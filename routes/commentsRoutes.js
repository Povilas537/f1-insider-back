const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');
const { authenticateJWT, authorizeRole } = require('../middlewares/authMiddleware');
const { authorizeCommentOwnerOrAdmin } = require('../middlewares/commentAuthMiddleware');

// Public routes
router.get('/article/:articleId', commentsController.getCommentsByArticleId);
router.get('/:id', commentsController.getCommentById);
router.get('/', commentsController.getComments);

// Only subscribers and admins can create comments
router.post('/', 
  authenticateJWT, 
  authorizeRole(['subscriber', 'admin']), 
  commentsController.createComment
);

// Only comment owners or admins can edit/delete
router.put('/:id', 
  authenticateJWT, 
  authorizeCommentOwnerOrAdmin, 
  commentsController.updateComment
);

router.delete('/:id', 
  authenticateJWT, 
  authorizeCommentOwnerOrAdmin, 
  commentsController.deleteComment
);

module.exports = router;
