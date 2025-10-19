const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

require('./models/StudentProfile');
require('./models/AlumniProfile');
require('./models/AdminProfile');
// Add core forum models (These models are directly involved in the failed query)
require('./models/PostReport');
require('./models/PostComment');
require('./models/Post');
require('./models/PostLike');
require('./models/ForumCategory');
require('./models/Event');
// Add mentorship models
require('./models/MentorshipRequest');
require('./models/MentorshipPreference');
require('./models/MentorshipSession');
require('./models/MentorshipMatch');
// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Global logging
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/alumni', require('./routes/alumniRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// FORUM ROUTES
app.use('/api/forums', require('./routes/forumRoutes'));

// EVENTS ROUTER
app.use('/api/events', require('./routes/eventRoutes'));

// MESSAGES ROUTER
app.use('/api/messages', require('./routes/messageRoutes'));

// MENTORSHIP ROUTER
app.use('/api/mentorship', require('./routes/mentorshipRoutes'));


app.get('/', (req, res) => res.send('Hello World!'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
