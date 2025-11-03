
import axios from "axios";

// 👇 Adjust this base URL to match your backend API endpoint
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// 🧠 Fake fallback data for testing
const fakeUserPoints = {
  userId: "12345",
  totalPoints: 720,
  history: [
    { activity: "Submitted Assignment", points: 100, date: "2025-10-10" },
    { activity: "Participated in Event", points: 200, date: "2025-10-15" },
    { activity: "Contributed in Forum", points: 420, date: "2025-10-20" },
  ],
};

const fakeLeaderboard = [
  { id: "1", name: "Aarav Mehta", points: 950 },
  { id: "2", name: "Baljeet Patel", points: 720 },
  { id: "3", name: "Diya Sharma", points: 610 },
  { id: "4", name: "Rahul Verma", points: 540 },
  { id: "5", name: "Isha Kapoor", points: 480 },
];

// ✅ Fetch user points
export const getUserPoints = async (userId) => {
  try {
    const res = await axios.get(`${API_BASE}/points/${userId}`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Error fetching user points:", error);
    return null;
  }
};

// ✅ Fetch leaderboard
export const getLeaderboard = async () => {
  try {
    const res = await axios.get(`${API_BASE}/leaderboard`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
};
