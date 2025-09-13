const mongoose = require('mongoose');

const PostLikeSchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('PostLike', PostLikeSchema);
