// BACKEND/controllers/eventController.js (FINALIZED)

const Event = require('../models/Event'); 
const mongoose = require('mongoose');

// Helper function to determine the Mongoose model name based on role
const getProfileType = (role) => {
    if (role === 'student') return 'StudentProfile';
    if (role === 'alumni') return 'AlumniProfile';
    if (role === 'admin') return 'AdminProfile'; 
    return null;
};

// Helper to determine the start date query based on the 'dateRange' filter
const getDateQuery = (dateRange) => {
    const now = new Date();
    let query = { $gte: now }; 

    if (dateRange === 'This month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        query = { $gte: startOfMonth };
    } 
    return query;
};

// --- Helper function to verify event ownership (Used by DELETE) ---
const verifyEventOwnership = async (eventId, userId, res) => {
    const event = await Event.findById(eventId).select('created_by');
    if (!event) {
        res.status(404).json({ message: 'Event not found.' });
        return false;
    }
    // Compare the event's creator ID (Mongoose ObjectId) with the authenticated user ID (String)
    if (event.created_by.toString() !== userId) {
        res.status(403).json({ message: 'Unauthorized. You do not own this event.' });
        return false;
    }
    return event;
};


// GET /api/events - Retrieve filtered list of upcoming events
exports.getEvents = async (req, res) => {
    try {
        const { category, audience, dateRange, location } = req.query;
        let query = { status: 'scheduled' };
        
        query.start_time = getDateQuery(dateRange);

        if (category && category.toLowerCase() !== 'all') {
            query.category = category;
        }
        if (audience && audience.toLowerCase() !== 'all') {
            query.audience = audience;
        }
        if (location && location.toLowerCase() !== 'all') {
            query.event_mode = location; 
        }

        const events = await Event.find(query)
            .sort({ start_time: 1 })
            // 🚨 FIX: Explicitly select 'created_by' for frontend ownership check
            .select('title description category event_mode start_time end_time capacity created_by') 
            .lean();

        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events.' });
    }
};

// POST /api/events - Create new event (Admin only)
exports.createEvent = async (req, res) => {
    try {
        const { id: created_by, role } = req.user;
        const creator_model_type = getProfileType(role);

        const { 
            title, description, category, audience, location, event_mode, 
            start_time, end_time, capacity 
        } = req.body;

        if (!title || !category || !start_time || !end_time || !event_mode) {
            return res.status(400).json({ message: 'Missing required event fields.' });
        }

        const newEvent = new Event({
            title, description, category, audience, location, event_mode,
            start_time: new Date(start_time),
            end_time: new Date(end_time),
            capacity,
            created_by,
            creator_model_type
        });

        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully.', event: newEvent });

    } catch (error) {
        console.error('Error creating event:', error.message);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Failed to create event due to a server error.' });
    }
};

// POST /api/events/:eventId/register - User registration (Open to all)
exports.registerForEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { id: userId, role } = req.user; 
        
        const registered_user_model_type = getProfileType(role);

        // 1. Fetch event, ensuring we get the registered list and capacity
        const event = await Event.findById(eventId).select('status capacity registered_users');

        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }
        if (event.status !== 'scheduled') {
            return res.status(400).json({ message: `Cannot register: Event is currently ${event.status}.` });
        }
        
        // Check for duplicate registration
        if (event.registered_users.some(item => item.user_id.toString() === userId.toString())) {
            return res.status(409).json({ message: 'You are already registered for this event.' });
        }
        
        // Check capacity
        if (event.capacity > 0 && event.registered_users.length >= event.capacity) {
            return res.status(409).json({ message: 'Registration failed: Event is full.' });
        }
        
        // 2. Update the event document atomically
        await Event.updateOne(
            { _id: eventId },
            { 
                $push: { 
                    registered_users: { 
                        user_id: userId,
                        registered_at: new Date()
                    }
                }, 
                $set: { registered_user_model_type }, 
                $inc: { registered_count: 1 } 
            }
        ).exec();

        res.json({ message: 'Successfully registered for the event.', eventId });

    } catch (error) {
        console.error('Error registering for event:', error.message);
        res.status(500).json({ message: 'Failed to register for the event.' });
    }
};

// DELETE /api/events/:eventId
exports.deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { id: userId, role } = req.user; 
        
        // Ensure only Admins can attempt deletion (optional, but good practice)
        if (role !== 'admin') {
            return res.status(403).json({ message: 'Only Admins can delete events.' });
        }

        // 1. Verify ownership and existence
        const event = await verifyEventOwnership(eventId, userId, res);
        if (!event) return; 

        // 2. Delete the event
        await Event.deleteOne({ _id: eventId });
        
        res.json({ message: 'Event deleted successfully.' });

    } catch (error) {
        console.error('Error deleting event:', error.message);
        res.status(500).json({ message: 'Failed to delete event.' });
    }
};