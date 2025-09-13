const mongoose = require('mongoose');

const UserCareerSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  current_role: { type: String },
  company_name: { type: String },
  experience: { type: String },  // e.g., "1-2 years"
  interests: { type: mongoose.Schema.Types.Mixed },  // Text or JSON object
}, { timestamps: true });

module.exports = mongoose.model('UserCareer', UserCareerSchema);
