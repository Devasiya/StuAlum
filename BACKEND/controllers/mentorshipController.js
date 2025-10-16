const MentorshipRequest = require('../models/MentorshipRequest');
const User = require('../models/User');
const AlumniProfile = require('../models/AlumniProfile');
const AdminProfile = require('../models/AdminProfile');
const StudentProfile = require('../models/StudentProfile');
const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');

// Create a mentorship request
exports.createMentorshipRequest = async (req, res) => {
    try {
        const { mentor_id } = req.body;
        const mentee_id = req.user.id;

        if (!mentor_id) {
            return res.status(400).json({ message: 'Mentor ID is required' });
        }

        // Check if mentor exists and is an alumni
        const mentor = await AlumniProfile.findById(mentor_id);
        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found or not an alumni' });
        }

        // Check if request already exists
        const existingRequest = await MentorshipRequest.findOne({
            mentee_id,
            mentor_id,
            status: { $in: ['requested', 'accepted'] }
        });

        if (existingRequest) {
            return res.status(400).json({
                message: existingRequest.status === 'accepted'
                    ? 'You are already connected with this mentor'
                    : 'Mentorship request already sent'
            });
        }

        // Create mentorship request
        const newRequest = new MentorshipRequest({
            mentee_id,
            mentor_id
        });

        await newRequest.save();

        // Get mentee details for notification
        let menteeProfile = null;
        let menteeEmail = null;
        if (req.user.role === 'student') {
            menteeProfile = await StudentProfile.findOne({ user_id: mentee_id });
            menteeEmail = menteeProfile?.email || 'unknown@email.com';
        } else if (req.user.role === 'alumni') {
            menteeProfile = await AlumniProfile.findOne({ user_id: mentee_id });
            menteeEmail = menteeProfile?.email || 'unknown@email.com';
        } else {
            // For admin or other roles, we might not have a profile, but let's assume they have an email
            menteeEmail = 'unknown@email.com'; // This should be handled better, perhaps store email in user session
        }

        // Mentor details already fetched above as 'mentor'

        // Send notification email to mentor
        try {
            const mailersend = new MailerSend({
                apiKey: process.env.MAILERSEND_API_KEY,
            });

            const verifiedSenderEmail = process.env.MAILERSEND_VERIFIED_EMAIL || mentor.email;

            const emailParams = new EmailParams()
                .setFrom(new Sender(verifiedSenderEmail, 'StuAlum Platform'))
                .setTo([new Recipient(mentor.email, mentor?.full_name || mentor.email)])
                .setReplyTo(new Sender(menteeEmail, menteeProfile?.full_name || menteeEmail))
                .setSubject('New Mentorship Request on StuAlum')
                .setHtml(`
                    <h1>New Mentorship Request</h1>
                    <p>Hi ${mentor?.full_name || mentor.email},</p>
                    <p><strong>${menteeProfile?.full_name || menteeEmail}</strong> has requested to connect with you for mentorship.</p>
                    <p>You can accept or decline this request by logging into your StuAlum account.</p>
                    <p>Best regards,<br>StuAlum Team</p>
                `);

            await mailersend.email.send(emailParams);
        } catch (emailError) {
            console.error('Error sending mentorship notification email:', emailError);
            // Don't fail the request if email fails
        }

        res.status(201).json({
            message: 'Mentorship request sent successfully',
            request: newRequest
        });
    } catch (error) {
        console.error('Error creating mentorship request:', error);
        res.status(500).json({ message: 'Server error while creating mentorship request' });
    }
};

// Get mentorship requests for the current user (as mentor)
exports.getMentorshipRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (user.role !== 'alumni') {
            return res.status(403).json({ message: 'Only alumni can receive mentorship requests' });
        }

        const requests = await MentorshipRequest.find({ mentor_id: userId, status: 'requested' })
            .populate('mentee_id', 'email role')
            .sort({ created_at: -1 });

        // Get profiles for mentees
        const requestsWithProfiles = await Promise.all(
            requests.map(async (request) => {
                const mentee = request.mentee_id;
                let profile = null;

                if (mentee.role === 'student') {
                    profile = await StudentProfile.findOne({ user_id: mentee._id });
                } else if (mentee.role === 'alumni') {
                    profile = await AlumniProfile.findOne({ user_id: mentee._id });
                }

                return {
                    _id: request._id,
                    mentee: {
                        _id: mentee._id,
                        email: mentee.email,
                        role: mentee.role,
                        full_name: profile?.full_name || mentee.email,
                        profile_photo_url: profile?.profile_photo_url,
                        current_position: profile?.current_position,
                        company: profile?.company
                    },
                    status: request.status,
                    created_at: request.created_at
                };
            })
        );

        res.status(200).json(requestsWithProfiles);
    } catch (error) {
        console.error('Error fetching mentorship requests:', error);
        res.status(500).json({ message: 'Server error while fetching mentorship requests' });
    }
};

