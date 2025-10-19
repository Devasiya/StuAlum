const MentorshipRequest = require('../models/MentorshipRequest');
const MentorshipPreference = require('../models/MentorshipPreference');
const MentorshipSession = require('../models/MentorshipSession');
const Conversation = require('../models/Conservation');
const Message = require('../models/Message');
const User = require('../models/User');
const AlumniProfile = require('../models/AlumniProfile');
const StudentProfile = require('../models/StudentProfile');
const PrepResource = require('../models/PrepResource');
const NLP_SERVICE = require('../utils/nlpService');
const UTILS = require('../utils/mentorshipUtils');

// Create a new mentorship request (student to alumni)
exports.createMentorshipRequest = async (req, res) => {
    try {
        const { mentor_id, message } = req.body;
        const mentee_id = req.user.id;

        // Check if request already exists
        const existingRequest = await MentorshipRequest.findOne({
            mentee_id,
            mentor_id,
            status: { $in: ['requested', 'accepted'] }
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'Request already exists' });
        }

        const request = new MentorshipRequest({
            mentee_id,
            mentor_id,
            message: message || 'I would like to request mentorship from you.',
            status: 'requested'
        });

        await request.save();
        res.status(201).json({ message: 'Mentorship request sent successfully', request });
    } catch (error) {
        console.error('Error creating mentorship request:', error);
        res.status(500).json({ message: 'Server error while creating request' });
    }
};

// Get all pending requests for the authenticated mentor (alumni)
exports.getMentorshipRequests = async (req, res) => {
    try {
        const mentor_id = req.user.id;

        const requests = await MentorshipRequest.find({ mentor_id, status: 'requested' })
            .populate({
                path: 'mentee_id',
                select: 'email full_name profile_photo_url current_position company',
                model: 'StudentProfile'
            })
            .sort({ created_at: -1 });

        const enrichedRequests = requests.map((req) => ({
            _id: req._id,
            mentee_id: {
                _id: req.mentee_id._id,
                email: req.mentee_id.email,
                full_name: req.mentee_id.full_name,
                profile_photo_url: req.mentee_id.profile_photo_url,
                current_position: req.mentee_id.current_position,
                company: req.mentee_id.company
            },
            created_at: req.created_at
        }));

        res.status(200).json(enrichedRequests);
    } catch (error) {
        console.error('Error fetching mentorship requests:', error);
        res.status(500).json({ message: 'Server error while fetching requests' });
    }
};

// Mentor accepts or declines a request
exports.respondToMentorshipRequest = async (req, res) => {
    try {
        const { requestId, action } = req.body;
        const mentor_id = req.user.id;

        const request = await MentorshipRequest.findOne({
            _id: requestId,
            mentor_id,
            status: 'requested'
        });

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = action === 'accept' ? 'accepted' : 'declined';
        await request.save();

        res.status(200).json({ message: `Request ${action}ed successfully` });
    } catch (error) {
        console.error('Error responding to mentorship request:', error);
        res.status(500).json({ message: 'Server error while responding to request' });
    }
};

// Get all current, active connections for the authenticated user
exports.getMentorshipConnections = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        let connections = [];

        if (userRole === 'student') {
            // Student sees their mentors
            connections = await MentorshipRequest.find({
                mentee_id: userId,
                status: 'accepted'
            })
            .populate({
                path: 'mentor_id',
                select: 'email full_name profile_photo_url current_position company',
                model: 'AlumniProfile'
            })
            .populate({
                path: 'mentee_id',
                select: 'email full_name profile_photo_url current_position company',
                model: 'StudentProfile'
            });
        } else if (userRole === 'alumni') {
            // Alumni sees their mentees
            connections = await MentorshipRequest.find({
                mentor_id: userId,
                status: 'accepted'
            })
            .populate({
                path: 'mentor_id',
                select: 'email full_name profile_photo_url current_position company',
                model: 'AlumniProfile'
            })
            .populate({
                path: 'mentee_id',
                select: 'email full_name profile_photo_url current_position company',
                model: 'StudentProfile'
            });
        }

        res.status(200).json(connections);
    } catch (error) {
        console.error('Error fetching mentorship connections:', error);
        res.status(500).json({ message: 'Server error while fetching connections' });
    }
};

