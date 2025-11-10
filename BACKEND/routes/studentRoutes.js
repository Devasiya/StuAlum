const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { registerStudent, loginStudent, getStudentDirectory, getStudentProfileById,getCurrentStudentProfile } = require('../controllers/studentController');
const auth = require('../middleware/auth');

router.post('/register', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'verificationFile', maxCount: 1 },
]), registerStudent);

router.post('/login', loginStudent);

router.get('/directory', getStudentDirectory);

router.get('/profile/:id', getStudentProfileById);


// router.get('/me', auth, getCurrentStudentProfile);


module.exports = router;
