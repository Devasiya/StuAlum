const bcrypt = require('bcryptjs');
const StudentProfile = require('../models/StudentProfile');
const jwt = require('jsonwebtoken');

exports.registerStudent = async (req, res) => {
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
};

exports.loginStudent = async (req, res) => {
  console.log('Login route hit');
  const { email, password } = req.body;

  try {
    const user = await StudentProfile.findOne({ email });
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
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

