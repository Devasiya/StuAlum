const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
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

    if (req.files['verificationFile']) {
      data.verificationFilePath = '/uploads/' + req.files['verificationFile'][0].filename;
    }
    if (req.files['profile_photo_url']) {
      data.profile_photo_url = '/uploads/' + req.files['profile_photo_url'][0].filename;
    }

    ['skills', 'contribution_preferences', 'communication'].forEach(field => {
      if (typeof data[field] === 'string') {
        data[field] = [data[field]];
      }
    });

    if (!data.user_id) {
      data.user_id = new mongoose.Types.ObjectId();
    }

    if (data.graduation_year) data.graduation_year = Number(data.graduation_year);
    if (data.yearsOfExperience) data.yearsOfExperience = Number(data.yearsOfExperience);

    const newAlumni = new AlumniProfile(data);
    await newAlumni.save();

    res.status(201).json({ message: 'Alumni registered successfully' });
  } catch (error) {
    console.error('Error registering alumni:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Student Registration route
app.post('/api/student/register', upload.single('verificationFile'), async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      data.photo = '/uploads/' + req.file.filename;  // or assign to `photo` field if applicable
    }

    // Convert certain comma-separated strings to arrays if needed
    ['skills', 'interests', 'purposes', 'communication'].forEach(field => {
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

    // Build new student profile object, explicitly mapping all expected fields
    const newStudentData = {
      full_name: data.full_name,
      enrollment_number: data.enrollment_number,
      branch: data.branch,
      course: data.course,
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
      linkedin: data.linkedin,
      github: data.github,
      portfolio: data.portfolio,
      extracuriculum: data.extracuriculum,
      is_verified: false,  // default
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


app.get('/', (req, res) => res.send('Hello World!'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
