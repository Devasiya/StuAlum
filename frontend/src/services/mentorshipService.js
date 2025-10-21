import api from './api';

const mentorshipService = {
    // Get AI-matched mentors for the student
    getMentorshipMatches: async () => {
        const response = await api.get('/mentorship/match');
        return response.data;
    },

    // Perform smart matching with requirements and filters
    smartMatchMentors: async (requirements, filters) => {
        const response = await api.post('/mentorship/smart-match', {
            requirements,
            filters
        });
        return response.data;
    },

    // Get mentorship connections for the user
    getMentorshipConnections: async () => {
        const response = await api.get('/mentorship/connections');
        return response.data;
    },

    // Get outgoing mentorship requests for the student
    getOutgoingRequests: async () => {
        const response = await api.get('/mentorship/outgoing');
        return response.data;
    },

    // Create a mentorship request
    createMentorshipRequest: async (mentorId) => {
        const response = await api.post('/mentorship/request', { mentor_id: mentorId });
        return response.data;
    },

    // Cancel a mentorship request
    cancelMentorshipRequest: async (requestId) => {
        const response = await api.post('/mentorship/cancel', { requestId });
        return response.data;
    },

    // Get mentorship requests for alumni (mentor)
    getMentorshipRequests: async () => {
        const response = await api.get('/mentorship/requests');
        return response.data;
    },

    // Respond to mentorship request (accept/decline)
    respondToMentorshipRequest: async (requestId, action) => {
        const response = await api.post('/mentorship/respond', { requestId, action });
        return response.data;
    },

    // Get mentorship history for alumni
    getMentorshipHistory: async () => {
        const response = await api.get('/mentorship/history');
        return response.data;
    },

    // Get mentorship preferences for alumni
    getMentorshipPreferences: async () => {
        const response = await api.get('/mentorship/preferences');
        return response.data;
    },

    // Update mentorship preferences for alumni
    updateMentorshipPreferences: async (preferences) => {
        const response = await api.put('/mentorship/preferences', preferences);
        return response.data;
    },

    // Schedule a mentorship session
    scheduleMentorshipSession: async (sessionData) => {
        const response = await api.post('/mentorship/schedule-session', sessionData);
        return response.data;
    },

    // Get scheduled sessions for alumni
    getScheduledSessions: async () => {
        const response = await api.get('/mentorship/scheduled-sessions');
        return response.data;
    },

    // Get scheduled sessions for students
    getScheduledSessionsForStudent: async () => {
        const response = await api.get('/mentorship/scheduled-sessions-student');
        return response.data;
    },

    // Complete a mentorship relationship
    completeMentorship: async (requestId) => {
        const response = await api.post('/mentorship/complete', { requestId });
        return response.data;
    },

    // Cancel a scheduled mentorship session
    cancelMentorshipSession: async (sessionId) => {
        const response = await api.post('/mentorship/cancel-session', { sessionId });
        return response.data;
    },

    // Update a scheduled mentorship session
    updateMentorshipSession: async (sessionData) => {
        const response = await api.put('/mentorship/update-session', sessionData);
        return response.data;
    },

    // Create or get conversation between mentor and mentee
    createOrGetConversation: async (otherUserId) => {
        const response = await api.post('/mentorship/conversation', { otherUserId });
        return response.data;
    },

    // Send a message in a conversation
    sendMessage: async (conversationId, messageText) => {
        const response = await api.post('/mentorship/message', { conversationId, messageText });
        return response.data;
    },

    // Edit a message
    editMessage: async (messageId, messageText) => {
        const response = await api.put(`/mentorship/messages/${messageId}`, { message_text: messageText });
        return response.data;
    },

    // Delete a message
    deleteMessage: async (messageId) => {
        const response = await api.delete(`/mentorship/messages/${messageId}`);
        return response.data;
    },

    // Get all conversations for the user
    getConversations: async () => {
        const response = await api.get('/mentorship/conversations');
        return response.data;
    },

    // Get messages for a specific conversation
    getMessages: async (conversationId) => {
        const response = await api.get(`/mentorship/messages/${conversationId}`);
        return response.data;
    },

    // Upload a mentorship resource (alumni only)
    uploadMentorshipResource: async (formData) => {
        const response = await api.post('/mentorship/upload-resource', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get all mentorship resources (for students)
    getMentorshipResources: async () => {
        const response = await api.get('/mentorship/resources');
        return response.data;
    },

    // Delete a mentorship resource (alumni only)
    deleteMentorshipResource: async (resourceId) => {
        const response = await api.delete(`/mentorship/resources/${resourceId}`);
        return response.data;
    }
};

export default mentorshipService;
