// frontend/src/services/eventService.js

import api from './api'; // Assume this is your configured Axios instance

/**
 * Event-specific API calls.
 */

// GET /api/events
export const getEventsList = (params) => {
    // Hits the backend route defined in eventRoutes.js
    return api.get('/events', { params }); 
};

// POST /api/events
export const createEvent = (eventData) => {
    return api.post('/events', eventData); 
};

// DELETE /api/events/:eventId
export const deleteEvent = (eventId) => {
    return api.delete(`/events/${eventId}`); 
};


// 🚨 FINAL IMPLEMENTATION: POST /api/events/:eventId/register
export const registerForEvent = (eventId) => {
    // This hits the backend route designed for user registration
    return api.post(`/events/${eventId}/register`);
};