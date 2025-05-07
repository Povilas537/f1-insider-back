const Team = require('../models/teamModel');
const Driver = require('../models/driverModel');
const ROLES = require('../config/roles');

const getTeams = async (req, res) => {
    try {
        const teams = await Team.find()
          .populate('drivers', 'name nationality photoUrl')
          .select('name logoUrl country points description teamPrincipal');
        res.send(teams);
    } catch (error) {
        res.status(500).send(error);
    }
}

const getTeamById = async (req, res) => {
    try {
      const { id } = req.params;
      const team = await Team.findById(id).populate({
        path: 'drivers',
        select: 'name photoUrl points wins podiums nationality number'
      });
      if (!team) {
        return res.status(404).send({ error: 'Team not found' });
      }
      res.send(team);
    } catch (error) {
      res.status(500).send(error);
    }
  }
  
// Create team (admin only)
const createTeam = async (req, res) => {
    try {
        // Auth check happens in middleware
        // In createTeam
    const team = new Team({
        name: req.body.name,
        logoUrl: req.body.logoUrl,
        country: req.body.country,
        foundation: req.body.foundation,
        description: req.body.description,
        carModel: req.body.carModel,
        teamPrincipal: req.body.teamPrincipal,
        gallery: req.body.gallery || []
    });
        await team.save();
        res.status(201).send(team);
    } catch (error) {
        res.status(500).send(error);
    }
}

// Update team (admin only)
const updateTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = {...req.body};
        
        // Optional: validate gallery is an array
        if (updates.gallery && !Array.isArray(updates.gallery)) {
            return res.status(400).send({ error: 'Gallery must be an array of image URLs' });
        }
        
        const updatedTeam = await Team.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );
        
        if (!updatedTeam) {
            return res.status(404).send({ error: 'Team not found' });
        }
        res.send(updatedTeam);
    } catch (error) {
        res.status(500).send(error);
    }
}


const deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the team first
        const teamToDelete = await Team.findById(id);
        if (!teamToDelete) {
            return res.status(404).send({ error: 'Team not found' });
        }
        
        // Update all drivers to remove the team reference
        await Driver.updateMany(
            { team: id },
            { $set: { team: null } }
        );
        
        // Now delete the team
        const deletedTeam = await Team.findByIdAndDelete(id);
        
        res.send({ message: 'Team was removed', data: deletedTeam });
    } catch (error) {
        res.status(500).send(error);
    }
}

// Add driver to team (admin only)
const addDriverToTeam = async (req, res) => {
    try {
        const { teamId, driverId } = req.body;
        
        // Find the team and the driver
        const team = await Team.findById(teamId);
        const driver = await Driver.findById(driverId);
        
        if (!team || !driver) {
            return res.status(404).send({ 
                error: !team ? 'Team not found' : 'Driver not found' 
            });
        }
        
        // Add driver to team if not already added
        if (!team.drivers.includes(driverId)) {
            team.drivers.push(driverId);
            await team.save();
            
            // Update driver's team reference
            driver.team = teamId;
            await driver.save();
        }
        
        // Return team with populated drivers
        const updatedTeam = await Team.findById(teamId).populate('drivers');
        res.send(updatedTeam);
    } catch (error) {
        res.status(500).send(error);
    }
}

// Remove driver from team (admin only)
const removeDriverFromTeam = async (req, res) => {
    try {
        const { teamId, driverId } = req.body;
        
        // Find the team and driver
        const team = await Team.findById(teamId);
        const driver = await Driver.findById(driverId);
        
        if (!team) {
            return res.status(404).send({ error: 'Team not found' });
        }
        
        if (!driver) {
            return res.status(404).send({ error: 'Driver not found' });
        }
        
        // Remove driver from team
        team.drivers = team.drivers.filter(id => id.toString() !== driverId);
        await team.save();
        
        // Remove team reference from driver
        driver.team = null;
        await driver.save();
        
        // Return updated team with populated drivers
        const updatedTeam = await Team.findById(teamId).populate('drivers');
        res.send(updatedTeam);
    } catch (error) {
        res.status(500).send(error);
    }
}

// Add gallery image to team (admin only)
const addGalleryImage = async (req, res) => {
    try {
      const { id } = req.params;
      const { imageUrl } = req.body;
      
      const team = await Team.findById(id);
      if (!team) {
        return res.status(404).send({ error: 'Team not found' });
      }
      
      // Initialize gallery array if it doesn't exist
      if (!team.gallery) {
        team.gallery = [];
      }
      
      team.gallery.push(imageUrl);
      await team.save();
      
      res.send(team);
    } catch (error) {
      res.status(500).send(error);
    }
  };
  
  // Remove gallery image from team (admin only)
  const removeGalleryImage = async (req, res) => {
    try {
      const { id } = req.params;
      const { imageUrl } = req.body;
      
      const team = await Team.findById(id);
      if (!team) {
        return res.status(404).send({ error: 'Team not found' });
      }
      
      if (team.gallery) {
        team.gallery = team.gallery.filter(url => url !== imageUrl);
        await team.save();
      }
      
      res.send(team);
    } catch (error) {
      res.status(500).send(error);
    }
  };
  

module.exports = {
    getTeams,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam,
    addDriverToTeam,
    removeDriverFromTeam,
    addGalleryImage,
    removeGalleryImage
}
