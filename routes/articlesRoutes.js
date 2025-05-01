const express = require('express')
const router = express.Router()
const articlesController = require('../controllers/articlesController')
const { authenticateJWT } = require('../middlewares/authMiddleware');

// GET all articles
router.get('/', articlesController.getArticles)

// GET article by ID
router.get('/:id', articlesController.getArticleById)

// POST create new article
router.post('/', authenticateJWT, articlesController.createArticle);

// PUT update article
router.put('/:id', articlesController.updateArticle)

// DELETE article
router.delete('/:id', articlesController.deleteArticle)

module.exports = router
