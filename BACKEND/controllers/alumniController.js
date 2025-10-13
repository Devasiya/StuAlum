
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const AlumniProfile = require('../models/AlumniProfile');

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
    ['skills', 'contribution_preferences', 'communication'].forEach(field => {
      if (data[field]) {
        if (typeof data[field] === 'string') {
          try {
            data[field] = JSON.parse(data[field]);
          } catch {
            data[field] = data[field].split(',').map(s => s.trim());
          }
        }
      } else {
        data[field] = [];
      }
    });

    if (!data.user_id) {
      data.user_id = new mongoose.Types.ObjectId();
    }

    if (data.graduation_year) data.graduation_year = Number(data.graduation_year);
    if (data.yearsOfExperience) data.yearsOfExperience = Number(data.yearsOfExperience);

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    } else {
      return res.status(400).json({ error: "Password is required" });
    }

    const newAlumni = new AlumniProfile({
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
      years_of_experience: data.yearsOfExperience,
      skills: data.skills,
      professional_achievements: data.professional_achievements,
      contribution_preferences: data.contribution_preferences,
      preferred_communication: data.communication,
      about_me: data.about_me,
      profile_photo_url: data.profile_photo_url,
      twitter: data.twitter,
      portfolio: data.portfolio,
      is_verified: false,
      engagement_status: data.engagement_status || 'inactive',
      prospect_type: data.prospect_type,
      user_id: data.user_id,
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', {
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