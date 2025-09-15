const mongoose = require("mongoose");

// Pretend these are 10 users in your DB
const userIds = [
  new mongoose.Types.ObjectId(), // User1
  new mongoose.Types.ObjectId(), // User2
  new mongoose.Types.ObjectId(), // User3
  new mongoose.Types.ObjectId(), // User4
  new mongoose.Types.ObjectId(), // User5
  new mongoose.Types.ObjectId(), // User6
  new mongoose.Types.ObjectId(), // User7
  new mongoose.Types.ObjectId(), // User8
  new mongoose.Types.ObjectId(), // User9
  new mongoose.Types.ObjectId()  // User10
];

// 10 mentorship matches (mentees + mentors interconnected)
const mentorshipMatches = [
  {
    mentee_id: userIds[0],
    mentor_id: userIds[5],
    ai_score: 85,
    match_reason: "Shared interest in Data Science",
    status: "active"
  },
  {
    mentee_id: userIds[1],
    mentor_id: userIds[6],
    ai_score: 72,
    match_reason: "Both specialize in Web Development",
    status: "pending"
  },
  {
    mentee_id: userIds[2],
    mentor_id: userIds[7],
    ai_score: 91,
    match_reason: "Strong AI/ML alignment",
    status: "active"
  },
  {
    mentee_id: userIds[3],
    mentor_id: userIds[8],
    ai_score: 65,
    match_reason: "Same industry: Finance",
    status: "pending"
  },
  {
    mentee_id: userIds[4],
    mentor_id: userIds[9],
    ai_score: 78,
    match_reason: "Both interested in Cloud Computing",
    status: "completed"
  },
  {
    mentee_id: userIds[5],
    mentor_id: userIds[0],
    ai_score: 80,
    match_reason: "Reversed mentorship for leadership skills",
    status: "active"
  },
  {
    mentee_id: userIds[6],
    mentor_id: userIds[2],
    ai_score: 69,
    match_reason: "Career guidance in Product Management",
    status: "pending"
  },
  {
    mentee_id: userIds[7],
    mentor_id: userIds[3],
    ai_score: 88,
    match_reason: "Shared passion for Cybersecurity",
    status: "active"
  },
  {
    mentee_id: userIds[8],
    mentor_id: userIds[1],
    ai_score: 74,
    match_reason: "Both in Healthcare Tech",
    status: "completed"
  },
  {
    mentee_id: userIds[9],
    mentor_id: userIds[4],
    ai_score: 95,
    match_reason: "Perfect match for Data Engineering",
    status: "active"
  }
];

module.exports = mentorshipMatches;
