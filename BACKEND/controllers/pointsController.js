// // Example data fallback (used if DB data not found)
// const fakeBadges = [
//   { id: 1, name: "Beginner Explorer", description: "Earned 100 points for consistent participation" },
//   { id: 2, name: "Active Contributor", description: "Earned 500 points for sharing valuable insights" },
//   { id: 3, name: "Community Star", description: "Top 5 in leaderboard for 2 consecutive weeks" },
// ];

// const fakeLeaderboard = [
//   { id: "1", name: "Aarav Mehta", points: 950 },
//   { id: "2", name: "Baljeet Patel", points: 720 },
//   { id: "3", name: "Diya Sharma", points: 610 },
//   { id: "4", name: "Rahul Verma", points: 540 },
//   { id: "5", name: "Isha Kapoor", points: 480 },
// ];

// // ✅ Controller: Get user points
// exports.getUserPoints = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // 🧩 Later, fetch from DB using userId
//     // Example: const userPoints = await Points.findOne({ userId });

//     const userPoints = { totalPoints: 720, badges: fakeBadges }; // Fake fallback

//     res.status(200).json(userPoints);
//   } catch (error) {
//     console.error("Error fetching user points:", error);
//     res.status(500).json({ message: "Failed to fetch user points" });
//   }
// };

// // ✅ Controller: Get leaderboard
// exports.getLeaderboard = async (req, res) => {
//   try {
//     // 🧩 Later: Replace with DB logic like: const leaderboard = await Points.find().sort({ points: -1 });
//     res.status(200).json(fakeLeaderboard);
//   } catch (error) {
//     console.error("Error fetching leaderboard:", error);
//     res.status(500).json({ message: "Failed to fetch leaderboard" });
//   }
// };


const Points = require("../models/Points");

// --- Fallback demo data (only used if DB empty) ---
const fakeBadges = [
  {
    name: "Beginner Explorer",
    description: "Earned 100 points for consistent participation",
    icon: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
  },
  {
    name: "Active Contributor",
    description: "Earned 500 points for sharing valuable insights",
    icon: "https://cdn-icons-png.flaticon.com/512/2583/2583345.png",
  },
  {
    name: "Community Star",
    description: "Top 5 in leaderboard for 2 consecutive weeks",
    icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  },
];

const fakeLeaderboard = [
  { id: "1", name: "Aarav Mehta", points: 950 },
  { id: "2", name: "Baljeet Patel", points: 720 },
  { id: "3", name: "Diya Sharma", points: 610 },
  { id: "4", name: "Rahul Verma", points: 540 },
  { id: "5", name: "Isha Kapoor", points: 480 },
];

// ✅ Controller: Fetch user's points + badges
exports.getUserPoints = async (req, res) => {
  try {
    const { userId } = req.params;

    // Try to get real data from MongoDB
    let userPoints = await Points.findOne({ userId });

    if (!userPoints) {
      // Create fake record for now
      userPoints = new Points({
        userId,
        userType: "Student",
        totalPoints: 720,
        badges: fakeBadges,
      });
      await userPoints.save();
    }

    res.status(200).json({
      totalPoints: userPoints.totalPoints,
      badges: userPoints.badges.length ? userPoints.badges : fakeBadges,
    });
  } catch (error) {
    console.error("❌ Error fetching user points:", error);
    res.status(500).json({ message: "Failed to fetch user points" });
  }
};

// ✅ Controller: Fetch leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const topUsers = await Points.find()
      .populate("userId", "name email") // optional
      .sort({ totalPoints: -1 })
      .limit(5);

    if (topUsers.length === 0) {
      return res.status(200).json(fakeLeaderboard);
    }

    const leaderboard = topUsers.map((entry, index) => ({
      id: entry.userId?._id || index,
      name: entry.userId?.name || "Anonymous",
      points: entry.totalPoints,
    }));

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("❌ Error fetching leaderboard:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};


// ✅ New: Award points or badges to user
exports.awardPoints = async (req, res) => {
  try {
    const { userId, userType, pointsToAdd, badge } = req.body;

    if (!userId || !userType) {
      return res.status(400).json({ message: "User ID and type are required" });
    }

    let record = await Points.findOne({ userId });

    if (!record) {
      record = new Points({
        userId,
        userType,
        totalPoints: 0,
        badges: [],
      });
    }

    // Update points
    record.totalPoints += Number(pointsToAdd) || 0;

    // Optionally add badge
    if (badge) {
      record.badges.push({
        name: badge.name,
        description: badge.description || "",
        icon: badge.icon || "",
      });
    }

    await record.save();

    res.status(200).json({
      message: "Points or badge awarded successfully",
      data: record,
    });
  } catch (error) {
    console.error("❌ Error awarding points:", error);
    res.status(500).json({ message: "Failed to award points" });
  }
};