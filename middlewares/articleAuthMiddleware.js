const Article = require('../models/articleModel');
const authorizeOwnerOrAdmin = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    if (req.user.role === 'admin' || (req.user.role === 'author' && article.author.toString() === req.user.id)) {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden' });
  } catch (error) {
    next(error);
  }
};
module.exports = { authorizeOwnerOrAdmin };
