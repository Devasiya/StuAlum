const mongoose = require('mongoose');

const MentorshipPreferenceSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  industry: { type: String },
  role: { type: String },
  skills: [String],
  location: { type: String },
  availability: { type: String },  // e.g., '1-2 hrs/week'
  alumni_year_range_start: { type: Number },
  alumni_year_range_end: { type: Number },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('MentorshipPreference', MentorshipPreferenceSchema);
