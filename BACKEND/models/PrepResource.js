const mongoose = require('mongoose');

const PrepResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  url: { type: String, required: true },
  description: String,
  difficulty: String,
  tags: [String],
  created_by: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'AdminProfile', 
        required: true 
    },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('PrepResource', PrepResourceSchema);
