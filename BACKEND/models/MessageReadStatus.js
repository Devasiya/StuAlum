const mongoose = require('mongoose');

const MessageReadStatusSchema = new mongoose.Schema({
  message_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  read_at: { type: Date, default: Date.now },
}, { 
  _id: false,
  timestamps: false,
});

MessageReadStatusSchema.index({ message_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('MessageReadStatus', MessageReadStatusSchema);
