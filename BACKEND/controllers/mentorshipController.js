const MentorshipRequest = require('../models/MentorshipRequest');
const MentorshipMatch = require('../models/MentorshipMatch');
const AlumniProfile = require('../models/AlumniProfile');
const AdminProfile = require('../models/AdminProfile');
const StudentProfile = require('../models/StudentProfile');
const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');
const mongoose = require('mongoose');

// Keyword extraction and analysis helper functions
function extractKeywords(text) {
    if (!text || !text.trim()) return [];

    const keywords = [];
    const lowerText = text.toLowerCase().trim();

    // Split by common separators
    const parts = lowerText.split(/[\s,;&]+/).filter(part => part.length > 0);

    // Extract meaningful keywords (longer than 2 characters)
    parts.forEach(part => {
        if (part.length > 2) {
            keywords.push(part);
        }
    });

    // Also extract multi-word phrases for specific technologies
    const techPhrases = [
        'full stack', 'machine learning', 'embedded system', 'data science', 'web development',
        'mobile development', 'cloud computing', 'artificial intelligence', 'deep learning',
        'computer vision', 'natural language', 'software engineering', 'system design',
        'database design', 'frontend development', 'backend development', 'devops',
        'cyber security', 'blockchain', 'internet of things', 'big data', 'data analytics'
    ];

    techPhrases.forEach(phrase => {
        if (lowerText.includes(phrase)) {
            keywords.push(phrase);
        }
    });

    return [...new Set(keywords)]; // Remove duplicates
}

