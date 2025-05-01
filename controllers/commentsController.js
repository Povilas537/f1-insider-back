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
        .populate('user', 'username _id') // Ensure _id is populated
        .sort({ createdAt: -1 });
        res.send(comments);
    } catch (error) {
        res.status(500).send(error);
    }
}

// Update createComment to use 'id' from token
const createComment = async (req, res) => {
    try {
      const commentData = {
        ...req.body,
        user: req.user.id // Match token's 'id' field
      };
      const comment = new Comment(commentData);
      await comment.save();
      res.status(201).send(comment);
    } catch (error) {
      res.status(500).send(error);
    }
  };
// Update updateComment
const updateComment = async (req, res) => {
    try {
      // Use the comment from middleware
      req.comment.content = req.body.content;
      const updatedComment = await req.comment.save();
      res.send(updatedComment);
    } catch (error) {
      res.status(500).send(error);
    }
  };
// Update deleteComment
const deleteComment = async (req, res) => {
    try {
      await req.comment.deleteOne();
      res.send({ 
        message: 'Comment was removed', 
        data: req.comment 
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
