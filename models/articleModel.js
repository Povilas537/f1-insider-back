const mongoose = require('mongoose');
const Comment = require('./commentModel'); // Import Comment model

const articleSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  content: { 
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        try {
          const parsed = JSON.parse(v);
          return !!parsed.blocks && Array.isArray(parsed.blocks);
        } catch {
          return false;
        }
      },
      message: 'Content must be valid Editor.js JSON format'
    }
  },
  imageUrl: { type: String },
  author:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, enum: ['news', 'analysis', 'interview'], default: 'news' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });

// Add a post middleware for findOneAndDelete operations
// This will run after an article is deleted
articleSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    // Delete all comments associated with this article
    await Comment.deleteMany({ article: doc._id });
  }
});

// Also handle the case where deleteOne or deleteMany is used
articleSchema.post('deleteOne', { document: true, query: false }, async function() {
  await Comment.deleteMany({ article: this._id });
});

module.exports = mongoose.model('Article', articleSchema);