// Get AI-matched mentors for the student
exports.getMentorshipMatches = async (req, res) => {
    try {
        const userId = req.user.id;

        // Simple matching logic - get all alumni profiles
        // In a real implementation, this would use AI/ML for better matching
        const mentors = await AlumniProfile.find()
            .select('email full_name profile_photo_url current_position company')
            .limit(10);

        res.status(200).json(mentors);
    } catch (error) {
        console.error('Error fetching mentorship matches:', error);
        res.status(500).json({ message: 'Server error while fetching matches' });
    }
};

// Perform smart matching based on requirements and filters
exports.smartMatchMentors = async (req, res) => {
    try {
        const { requirements, filters } = req.body;
        const userId = req.user.id;

        // Student Preparation: Fetch student's complete profile
        const studentProfile = await StudentProfile.findOne({ user_id: userId }) || { current_position: '', location: '', availability: '', skills: [] };

        // Concatenate student's requirements and current_position into query string
        const studentQuery = `${requirements || ''} ${studentProfile.current_position || ''}`.trim();

        // Get all alumni profiles as corpus
        const allAlumniProfiles = await AlumniProfile.find()
            .select('email full_name profile_photo_url current_position company industry location skills graduation_year user_id');

        // Generate TF-IDF vector for student's semantic query
        const studentVector = await NLP_SERVICE.generateTfIdfVector(studentQuery, allAlumniProfiles);

        // Prepare student's skills as a Set for efficient comparison
        const studentSkills = new Set(studentProfile.skills || []);

        // Apply filters if provided
        let alumniProfiles = allAlumniProfiles;
        if (filters) {
            if (filters.role) {
                alumniProfiles = alumniProfiles.filter(profile =>
                    profile.current_position && profile.current_position.toLowerCase().includes(filters.role.toLowerCase())
                );
            }

            if (filters.location) {
                alumniProfiles = alumniProfiles.filter(profile =>
                    profile.location && profile.location.toLowerCase().includes(filters.location.toLowerCase())
                );
            }

            if (filters.skills) {
                const skillArray = filters.skills.split(',').map(s => s.trim().toLowerCase());
                alumniProfiles = alumniProfiles.filter(profile =>
                    profile.skills && profile.skills.some(skill => skillArray.includes(skill.toLowerCase()))
                );
            }

            if (filters.alumniYear) {
                alumniProfiles = alumniProfiles.filter(profile =>
                    profile.graduation_year === filters.alumniYear
                );
            }

            // Availability filter - join with MentorshipPreference
            if (filters.availability) {
                const preferences = await MentorshipPreference.find({ availability: { $regex: filters.availability, $options: 'i' } }).select('user_id');
                const userIds = preferences.map(p => p.user_id.toString());
                alumniProfiles = alumniProfiles.filter(profile => userIds.includes(profile.user_id.toString()));
            }
        }

        // Iterative Scoring: Calculate scores for each alumni profile
        const matchedMentors = [];

        for (const alumniProfile of alumniProfiles) {
            // Generate TF-IDF vector for alumni's description text
            const alumniText = `${alumniProfile.current_position || ''} ${alumniProfile.industry || ''} ${alumniProfile.company || ''}`.trim();
            const alumniVector = await NLP_SERVICE.generateTfIdfVector(alumniText, allAlumniProfiles);

            // Calculate individual scores (0.0 to 1.0)
            const S_desc = await NLP_SERVICE.cosineSimilarity(studentVector, alumniVector);
            const S_skill = UTILS.jaccardSimilarity(studentSkills, new Set(alumniProfile.skills || []));
            const S_role = UTILS.calculateRoleSimilarity(studentProfile.current_position || '', alumniProfile.current_position || '');
            const S_loc = UTILS.calculateLocationScore(studentProfile.location || '', alumniProfile.location || '');
            const S_avail = UTILS.calculateAvailabilityScore(studentProfile.availability || '', alumniProfile.availability || '');

            // Compute Total Weighted Score
            const S_total = (0.35 * S_desc) + (0.30 * S_skill) + (0.25 * S_role) + (0.05 * S_loc) + (0.05 * S_avail);

            // Only include if score > 0.1
            if (S_total > 0.1) {
                matchedMentors.push({
                    _id: alumniProfile._id,
                    email: alumniProfile.email,
                    full_name: alumniProfile.full_name,
                    profile_photo_url: alumniProfile.profile_photo_url,
                    current_position: alumniProfile.current_position,
                    company: alumniProfile.company,
                    industry: alumniProfile.industry,
                    location: alumniProfile.location,
                    skills: alumniProfile.skills,
                    graduation_year: alumniProfile.graduation_year,
                    ai_score: Math.round(S_total * 100), // Scale to 0-100
                    match_reason: `Semantic similarity: ${S_desc.toFixed(2)}, Skill overlap: ${S_skill.toFixed(2)}, Role compatibility: ${S_role.toFixed(2)}`,
                    rating: (Math.random() * 2 + 3).toFixed(1), // Mock rating 3.0-5.0
                    mentee_count: Math.floor(Math.random() * 10) + 1 // Mock mentee count
                });
            }
        }

        // Ranking and Output: Sort by ai_score descending
        matchedMentors.sort((a, b) => b.ai_score - a.ai_score);

        res.status(200).json(matchedMentors);
    } catch (error) {
        console.error('Error performing smart matching:', error);
        res.status(500).json({ message: 'Server error while performing smart matching' });
    }
};

