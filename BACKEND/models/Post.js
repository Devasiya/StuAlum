const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  forum_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumCategory', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes_count: { type: Number, default: 0 },
  views_count: { type: Number, default: 0 },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Post', PostSchema);
