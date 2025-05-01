const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const authorizeSelfOrAdmin = require('../middlewares/canEditMiddleware');
const getCommentMiddleware = require('../middlewares/getCommentMiddleware');

// Update protected routes
router.put('/:id', 
  authenticateJWT,
  getCommentMiddleware,
  authorizeSelfOrAdmin,
  commentsController.updateComment
);

router.delete('/:id', 
  authenticateJWT,
  getCommentMiddleware,
  authorizeSelfOrAdmin,
  commentsController.deleteComment
);

module.exports = router;