// Respond to mentorship request (accept/decline)
exports.respondToMentorshipRequest = async (req, res) => {
    try {
        const { requestId, action } = req.body; // action: 'accept' or 'decline'
        const userId = req.user.id;

        if (!['accept', 'decline'].includes(action)) {
            return res.status(400).json({ message: 'Invalid action. Must be "accept" or "decline"' });
        }

        const request = await MentorshipRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Mentorship request not found' });
        }

        if (request.mentor_id.toString() !== userId) {
            return res.status(403).json({ message: 'You can only respond to requests sent to you' });
        }

        if (request.status !== 'requested') {
            return res.status(400).json({ message: 'This request has already been responded to' });
        }

        request.status = action === 'accept' ? 'accepted' : 'declined';
        await request.save();

        // Get mentee details for notification
        const menteeUser = await User.findById(request.mentee_id);
        let menteeProfile = null;
        if (menteeUser.role === 'student') {
            menteeProfile = await StudentProfile.findOne({ user_id: request.mentee_id });
        } else if (menteeUser.role === 'alumni') {
            menteeProfile = await AlumniProfile.findOne({ user_id: request.mentee_id });
        }

        // Get mentor details
        const mentorProfile = await AlumniProfile.findOne({ user_id: userId });

        // Send notification email to mentee
        try {
            const mailersend = new MailerSend({
                apiKey: process.env.MAILERSEND_API_KEY,
            });

            const verifiedSenderEmail = process.env.MAILERSEND_VERIFIED_EMAIL || menteeUser.email;

            const emailParams = new EmailParams()
                .setFrom(new Sender(verifiedSenderEmail, 'StuAlum Platform'))
                .setTo([new Recipient(menteeUser.email, menteeProfile?.full_name || menteeUser.email)])
                .setReplyTo(new Sender(mentorProfile?.email || 'noreply@stualum.com', mentorProfile?.full_name || 'StuAlum Team'))
                .setSubject(`Mentorship Request ${action === 'accept' ? 'Accepted' : 'Declined'}`)
                .setHtml(`
                    <h1>Mentorship Request ${action === 'accept' ? 'Accepted' : 'Declined'}</h1>
                    <p>Hi ${menteeProfile?.full_name || menteeUser.email},</p>
                    <p>Your mentorship request to <strong>${mentorProfile?.full_name || 'the mentor'}</strong> has been <strong>${action === 'accept' ? 'accepted' : 'declined'}</strong>.</p>
                    ${action === 'accept'
                        ? '<p>You can now connect and start your mentorship journey!</p>'
                        : '<p>You can try connecting with other mentors on the platform.</p>'
                    }
                    <p>Best regards,<br>StuAlum Team</p>
                `);

            await mailersend.email.send(emailParams);
        } catch (emailError) {
            console.error('Error sending mentorship response notification:', emailError);
        }

        res.status(200).json({
            message: `Mentorship request ${action}ed successfully`,
            request
        });
    } catch (error) {
        console.error('Error responding to mentorship request:', error);
        res.status(500).json({ message: 'Server error while responding to mentorship request' });
    }
};

// Get mentorship connections for the current user
exports.getMentorshipConnections = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        let connections = [];

        if (user.role === 'alumni') {
            // Get mentees (accepted requests where user is mentor)
            const menteeRequests = await MentorshipRequest.find({
                mentor_id: userId,
                status: 'accepted'
            }).populate('mentee_id', 'email role');

            const mentees = await Promise.all(
                menteeRequests.map(async (request) => {
                    const mentee = request.mentee_id;
                    let profile = null;

                    if (mentee.role === 'student') {
                        profile = await StudentProfile.findOne({ user_id: mentee._id });
                    } else if (mentee.role === 'alumni') {
                        profile = await AlumniProfile.findOne({ user_id: mentee._id });
                    }

                    return {
                        _id: mentee._id,
                        email: mentee.email,
                        role: mentee.role,
                        full_name: profile?.full_name || mentee.email,
                        profile_photo_url: profile?.profile_photo_url,
                        current_position: profile?.current_position,
                        company: profile?.company,
                        relationship: 'mentee',
                        connected_at: request.created_at
                    };
                })
            );

            connections.push(...mentees);
        }

        // Get mentors (accepted requests where user is mentee)
        const mentorRequests = await MentorshipRequest.find({
            mentee_id: userId,
            status: 'accepted'
        }).populate('mentor_id', 'email role');

        const mentors = await Promise.all(
            mentorRequests.map(async (request) => {
                const mentor = request.mentor_id;
                const profile = await AlumniProfile.findOne({ user_id: mentor._id });

                return {
                    _id: mentor._id,
                    email: mentor.email,
                    role: mentor.role,
                    full_name: profile?.full_name || mentor.email,
                    profile_photo_url: profile?.profile_photo_url,
                    current_position: profile?.current_position,
                    company: profile?.company,
                    relationship: 'mentor',
                    connected_at: request.created_at
                };
            })
        );

        connections.push(...mentors);

        // Sort by connection date
        connections.sort((a, b) => new Date(b.connected_at) - new Date(a.connected_at));

        res.status(200).json(connections);
    } catch (error) {
        console.error('Error fetching mentorship connections:', error);
        res.status(500).json({ message: 'Server error while fetching mentorship connections' });
    }
};