// Helper function to expand keywords with synonyms and related terms
function expandKeywordsWithSynonyms(keywords) {
    const synonymMap = {
        'software': ['software', 'programming', 'coding', 'development', 'tech'],
        'engineer': ['engineer', 'developer', 'programmer', 'coder'],
        'google': ['google', 'alphabet', 'tech giant'],
        'development': ['development', 'web development', 'app development', 'software development', 'frontend', 'backend', 'fullstack'],
        'data': ['data', 'analytics', 'machine learning', 'ai', 'data science'],
        'marketing': ['marketing', 'digital marketing', 'social media', 'advertising'],
        'finance': ['finance', 'banking', 'investment', 'financial'],
        'design': ['design', 'ui', 'ux', 'graphic design', 'product design'],
        'management': ['management', 'leadership', 'project management', 'team lead'],
        'sales': ['sales', 'business development', 'account management']
    };

    const expanded = new Set();
    keywords.forEach(keyword => {
        expanded.add(keyword);
        // Check for synonyms
        for (const [key, synonyms] of Object.entries(synonymMap)) {
            if (keyword.includes(key) || synonyms.some(syn => keyword.includes(syn))) {
                synonyms.forEach(syn => expanded.add(syn));
            }
        }
    });

    return Array.from(expanded);
}

// Get outgoing mentorship requests for the student
exports.getOutgoingRequests = async (req, res) => {
    try {
        const mentee_id = req.user.id;

        const requests = await MentorshipRequest.find({ mentee_id })
            .populate({
                path: 'mentor_id',
                select: 'email full_name profile_photo_url current_position company',
                model: 'AlumniProfile'
            })
            .sort({ created_at: -1 });

        res.status(200).json(requests);
    } catch (error) {
        console.error('Error fetching outgoing requests:', error);
        res.status(500).json({ message: 'Server error while fetching outgoing requests' });
    }
};

