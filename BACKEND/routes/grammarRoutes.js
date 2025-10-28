const express = require('express');
const router = express.Router();
const { checkGrammar } = require('../controllers/grammarController');

console.log("✅ Grammar routes loaded");
// POST route for grammar correction
// router.post('/check', checkGrammar);

router.post('/check', (req, res, next) => {
  console.log("📨 /api/grammar/check route hit");
  checkGrammar(req, res, next);
});

module.exports = router;