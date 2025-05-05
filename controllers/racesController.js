const Race = require('../models/raceModel');
const Driver = require('../models/driverModel');
const Team = require('../models/teamModel');

// Points calculation system
const calculatePoints = (position) => {
  // F1 standard points system
  const pointsSystem = {
    1: 25, 2: 18, 3: 15, 4: 12, 5: 10,
    6: 8, 7: 6, 8: 4, 9: 2, 10: 1
  };
  return pointsSystem[position] || 0;
};

const getRaces = async (req, res) => {
    try {
      const { status } = req.query;
      let query = {};
      
      if (status) {
        query.status = status;
      }
      
      const races = await Race.find(query)
        .populate('winner', 'name')
        .populate({
          path: 'results.driver',
          select: 'name team',
          populate: {
            path: 'team',
            select: 'name'
          }
        });
      res.send(races);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  const getRaceById = async (req, res) => {
    try {
      const { id } = req.params;
      const race = await Race.findById(id)
        .populate('winner', 'name')
        .populate({
          path: 'results.driver',
          select: 'name team',
          populate: {
            path: 'team',
            select: 'name'
          }
        });
      if (!race) {
        return res.status(404).send({ error: 'Race not found' });
      }
      res.send(race);
    } catch (error) {
      res.status(500).send(error);
    }
  };
  
const createRace = async (req, res) => {
  try {
    const race = new Race(req.body);
    await race.save();
    res.send(race);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateRace = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRace = await Race.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedRace) {
      return res.status(404).send({ error: 'Race not found' });
    }
    res.send(updatedRace);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteRace = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRace = await Race.findByIdAndDelete(id);
    if (!deletedRace) {
      return res.status(404).send({ error: 'Race not found' });
    }
    res.send({ message: 'Race was removed', data: deletedRace });
  } catch (error) {
    res.status(500).send(error);
  }
};



// Get past races (completed races)
const getPastRaces = async (req, res) => {
    try {
      const currentDate = new Date();
      const races = await Race.find({ date: { $lt: currentDate } })
        .populate('winner', 'name')
        .populate({
          path: 'results.driver',
          select: 'name team',
          populate: {
            path: 'team',
            select: 'name'
          }
        })
        .sort('-date'); // Most recent first
      res.send(races);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  const getUpcomingRaces = async (req, res) => {
    try {
      const currentDate = new Date();
      const races = await Race.find({ date: { $gte: currentDate } })
        .populate('winner', 'name')
        .populate({
          path: 'results.driver',
          select: 'name team',
          populate: {
            path: 'team',
            select: 'name'
          }
        })
        .sort('date'); // Closest first
      res.send(races);
    } catch (error) {
      res.status(500).send(error);
    }
  };

// In racesController.js, inside the updateRaceResults function
// After calculating points but before updating the driver

const updateRaceResults = async (req, res) => {
    try {
      const { id } = req.params;
      const { results, winner, fastestLap } = req.body;
      
      const race = await Race.findById(id);
      if (!race) {
        return res.status(404).send({ error: 'Race not found' });
      }
          // Check if race date has passed
    const currentDate = new Date();
    const raceDate = new Date(race.date);
    
    if (raceDate > currentDate) {
      return res.status(400).send({ 
        error: 'Cannot enter results for a race that has not happened yet' 
      });
    }
      
      // Mark race as completed
      race.status = 'completed';
      race.winner = winner;
      race.fastestLap = fastestLap;
      
      // Process results with points calculation
      const processedResults = results.map(result => {
        let points = calculatePoints(result.position);
        // Add fastest lap point (if applicable)
        points = calculatePoints(result.position);
        return {
          driver: result.driver,
          position: result.position,
          points: points
        };
      });
      
      race.results = processedResults;
      await race.save();
      
                // Update driver stats - points, wins, and podiums
          // Inside updateRaceResults function
          for (const result of processedResults) {
            const driverUpdate = { 
              // Increment both sets of stats
              $inc: {
                'careerStats.points': result.points,
                'seasonStats.points': result.points,
                'careerStats.starts': 1,
                'seasonStats.starts': 1
              } 
            };
            
            // Check for win (position 1)
            if (result.position === 1) {
              driverUpdate.$inc['careerStats.wins'] = 1;
              driverUpdate.$inc['seasonStats.wins'] = 1;
              driverUpdate.$inc['careerStats.podiums'] = 1;
              driverUpdate.$inc['seasonStats.podiums'] = 1;
            } 
            // Check for podium (positions 2-3)
            else if (result.position === 2 || result.position === 3) {
              driverUpdate.$inc['careerStats.podiums'] = 1;
              driverUpdate.$inc['seasonStats.podiums'] = 1;
            }
            
            // Check for fastest lap
            if (fastestLap && fastestLap === result.driver) {
              driverUpdate.$inc['careerStats.fastestLaps'] = 1;
              driverUpdate.$inc['seasonStats.fastestLaps'] = 1;
            }
            
            await Driver.findByIdAndUpdate(result.driver, driverUpdate);
          }

      
     // Update team standings by aggregating driver points
const updatedDrivers = await Driver.find().populate('team');
const teamPoints = {};

// Group driver points by team
for (const driver of updatedDrivers) {
  if (driver.team) {
    const teamId = driver.team._id.toString();
    // Use seasonStats.points instead of direct points
    teamPoints[teamId] = (teamPoints[teamId] || 0) + driver.seasonStats.points;
  }
}

// Update each team's points
for (const [teamId, points] of Object.entries(teamPoints)) {
  await Team.findByIdAndUpdate(
    teamId,
    { points },
    { new: true }
  );
}
      
      res.send({ message: 'Race results updated and standings recalculated', race });
    } catch (err) {
      res.status(500).send(err);
    }
  };
  

module.exports = {
  getRaces,
  getRaceById,
  createRace,
  updateRace,
  deleteRace,
  getPastRaces,
  getUpcomingRaces,
  updateRaceResults
};
