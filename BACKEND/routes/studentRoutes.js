const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { registerStudent, loginStudent, getStudentDirectory, getStudentProfileById } = require('../controllers/studentController');

router.post('/register', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'verificationFile', maxCount: 1 },
]), registerStudent);

router.post('/login', loginStudent);

router.get('/directory', getStudentDirectory);

router.get('/profile/:id', getStudentProfileById);

module.exports = router;