function analyzeKeywordMatch(keyword, mentor) {
    let score = 0;
    let matched = false;
    let reason = '';

    const keywordLower = keyword.toLowerCase();

    // Check position
    if (mentor.current_position && mentor.current_position.toLowerCase().includes(keywordLower)) {
        score += 40;
        matched = true;
        reason = `Position matches: ${mentor.current_position}`;
    }

    // Check company
    if (mentor.company && mentor.company.toLowerCase().includes(keywordLower)) {
        score += 35;
        matched = true;
        if (reason) reason += ', ';
        reason += `Company matches: ${mentor.company}`;
    }

    // Check skills
    if (mentor.skills && mentor.skills.some(skill => skill.toLowerCase().includes(keywordLower))) {
        score += 25;
        matched = true;
        if (reason) reason += ', ';
        reason += 'Skills alignment';
    }

    // Check industry
    if (mentor.industry && mentor.industry.toLowerCase().includes(keywordLower)) {
        score += 20;
        matched = true;
        if (reason) reason += ', ';
        reason += `Industry matches: ${mentor.industry}`;
    }

    // Check bio/description if available
    if (mentor.bio && mentor.bio.toLowerCase().includes(keywordLower)) {
        score += 15;
        matched = true;
        if (reason) reason += ', ';
        reason += 'Bio/description matches';
    }

    // Special scoring for technology keywords
    const techKeywords = {
        'full stack': ['fullstack', 'full-stack', 'frontend', 'backend', 'web development'],
        'machine learning': ['ml', 'ai', 'artificial intelligence', 'data science', 'neural network'],
        'embedded system': ['embedded', 'firmware', 'iot', 'microcontroller', 'rtos'],
        'data science': ['data', 'analytics', 'statistics', 'python', 'r', 'pandas'],
        'web development': ['web', 'html', 'css', 'javascript', 'react', 'angular', 'vue'],
        'mobile development': ['mobile', 'ios', 'android', 'react native', 'flutter'],
        'cloud computing': ['aws', 'azure', 'gcp', 'cloud', 'docker', 'kubernetes'],
        'artificial intelligence': ['ai', 'machine learning', 'deep learning', 'neural'],
        'cyber security': ['security', 'cyber', 'encryption', 'penetration', 'hacking'],
        'blockchain': ['blockchain', 'crypto', 'bitcoin', 'ethereum', 'smart contract'],
        'devops': ['devops', 'ci/cd', 'jenkins', 'docker', 'kubernetes', 'automation']
    };

    if (techKeywords[keywordLower]) {
        const relatedTerms = techKeywords[keywordLower];
        let hasRelatedMatch = false;

        // Check if mentor has related skills or position
        if (mentor.skills) {
            hasRelatedMatch = mentor.skills.some(skill =>
                relatedTerms.some(term => skill.toLowerCase().includes(term))
            );
        }

        if (!hasRelatedMatch && mentor.current_position) {
            hasRelatedMatch = relatedTerms.some(term =>
                mentor.current_position.toLowerCase().includes(term)
            );
        }

        if (hasRelatedMatch) {
            score += 30;
            matched = true;
            if (reason) reason += ', ';
            reason += `Related technology expertise in ${keyword}`;
        }
    }

    return {
        keyword,
        score,
        matched,
        reason
    };
}

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
            menteeProfile = await StudentProfile.findById(mentee_id);
            menteeEmail = menteeProfile?.email || 'unknown@email.com';
        } else if (req.user.role === 'alumni') {
            menteeProfile = await AlumniProfile.findById(mentee_id);
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
        const user = await AlumniProfile.findById(userId);

        if (!user) {
            return res.status(403).json({ message: 'Only alumni can receive mentorship requests' });
        }

        const requests = await MentorshipRequest.find({ mentor_id: userId, status: 'requested' })
            .populate('mentee_id', 'email full_name profile_photo_url current_position company')
            .sort({ created_at: -1 });

        // Get profiles for mentees
        const requestsWithProfiles = requests.map((request) => {
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
                status: request.status,
                created_at: request.created_at
            };
        });

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
        const menteeUser = await StudentProfile.findById(request.mentee_id);
        let menteeProfile = menteeUser;
        let menteeEmail = menteeUser?.email || 'unknown@email.com';

        // Get mentor details
        const mentorProfile = await AlumniProfile.findById(userId);

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
        const userRole = req.user.role;

        let connections = [];

        if (userRole === 'alumni') {
            // Get mentees (accepted requests where user is mentor)
            const menteeRequests = await MentorshipRequest.find({
                mentor_id: userId,
                status: 'accepted'
            }).populate('mentee_id', 'email full_name profile_photo_url current_position company');

            const mentees = menteeRequests.map((request) => {
                const mentee = request.mentee_id;
                return {
                    _id: mentee._id,
                    email: mentee.email,
                    full_name: mentee.full_name,
                    profile_photo_url: mentee.profile_photo_url,
                    current_position: mentee.current_position,
                    company: mentee.company,
                    relationship: 'mentee',
                    connected_at: request.created_at
                };
            });

            connections.push(...mentees);
        }

        // Get mentors (accepted requests where user is mentee)
        const mentorRequests = await MentorshipRequest.find({
            mentee_id: userId,
            status: 'accepted'
        }).populate('mentor_id', 'email full_name profile_photo_url current_position company');

        const mentors = mentorRequests.map((request) => {
            const mentor = request.mentor_id;
            return {
                _id: mentor._id,
                email: mentor.email,
                full_name: mentor.full_name,
                profile_photo_url: mentor.profile_photo_url,
                current_position: mentor.current_position,
                company: mentor.company,
                relationship: 'mentor',
                connected_at: request.created_at
            };
        });

        connections.push(...mentors);

        // Sort by connection date
        connections.sort((a, b) => new Date(b.connected_at) - new Date(a.connected_at));

        res.status(200).json(connections);
    } catch (error) {
        console.error('Error fetching mentorship connections:', error);
        res.status(500).json({ message: 'Server error while fetching mentorship connections' });
    }
};