// Cancel a mentorship request
exports.cancelMentorshipRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        const mentee_id = req.user.id;

        const request = await MentorshipRequest.findOneAndDelete({
            _id: requestId,
            mentee_id,
            status: 'requested'
        });

        if (!request) {
            return res.status(404).json({ message: 'Request not found or cannot be cancelled' });
        }

        res.status(200).json({ message: 'Request cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling mentorship request:', error);
        res.status(500).json({ message: 'Server error while cancelling request' });
    }
};

// Complete a mentorship relationship
exports.completeMentorship = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const { requestId } = req.body;

        if (userRole !== 'alumni') {
            return res.status(403).json({ message: 'Only alumni can complete mentorships' });
        }

        const request = await MentorshipRequest.findOne({
            _id: requestId,
            mentor_id: userId,
            status: 'accepted'
        });

        if (!request) {
            return res.status(404).json({ message: 'Mentorship relationship not found' });
        }

        request.status = 'completed';
        await request.save();

        res.status(200).json({ message: 'Mentorship completed successfully' });
    } catch (error) {
        console.error('Error completing mentorship:', error);
        res.status(500).json({ message: 'Server error while completing mentorship' });
    }
};

// Get mentorship history for alumni (completed relationships)
exports.getMentorshipHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        if (userRole !== 'alumni') {
            return res.status(403).json({ message: 'Only alumni can access mentorship history' });
        }

        // Get completed mentorship relationships where user was mentor
        const completedRequests = await MentorshipRequest.find({
            mentor_id: userId,
            status: 'completed'
        }).populate({
            path: 'mentee_id',
            select: 'email full_name profile_photo_url current_position company',
            model: 'StudentProfile'
        });

        const history = completedRequests.filter(request => request.mentee_id).map((request) => {
            const mentee = request.mentee_id;
            return {
                _id: request._id,
                mentee: {
                    _id: mentee._id,
                    email: mentee.email,
                    full_name: mentee.full_name,
                    profile_photo_url: mentee.profile_photo_url,
                    current_position: mentee.current_position,
                    company: mentee.company
                },
                status: 'completed',
                connected_at: request.created_at,
                completed_at: request.updated_at
            };
        });

        res.status(200).json(history);
    } catch (error) {
        console.error('Error fetching mentorship history:', error);
        res.status(500).json({ message: 'Server error while fetching mentorship history' });
    }
};

// Get mentorship preferences for alumni
exports.getMentorshipPreferences = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        if (userRole !== 'alumni') {
            return res.status(403).json({ message: 'Only alumni can access mentorship preferences' });
        }

        const preferences = await MentorshipPreference.findOne({ user_id: userId });

        if (!preferences) {
            // Return default preferences if none exist
            return res.status(200).json({
                industry: '',
                role: '',
                skills: [],
                location: '',
                availability: '',
                alumni_year_range_start: null,
                alumni_year_range_end: null
            });
        }

        res.status(200).json(preferences);
    } catch (error) {
        console.error('Error fetching mentorship preferences:', error);
        res.status(500).json({ message: 'Server error while fetching mentorship preferences' });
    }
};

// Update mentorship preferences for alumni
exports.updateMentorshipPreferences = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const { industry, role, skills, location, availability, alumni_year_range_start, alumni_year_range_end } = req.body;

        if (userRole !== 'alumni') {
            return res.status(403).json({ message: 'Only alumni can update mentorship preferences' });
        }

        const preferences = await MentorshipPreference.findOneAndUpdate(
            { user_id: userId },
            {
                industry,
                role,
                skills,
                location,
                availability,
                alumni_year_range_start,
                alumni_year_range_end
            },
            { upsert: true, new: true }
        );

        res.status(200).json({
            message: 'Mentorship preferences updated successfully',
            preferences
        });
    } catch (error) {
        console.error('Error updating mentorship preferences:', error);
        res.status(500).json({ message: 'Server error while updating mentorship preferences' });
    }
};

