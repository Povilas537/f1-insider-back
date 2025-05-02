const Driver = require('../models/driverModel');
const Team = require('../models/teamModel');

const getDrivers = async (req, res) => {
    try {
        // Already good - populating team name
        const drivers = await Driver.find().populate('team', 'name');
        res.send(drivers);
    } catch (error) {
        res.status(500).send(error);
    }
}

const getDriverById = async (req, res) => {
    try {
        // Already good - populating team name
        const { id } = req.params;
        const driver = await Driver.findById(id).populate('team', 'name');
        if (!driver) {
            return res.status(404).send({ error: 'Driver not found' });
        }
        res.send(driver);
    } catch (error) {
        res.status(500).send(error);
    }
}

const createDriver = async (req, res) => {
    try {
        const driver = new Driver(req.body);
        await driver.save();
        
        // Add new code: Update team's drivers array if team is specified
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
}

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

module.exports = {
    getDrivers,
    getDriverById,
    createDriver,
    updateDriver,
    deleteDriver
}
