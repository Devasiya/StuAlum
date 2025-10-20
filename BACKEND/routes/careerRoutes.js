// BACKEND/routes/careerRoutes.js 

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const { checkRole } = require('../middleware/checkRole'); 
const careerController = require('../controllers/careerController');

const ALL_MEMBERS = ['student', 'alumni', 'admin']; 
const ADMIN_ONLY = ['admin'];

// --- CAREER GUIDANCE ROUTES ---

// 1. GET /api/career/resources
// 🚨 TEMPORARY FIX: Remove checkRole to isolate hang point
router.get('/resources', auth, careerController.getCareerResources); // <-- CHANGED

// 2. GET /api/career/sessions (Placeholder)
router.get('/sessions', auth, checkRole(ALL_MEMBERS), careerController.getQASessions);

// 3. POST /api/career/upload-resume
router.post('/upload-resume', auth, checkRole(ALL_MEMBERS), careerController.uploadResume); 

// 4. POST /api/career/resource-create
router.post('/resource-create', auth, checkRole(ADMIN_ONLY), careerController.createResource); 
// Note: Ensure careerController.createResource is defined and exported!

module.exports = router;