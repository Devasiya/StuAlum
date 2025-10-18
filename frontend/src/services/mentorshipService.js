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
    }
};

export default mentorshipService;
