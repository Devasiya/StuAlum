const { Types } = require("mongoose");

// Example Post IDs (replace with your actual Post IDs or generate new ones)
const postIds = [
  new Types.ObjectId(),
  new Types.ObjectId(),
  new Types.ObjectId(),
  new Types.ObjectId(),
  new Types.ObjectId(),
  new Types.ObjectId(),
  new Types.ObjectId(),
  new Types.ObjectId(),
  new Types.ObjectId(),
  new Types.ObjectId()
];

// Example User IDs (replace with your actual User IDs or generate new ones)
const userIds = [
  new Types.ObjectId(),
  new Types.ObjectId(),
  new Types.ObjectId(),
  new Types.ObjectId(),
  new Types.ObjectId(),
  new Types.ObjectId(),
  new Types.ObjectId(),
  new Types.ObjectId(),
  new Types.ObjectId(),
  new Types.ObjectId()
];

const reports = [
  {
    _id: new Types.ObjectId(),
    post_id: postIds[0],
    reported_by: userIds[0],
    reason: "Inappropriate language",
    status: "pending",
    created_at: new Date(),
  },
  {
    _id: new Types.ObjectId(),
    post_id: postIds[1],
    reported_by: userIds[1],
    reason: "Spam content",
    status: "pending",
    created_at: new Date(),
  },
  {
    _id: new Types.ObjectId(),
    post_id: postIds[2],
    reported_by: userIds[2],
    reason: "Harassment",
    status: "reviewed",
    created_at: new Date(),
  },
  {
    _id: new Types.ObjectId(),
    post_id: postIds[3],
    reported_by: userIds[3],
    reason: "Irrelevant content",
    status: "pending",
    created_at: new Date(),
  },
  {
    _id: new Types.ObjectId(),
    post_id: postIds[4],
    reported_by: userIds[4],
    reason: "Duplicate post",
    status: "reviewed",
    created_at: new Date(),
  },
  {
    _id: new Types.ObjectId(),
    post_id: postIds[5],
    reported_by: userIds[5],
    reason: "Off-topic content",
    status: "pending",
    created_at: new Date(),
  },
  {
    _id: new Types.ObjectId(),
    post_id: postIds[6],
    reported_by: userIds[6],
    reason: "Plagiarized content",
    status: "reviewed",
    created_at: new Date(),
  },
  {
    _id: new Types.ObjectId(),
    post_id: postIds[7],
    reported_by: userIds[7],
    reason: "Inappropriate images",
    status: "pending",
    created_at: new Date(),
  },
  {
    _id: new Types.ObjectId(),
    post_id: postIds[8],
    reported_by: userIds[8],
    reason: "Misleading information",
    status: "reviewed",
    created_at: new Date(),
  },
  {
    _id: new Types.ObjectId(),
    post_id: postIds[9],
    reported_by: userIds[9],
    reason: "Offensive content",
    status: "pending",
    created_at: new Date(),
  }
];

module.exports = reports;
