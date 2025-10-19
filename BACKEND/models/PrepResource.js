const mongoose = require('mongoose');

const PrepResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  url: { type: String, required: true },
  description: String,
  difficulty: String,
  tags: [String],
  category: { type: String, default: 'prep' }, // 'prep' or 'mentorship'
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('PrepResource', PrepResourceSchema);
