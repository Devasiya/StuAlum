const mongoose = require('mongoose');

const ConversationParticipantSchema = new mongoose.Schema({
  conversation_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  joined_at: { type: Date, default: Date.now },
}, { 
  _id: false,
  timestamps: false,
});

ConversationParticipantSchema.index({ conversation_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('ConversationParticipant', ConversationParticipantSchema);
