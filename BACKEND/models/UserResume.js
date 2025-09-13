const mongoose = require('mongoose');

const UserResumeSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  file_data: { type: Buffer, required: true },  // binary PDF data
  file_name: { type: String, required: true },
  file_type: { type: String, required: true },
  upload_date: { type: Date, default: Date.now },
  status: { type: String, default: 'uploaded' },
  review_summary: String,
  review_details: mongoose.Schema.Types.Mixed,  // for storing JSON feedback
  reviewed_at: Date,
});

module.exports = mongoose.model('UserResume', UserResumeSchema);
