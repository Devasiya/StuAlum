const { Types } = require("mongoose");

// Example Forum Categories (5)
const forumIds = [
  new Types.ObjectId("6510a1a3f1d2a001f9e10011"), // Career Guidance
  new Types.ObjectId("6510a1a3f1d2a001f9e10022"), // Placements
  new Types.ObjectId("6510a1a3f1d2a001f9e10033"), // Events
  new Types.ObjectId("6510a1a3f1d2a001f9e10044"), // Research & Innovation
  new Types.ObjectId("6510a1a3f1d2a001f9e10055")  // General Discussion
];

// Example Users (5)
const userIds = [
  new Types.ObjectId("6510a2b3f1d2a001f9f20011"),
  new Types.ObjectId("6510a2b3f1d2a001f9f20022"),
  new Types.ObjectId("6510a2b3f1d2a001f9f20033"),
  new Types.ObjectId("6510a2b3f1d2a001f9f20044"),
  new Types.ObjectId("6510a2b3f1d2a001f9f20055")
];

const posts = [
  {
    _id: new Types.ObjectId(),
    forum_id: forumIds[0],
    title: "How to prepare for campus placements?",
    content: "What are the best resources and strategies for final year students?",
    created_by: userIds[0],
    likes_count: 15,
    views_count: 120,
    created_at: new Date("2025-09-01T09:00:00Z"),
    updated_at: new Date("2025-09-01T09:00:00Z")
  },
  {
    _id: new Types.ObjectId(),
    forum_id: forumIds[1],
    title: "Company-specific preparation for Infosys",
    content: "Can someone share the pattern and preparation tips for Infosys?",
    created_by: userIds[1],
    likes_count: 25,
    views_count: 200,
    created_at: new Date("2025-09-02T10:30:00Z"),
    updated_at: new Date("2025-09-02T10:30:00Z")
  },
  {
    _id: new Types.ObjectId(),
    forum_id: forumIds[2],
    title: "Upcoming Hackathon in October",
    content: "Our college is organizing a 48-hour coding hackathon. Details inside!",
    created_by: userIds[2],
    likes_count: 40,
    views_count: 350,
    created_at: new Date("2025-09-03T11:00:00Z"),
    updated_at: new Date("2025-09-03T11:00:00Z")
  },
  {
    _id: new Types.ObjectId(),
    forum_id: forumIds[3],
    title: "Best tools for AI/ML research",
    content: "What tools and frameworks are you using for your ML research projects?",
    created_by: userIds[3],
    likes_count: 33,
    views_count: 280,
    created_at: new Date("2025-09-04T15:00:00Z"),
    updated_at: new Date("2025-09-04T15:00:00Z")
  },
  {
    _id: new Types.ObjectId(),
    forum_id: forumIds[4],
    title: "Alumni meet-up highlights",
    content: "Here’s a summary of the alumni meet-up held last week.",
    created_by: userIds[4],
    likes_count: 18,
    views_count: 150,
    created_at: new Date("2025-09-05T12:00:00Z"),
    updated_at: new Date("2025-09-05T12:00:00Z")
  },
  {
    _id: new Types.ObjectId(),
    forum_id: forumIds[0],
    title: "Resume review tips",
    content: "What are recruiters looking for in resumes for software jobs?",
    created_by: userIds[1],
    likes_count: 22,
    views_count: 210,
    created_at: new Date("2025-09-06T14:00:00Z"),
    updated_at: new Date("2025-09-06T14:00:00Z")
  },
  {
    _id: new Types.ObjectId(),
    forum_id: forumIds[2],
    title: "Cultural fest schedule",
    content: "Here’s the list of events and schedule for our annual fest.",
    created_by: userIds[0],
    likes_count: 50,
    views_count: 500,
    created_at: new Date("2025-09-07T16:00:00Z"),
    updated_at: new Date("2025-09-07T16:00:00Z")
  },
  {
    _id: new Types.ObjectId(),
    forum_id: forumIds[1],
    title: "TCS Codevita strategies",
    content: "Let’s discuss problem-solving strategies for TCS Codevita contest.",
    created_by: userIds[2],
    likes_count: 29,
    views_count: 240,
    created_at: new Date("2025-09-08T17:00:00Z"),
    updated_at: new Date("2025-09-08T17:00:00Z")
  },
  {
    _id: new Types.ObjectId(),
    forum_id: forumIds[3],
    title: "Paper publication in IEEE",
    content: "What is the process of publishing a paper in IEEE journals?",
    created_by: userIds[3],
    likes_count: 12,
    views_count: 95,
    created_at: new Date("2025-09-09T18:00:00Z"),
    updated_at: new Date("2025-09-09T18:00:00Z")
  },
  {
    _id: new Types.ObjectId(),
    forum_id: forumIds[4],
    title: "New canteen menu feedback",
    content: "What do you all think of the updated menu in the canteen?",
    created_by: userIds[4],
    likes_count: 10,
    views_count: 80,
    created_at: new Date("2025-09-10T19:00:00Z"),
    updated_at: new Date("2025-09-10T19:00:00Z")
  }
];

module.exports = posts;
