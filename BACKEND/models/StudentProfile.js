const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  enrollment_number: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  branch: { type: String, required: true },
  year_of_admission: { type: Number, required: true },
  year_of_graduation: { type: Number, required: true },
  contact_number: { type: String },
  address: { type: String },
  skills: [String],
  career_goals: { type: String },
  discovery_insights: { type: String },
  preferences: { type: String },
  photo: { type: String },
  verficationFile: { type: String },
  linkedin: { type: String },
  github: { type: String },
  extracurricular: { type: String },
  is_verified: { type: Boolean, default: false },
  mentorship_area: { type: String },
  mentor_type: { type: String },
  communication: [{ type: String }],
  notifications: {
    mentorship: { type: Boolean, default: true },
    events: { type: Boolean, default: true },
    community: { type: Boolean, default: false },
    content: { type: Boolean, default: true },
  },
  hear_about: { type: String },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);
