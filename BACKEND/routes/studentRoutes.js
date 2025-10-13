const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { registerStudent, loginStudent } = require('../controllers/studentController');

router.post('/register', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'verificationFile', maxCount: 1 },
]), registerStudent);

router.post('/login', loginStudent);

module.exports = router;
