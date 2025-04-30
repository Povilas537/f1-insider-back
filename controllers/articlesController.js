const Article = require('../models/articleModel')

const getArticles = async (req, res) => {
    try {
        const articles = await Article.find().populate('author', 'username')
        res.send(articles)
    } catch (error) {
        res.status(500).send(error)
    }
}

const getArticleById = async (req, res) => {
    try {
        const { id } = req.params
        const article = await Article.findById(id).populate('author', 'username')
        if (!article) {
            return res.status(404).send({ error: 'Article not found' })
        }
        res.send(article)
    } catch (error) {
        res.status(500).send(error)
    }
}

const createArticle = async (req, res) => {
    try {
        const article = new Article(req.body)
        await article.save()
        res.send(article)
    } catch (error) {
        res.status(500).send(error)
    }
}

const updateArticle = async (req, res) => {
    try {
        const { id } = req.params
        const updatedArticle = await Article.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        )
        if (!updatedArticle) {
            return res.status(404).send({ error: 'Article not found' })
        }
        res.send(updatedArticle)
    } catch (error) {
        res.status(500).send(error)
    }
}

const deleteArticle = async (req, res) => {
    try {
        const { id } = req.params
        const deletedArticle = await Article.findByIdAndDelete(id)
        if (!deletedArticle) {
            return res.status(404).send({ error: 'Article not found' })
        }
        res.send({ message: 'Article was removed', data: deletedArticle })
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports = {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
}
