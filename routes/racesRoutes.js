const express = require('express');
const router = express.Router();
const racesController = require('../controllers/racesController');
const { authenticateJWT, authorizeRole } = require('../middlewares/authMiddleware');
const ROLES = require('../config/roles');


router.get('/', racesController.getRaces);
router.get('/past', racesController.getPastRaces);
router.get('/upcoming', racesController.getUpcomingRaces);
router.get('/:id', racesController.getRaceById);


router.post('/', authenticateJWT, authorizeRole([ROLES.ADMIN]), racesController.createRace);
router.put('/:id', authenticateJWT, authorizeRole([ROLES.ADMIN]), racesController.updateRace);
router.put('/:id/results', authenticateJWT, authorizeRole([ROLES.ADMIN]), racesController.updateRaceResults);
router.delete('/:id', authenticateJWT, authorizeRole([ROLES.ADMIN]), racesController.deleteRace);

module.exports = router;
