const express = require('express');
const router = express.Router();
const standingsController = require('../controllers/standingsController');
const { authenticateJWT, authorizeRole } = require('../middlewares/authMiddleware');
const ROLES = require('../config/roles');

// Public routes
router.get('/drivers', standingsController.getDriverStandings);
router.get('/teams', standingsController.getTeamStandings);

// Admin-only routes
router.post('/recalculate', 
  authenticateJWT, 
  authorizeRole([ROLES.ADMIN]), 
  standingsController.recalculateAllStandings
);

module.exports = router;
