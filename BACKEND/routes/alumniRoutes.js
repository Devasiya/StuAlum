// BACKEND/routes/alumniRoutes.js

const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { 
    registerAlumni, 
    loginAlumni, 
    // ADDED: Import the new controller function for the directory
    getAlumniDirectory 
} = require('../controllers/alumniController'); 

// --- Authentication Routes ---

router.post('/register', upload.fields([
    { name: 'verificationFile', maxCount: 1 },
    { name: 'profile_photo_url', maxCount: 1 },
]), registerAlumni);

router.post('/login', loginAlumni);

// --- Alumni Directory Route ---

// ADDED: Route to fetch the list of alumni for the directory
router.get('/directory', getAlumniDirectory);

module.exports = router;