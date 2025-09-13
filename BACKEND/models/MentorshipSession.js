const mongoose = require('mongoose');

const MentorshipSessionSchema = new mongoose.Schema({
  match_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorshipMatch', required: true },
  scheduled_time: { type: Date, required: true },
  duration: { type: Number, required: true },  // session duration, e.g. in minutes
  mode: { type: String, enum: ['virtual', 'in_person', 'hybrid'], required: true },
  topic: { type: String },
  status: { type: String, enum: ['upcoming', 'completed', 'rescheduled', 'cancelled'], default: 'upcoming' },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('MentorshipSession', MentorshipSessionSchema);
