// BACKEND/controllers/alumniController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
// Assuming AlumniProfile is the correct model for alumni data
const AlumniProfile = require('../models/AlumniProfile'); 
// Assuming you have a User model or that AlumniProfile serves as the main user model

// --- Existing Functions (Kept for Context) ---

exports.registerAlumni = async (req, res) => {
    try {
        const data = req.body;

        // Handle uploaded files
        if (req.files['verificationFile'] && req.files['verificationFile'].length > 0) {
            data.verificationFile = '/uploads/' + req.files['verificationFile'][0].filename;
        }
        if (req.files['profile_photo_url'] && req.files['profile_photo_url'].length > 0) {
            data.profile_photo_url = '/uploads/' + req.files['profile_photo_url'][0].filename;
        }

        // Normalize string fields that should be arrays
        ['skills', 'contribution_preferences', 'preferred_communication'].forEach(field => {
            if (data[field]) {
                if (typeof data[field] === 'string') {
                    try {
                        // Attempt to parse JSON string (if frontend sends a stringified array)
                        data[field] = JSON.parse(data[field]);
                    } catch {
                        // Fallback to splitting by comma
                        data[field] = data[field].split(',').map(s => s.trim());
                    }
                }
            } else {
                data[field] = [];
            }
        });

        if (!data.user_id) {
            // Mongoose ID for user_id (optional, based on your full schema design)
            // If AlumniProfile is the main user, this might be redundant, but keeping for safety.
            data.user_id = new mongoose.Types.ObjectId();
        }

        if (data.graduation_year) data.graduation_year = Number(data.graduation_year);
        // Correcting: req.body used yearsOfExperience, model uses years_of_experience
        if (data.yearsOfExperience) data.years_of_experience = Number(data.yearsOfExperience); 

        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        } else {
            return res.status(400).json({ error: "Password is required" });
        }

        // Check if user already exists
        const existingAlumni = await AlumniProfile.findOne({ email: data.email });
        if (existingAlumni) {
            return res.status(409).json({ error: "Email already registered" });
        }

        const newAlumni = new AlumniProfile({
            user_id: data.user_id, // Make sure user_id is the primary ID or linked to the User model if separated
            full_name: data.full_name,
            email: data.email,
            password: data.password,
            contact_number: data.contact_number,
            linkedin_url: data.linkedin_url,
            github_url: data.github_url,
            leetcode_url: data.leetcode_url,
            college_id: data.college_id,
            graduation_year: data.graduation_year,
            verificationFile: data.verificationFile,
            degree: data.degree,
            current_position: data.current_position,
            company: data.company,
            industry: data.industry,
            location: data.location,
            years_of_experience: data.years_of_experience,
            skills: data.skills,
            professional_achievements: data.professional_achievements,
            contribution_preferences: data.contribution_preferences,
            preferred_communication: data.preferred_communication,
            about_me: data.about_me,
            profile_photo_url: data.profile_photo_url,
            twitter: data.twitter,
            portfolio: data.portfolio,
            is_verified: false,
            engagement_status: data.engagement_status || 'inactive',
            prospect_type: data.prospect_type,
        });

        await newAlumni.save();
        res.status(201).json({ message: 'Alumni registered successfully' });
    } catch (error) {
        console.error('Error registering alumni:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

exports.loginAlumni = async (req, res) => {
    console.log('Alumni login route hit');
    const { email, password } = req.body;

    try {
        const user = await AlumniProfile.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id , role: 'alumni' }, process.env.JWT_SECRET || 'your_jwt_secret', {
            expiresIn: '1h',
        });

        res.json({
            token,
            user: { id: user._id, full_name: user.full_name, email: user.email },
        });
    } catch (error) {
        console.error('Alumni login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// ------------------------------------------------------------------
// --- NEW FUNCTION: Alumni Directory Listing (Optimized for Random) ---
// ------------------------------------------------------------------

/**
 * Fetches a list of alumni based on search and filter criteria for the directory.
 */
exports.getAlumniDirectory = async (req, res) => {
    try {
        const { nameOrKeyword, gradYear, company, industry, remoteFriendly, hiring, mentorReady, limit = 20, skip = 0 } = req.query;
        
        const numLimit = Number(limit);
        const numSkip = Number(skip);

        const filters = {};

        // 1. Search by Name or Keyword (full_name, company, industry, skills)
        if (nameOrKeyword) {
            const searchRegex = new RegExp(nameOrKeyword, 'i'); // Case-insensitive search
            filters.$or = [
                { full_name: searchRegex },
                { company: searchRegex },
                { industry: searchRegex },
                { skills: searchRegex }, // Assuming skills is an array of strings in your model
            ];
        }

        // 2. Specific Filters (from the prototype's inputs)
        if (gradYear) {
            filters.graduation_year = Number(gradYear);
        }
        if (company) {
            filters.company = new RegExp(company, 'i');
        }
        if (industry) {
            filters.industry = new RegExp(industry, 'i');
        }

        // 3. Chip Filters (Boolean fields)
        // Assuming your AlumniProfile model has boolean fields like: is_remote_friendly, is_hiring, is_mentor_ready
        if (remoteFriendly === 'true') {
            filters.is_remote_friendly = true;
        }
        if (hiring === 'true') {
            filters.is_hiring = true;
        }
        if (mentorReady === 'true') {
            filters.is_mentor_ready = true;
        }

        // Always filter for verified alumni for the public directory (optional, but recommended)
        // filters.is_verified = true; // Temporarily commented out to show all alumni for testing

        let alumniList;
        let totalCount;
        
        if (Object.keys(filters).length === 0) {
            // If no filters are applied, use aggregation to perform random sampling (better performance)
            
            totalCount = await AlumniProfile.countDocuments({}); // Get total count for pagination info
            
            // Note: $sample is not compatible with $skip/$limit for true random pagination
            // For the prototype feel (different results on load), we'll sample a larger set
            // and then apply skip/limit, or just rely on $sample for the first page.
            // For true pagination with random order, this approach is complex. 
            // Sticking to the most efficient way to get a random *first page*.
            
            alumniList = await AlumniProfile.aggregate([
                { $match: { } }, // Match all documents
                { $sample: { size: numLimit } }, // Get a random sample of the 'limit' size
                { $project: { // Select the required fields
                    full_name: 1, 
                    current_position: 1, 
                    company: 1, 
                    location: 1, 
                    profile_photo_url: 1, 
                    skills: 1, 
                    graduation_year: 1, 
                    contribution_preferences: 1 
                } }
            ]);
            
        } else {
            // Filters applied, use normal query with pagination and no randomization
            totalCount = await AlumniProfile.countDocuments(filters);
            alumniList = await AlumniProfile.find(filters)
                .select('full_name current_position company location profile_photo_url skills graduation_year contribution_preferences')
                .limit(numLimit)
                .skip(numSkip)
                .lean();
        }

        // Format the output to match the expected structure of the frontend card
        const formattedAlumni = alumniList.map(alumnus => ({
            // Note: For aggregation results (in the random case), _id is the top level field.
            id: alumnus._id,
            name: alumnus.full_name,
            title: alumnus.current_position,
            company: alumnus.company,
            location: alumnus.location,
            // Ensure a default image path is set if the profile_photo_url is missing
            profileImage: alumnus.profile_photo_url || '/path/to/default/image.png',
            // Combine skills and mentorship preferences for the tags display
            tags: [
                ...(alumnus.skills || []).slice(0, 3), 
                ...(alumnus.contribution_preferences || []).slice(0, 2)
            ].slice(0, 5), // Limit total tags shown
            gradYear: alumnus.graduation_year,
            // You can optionally pass the boolean flags if they exist on the model
            // isHiring: alumnus.is_hiring, 
            // isMentorReady: alumnus.is_mentor_ready,
        }));


        res.status(200).json({ 
            alumni: formattedAlumni, 
            total: totalCount // Use the pre-calculated count
        });

    } catch (error) {
        console.error('Error fetching alumni directory:', error);
        res.status(500).json({ message: 'Error fetching alumni directory', error: error.message });
    }
};