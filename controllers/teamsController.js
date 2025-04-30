const Team = require('../models/teamModel');
const Driver = require('../models/driverModel');
const ROLES = require('../config/roles');

// Get all teams with populated drivers
const getTeams = async (req, res) => {
    try {
        const teams = await Team.find().populate('drivers', 'name nationality');
        res.send(teams);
    } catch (error) {
        res.status(500).send(error);
    }
}

// Get team by ID with populated drivers
const getTeamById = async (req, res) => {
    try {
        const { id } = req.params;
        const team = await Team.findById(id).populate('drivers');
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
        const team = new Team(req.body);
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
        const updatedTeam = await Team.findByIdAndUpdate(
            id,
            req.body,
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

// Delete team (admin only)
const deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTeam = await Team.findByIdAndDelete(id);
        if (!deletedTeam) {
            return res.status(404).send({ error: 'Team not found' });
        }
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

module.exports = {
    getTeams,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam,
    addDriverToTeam,
    removeDriverFromTeam
}
