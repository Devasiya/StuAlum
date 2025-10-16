const express = require('express');
const router = express.Router();
// 🛑 FIX 1: Import the protect middleware function. Assuming it's exported from '../middleware/auth'
const auth = require('../middleware/auth');
// Assuming your auth middleware exports a function named 'protect' or similar. 
// If your auth.js file exports an object { protect: protectFunc }, you need to destructure it.
// For now, we will assume the main export 'auth' handles it, but you have duplicates.

const {
    getConversations,
    getConversationMessages,
    sendMessage,
    createOrGetConversation
} = require('../controllers/messageController');

// All message routes require authentication
// 🛑 FIX 2: Rename 'auth' to 'protect' in the import OR use 'auth' for all routes below.
// Based on the error, your auth middleware is likely named 'protect'.
// Let's assume you need to import { protect } from somewhere.
const protect = require('../middleware/auth').protect; // ADJUST THIS LINE based on your auth.js export

// -------------------------------------------------------------
// Note: Your original code had duplicate routes and misplaced routes.
// The clean version below uses 'auth' which is defined in the initial require.
// -------------------------------------------------------------
router.use(auth); // Applies auth to all routes below. This should be a full protection middleware.

// Get all conversations for the logged-in user
router.get('/conversations', getConversations);

// Get messages for a specific conversation
router.get('/conversation/:conversationId', getConversationMessages);

// Create or get conversation between two users
router.post('/conversation', createOrGetConversation);

// Send a message
router.post('/send', sendMessage);

// 🛑 REMOVED DUPLICATE AND ERROR-CAUSING LINES:
// router.post('/conversation', protect, messageController.createOrGetConversation); // ERROR: protect not defined
// router.post('/send', protect, messageController.sendMessage); // ERROR: protect not defined

module.exports = router;