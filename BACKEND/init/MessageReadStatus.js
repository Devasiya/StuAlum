const mongoose = require("mongoose");

// Example User IDs (5 users)
const userIds = [
  new mongoose.Types.ObjectId("650f1c2a3f1d2a001f9d3001"), // User1
  new mongoose.Types.ObjectId("650f1c2a3f1d2a001f9d3002"), // User2
  new mongoose.Types.ObjectId("650f1c2a3f1d2a001f9d3003"), // User3
  new mongoose.Types.ObjectId("650f1c2a3f1d2a001f9d3004"), // User4
  new mongoose.Types.ObjectId("650f1c2a3f1d2a001f9d3005")  // User5
];

// Example Message IDs (4 messages)
const messageIds = [
  new mongoose.Types.ObjectId("650f1c2a3f1d2a001f9d4001"), // Msg1
  new mongoose.Types.ObjectId("650f1c2a3f1d2a001f9d4002"), // Msg2
  new mongoose.Types.ObjectId("650f1c2a3f1d2a001f9d4003"), // Msg3
  new mongoose.Types.ObjectId("650f1c2a3f1d2a001f9d4004")  // Msg4
];

const messageReadStatuses = [
  {
    message_id: messageIds[0],
    user_id: userIds[0],
    read_at: new Date("2025-09-10T09:05:00Z")
  },
  {
    message_id: messageIds[0],
    user_id: userIds[1],
    read_at: new Date("2025-09-10T09:06:30Z")
  },
  {
    message_id: messageIds[1],
    user_id: userIds[2],
    read_at: new Date("2025-09-11T14:10:00Z")
  },
  {
    message_id: messageIds[1],
    user_id: userIds[3],
    read_at: new Date("2025-09-11T14:12:00Z")
  },
  {
    message_id: messageIds[2],
    user_id: userIds[0],
    read_at: new Date("2025-09-12T08:37:00Z")
  },
  {
    message_id: messageIds[2],
    user_id: userIds[4],
    read_at: new Date("2025-09-12T08:38:30Z")
  },
  {
    message_id: messageIds[2],
    user_id: userIds[2],
    read_at: new Date("2025-09-12T08:39:00Z")
  },
  {
    message_id: messageIds[3],
    user_id: userIds[1],
    read_at: new Date("2025-09-13T10:00:00Z")
  },
  {
    message_id: messageIds[3],
    user_id: userIds[3],
    read_at: new Date("2025-09-13T10:01:00Z")
  },
  {
    message_id: messageIds[3],
    user_id: userIds[4],
    read_at: new Date("2025-09-13T10:02:00Z")
  }
];

module.exports = messageReadStatuses;
