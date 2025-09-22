const mongoose = require('mongoose');

const AlumniProfileSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  college_id: { type: String, ref: 'College', required: false },
  full_name: { type: String, required: true },
  graduation_year: { type: Number, required: true },
  degree: { type: String },
  specialization: { type: String },
  enrollment_number: { type: String },
  current_position: { type: String },
  company: { type: String },
  industry: { type: String },
  location: { type: String },
  professional_achievements: { type: String },
  skills: { type: [String], default: [] },
  linkedin_url: { type: String },
  github_url: { type: String },
  leetcode_url: { type: String },
  contribution_preferences: { type: [String] },
  about_me: { type: String },
  profile_photo_url: { type: String },
  contact_number: { type: String },
  is_verified: { type: Boolean, default: false },
  engagement_status: { type: String, enum: ['active', 'inactive', 'recently_connected'], default: 'inactive' },
  prospect_type: { type: String, enum: ['mentor', 'donor', 'speaker'] },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('AlumniProfile', AlumniProfileSchema);