// Get AI-matched mentors for the student
exports.getMentorshipMatches = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        if (userRole !== 'student') {
            return res.status(403).json({ message: 'Only students can access mentorship matches' });
        }

        // Convert userId to ObjectId for database queries
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Get student's profile for matching criteria
        const studentProfile = await StudentProfile.findById(userObjectId);
        if (!studentProfile) {
            return res.status(404).json({ message: 'Student profile not found' });
        }

        // Mock AI matching logic: Find alumni matches based on student's interests
        // In a real implementation, this would use ML algorithms
        const matches = await MentorshipMatch.find({ mentee_id: userObjectId, status: 'active' })
            .populate('mentor_id', 'email full_name profile_photo_url current_position company skills graduation_year')
            .sort({ ai_score: -1 })
            .limit(10);

        const matchResults = matches.map((match) => {
            const mentor = match.mentor_id;
            return {
                _id: mentor._id,
                email: mentor.email,
                full_name: mentor.full_name,
                profile_photo_url: mentor.profile_photo_url,
                current_position: mentor.current_position,
                company: mentor.company,
                skills: mentor.skills || [],
                graduation_year: mentor.graduation_year,
                ai_score: match.ai_score,
                match_reason: match.match_reason,
                rating: 4.9, // Mocked
                mentee_count: 12 // Mocked
            };
        });

        // If no matches found, return mock data for development
        if (matchResults.length === 0) {
            const mockMatches = [
                {
                    _id: 'mock1',
                    email: 'john.doe@example.com',
                    full_name: 'John Doe',
                    profile_photo_url: '/default-avatar.png',
                    current_position: 'Senior Software Engineer',
                    company: 'Tech Corp',
                    skills: ['JavaScript', 'React', 'Node.js'],
                    graduation_year: 2015,
                    ai_score: 85,
                    match_reason: 'Shared interest in Web Development',
                    rating: 4.9,
                    mentee_count: 12
                },
                {
                    _id: 'mock2',
                    email: 'jane.smith@example.com',
                    full_name: 'Jane Smith',
                    profile_photo_url: '/default-avatar.png',
                    current_position: 'Product Manager',
                    company: 'Startup Inc',
                    skills: ['Product Strategy', 'Agile', 'Leadership'],
                    graduation_year: 2010,
                    ai_score: 78,
                    match_reason: 'Career guidance in Product Management',
                    rating: 4.8,
                    mentee_count: 8
                }
            ];
            return res.status(200).json(mockMatches);
        }

        res.status(200).json(matchResults);
    } catch (error) {
        console.error('Error fetching mentorship matches:', error);
        res.status(500).json({ message: 'Server error while fetching mentorship matches' });
    }
};

