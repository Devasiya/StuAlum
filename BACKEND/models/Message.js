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
    sender_email: {
        type: String
    },
    sender_role: {
        type: String,
        enum: ['student', 'alumni', 'admin']
    },
    sender_name: {
        type: String,
        default: ''
    },
    message_text: {
        type: String,
        required: true,
        trim: true
    },
    sent_at: {
        type: Date,
        default: Date.now
    },
    edited_at: {
        type: Date,
        default: null
    },
    deleted_at: {
        type: Date,
        default: null
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    is_read: {
        type: Boolean,
        default: false
    },
    deleted_by_users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

// Index for efficient querying
messageSchema.index({ conversation_id: 1, sent_at: 1 });

module.exports = mongoose.model('Message', messageSchema);
