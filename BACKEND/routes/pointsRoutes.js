const express = require('express');
const router = express.Router();
const { getUserPoints, getLeaderboard,awardPoints } = require('../controllers/pointsController');

// GET user points
router.get('/:userId', getUserPoints);

// GET leaderboard
router.get('/', getLeaderboard);

router.post("/award", awardPoints); // new POST route

module.exports = router;
