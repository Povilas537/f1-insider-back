const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');
const { authenticateJWT } = require('../middlewares/authMiddleware'); // ADD THIS

router.get('/', commentsController.getComments);
router.get('/:id', commentsController.getCommentById);
router.post('/', authenticateJWT, commentsController.createComment); // ADD MIDDLEWARE HERE
router.put('/:id', authenticateJWT, commentsController.updateComment); // Optional: Add middleware for other routes
router.delete('/:id', authenticateJWT, commentsController.deleteComment); // Optional: Add middleware for other routes
router.get('/article/:articleId', commentsController.getCommentsByArticleId);

module.exports = router;