// Schedule a mentorship session
exports.scheduleMentorshipSession = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const { mentee_id, scheduled_date, scheduled_time, duration, mode, topic, meeting_link } = req.body;

        if (userRole !== 'alumni') {
            return res.status(403).json({ message: 'Only alumni can schedule sessions' });
        }

        // Verify the mentee is actually connected to this mentor
        const connection = await MentorshipRequest.findOne({
            mentor_id: userId,
            mentee_id,
            status: 'accepted'
        });

        if (!connection) {
            return res.status(403).json({ message: 'You can only schedule sessions with your mentees' });
        }

        // Combine date and time into a single Date object
        const scheduledDateTime = new Date(`${scheduled_date}T${scheduled_time}`);

        // Create a mentorship session (assuming MentorshipSession model exists)
        const session = new MentorshipSession({
            match_id: connection._id, // Using request ID as match ID for now
            scheduled_time: scheduledDateTime,
            duration,
            mode,
            topic,
            meeting_link: meeting_link || ''
        });

        await session.save();

        res.status(201).json({
            message: 'Mentorship session scheduled successfully',
            session
        });
    } catch (error) {
        console.error('Error scheduling mentorship session:', error);
        res.status(500).json({ message: 'Server error while scheduling session' });
    }
};

// Get scheduled sessions for alumni
exports.getScheduledSessions = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        if (userRole !== 'alumni') {
            return res.status(403).json({ message: 'Only alumni can view scheduled sessions' });
        }

        // Get all accepted mentorship requests for this mentor
        const connections = await MentorshipRequest.find({
            mentor_id: userId,
            status: 'accepted'
        });

        console.log('Found connections:', connections.length);
        const matchIds = connections.map(conn => conn._id);
        console.log('Match IDs:', matchIds);

        // Get sessions for these matches
        const sessions = await MentorshipSession.find({
            match_id: { $in: matchIds },
            status: { $in: ['upcoming', 'rescheduled'] }
        }).sort({ scheduled_time: 1 });

        console.log('Found sessions:', sessions.length);
        console.log('Sessions:', sessions.map(s => ({ id: s._id, match_id: s.match_id, status: s.status })));

        // Enrich with mentee details using the connections we already have
        const enrichedSessions = await Promise.all(sessions.map(async (session) => {
            const connection = connections.find(conn => conn._id.toString() === session.match_id.toString());

            // Handle case where connection might not exist
            if (!connection) {
                console.log('No connection found for session:', session._id, 'match_id:', session.match_id);
                return null; // Skip this session if connection is invalid
            }

            const studentProfile = await StudentProfile.findById(connection.mentee_id);

            if (studentProfile) {
                return {
                    _id: session._id,
                    mentee: {
                        _id: studentProfile._id,
                        full_name: studentProfile.full_name,
                        profile_photo_url: studentProfile.profile_photo_url,
                        current_position: studentProfile.current_position,
                        company: studentProfile.company
                    },
                    scheduled_date: session.scheduled_time.toISOString().split('T')[0],
                    scheduled_time: session.scheduled_time.toTimeString().slice(0, 5),
                    duration: session.duration,
                    mode: session.mode,
                    topic: session.topic,
                    meeting_link: session.meeting_link,
                    status: session.status
                };
            } else {
                // Use unknown if no profile exists
                console.log('No student profile found for connection:', connection._id, 'mentee_id:', connection.mentee_id);
                return {
                    _id: session._id,
                    mentee: {
                        _id: connection.mentee_id,
                        full_name: 'Unknown',
                        profile_photo_url: '',
                        current_position: '',
                        company: ''
                    },
                    scheduled_date: session.scheduled_time.toISOString().split('T')[0],
                    scheduled_time: session.scheduled_time.toTimeString().slice(0, 5),
                    duration: session.duration,
                    mode: session.mode,
                    topic: session.topic,
                    status: session.status
                };
            }
        }));

        // Filter out null sessions
        const validSessions = enrichedSessions.filter(session => session !== null);
        console.log('Valid sessions to return:', validSessions.length);

        res.status(200).json(validSessions);
    } catch (error) {
        console.error('Error fetching scheduled sessions:', error);
        res.status(500).json({ message: 'Server error while fetching sessions' });
    }
};

