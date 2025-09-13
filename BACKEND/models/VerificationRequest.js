const mongoose = require('mongoose');

const VerificationRequestSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  college_id: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  role: { type: String, enum: ['student', 'alumni', 'admin'], required: true },
  documents: [String],  // URLs or filenames of verification docs
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  remarks: String,
  verified_by: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminProfile' },
  created_at: { type: Date, default: Date.now },
  verified_at: Date,
});

module.exports = mongoose.model('VerificationRequest', VerificationRequestSchema);
