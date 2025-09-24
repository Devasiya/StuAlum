const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  enrollment_number: { type: String, required: true, unique: true },
  branch: { type: String, required: true },
  year_of_admission: { type: Number, required: true },
  year_of_graduation: { type: Number, required: true },
  contact_number: { type: String },
  address: { type: String },
  skills: [String],
  interests: [String],
  career_goals: String,
  discovery_insights: String,
  preferences: String,
  photo: String,
  linkedin: String,
  github: String,
  portfolio: String,
  extracuriculum: String,
  is_verified: { type: Boolean, default: false },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);