// Get scheduled sessions for students
exports.getScheduledSessionsForStudent = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        if (userRole !== 'student') {
            return res.status(403).json({ message: 'Only students can view their scheduled sessions' });
        }

        // Get all accepted mentorship requests for this student
        const connections = await MentorshipRequest.find({
            mentee_id: userId,
            status: 'accepted'
        });

        console.log('Found connections:', connections.length);
        const matchIds = connections.map(conn => conn._id);
        console.log('Match IDs:', matchIds);

        // Get sessions for these matches
        const sessions = await MentorshipSession.find({
            match_id: { $in: matchIds },
            status: { $in: ['upcoming', 'rescheduled'] }
        }).sort({ scheduled_time: 1 });

        console.log('Found sessions:', sessions.length);
        console.log('Sessions:', sessions.map(s => ({ id: s._id, match_id: s.match_id, status: s.status })));

        // Enrich with mentor details using the connections we already have
        const enrichedSessions = await Promise.all(sessions.map(async (session) => {
            const connection = connections.find(conn => conn._id.toString() === session.match_id.toString());

            // Handle case where connection might not exist
            if (!connection) {
                console.log('No connection found for session:', session._id, 'match_id:', session.match_id);
                return null; // Skip this session if connection is invalid
            }

            const alumniProfile = await AlumniProfile.findById(connection.mentor_id);

            if (alumniProfile) {
                return {
                    _id: session._id,
                    mentor: {
                        _id: alumniProfile._id,
                        full_name: alumniProfile.full_name,
                        profile_photo_url: alumniProfile.profile_photo_url,
                        current_position: alumniProfile.current_position,
                        company: alumniProfile.company
                    },
                    scheduled_date: session.scheduled_time.toISOString().split('T')[0],
                    scheduled_time: session.scheduled_time.toTimeString().slice(0, 5),
                    duration: session.duration,
                    mode: session.mode,
                    topic: session.topic,
                    meeting_link: session.meeting_link,
                    status: session.status
                };
            } else {
                // Use unknown if no profile exists
                console.log('No alumni profile found for connection:', connection._id, 'mentor_id:', connection.mentor_id);
                return {
                    _id: session._id,
                    mentor: {
                        _id: connection.mentor_id,
                        full_name: 'Unknown',
                        profile_photo_url: '',
                        current_position: '',
                        company: ''
                    },
                    scheduled_date: session.scheduled_time.toISOString().split('T')[0],
                    scheduled_time: session.scheduled_time.toTimeString().slice(0, 5),
                    duration: session.duration,
                    mode: session.mode,
                    topic: session.topic,
                    meeting_link: session.meeting_link,
                    status: session.status
                };
            }
        }));

        // Filter out null sessions
        const validSessions = enrichedSessions.filter(session => session !== null);
        console.log('Valid sessions to return:', validSessions.length);

        res.status(200).json(validSessions);
    } catch (error) {
        console.error('Error fetching scheduled sessions for student:', error);
        res.status(500).json({ message: 'Server error while fetching sessions' });
    }
};

// Update a scheduled mentorship session
exports.updateMentorshipSession = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const { sessionId, scheduled_date, scheduled_time, duration, mode, topic, meeting_link } = req.body;

        if (userRole !== 'alumni') {
            return res.status(403).json({ message: 'Only alumni can update sessions' });
        }

        // Find the session and verify it belongs to this mentor
        const session = await MentorshipSession.findById(sessionId);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Verify the session belongs to this mentor by checking the match_id
        const connection = await MentorshipRequest.findOne({
            _id: session.match_id,
            mentor_id: userId,
            status: 'accepted'
        });

        if (!connection) {
            return res.status(403).json({ message: 'You can only update your own sessions' });
        }

        // Combine date and time into a single Date object
        const scheduledDateTime = new Date(`${scheduled_date}T${scheduled_time}`);

        // Update the session
        session.scheduled_time = scheduledDateTime;
        session.duration = duration;
        session.mode = mode;
        session.topic = topic;
        session.meeting_link = meeting_link;
        session.status = 'rescheduled';

        await session.save();

        res.status(200).json({
            message: 'Mentorship session updated successfully',
            session
        });
    } catch (error) {
        console.error('Error updating mentorship session:', error);
        res.status(500).json({ message: 'Server error while updating session' });
    }
};

