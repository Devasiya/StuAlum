const { Types } = require("mongoose");

// Example Post IDs (from your Post seeder)
const postIds = [
  new Types.ObjectId("6520a1a3f1d2a001f9e20011"), // Post 1
  new Types.ObjectId("6520a1a3f1d2a001f9e20022"), // Post 2
  new Types.ObjectId("6520a1a3f1d2a001f9e20033"), // Post 3
  new Types.ObjectId("6520a1a3f1d2a001f9e20044"), // Post 4
  new Types.ObjectId("6520a1a3f1d2a001f9e20055"), // Post 5
  new Types.ObjectId("6520a1a3f1d2a001f9e20066"), // Post 6
  new Types.ObjectId("6520a1a3f1d2a001f9e20077"), // Post 7
  new Types.ObjectId("6520a1a3f1d2a001f9e20088"), // Post 8
  new Types.ObjectId("6520a1a3f1d2a001f9e20099"), // Post 9
  new Types.ObjectId("6520a1a3f1d2a001f9e20100")  // Post 10
];

// Example Users (same from User seeder)
const userIds = [
  new Types.ObjectId("6510a2b3f1d2a001f9f20011"),
  new Types.ObjectId("6510a2b3f1d2a001f9f20022"),
  new Types.ObjectId("6510a2b3f1d2a001f9f20033"),
  new Types.ObjectId("6510a2b3f1d2a001f9f20044"),
  new Types.ObjectId("6510a2b3f1d2a001f9f20055")
];

const postComments = [
  {
    _id: new Types.ObjectId(),
    post_id: postIds[0],
    user_id: userIds[1],
    content: "Really useful tips for campus placements. Thanks for sharing!",
    created_at: new Date("2025-09-01T10:00:00Z"),
    updated_at: new Date("2025-09-01T10:00:00Z")
  },
  {
    _id: new Types.ObjectId(),
    post_id: postIds[1],
    user_id: userIds[2],
    content: "Infosys pattern is mostly aptitude-based. Focus on logical reasoning.",
    created_at: new Date("2025-09-02T11:00:00Z"),
    updated_at: new Date("2025-09-02T11:00:00Z")
  },
  {
    _id: new Types.ObjectId(),
    post_id: postIds[2],
    user_id: userIds[3],
    content: "Excited about this hackathon! Who’s forming a team?",
    created_at: new Date("2025-09-03T12:30:00Z"),
    updated_at: new Date("2025-09-03T12:30:00Z")
  },
  {
    _id: new Types.ObjectId(),
    post_id: postIds[3],
    user_id: userIds[4],
    content: "TensorFlow and PyTorch are the best for ML research.",
    created_at: new Date("2025-09-04T16:10:00Z"),
    updated_at: new Date("2025-09-04T16:10:00Z")
  },
  {
    _id: new Types.ObjectId(),
    post_id: postIds[4],
    user_id: userIds[0],
    content: "Alumni meet-up was amazing. I loved the panel discussion.",
    created_at: new Date("2025-09-05T13:20:00Z"),
    updated_at: new Date("2025-09-05T13:20:00Z")
  },
  {
    _id: new Types.ObjectId(),
    post_id: postIds[5],
    user_id: userIds[2],
    content: "Make sure your resume is ATS-friendly. Keywords matter a lot.",
    created_at: new Date("2025-09-06T15:30:00Z"),
    updated_at: new Date("2025-09-06T15:30:00Z")
  },
  {
    _id: new Types.ObjectId(),
    post_id: postIds[6],
    user_id: userIds[1],
    content: "The cultural fest lineup looks amazing this year!",
    created_at: new Date("2025-09-07T17:00:00Z"),
    updated_at: new Date("2025-09-07T17:00:00Z")
  },
  {
    _id: new Types.ObjectId(),
    post_id: postIds[7],
    user_id: userIds[3],
    content: "For TCS Codevita, practice previous years’ problems.",
    created_at: new Date("2025-09-08T18:10:00Z"),
    updated_at: new Date("2025-09-08T18:10:00Z")
  },
  {
    _id: new Types.ObjectId(),
    post_id: postIds[8],
    user_id: userIds[4],
    content: "Publishing in IEEE requires a solid research contribution. Start early.",
    created_at: new Date("2025-09-09T19:15:00Z"),
    updated_at: new Date("2025-09-09T19:15:00Z")
  },
  {
    _id: new Types.ObjectId(),
    post_id: postIds[9],
    user_id: userIds[0],
    content: "The new canteen menu is better, but prices are a bit high.",
    created_at: new Date("2025-09-10T20:00:00Z"),
    updated_at: new Date("2025-09-10T20:00:00Z")
  }
];

module.exports = postComments;
