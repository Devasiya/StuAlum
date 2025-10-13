const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { registerAlumni, loginAlumni } = require('../controllers/alumniController');

router.post('/register', upload.fields([
  { name: 'verificationFile', maxCount: 1 },
  { name: 'profile_photo_url', maxCount: 1 },
]), registerAlumni);

router.post('/login', loginAlumni);

module.exports = router;