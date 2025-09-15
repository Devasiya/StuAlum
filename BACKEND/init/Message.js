const mongoose = require("mongoose");

// Example user IDs (5 users)
const userIds = [
  new mongoose.Types.ObjectId(), // User1
  new mongoose.Types.ObjectId(), // User2
  new mongoose.Types.ObjectId(), // User3
  new mongoose.Types.ObjectId(), // User4
  new mongoose.Types.ObjectId()  // User5
];

// Example conversation IDs (3 conversations)
const conversationIds = [
  new mongoose.Types.ObjectId(), // Conversation1 (User1 <-> User2)
  new mongoose.Types.ObjectId(), // Conversation2 (User3 <-> User4)
  new mongoose.Types.ObjectId()  // Conversation3 (Group: User1, User3, User5)
];

const messages = [
  {
    conversation_id: conversationIds[0],
    sender_id: userIds[0],
    message_text: "Hey! How are you?",
    sent_at: new Date("2025-09-10T09:00:00Z"),
    is_read: true
  },
  {
    conversation_id: conversationIds[0],
    sender_id: userIds[1],
    message_text: "I’m good, thanks! What about you?",
    sent_at: new Date("2025-09-10T09:02:00Z"),
    is_read: true
  },
  {
    conversation_id: conversationIds[0],
    sender_id: userIds[0],
    message_text: "Doing well! Did you check the new project repo?",
    sent_at: new Date("2025-09-10T09:05:00Z"),
    is_read: false
  },
  {
    conversation_id: conversationIds[1],
    sender_id: userIds[2],
    message_text: "Are we still on for the meeting later?",
    sent_at: new Date("2025-09-11T14:00:00Z"),
    is_read: false
  },
  {
    conversation_id: conversationIds[1],
    sender_id: userIds[3],
    message_text: "Yes, let’s connect at 5 PM.",
    sent_at: new Date("2025-09-11T14:05:00Z"),
    is_read: true
  },
  {
    conversation_id: conversationIds[1],
    sender_id: userIds[2],
    message_text: "Perfect, see you then.",
    sent_at: new Date("2025-09-11T14:07:00Z"),
    is_read: true
  },
  {
    conversation_id: conversationIds[2],
    sender_id: userIds[0],
    message_text: "Hi team, sharing the document here.",
    sent_at: new Date("2025-09-12T08:30:00Z"),
    is_read: true
  },
  {
    conversation_id: conversationIds[2],
    sender_id: userIds[4],
    message_text: "Got it, thanks!",
    sent_at: new Date("2025-09-12T08:32:00Z"),
    is_read: true
  },
  {
    conversation_id: conversationIds[2],
    sender_id: userIds[2],
    message_text: "I’ll review and add comments.",
    sent_at: new Date("2025-09-12T08:35:00Z"),
    is_read: false
  },
  {
    conversation_id: conversationIds[2],
    sender_id: userIds[0],
    message_text: "Cool, let’s finalize by EOD.",
    sent_at: new Date("2025-09-12T08:40:00Z"),
    is_read: false
  }
];

module.exports = messages;
