// BACKEND/routes/alumniRoutes.js

const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
    registerAlumni,
    loginAlumni,
    getAlumniDirectory, // Existing import for directory list
    getAlumniProfileById,
    // 🛑 ADDED: Import the function to handle CSV export
    exportAlumniToCSV,
    inviteAlumni
} = require('../controllers/alumniController');

// --- Authentication Routes ---

router.post('/register', upload.fields([
    { name: 'verificationFile', maxCount: 1 },
    { name: 'profile_photo_url', maxCount: 1 },
]), registerAlumni);

router.post('/login', loginAlumni);

// --- Alumni Directory & Profile Routes ---

// Existing: Route to fetch the list of alumni for the directory
router.get('/directory', getAlumniDirectory);

// 🛑 NEW ROUTE: Handles the export of the directory data to CSV
// This route is called by the frontend's "Export" button
router.get('/export', exportAlumniToCSV); 

// Existing: Dynamic route to fetch a single alumni profile by ID
router.get('/:id', getAlumniProfileById);

// 🛑 NEW ROUTE: Invite Alumni
router.post('/invite', inviteAlumni);

module.exports = router;
