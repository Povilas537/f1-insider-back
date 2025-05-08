
const mongoose = require('mongoose');
const Comment = require('./commentModel');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }, 
  imageUrl: { type: String }, 
  contentImageUrl: { type: String }, 
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, enum: ['news', 'analysis', 'interview'], default: 'news' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });


articleSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await Comment.deleteMany({ article: doc._id });
  }
});

articleSchema.post('deleteOne', { document: true, query: false }, async function() {
  await Comment.deleteMany({ article: this._id });
});

module.exports = mongoose.model('Article', articleSchema);
