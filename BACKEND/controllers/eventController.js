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
        // Get user ID for registration status check
        const userId = req.user ? req.user.id : null;

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

        // 1. Fetch events, including the registered_users array
        const events = await Event.find(query)
            .sort({ start_time: 1 })
            // Now includes 'registered_count' and 'registered_users' for frontend logic
            .select('title description category event_mode start_time end_time capacity created_by registered_users registered_count')
            .lean();

        // 2. Map and check registration status for the current user
        const eventsWithStatus = events.map(event => {
            let isRegistered = false;

            if (userId && event.registered_users) {
                isRegistered = event.registered_users.some(
                    // Check if the current user's ID exists in the registered_users array
                    item => item.user_id && item.user_id.toString() === userId.toString()
                );
            }

            // Return the event object with the new status flag for the frontend
            return {
                ...event,
                userRegistered: isRegistered,
            };
        });

        res.json(eventsWithStatus);
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

        const event = await Event.findById(eventId).select('status capacity registered_users');

        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }
        if (event.status !== 'scheduled') {
            return res.status(400).json({ message: `Cannot register: Event is currently ${event.status}.` });
        }

        if (event.registered_users.some(item => item.user_id.toString() === userId.toString())) {
            return res.status(409).json({ message: 'You are already registered for this event.' });
        }

        if (event.capacity > 0 && event.registered_users.length >= event.capacity) {
            return res.status(409).json({ message: 'Registration failed: Event is full.' });
        }

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

        if (role !== 'admin') {
            return res.status(403).json({ message: 'Only Admins can delete events.' });
        }

        const event = await verifyEventOwnership(eventId, userId, res);
        if (!event) return;

        await Event.deleteOne({ _id: eventId });

        res.json({ message: 'Event deleted successfully.' });

    } catch (error) {
        console.error('Error deleting event:', error.message);
        res.status(500).json({ message: 'Failed to delete event.' });
    }
};



//ai 

const {getGeminiEventPlan}=require("../utils/gemini");

exports.generateEventPlan = async (req, res) => {
  try {
    console.log("📩 Incoming request body:", req.body);

    const {
      title, category, startTime, endTime, capacity,
      audience, mode, location, description,status
    } = req.body;

    if (!title || !location || !startTime || !endTime || !mode) {
      console.warn("⚠️ Missing title or location");
      return res.status(400).json({ error: "Event name and location are required." });
    }

    const prompt = `
Generate a detailed, professional event plan for the following:

**Title:** ${title}
**Category:** ${category}
**Date & Time:** ${startTime} to ${endTime}
**Target Audience:** ${audience}
**Mode:** ${mode}
**Location:** ${location}
**Capacity:** ${capacity}
**Description:** ${description}
**Status:** ${status}

Please format the output as a **well-structured Markdown document** with:
- Headings (##)
- Bullet points
- Bold for section titles
- Proper spacing

Include:
- Venue Suggestions
- Timeline of Activities
- Catering Recommendations
- Decoration Ideas
- Entertainment Options
- Logistics & Setup
- Budget Estimation (in INR)
- Additional Recommendations

Make it look creative, elegant, and easy to read.
`;

    console.log("🧠 Sending prompt to Gemini...");

    const plan = await getGeminiEventPlan(prompt);
    console.log("✅ Gemini responded successfully!");

    // return res.status(200).json({ success: true, plan });
    res.json({ success: true, plan });
  } catch (err) {
    console.error("❌ ERROR in generateEventPlan:", err);
     return res.status(500).json({ error: "Failed to generate event plan." });
  }
};



// ✅ Publish event (AI-generated event plan)
// exports.publishEvent = async (req, res) => {
//   try {
//     const { title, location, output } = req.body;

//     if (!title || !location || !output) {
//       return res.status(400).json({ error: "Title, location, and event plan are required." });
//     }

//     // 🔹 Create an event entry in your Event model
//     const newEvent = await Event.create({
//       title,
//       location,
//       description: output, // Store the AI-generated plan
//       status: "Published",
//       createdAt: new Date(),
//     });

//     res.status(201).json({
//       success: true,
//       message: "Event published successfully!",
//       event: newEvent,
//     });
//   } catch (err) {
//     console.error("❌ Error publishing event:", err);
//     res.status(500).json({ error: "Failed to publish event" });
//   }
// };


exports.publishEvent = async (req, res) => {
  try {
    const { eventId, title, location, output } = req.body;

    if (!title || !location || !output) {
      return res.status(400).json({
        error: "Title, location, and generated event plan are required.",
      });
    }

    let event;
    if (eventId) {
      // 🔹 Update existing event
      event = await Event.findByIdAndUpdate(
        eventId,
        {
          title,
          location,
          description: output,
          status: "Published",
        },
        { new: true }
      );
    } else {
      // 🔹 Create new event if no ID provided
      event = await Event.create({
        title,
        location,
        description: output,
        status: "Published",
        createdAt: new Date(),
      });
    }

    res.status(201).json({
      success: true,
      message: "✅ Event published successfully!",
      event,
    });
  } catch (error) {
    console.error("❌ Error publishing event:", error);
    res.status(500).json({ error: "Failed to publish event" });
  }
};
