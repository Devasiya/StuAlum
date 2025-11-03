// utils/pointsService.js
const Points = require("../models/Points");
const { badgeRules } = require("./badgeRules");

exports.addPoints = async (userId, userType, pointsToAdd) => {
  try {
    if (!userId || !userType) return;

    let record = await Points.findOne({ userId });
    if (!record) {
      record = new Points({
        userId,
        userType,
        totalPoints: 0,
        badges: [],
      });
    }

    record.totalPoints += Number(pointsToAdd) || 0;

    // --- Auto award badges based on total points ---
    for (const rule of badgeRules) {
      const alreadyHasBadge = record.badges.some((b) => b.name === rule.name);
      if (record.totalPoints >= rule.threshold && !alreadyHasBadge) {
        record.badges.push({
          name: rule.name,
          description: rule.description,
          icon: rule.icon,
        });
        console.log(`🏅 ${rule.name} badge awarded to ${userId}`);
      }
    }

    await record.save();
    console.log(`✅ ${pointsToAdd} points added to ${userId}`);
  } catch (error) {
    console.error("❌ Failed to add points:", error);
  }
};
