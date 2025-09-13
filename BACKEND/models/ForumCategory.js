const mongoose = require('mongoose');

const ForumCategorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('ForumCategory', ForumCategorySchema);
