// driversRoutes.js
const express = require('express');
const router = express.Router();
const driversController = require('../controllers/driversController');
const { authenticateJWT, authorizeRole } = require('../middlewares/authMiddleware');
const ROLES = require('../config/roles');

// Public routes - anyone can view drivers
router.get('/', driversController.getDrivers);
router.get('/:id', driversController.getDriverById);

// Admin-only routes - only admins can modify driver data
router.post('/', authenticateJWT, authorizeRole([ROLES.ADMIN]), driversController.createDriver);
router.put('/:id', authenticateJWT, authorizeRole([ROLES.ADMIN]), driversController.updateDriver);
router.delete('/:id', authenticateJWT, authorizeRole([ROLES.ADMIN]), driversController.deleteDriver);

module.exports = router;
