const express = require("express");
const router = express.Router();
const { generateRecommendations } = require("../controllers/recommendationController");


router.post("/generate", generateRecommendations);

module.exports = router;


