const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  reported_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'reviewed'], default: 'pending' },
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('Report', ReportSchema);