// Cancel a scheduled mentorship session
exports.cancelMentorshipSession = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const { sessionId } = req.body;

        if (userRole !== 'alumni') {
            return res.status(403).json({ message: 'Only alumni can cancel sessions' });
        }

        // Find the session and verify it belongs to this mentor
        const session = await MentorshipSession.findById(sessionId);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Verify the session belongs to this mentor by checking the match_id
        const connection = await MentorshipRequest.findOne({
            _id: session.match_id,
            mentor_id: userId,
            status: 'accepted'
        });

        if (!connection) {
            return res.status(403).json({ message: 'You can only cancel your own sessions' });
        }

        // Delete the session
        await MentorshipSession.findByIdAndDelete(sessionId);

        res.status(200).json({ message: 'Session cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling mentorship session:', error);
        res.status(500).json({ message: 'Server error while cancelling session' });
    }
};

// Create or get conversation between mentor and mentee
exports.createOrGetConversation = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const { otherUserId } = req.body;

        // Find the mentorship request to ensure they are connected
        let mentorshipRequest;
        if (userRole === 'student') {
            mentorshipRequest = await MentorshipRequest.findOne({
                mentee_id: userId,
                mentor_id: otherUserId,
                status: 'accepted'
            });
        } else if (userRole === 'alumni') {
            mentorshipRequest = await MentorshipRequest.findOne({
                mentor_id: userId,
                mentee_id: otherUserId,
                status: 'accepted'
            });
        }

        if (!mentorshipRequest) {
            return res.status(403).json({ message: 'You can only message connected mentorship partners' });
        }

        // Check if conversation already exists
        let conversation = await Conversation.findOne({
            mentorship_request_id: mentorshipRequest._id,
            participants: { $all: [userId, otherUserId] }
        });

        if (!conversation) {
            // Create new conversation
            conversation = new Conversation({
                participants: [userId, otherUserId],
                mentorship_request_id: mentorshipRequest._id
            });
            await conversation.save();
        }

        res.status(200).json({ conversation });
    } catch (error) {
        console.error('Error creating/getting conversation:', error);
        res.status(500).json({ message: 'Server error while creating/getting conversation' });
    }
};

// Send a message in a conversation
exports.sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { conversationId, messageText } = req.body;

        // Verify the conversation exists and user is a participant
        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: senderId
        });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found or access denied' });
        }

        // Create the message
        const message = new Message({
            conversation_id: conversationId,
            sender_id: senderId,
            message_text: messageText
        });

        await message.save();

        // Update conversation's last_message and updated_at
        conversation.last_message = message._id;
        conversation.updated_at = new Date();
        await conversation.save();

        // Populate sender details for response
        await message.populate({
            path: 'sender_id',
            select: 'full_name profile_photo_url',
            model: senderId === conversation.participants[0] ? 'StudentProfile' : 'AlumniProfile'
        });

        res.status(201).json({ message });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Server error while sending message' });
    }
};

