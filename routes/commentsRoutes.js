const express = require('express')
const router = express.Router()
const commentsController = require('../controllers/commentsController')

router.get('/', commentsController.getComments)
router.get('/:id', commentsController.getCommentById)
router.post('/', commentsController.createComment)
router.put('/:id', commentsController.updateComment)
router.delete('/:id', commentsController.deleteComment)

module.exports = router
