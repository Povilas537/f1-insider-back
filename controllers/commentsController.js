const Comment = require('../models/commentModel')

const getComments = async (req, res) => {
    try {
        const comments = await Comment.find().populate('article', 'title').populate('user', 'username')
        res.send(comments)
    } catch (error) {
        res.status(500).send(error)
    }
}

const getCommentById = async (req, res) => {
    try {
        const { id } = req.params
        const comment = await Comment.findById(id).populate('article', 'title').populate('user', 'username')
        if (!comment) {
            return res.status(404).send({ error: 'Comment not found' })
        }
        res.send(comment)
    } catch (error) {
        res.status(500).send(error)
    }
}

const getCommentsByArticleId = async (req, res) => {
  try {
    const { articleId } = req.params;
    const comments = await Comment.find({ article: articleId })
      .populate('user', '_id username') // Include _id explicitly
      .sort({ createdAt: -1 });
    res.send(comments);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createComment = async (req, res) => {
  try {
    const commentData = {
      ...req.body,
      user: req.user.id
    };
    const comment = new Comment(commentData);
    await comment.save();
    
    // Populate user before sending response
    const populatedComment = await Comment.findById(comment._id)
      .populate('user', '_id username');
    res.status(201).send(populatedComment);
  } catch (error) {
    res.status(500).send(error);
  }
};
// Update updateComment
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).send({ error: 'Comment not found' });
    }
    
    comment.content = req.body.content;
    const updatedComment = await comment.save();
    
    // Populate user info before sending response
    const populatedComment = await Comment.findById(updatedComment._id)
      .populate('user', '_id username');
    res.send(populatedComment);
  } catch (error) {
    res.status(500).send(error);
  }
};
// Update deleteComment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).send({ error: 'Comment not found' });
    }
    
    await comment.deleteOne();
    res.send({ 
      message: 'Comment was removed', 
      data: comment 
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
    getComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment,
    getCommentsByArticleId
}
