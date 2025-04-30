const express = require('express')
const router = express.Router()
const standingsController = require('../controllers/standingsController')

// Example: GET driver standings
router.get('/drivers', standingsController.getDriverStandings)
// Example: GET team standings
router.get('/teams', standingsController.getTeamStandings)

module.exports = router
