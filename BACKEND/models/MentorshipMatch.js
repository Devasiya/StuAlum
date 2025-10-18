const mongoose = require('mongoose');

const MentorshipMatchSchema = new mongoose.Schema({
  mentee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
  mentor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'AlumniProfile', required: true },
  ai_score: { type: Number, default: 0 },  // AI-generated match strength
  match_reason: { type: String },
  status: { type: String, enum: ['pending', 'active', 'completed'], default: 'pending' },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('MentorshipMatch', MentorshipMatchSchema);
