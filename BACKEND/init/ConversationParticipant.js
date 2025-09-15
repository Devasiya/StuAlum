const { Types } = require("mongoose");
const users = require("./User"); // note uppercase 'U'
const conversations = require("./Conservation");

// Utility to pick random users
const getRandomUsers = (count) => {
  const shuffled = [...users].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generate conversation participants
const conversationParticipants = [];

conversations.forEach((conversation) => {
  // Each conversation will have 3–4 participants randomly
  const participantCount = Math.floor(Math.random() * 2) + 3; 
  const selectedUsers = getRandomUsers(participantCount);

  selectedUsers.forEach((user) => {
    conversationParticipants.push({
      _id: new Types.ObjectId(),
      user_id: user._id,           // must match schema
      conversation_id: conversation._id, // must match schema
      role_in_conversation: "student",
      joined_at: new Date(
        2025,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1,
        Math.floor(Math.random() * 24),
        Math.floor(Math.random() * 60)
      ),
    });
  });
});

module.exports = conversationParticipants;
