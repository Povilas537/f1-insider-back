const Article = require('../models/articleModel');

// Get all articles
const getArticles = async (req, res, next) => {
  try {
    const articles = await Article.find().populate('author', 'username');
    res.status(200).json({ data: articles });
  } catch (error) {
    next(error);
  }
};

// Get article by ID
const getArticleById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const article = await Article.findById(id)
        .populate('author', 'username')
        .populate({
          path: 'comments',
          populate: { path: 'author', select: 'username' }
        }); // populate comments and their authors
  
      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }
  
      res.status(200).json({ data: article });
    } catch (error) {
      next(error);
    }
  };
// Create article
const createArticle = async (req, res) => {
  try {
    const article = new Article({
      ...req.body,
      author: req.user.id // Set from JWT payload
    });
    await article.save();
    res.send(article);
  } catch (error) {
    res.status(500).send(error);
  }
};
// Update article
const updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedArticle) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.status(200).json({ data: updatedArticle });
  } catch (error) {
    next(error);
  }
};

const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedArticle = await Article.findOneAndDelete({ _id: id });
    
    if (!deletedArticle) {
      return res.status(404).send({ error: 'Article not found' });
    }
    
    res.send({ message: 'Article and its comments were removed', data: deletedArticle });
  } catch (error) {
    res.status(500).send(error);
  }
};


module.exports = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
