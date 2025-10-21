const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
    getConversations,
    getConversationMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    createOrGetConversation
} = require('../controllers/messageController');

// All message routes require authentication
router.use(auth);

// Get all conversations for the logged-in user
router.get('/conversations', getConversations);

// Get messages for a specific conversation
router.get('/conversation/:conversationId', getConversationMessages);

// Create or get conversation between two users
router.post('/conversation', createOrGetConversation);

// Send a message
router.post('/send', sendMessage);

// Edit a message
router.put('/:messageId', editMessage);

// Delete a message
router.delete('/:messageId', deleteMessage);

module.exports = router;
