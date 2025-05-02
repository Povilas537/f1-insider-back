const express = require('express');
const router = express.Router();
const teamsController = require('../controllers/teamsController');
const { authenticateJWT, authorizeRole } = require('../middlewares/authMiddleware');
const ROLES = require('../config/roles');

// Public routes
router.get('/', teamsController.getTeams);
router.get('/:id', teamsController.getTeamById);

// Admin-only routes
router.post('/', authenticateJWT, authorizeRole([ROLES.ADMIN]), teamsController.createTeam);
router.put('/:id', authenticateJWT, authorizeRole([ROLES.ADMIN]), teamsController.updateTeam);
router.delete('/:id', authenticateJWT, authorizeRole([ROLES.ADMIN]), teamsController.deleteTeam);
router.post('/add-driver', authenticateJWT, authorizeRole([ROLES.ADMIN]), teamsController.addDriverToTeam);
router.post('/remove-driver', authenticateJWT, authorizeRole([ROLES.ADMIN]), teamsController.removeDriverFromTeam);

module.exports = router;