// Smart match endpoint with AI matching algorithm
exports.smartMatchMentors = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const { requirements, filters } = req.body;

        if (userRole !== 'student') {
            return res.status(403).json({ message: 'Only students can access mentorship matches' });
        }

        // Get student's profile
        const studentProfile = await StudentProfile.findById(userId);
        if (!studentProfile) {
            return res.status(404).json({ message: 'Student profile not found' });
        }

        // Build query for alumni - be very inclusive
        let query = {};

        // Only filter by verification if we have alumni, otherwise be more inclusive
        const totalAlumni = await AlumniProfile.countDocuments();
        if (totalAlumni > 0) {
            query.is_verified = true;
        }

        // Apply location and year filters if provided
        if (filters.location) {
            query.location = new RegExp(filters.location, 'i');
        }

        if (filters.alumniYear) {
            query.graduation_year = parseInt(filters.alumniYear);
        }

        // Find potential mentors - increase limit significantly
        let potentialMentors = await AlumniProfile.find(query).limit(200);

        console.log(`Found ${potentialMentors.length} potential mentors for query:`, query);

        // If still no mentors found, try without any filters
        if (potentialMentors.length === 0) {
            console.log('No mentors found with filters, trying without filters...');
            potentialMentors = await AlumniProfile.find({}).limit(200);
            console.log(`Found ${potentialMentors.length} mentors without filters`);
        }

        // Enhanced Keyword Analysis and Matching Algorithm
        const matches = potentialMentors.map(mentor => {
            let score = 0;
            let reasons = [];
            let matchedKeywords = [];

            // Extract keywords from requirements
            const keywords = extractKeywords(requirements || '');

            if (keywords.length > 0) {
                // Analyze each keyword against mentor profile
                keywords.forEach(keyword => {
                    const keywordMatches = analyzeKeywordMatch(keyword, mentor);
                    score += keywordMatches.score;
                    if (keywordMatches.matched) {
                        matchedKeywords.push(keywordMatches.keyword);
                        if (keywordMatches.reason) {
                            reasons.push(keywordMatches.reason);
                        }
                    }
                });

                // Remove duplicate reasons
                reasons = [...new Set(reasons)];
            }

            // Skills matching with enhanced keyword analysis
            if (studentProfile.skills && mentor.skills) {
                const studentSkills = studentProfile.skills.map(s => s.toLowerCase());
                const mentorSkills = mentor.skills.map(s => s.toLowerCase());
                const commonSkills = studentSkills.filter(skill => mentorSkills.includes(skill));
                score += commonSkills.length * 15;
                if (commonSkills.length > 0) {
                    reasons.push(`Shared skills: ${commonSkills.join(', ')}`);
                }
            }

            // Career goals matching
            if (studentProfile.career_goals && requirements) {
                const goals = studentProfile.career_goals.toLowerCase();
                const reqs = requirements.toLowerCase();
                if (goals.includes(reqs) || reqs.includes(goals)) {
                    score += 20;
                    reasons.push('Career goals alignment');
                }
            }

            // Branch/Field matching (engineering focus)
            if (studentProfile.branch && mentor.industry) {
                const branch = studentProfile.branch.toLowerCase();
                const industry = mentor.industry.toLowerCase();
                if (branch.includes('engineer') || branch.includes('computer') || branch.includes('tech')) {
                    if (industry.includes('tech') || industry.includes('software') || industry.includes('engineering')) {
                        score += 20;
                        reasons.push('Engineering field alignment');
                    }
                }
            }

            // Experience level matching
            if (mentor.years_of_experience) {
                if (mentor.years_of_experience >= 5) score += 10;
                if (mentor.years_of_experience >= 10) score += 10;
                reasons.push(`${mentor.years_of_experience} years of experience`);
            }

            // Graduation year proximity
            if (mentor.graduation_year && studentProfile.year_of_graduation) {
                const yearDiff = Math.abs(mentor.graduation_year - studentProfile.year_of_graduation);
                if (yearDiff <= 5) score += 8;
                if (yearDiff <= 2) score += 8;
            }

            // Role matching - improved for engineering roles
            if (filters.role && mentor.current_position) {
                const roleMatch = mentor.current_position.toLowerCase().includes(filters.role.toLowerCase());
                if (roleMatch) {
                    score += 25;
                    reasons.push(`Role match: ${mentor.current_position}`);
                }
            }

            // Skills filter matching
            if (filters.skills) {
                const filterSkills = filters.skills.toLowerCase().split(',').map(s => s.trim());
                const mentorSkills = mentor.skills.map(s => s.toLowerCase());
                const skillMatches = filterSkills.filter(skill => mentorSkills.some(ms => ms.includes(skill)));
                score += skillMatches.length * 12;
                if (skillMatches.length > 0) {
                    reasons.push(`Skill matches: ${skillMatches.join(', ')}`);
                }
            }

            // Base score for any alumni
            score += 15;

            return {
                mentor,
                score: Math.min(score, 100), // Cap at 100
                reasons,
                matchedKeywords
            };
        });

        // Sort by score and take top matches
        matches.sort((a, b) => b.score - a.score);
        const topMatches = matches.slice(0, 10);

        // Format response
        const matchResults = topMatches.map(match => {
            const mentor = match.mentor;
            return {
                _id: mentor._id,
                email: mentor.email,
                full_name: mentor.full_name,
                profile_photo_url: mentor.profile_photo_url,
                current_position: mentor.current_position,
                company: mentor.company,
                skills: mentor.skills || [],
                graduation_year: mentor.graduation_year,
                ai_score: match.score,
                match_reason: match.reasons.join(', '),
                matched_keywords: match.matchedKeywords,
                rating: 4.5 + (Math.random() * 0.5), // Mock rating
                mentee_count: Math.floor(Math.random() * 20) + 1 // Mock mentee count
            };
        });

        console.log(`Returning ${matchResults.length} matches`);

        // Always return mock data as fallback to ensure user sees results
        if (matchResults.length === 0) {
            console.log('No matches found, returning mock data...');
            const mockMatches = [
                {
                    _id: 'mock1',
                    email: 'john.doe@example.com',
                    full_name: 'John Doe',
                    profile_photo_url: '/default-avatar.png',
                    current_position: 'Senior Software Engineer',
                    company: 'Google',
                    skills: ['JavaScript', 'Python', 'React', 'Node.js'],
                    graduation_year: 2015,
                    ai_score: 95,
                    match_reason: 'Position matches software engineer, Engineering field alignment, Technical expertise',
                    matched_keywords: ['software', 'engineer'],
                    rating: 4.9,
                    mentee_count: 12
                },
                {
                    _id: 'mock2',
                    email: 'jane.smith@example.com',
                    full_name: 'Jane Smith',
                    profile_photo_url: '/default-avatar.png',
                    current_position: 'Engineering Manager',
                    company: 'Microsoft',
                    skills: ['Leadership', 'System Design', 'Team Management'],
                    graduation_year: 2010,
                    ai_score: 88,
                    match_reason: 'Engineering role alignment, Leadership skills match',
                    matched_keywords: ['engineering', 'manager'],
                    rating: 4.8,
                    mentee_count: 8
                },
                {
                    _id: 'mock3',
                    email: 'bob.johnson@example.com',
                    full_name: 'Bob Johnson',
                    profile_photo_url: '/default-avatar.png',
                    current_position: 'Principal Engineer',
                    company: 'Amazon',
                    skills: ['Java', 'AWS', 'Microservices', 'Architecture'],
                    graduation_year: 2008,
                    ai_score: 92,
                    match_reason: 'Engineering field alignment, Technical expertise',
                    matched_keywords: ['engineer', 'architecture'],
                    rating: 4.7,
                    mentee_count: 15
                }
            ];
            return res.status(200).json(mockMatches);
        }

        res.status(200).json(matchResults);
    } catch (error) {
        console.error('Error in smart match:', error);
        res.status(500).json({ message: 'Server error while performing smart match' });
    }
};

