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
    completeMentorship,
    getMentorshipHistory,
    getMentorshipPreferences,
    updateMentorshipPreferences,
    scheduleMentorshipSession,
    getScheduledSessions,
    getScheduledSessionsForStudent,
    cancelMentorshipSession,
    updateMentorshipSession,
    createOrGetConversation,
    sendMessage,
    getConversations,
    getMessages,
    uploadMentorshipResource,
    getMentorshipResources,
    deleteMentorshipResource
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

// POST /api/mentorship/complete
// Completes a mentorship relationship
router.post('/complete', completeMentorship);

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

// GET /api/mentorship/scheduled-sessions-student
// Gets scheduled sessions for students
router.get('/scheduled-sessions-student', getScheduledSessionsForStudent);

// POST /api/mentorship/cancel-session
// Cancels a scheduled mentorship session
router.post('/cancel-session', cancelMentorshipSession);

// PUT /api/mentorship/update-session
// Updates a scheduled mentorship session
router.put('/update-session', updateMentorshipSession);

// POST /api/mentorship/conversation
// Creates or gets a conversation between mentor and mentee
router.post('/conversation', createOrGetConversation);

// POST /api/mentorship/message
// Sends a message in a conversation
router.post('/message', sendMessage);

// GET /api/mentorship/conversations
// Gets all conversations for the authenticated user
router.get('/conversations', getConversations);

// GET /api/mentorship/messages/:conversationId
// Gets messages for a specific conversation
router.get('/messages/:conversationId', getMessages);

// POST /api/mentorship/upload-resource
// Uploads a mentorship resource (alumni only)
const upload = require('../middleware/uploadMiddleware');
router.post('/upload-resource', upload.single('file'), uploadMentorshipResource);

// GET /api/mentorship/resources
// Gets all mentorship resources (for students)
router.get('/resources', getMentorshipResources);

// DELETE /api/mentorship/resources/:resourceId
// Deletes a mentorship resource (alumni only)
router.delete('/resources/:resourceId', deleteMentorshipResource);

module.exports = router;
