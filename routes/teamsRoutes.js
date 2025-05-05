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

// Gallery management routes (new)
router.post('/:id/gallery', authenticateJWT, authorizeRole([ROLES.ADMIN]), teamsController.addGalleryImage);
router.delete('/:id/gallery', authenticateJWT, authorizeRole([ROLES.ADMIN]), teamsController.removeGalleryImage);

// Driver management routes - note the path change to avoid conflicts
router.post('/driver/add', authenticateJWT, authorizeRole([ROLES.ADMIN]), teamsController.addDriverToTeam);
router.post('/driver/remove', authenticateJWT, authorizeRole([ROLES.ADMIN]), teamsController.removeDriverFromTeam);

module.exports = router;
