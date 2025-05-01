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

const createComment = async (req, res) => {
    try {
         
    console.log(req.user);
      const commentData = {
        ...req.body,
        user: req.user.id // <-- Ensure this matches the token payload key
      };
      const comment = new Comment(commentData);
      await comment.save();
      res.status(201).send(comment);
    } catch (error) {
      res.status(500).send(error);
    }
  };
const updateComment = async (req, res) => {
    try {
        const { id } = req.params
        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        )
        if (!updatedComment) {
            return res.status(404).send({ error: 'Comment not found' })
        }
        res.send(updatedComment)
    } catch (error) {
        res.status(500).send(error)
    }
}

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params
        const deletedComment = await Comment.findByIdAndDelete(id)
        if (!deletedComment) {
            return res.status(404).send({ error: 'Comment not found' })
        }
        res.send({ message: 'Comment was removed', data: deletedComment })
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports = {
    getComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment
}
