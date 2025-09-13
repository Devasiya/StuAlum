const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  title: { type: String }, // Optional for group chats
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Conversation', ConversationSchema);
