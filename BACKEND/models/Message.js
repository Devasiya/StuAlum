const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message_text: {
        type: String,
        required: true,
        trim: true
    },
    sent_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient querying
messageSchema.index({ conversation_id: 1, sent_at: 1 });

module.exports = mongoose.model('Message', messageSchema);
