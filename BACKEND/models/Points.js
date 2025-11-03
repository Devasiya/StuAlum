const mongoose = require("mongoose");

const PointsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "userType", // can point to either Student or Alumni
    required: true,
  },
  userType: {
    type: String,
    enum: ["Student", "Alumni"],
    required: true,
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
  badges: [
    {
      name: String,
      description: String,
      icon: String,
      earnedAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Points", PointsSchema);
