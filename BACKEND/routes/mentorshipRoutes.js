const express = require('express');
const router = express.Router();
// Assuming 'auth' is your middleware that verifies the JWT and sets req.user
const auth = require('../middleware/auth'); 

const {
    createMentorshipRequest,
    getMentorshipRequests,
    respondToMentorshipRequest,
    getMentorshipConnections
} = require('../controllers/mentorshipController');

// --- Apply Auth Middleware ---
// All mentorship routes require a logged-in user
router.use(auth);

// --- Mentorship Interaction Routes ---

// POST /api/mentorship/request
// Creates a new mentorship request (called by the user clicking the button)
router.post('/request', createMentorshipRequest);

// GET /api/mentorship/requests
// Gets all pending requests for the authenticated mentor
router.get('/requests', getMentorshipRequests);

// POST /api/mentorship/respond
// Mentor accepts or declines a request (Accept/Decline)
router.post('/respond', respondToMentorshipRequest);

// GET /api/mentorship/connections
// Gets all current, active connections for the authenticated user
router.get('/connections', getMentorshipConnections);

module.exports = router;