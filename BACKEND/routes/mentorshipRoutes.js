const express = require('express');
const router = express.Router();
// Assuming 'auth' is your middleware that verifies the JWT and sets req.user
const auth = require('../middleware/auth');

const {
    createMentorshipRequest,
    getMentorshipRequests,
    respondToMentorshipRequest,
    getMentorshipConnections,
    getMentorshipMatches,
    getOutgoingRequests,
    cancelMentorshipRequest,
    smartMatchMentors,
    getMentorshipHistory,
    getMentorshipPreferences,
    updateMentorshipPreferences,
    scheduleMentorshipSession,
    getScheduledSessions
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

// GET /api/mentorship/match
// Gets AI-matched mentors for the student
router.get('/match', getMentorshipMatches);

// POST /api/mentorship/smart-match
// Performs smart matching based on requirements and filters
router.post('/smart-match', smartMatchMentors);

// GET /api/mentorship/outgoing
// Gets outgoing mentorship requests for the student
router.get('/outgoing', getOutgoingRequests);

// POST /api/mentorship/cancel
// Cancels a mentorship request
router.post('/cancel', cancelMentorshipRequest);

// GET /api/mentorship/history
// Gets mentorship history for alumni
router.get('/history', getMentorshipHistory);

// GET /api/mentorship/preferences
// Gets mentorship preferences for alumni
router.get('/preferences', getMentorshipPreferences);

// PUT /api/mentorship/preferences
// Updates mentorship preferences for alumni
router.put('/preferences', updateMentorshipPreferences);

// POST /api/mentorship/schedule-session
// Schedules a mentorship session
router.post('/schedule-session', scheduleMentorshipSession);

// GET /api/mentorship/scheduled-sessions
// Gets scheduled sessions for alumni
router.get('/scheduled-sessions', getScheduledSessions);

module.exports = router;
