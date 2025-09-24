const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/StudAlum';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const AlumniProfile = require('./models/AlumniProfile');
const StudentProfile = require('./models/StudentProfile'); 
const AdminProfile = require('./models/AdminProfile');

// Alumni Registration route
app.post('/api/alumni/register', upload.fields([
  { name: 'verificationFile', maxCount: 1 },
  { name: 'profile_photo_url', maxCount: 1 }
]), async (req, res) => {
  try {
    const data = req.body;

    // Assign uploaded file paths to data keys matching schema
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
            // Try to parse as JSON array string
            data[field] = JSON.parse(data[field]);
          } catch {
            // Fallback: treat as comma-separated string
            data[field] = data[field].split(',').map(s => s.trim());
          }
        }
      } else {
        data[field] = [];
      }
    });

    // Add user_id if missing
    if (!data.user_id) {
      data.user_id = new mongoose.Types.ObjectId();
    }

    // Convert numerical fields properly
    if (data.graduation_year) data.graduation_year = Number(data.graduation_year);
    if (data.yearsOfExperience) data.yearsOfExperience = Number(data.yearsOfExperience);

    // Password hashing
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    } else {
      return res.status(400).json({ error: "Password is required" });
    }

    // Build new AlumniProfile document using mapped data keys
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
});


//student registration
app.post('/api/student/register', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'verificationFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const data = req.body;

    if (req.files) {
      if (req.files.photo && req.files.photo.length > 0) {
        data.photo = '/uploads/' + req.files.photo[0].filename;
      }
      if (req.files.verificationFile && req.files.verificationFile.length > 0) {
        data.verificationFile = '/uploads/' + req.files.verificationFile[0].filename;
      }
    }

    ['skills', 'interests', 'communication'].forEach(field => {
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

    if (typeof data.notifications === 'string') {
      try {
        data.notifications = JSON.parse(data.notifications);
      } catch {
        data.notifications = {
          mentorship: true,
          events: true,
          community: false,
          content: true,
        };
      }
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    } else {
      return res.status(400).json({ error: "Password is required" });
    }

    const newStudentData = {
      full_name: data.full_name,
      email: data.email,
      password: data.password,
      enrollment_number: data.enrollment_number,
      branch: data.branch,
      year_of_admission: data.year_of_admission ? Number(data.year_of_admission) : undefined,
      year_of_graduation: data.year_of_graduation ? Number(data.year_of_graduation) : undefined,
      contact_number: data.contact_number,
      address: data.address,
      skills: data.skills,
      interests: data.interests,
      career_goals: data.career_goal,
      discovery_insights: data.discovery_insights,
      preferences: data.preferences,
      photo: data.photo,
      verificationFile: data.verificationFile,
      linkedin: data.linkedin_url,
      github: data.github_url,
      extracurricular: data.extracurricular,
      is_verified: false,
      notifications: data.notifications,
      mentorship_area: data.mentorship_area,
      mentor_type: data.mentor_type,
      communication: data.communication,
      hear_about: data.hear_about,
    };

    const newStudent = new StudentProfile(newStudentData);
    await newStudent.save();

    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});



// Admin Registration route
app.post('/api/admin/register', async (req, res) => {
  try {
    const data = req.body;

    // You can add validation here if needed
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    } else {
      return res.status(400).json({ error: "Password is required" });
    }

    const newAdmin = new AdminProfile({
      full_name: data.full_name,
      email: data.email,
      password: data.password,   // Ideally hash this before saving
      confirm_password: data.confirm_password,
      designation: data.designation,
      department: data.department,
      contact_office: data.contact_office,
      college: data.college,
      admin_level: data.admin_level || "admin",
      permissions: data.permissions || { edit_user: false, manage_events: false },
    });

    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

//Login Student
app.post('/login/student', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find student by email (assuming email is stored in StudentProfile)
    const user = await StudentProfile.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Compare password with hashed password stored
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', {
      expiresIn: '1h',
    });

    // Return token and user info (excluding sensitive data)
    res.json({
      token,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




app.get('/', (req, res) => res.send('Hello World!'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
