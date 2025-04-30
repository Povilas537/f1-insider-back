const Driver = require('../models/driverModel')
const Team = require('../models/teamModel')

const getDriverStandings = async (req, res) => {
    try {
        const drivers = await Driver.find().select('name team points').populate('team', 'name').sort('-points')
        res.send(drivers)
    } catch (error) {
        res.status(500).send(error)
    }
}

const getTeamStandings = async (req, res) => {
    try {
        const teams = await Team.find().select('name points').sort('-points')
        res.send(teams)
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports = {
    getDriverStandings,
    getTeamStandings
}
