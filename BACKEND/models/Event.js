const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },  // workshop, seminar, competition, placement, talk, etc.
  audience: { type: String },  // students, alumni, all, etc.
  location: { type: String },  // physical address or online link
  event_mode: { type: String, enum: ['in_person', 'virtual', 'hybrid'], required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  capacity: { type: Number, default: 0 },
  status: { type: String, enum: ['scheduled', 'cancelled', 'postponed', 'rescheduled'], default: 'scheduled' },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Event', EventSchema);
