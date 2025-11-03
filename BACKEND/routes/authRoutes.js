const express = require("express");
const router = express.Router();
const Student = require("../models/StudentProfile");
const Alumni = require("../models/AlumniProfile");
const Admin = require("../models/AdminProfile");

// ✅ Route: GET /api/auth/me
// Returns the current user based on session or token (for now using query/fake logic)
router.get("/me", async (req, res) => {
  try {
    // If you have session authentication:
    // const userId = req.session?.userId;

    // TEMPORARY (for testing with frontend)
    const { userId, role } = req.query; // e.g. /api/auth/me?userId=123&role=student

    if (!userId || !role) {
      return res.status(400).json({ message: "Missing userId or role" });
    }

    let user;
    if (role === "student") {
      user = await Student.findById(userId).select("-password");
    } else if (role === "alumni") {
      user = await Alumni.findById(userId).select("-password");
    } else if (role === "admin") {
      user = await Admin.findById(userId).select("-password");
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
