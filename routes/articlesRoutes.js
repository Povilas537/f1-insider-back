const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articlesController');
const { authenticateJWT, authorizeRole } = require('../middlewares/authMiddleware');
const { authorizeOwnerOrAdmin } = require('../middlewares/articleAuthMiddleware')

router.get('/', articlesController.getArticles);
router.get('/:id', articlesController.getArticleById);


router.post('/', authenticateJWT, authorizeRole(['author', 'admin']), articlesController.createArticle);
router.put('/:id', authenticateJWT, authorizeOwnerOrAdmin, articlesController.updateArticle);
router.delete('/:id', authenticateJWT, authorizeOwnerOrAdmin, articlesController.deleteArticle);

module.exports = router;
