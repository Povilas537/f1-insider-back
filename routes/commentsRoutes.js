const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');
const { authenticateJWT, authorizeRole } = require('../middlewares/authMiddleware');
const { authorizeCommentOwnerOrAdmin } = require('../middlewares/commentAuthMiddleware');


router.get('/article/:articleId', commentsController.getCommentsByArticleId);
router.get('/:id', commentsController.getCommentById);
router.get('/', commentsController.getComments);


router.post('/', 
  authenticateJWT, 
  authorizeRole(['subscriber', 'admin']), 
  commentsController.createComment
);

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
