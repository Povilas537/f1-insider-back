const express = require('express');
const router = express.Router();
const racesController = require('../controllers/racesController');
const { authenticateJWT, authorizeRole } = require('../middlewares/authMiddleware');
const ROLES = require('../config/roles');

// Public routes
router.get('/', racesController.getRaces);
router.get('/past', racesController.getPastRaces);
router.get('/upcoming', racesController.getUpcomingRaces);
router.get('/:id', racesController.getRaceById);

// Admin-only routes
router.post('/', authenticateJWT, authorizeRole([ROLES.ADMIN]), racesController.createRace);
router.put('/:id', authenticateJWT, authorizeRole([ROLES.ADMIN]), racesController.updateRace);
router.put('/:id/results', authenticateJWT, authorizeRole([ROLES.ADMIN]), racesController.updateRaceResults);
router.delete('/:id', authenticateJWT, authorizeRole([ROLES.ADMIN]), racesController.deleteRace);

module.exports = router;