// Get all conversations for the authenticated user
exports.getConversations = async (req, res) => {
    try {
        const userId = req.user.id;

        const conversations = await Conversation.find({
            participants: userId
        })
        .populate({
            path: 'mentorship_request_id',
            select: 'mentee_id mentor_id',
            populate: [
                {
                    path: 'mentee_id',
                    select: 'full_name profile_photo_url current_position company',
                    model: 'StudentProfile'
                },
                {
                    path: 'mentor_id',
                    select: 'full_name profile_photo_url current_position company',
                    model: 'AlumniProfile'
                }
            ]
        })
        .populate({
            path: 'last_message',
            populate: {
                path: 'sender_id',
                select: 'full_name'
            }
        })
        .sort({ updated_at: -1 });

        // Enrich conversations with other participant details
        const enrichedConversations = conversations.map(conversation => {
            const mentorshipRequest = conversation.mentorship_request_id;
            const otherParticipant = mentorshipRequest.mentee_id._id.toString() === userId.toString()
                ? mentorshipRequest.mentor_id
                : mentorshipRequest.mentee_id;

            return {
                _id: conversation._id,
                other_participant: otherParticipant,
                last_message: conversation.last_message,
                updated_at: conversation.updated_at
            };
        });

        res.status(200).json(enrichedConversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ message: 'Server error while fetching conversations' });
    }
};

// Get messages for a specific conversation
exports.getMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const { conversationId } = req.params;

        // Verify user is participant in conversation
        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: userId
        });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found or access denied' });
        }

        const messages = await Message.find({
            conversation_id: conversationId
        })
        .populate({
            path: 'sender_id',
            select: 'full_name profile_photo_url',
            model: conversation.participants[0].toString() === userId.toString() ? 'StudentProfile' : 'AlumniProfile'
        })
        .sort({ created_at: 1 });

        // Mark messages as read by this user
        await Message.updateMany(
            {
                conversation_id: conversationId,
                sender_id: { $ne: userId },
                'read_by.user_id': { $ne: userId }
            },
            {
                $push: {
                    read_by: {
                        user_id: userId,
                        read_at: new Date()
                    }
                }
            }
        );

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error while fetching messages' });
    }
};

// Upload a mentorship resource (alumni only)
exports.uploadMentorshipResource = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const { title, resource_type, description, tags, file_url } = req.body;

        if (userRole !== 'alumni') {
            return res.status(403).json({ message: 'Only alumni can upload mentorship resources' });
        }

        let url;
        if (resource_type === 'link') {
            if (!file_url) {
                return res.status(400).json({ message: 'URL is required for link type' });
            }
            url = file_url;
        } else {
            if (!req.file) {
                return res.status(400).json({ message: 'File is required for file type' });
            }
            url = req.file.path;
        }

        const resource = new PrepResource({
            title,
            type: resource_type,
            url,
            description,
            difficulty: 'intermediate',
            tags: tags || [],
            category: 'mentorship',
            created_by: userId
        });

        await resource.save();
        res.status(201).json({ message: 'Mentorship resource uploaded successfully', resource });
    } catch (error) {
        console.error('Error uploading mentorship resource:', error);
        res.status(500).json({ message: 'Server error while uploading resource' });
    }
};

// Get all mentorship resources (for students)
exports.getMentorshipResources = async (req, res) => {
    try {
        const resources = await PrepResource.find({ category: 'mentorship' })
            .populate({
                path: 'created_by',
                select: 'full_name profile_photo_url current_position company',
                model: 'AlumniProfile'
            })
            .sort({ created_at: -1 });

        res.status(200).json(resources);
    } catch (error) {
        console.error('Error fetching mentorship resources:', error);
        res.status(500).json({ message: 'Server error while fetching resources' });
    }
};

// Delete a mentorship resource (alumni only - only the creator can delete)
exports.deleteMentorshipResource = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const { resourceId } = req.params;

        if (userRole !== 'alumni') {
            return res.status(403).json({ message: 'Only alumni can delete mentorship resources' });
        }

        // Find the resource and verify ownership
        const resource = await PrepResource.findOne({
            _id: resourceId,
            created_by: userId,
            category: 'mentorship'
        });

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found or access denied' });
        }

        // Delete the resource
        await PrepResource.findByIdAndDelete(resourceId);

        res.status(200).json({ message: 'Mentorship resource deleted successfully' });
    } catch (error) {
        console.error('Error deleting mentorship resource:', error);
        res.status(500).json({ message: 'Server error while deleting resource' });
    }
};
