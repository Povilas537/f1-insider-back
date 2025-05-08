const express = require('express');
const router = express.Router();
const driversController = require('../controllers/driversController');
const { authenticateJWT, authorizeRole } = require('../middlewares/authMiddleware');
const ROLES = require('../config/roles');


router.get('/', driversController.getDrivers);
router.get('/:id', driversController.getDriverById);


router.post('/', authenticateJWT, authorizeRole([ROLES.ADMIN]), driversController.createDriver);
router.put('/:id', authenticateJWT, authorizeRole([ROLES.ADMIN]), driversController.updateDriver);
router.delete('/:id', authenticateJWT, authorizeRole([ROLES.ADMIN]), driversController.deleteDriver);

router.post(
    '/:id/reset-career',
    authenticateJWT,
    authorizeRole([ROLES.ADMIN]),
    driversController.resetDriverCareerStats
  );
  
  router.put(
    '/:id/initial-career-stats',
    authenticateJWT,
    authorizeRole([ROLES.ADMIN]),
    driversController.updateInitialCareerStats
  );
  


router.post('/:id/gallery', authenticateJWT, authorizeRole([ROLES.ADMIN]), driversController.addDriverGalleryImage);
router.delete('/:id/gallery', authenticateJWT, authorizeRole([ROLES.ADMIN]), driversController.removeDriverGalleryImage);

module.exports = router;
