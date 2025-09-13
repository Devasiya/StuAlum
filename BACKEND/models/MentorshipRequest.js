const mongoose = require('mongoose');

const MentorshipRequestSchema = new mongoose.Schema({
  mentee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['requested', 'accepted', 'declined', 'withdrawn'], default: 'requested' },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('MentorshipRequest', MentorshipRequestSchema);
