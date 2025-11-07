const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// NOTE: connectDB function should be verified to handle its own connection errors
const connectDB = require('./config/db');

// 1. Load environment variables first
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// Function to initialize and start the server
const startServer = async () => {
    try {
        // 2. CRITICAL STEP: Await the database connection before proceeding
        await connectDB();

        // 3. Require Mongoose Models (Must be done after DB connection attempt)
        // Profile Models
        require('./models/StudentProfile');
        require('./models/AlumniProfile');
        require('./models/AdminProfile');

        // Resource Models (Ensure these exist)
        require('./models/PrepResource'); // <--- CHECK THIS FILE PATH
        require('./models/CareerArticleVideo');

        // Core Forum Models
        require('./models/PostReport');
        require('./models/PostComment');
        require('./models/Post');
        require('./models/PostLike');
        require('./models/ForumCategory');

        // Event Model
        require('./models/Event');

        // Add mentorship models
        require('./models/MentorshipRequest');
        require('./models/MentorshipPreference');
        require('./models/MentorshipSession');
        require('./models/MentorshipMatch');

        // Middleware (Setup the application context)
        app.use(cors());
        app.use(express.json());
        app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

        // Global logging
        app.use((req, res, next) => {
          console.log(`Incoming ${req.method} ${req.url}`);
          next();
        });
         //AI Routes Text generation and grammar checker
        app.use('/api/text', require('./routes/aitextgeneratorRoutes'));
        app.use('/api/grammar', require('./routes/grammarRoutes'));

        
        // Routes
        app.use('/api/alumni', require('./routes/alumniRoutes'));
        app.use('/api/student', require('./routes/studentRoutes'));
        app.use('/api/admin', require('./routes/adminRoutes'));
        app.use('/api/forums', require('./routes/forumRoutes'));
        app.use('/api/events', require('./routes/eventRoutes'));
        app.use('/api/career', require('./routes/careerRoutes'));
        // Auth/User route
        app.use("/api/auth", require("./routes/authRoutes"));

        // MESSAGES ROUTER
        app.use('/api/messages', require('./routes/messageRoutes'));

        // MENTORSHIP ROUTER
        app.use('/api/mentorship', require('./routes/mentorshipRoutes'));

        //contact route
        app.use("/api/contact",require("./routes/contactRoutes"));

        //ai recommendation route
        app.use("/api/recommendations",require("./routes/recommendationRoutes"));

        //Badge & point stystem routes
        app.use('/api/points', require('./routes/pointsRoutes'));
        // Root Route
        app.get('/', (req, res) => res.send('Hello World!'));

        // 4. Start the server only after all async operations are done
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    } catch (error) {
        // If DB connection fails, log it and potentially exit
        console.error("Failed to connect to the database or start server:", error.message);
        process.exit(1); // Exit with a failure code
    }
}

// Execute the starting function
startServer();
