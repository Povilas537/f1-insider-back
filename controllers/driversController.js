const Driver = require('../models/driverModel');
const Team = require('../models/teamModel');
const Race = require('../models/raceModel');

const getDrivers = async (req, res) => {
    try {
        // Already good - populating team name
        const drivers = await Driver.find().populate('team', 'name');
        res.send(drivers);
    } catch (error) {
        res.status(500).send(error);
    }
}

// Get driver details with populated team info
const getDriverById = async (req, res) => {
    try {
      const { id } = req.params;
      const driver = await Driver.findById(id).populate('team', 'name logoUrl');
      
      if (!driver) {
        return res.status(404).send({ error: 'Driver not found' });
      }
      
      res.send(driver);
    } catch (error) {
      res.status(500).send(error);
    }
  };
  
  const createDriver = async (req, res) => {
    try {
      const driverData = req.body;
      
      // Store initial career stats if provided
      if (!driverData.initialCareerStats && driverData.careerStats) {
        driverData.initialCareerStats = {
          starts: driverData.careerStats.starts || 0,
          wins: driverData.careerStats.wins || 0,
          podiums: driverData.careerStats.podiums || 0,
          fastestLaps: driverData.careerStats.fastestLaps || 0,
          points: driverData.careerStats.points || 0
        };
      }
      
      const driver = new Driver(driverData);
      await driver.save();
      
      // Add to team if specified
      if (driver.team) {
        await Team.findByIdAndUpdate(
          driver.team,
          { $addToSet: { drivers: driver._id } }
        );
      }
      
      res.status(201).send(driver);
    } catch (error) {
      res.status(500).send(error);
    }
  };
  

const updateDriver = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get the driver before update to check if team changes
        const oldDriver = await Driver.findById(id);
        if (!oldDriver) {
            return res.status(404).send({ error: 'Driver not found' });
        }
        
        // Update the driver
        const updatedDriver = await Driver.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        
        // Handle team change - maintain relationship consistency
        if (req.body.team && oldDriver.team && 
            req.body.team.toString() !== oldDriver.team.toString()) {
            
            // Remove driver from old team
            await Team.findByIdAndUpdate(
                oldDriver.team,
                { $pull: { drivers: id } }
            );
            
            // Add driver to new team
            await Team.findByIdAndUpdate(
                req.body.team,
                { $addToSet: { drivers: id } }
            );
        } 
        // If adding team for the first time
        else if (req.body.team && !oldDriver.team) {
            await Team.findByIdAndUpdate(
                req.body.team,
                { $addToSet: { drivers: id } }
            );
        }
        // If removing team
        else if (req.body.hasOwnProperty('team') && !req.body.team && oldDriver.team) {
            await Team.findByIdAndUpdate(
                oldDriver.team,
                { $pull: { drivers: id } }
            );
        }
        
        res.send(updatedDriver);
    } catch (error) {
        res.status(500).send(error);
    }
}

const deleteDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDriver = await Driver.findByIdAndDelete(id);
        
        if (!deletedDriver) {
            return res.status(404).send({ error: 'Driver not found' });
        }
        
        // Remove driver from team's drivers array
        if (deletedDriver.team) {
            await Team.findByIdAndUpdate(
                deletedDriver.team,
                { $pull: { drivers: id } }
            );
        }
        
        res.send({ message: 'Driver was removed', data: deletedDriver });
    } catch (error) {
        res.status(500).send(error);
    }
}



// Add gallery image to driver
const addDriverGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;
    
    const driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).send({ error: 'Driver not found' });
    }
    
    // Initialize gallery array if it doesn't exist
    if (!driver.gallery) {
      driver.gallery = [];
    }
    
    driver.gallery.push(imageUrl);
    await driver.save();
    
    res.send(driver);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Remove gallery image from driver
const removeDriverGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;
    
    const driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).send({ error: 'Driver not found' });
    }
    
    if (driver.gallery) {
      driver.gallery = driver.gallery.filter(url => url !== imageUrl);
      await driver.save();
    }
    
    res.send(driver);
  } catch (error) {
    res.status(500).send(error);
  }
};

const resetDriverCareerStats = async (req, res) => {
  try {
    const { id } = req.params;
    const { includeRaceResults = true } = req.body; // Default to including race results
    
    // Find the driver
    const driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).send({ error: 'Driver not found' });
    }
    
    // Check if initial stats exist
    if (!driver.initialCareerStats) {
      return res.status(400).send({
        error: 'No initial career stats found for this driver'
      });
    }
    
    // Reset to initial values first
    await Driver.findByIdAndUpdate(
      id,
      {
        'careerStats.starts': driver.initialCareerStats.starts,
        'careerStats.wins': driver.initialCareerStats.wins,
        'careerStats.podiums': driver.initialCareerStats.podiums,
        'careerStats.fastestLaps': driver.initialCareerStats.fastestLaps,
        'careerStats.points': driver.initialCareerStats.points
      }
    );
    
    // If we don't need to include race results, we're done
    if (!includeRaceResults) {
      const updatedDriver = await Driver.findById(id);
      return res.send({
        message: 'Career stats reset to initial values only',
        driver: updatedDriver
      });
    }
    
    // Otherwise, get all completed races with this driver
    const races = await Race.find({ 
      status: 'completed',
      'results.driver': id 
    });
    
    // Calculate stats from these races
    let additionalStats = {
      starts: 0,
      wins: 0,
      podiums: 0,
      fastestLaps: 0,
      points: 0
    };
    
    
    for (const race of races) {
      for (const result of race.results) {
  
        if (result.driver.toString() !== id) continue;
        
      
        additionalStats.starts++;
        additionalStats.points += result.points || 0;
        
        if (result.position === 1) {
          additionalStats.wins++;
          additionalStats.podiums++;
        } else if (result.position === 2 || result.position === 3) {
          additionalStats.podiums++;
        }
       
        if (race.fastestLap && race.fastestLap.toString() === id) {
          additionalStats.fastestLaps++;
        }
      }
    }
    
   
    if (Object.values(additionalStats).some(val => val > 0)) {
      await Driver.findByIdAndUpdate(
        id,
        {
          $inc: {
            'careerStats.starts': additionalStats.starts,
            'careerStats.wins': additionalStats.wins,
            'careerStats.podiums': additionalStats.podiums,
            'careerStats.fastestLaps': additionalStats.fastestLaps,
            'careerStats.points': additionalStats.points
          }
        }
      );
    }
    
    const updatedDriver = await Driver.findById(id);
    res.send({
      message: includeRaceResults 
        ? 'Career stats reset to initial values and race results added' 
        : 'Career stats reset to initial values only',
      driver: updatedDriver
    });
  } catch (error) {
    res.status(500).send(error);
  }
};


const updateInitialCareerStats = async (req, res) => {
  try {
    const { id } = req.params;
    const { initialCareerStats } = req.body;
    
    if (!initialCareerStats) {
      return res.status(400).send({ error: 'Initial career stats are required' });
    }
    
    const driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).send({ error: 'Driver not found' });
    }
    
    const updatedDriver = await Driver.findByIdAndUpdate(
      id,
      { initialCareerStats },
      { new: true }
    );
    
    res.send(updatedDriver);
  } catch (error) {
    res.status(500).send(error);
  }
};




module.exports = {
    getDrivers,
    getDriverById,
    createDriver,
    updateDriver,
    deleteDriver,
    addDriverGalleryImage,
    removeDriverGalleryImage,
    resetDriverCareerStats,
    updateInitialCareerStats
    
}
