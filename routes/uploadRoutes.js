const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Public upload endpoint (or use authenticateJWT if you want to restrict uploads)
router.post('/upload-image', 
  uploadController.upload.single('image'), 
  uploadController.uploadImage
);

module.exports = router;
