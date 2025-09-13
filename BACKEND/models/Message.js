const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  conversation_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message_text: { type: String, required: true },
  sent_at: { type: Date, default: Date.now },
  is_read: { type: Boolean, default: false }, // For 2-user chats; for group chats consider MessageReadStatus
}, { timestamps: false });

module.exports = mongoose.model('Message', MessageSchema);
