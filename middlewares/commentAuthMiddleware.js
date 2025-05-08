const Comment = require('../models/commentModel');

const authorizeCommentOwnerOrAdmin = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (req.user.role === 'admin' || comment.user.toString() === req.user.id) {
      req.comment = comment; 
      return next();
    }
    
    return res.status(403).json({ message: 'Not authorized to modify this comment' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { authorizeCommentOwnerOrAdmin };
