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

    // Assign user_id if not provided - create new ObjectId to avoid duplicate null error
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
app.get('/', (req, res) => res.send('Hello World!'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