// Get outgoing mentorship requests for the student
exports.getOutgoingRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        if (userRole !== 'student') {
            return res.status(403).json({ message: 'Only students can access outgoing requests' });
        }

        const requests = await MentorshipRequest.find({
            mentee_id: userId,
            status: 'requested'
        }).populate('mentor_id', 'email full_name profile_photo_url current_position company');

        const requestResults = requests.map((request) => {
            const mentor = request.mentor_id;
            return {
                _id: request._id,
                mentor: {
                    _id: mentor._id,
                    email: mentor.email,
                    full_name: mentor.full_name,
                    profile_photo_url: mentor.profile_photo_url,
                    current_position: mentor.current_position,
                    company: mentor.company
                },
                status: request.status,
                created_at: request.created_at
            };
        });

        res.status(200).json(requestResults);
    } catch (error) {
        console.error('Error fetching outgoing requests:', error);
        res.status(500).json({ message: 'Server error while fetching outgoing requests' });
    }
};

// Cancel a mentorship request
exports.cancelMentorshipRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        const userId = req.user.id;

        const request = await MentorshipRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Mentorship request not found' });
        }

        if (request.mentee_id.toString() !== userId) {
            return res.status(403).json({ message: 'You can only cancel your own requests' });
        }

        if (request.status !== 'requested') {
            return res.status(400).json({ message: 'This request cannot be cancelled' });
        }

        await MentorshipRequest.findByIdAndDelete(requestId);

        res.status(200).json({ message: 'Mentorship request cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling mentorship request:', error);
        res.status(500).json({ message: 'Server error while cancelling mentorship request' });
    }
};
