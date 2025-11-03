// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Trophy, Medal } from "lucide-react";
// import BadgeDisplay from "./BadgeDisplay";
// import ProgressLine from "./ProgressLine";
// import Leaderboard from "./Leaderboard";

// // --- Simple Card & Button Components ---
// const Card = ({ children, className = "" }) => (
//   <div className={`bg-white shadow-md rounded-2xl ${className}`}>{children}</div>
// );

// const CardContent = ({ children, className = "" }) => (
//   <div className={`p-5 ${className}`}>{children}</div>
// );

// const Button = ({ children, onClick, className = "" }) => (
//   <button
//     onClick={onClick}
//     className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition ${className}`}
//   >
//     {children}
//   </button>
// );
// // ------------------------------------------------------------

// export default function PointsDashboard({ user }) {
//   const [userPoints, setUserPoints] = useState(0);
//   const [badges, setBadges] = useState([]);
//   const [leaderboard, setLeaderboard] = useState([]);
//   const [level, setLevel] = useState(1);

//   useEffect(() => {
//     // 🧠 Simulate fetching data with a short delay
//     setTimeout(() => {
//       const fakePoints = 720;
//       const fakeBadges = [
//         {
//           id: 1,
//           name: "Beginner Explorer",
//           description: "Earned 100 points for consistent participation",
//           icon: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
//         },
//         {
//           id: 2,
//           name: "Active Contributor",
//           description: "Earned 500 points for sharing valuable insights",
//           icon: "https://cdn-icons-png.flaticon.com/512/2583/2583345.png",
//         },
//         {
//           id: 3,
//           name: "Community Star",
//           description: "Top 5 in leaderboard for 2 consecutive weeks",
//           icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//         },
//       ];

//       const fakeLeaderboard = [
//         { id: "1", name: "Aarav Mehta", points: 950 },
//         { id: "2", name: "Baljeet Patel", points: 720 },
//         { id: "3", name: "Diya Sharma", points: 610 },
//         { id: "4", name: "Rahul Verma", points: 540 },
//         { id: "5", name: "Isha Kapoor", points: 480 },
//       ];

//       setUserPoints(fakePoints);
//       setBadges(fakeBadges);
//       setLeaderboard(fakeLeaderboard);
//       setLevel(Math.floor(fakePoints / 500) + 1);
//       // --- Step 2: then try to fetch real data ---
//       const fetchRealData = async () => {
//         try {
//           const userId = localStorage.getItem("userId");
//           const [pointsRes, leaderboardRes] = await Promise.all([
//             getUserPoints(userId), // ← your backend call
//             getLeaderboard(),
//           ]);

//           // Merge or replace fake data with real data
//           if (pointsRes) setUserPoints(pointsRes.totalPoints || fakePoints);
//           if (leaderboardRes?.length) setLeaderboard([...fakeLeaderboard, ...leaderboardRes]);
//         } catch (err) {
//           console.error("Error fetching real data:", err);
//           // keep fake data if API fails
//         }
//       };
//       fetchRealData();
//     }, 500);
//   }, []);

//   const progress = Math.min((userPoints / 1000) * 100, 100);

//   return (
//     <div className="p-6 sm:p-8">
//       {/* Header */}
//       <motion.div
//         className="flex flex-wrap items-center justify-between mb-8"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <h1 className="text-3xl font-bold flex items-center gap-2">
//           <Trophy className="text-yellow-500 w-8 h-8" />
//           Points & Badges Dashboard
//         </h1>
//         <Button>Redeem Rewards</Button>
//       </motion.div>

//       {/* Points Summary */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.6 }}
//       >
//         <Card className="mb-8">
//           <CardContent className="text-center">
//             <h2 className="text-xl font-semibold text-gray-700 mb-2">
//               Total Points
//             </h2>
//             <motion.p
//               className="text-5xl font-bold text-green-600"
//               initial={{ scale: 0.8 }}
//               animate={{ scale: 1 }}
//               transition={{ duration: 0.6, ease: "easeOut" }}
//             >
//               {userPoints}
//             </motion.p>
//             <p className="text-gray-500 mt-2">
//               Keep going! Unlock your next badge soon.
//             </p>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Progress Section */}
//       <ProgressLine points={userPoints} level={level} progress={progress} />

//       {/* Badges Section */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.4 }}
//         className="mt-10"
//       >
//         <h2 className="text-2xl font-semibold mb-4">Your Badges</h2>
//         <BadgeDisplay badges={badges} />
//       </motion.div>

//       {/* Leaderboard Section */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.5 }}
//         className="mt-10"
//       >
//         <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
//           <Medal className="text-blue-500" /> Leaderboard
//         </h2>
//         <Leaderboard leaderboard={leaderboard} />
//       </motion.div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal } from "lucide-react";
import BadgeDisplay from "./BadgeDisplay";
import ProgressLine from "./ProgressLine";
import Leaderboard from "./Leaderboard";
import { getUserPoints, getLeaderboard } from "../../services/pointsService";

// Reusable components
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-gradient-to-br from-[#1a1a2e] via-[#1a1a3b] to-[#120f3d] shadow-lg rounded-2xl border border-[#3b1fa8]/30 ${className}`}
  >
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Button = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2 rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 transition duration-300 ${className}`}
  >
    {children}
  </button>
);

export default function PointsDashboard({ user }) {
  const [userPoints, setUserPoints] = useState(0);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);

  const fakeData = {
    points: 950,
    badges: [
      {
        id: 1,
        name: "Beginner Explorer",
        description: "Earned 100 points for consistent participation",
        icon: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
      },
      {
        id: 2,
        name: "Active Contributor",
        description: "Earned 500 points for sharing valuable insights",
        icon: "https://cdn-icons-png.flaticon.com/512/2583/2583345.png",
      },
      {
        id: 3,
        name: "Community Star",
        description: "Top 5 in leaderboard for 2 consecutive weeks",
        icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      },
    ],
    leaderboard: [
      { id: "1", name: "Baljeet Kumar Patel", points: 950 },
      { id: "2", name: "Alle Sai Devsaya", points: 720 },
      { id: "3", name: "Kusuma M", points: 610 },
      { id: "4", name: "Haashini", points: 540 },
      { id: "5", name: "Bartika Das", points: 530 },
      { id: "6", name: "Ankit Kashyap", points: 510 },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId || userId === "null" || userId === "undefined") {
        console.warn("⚠️ No userId found in localStorage, using fake data.");
        setUserPoints(fakeData.points);
        setBadges(fakeData.badges);
        setLeaderboard(fakeData.leaderboard);
        setLoading(false);
        return;
        }

        const [pointsRes, leaderboardRes] = await Promise.allSettled([
          getUserPoints(userId),
          getLeaderboard(),
        ]);

        if (pointsRes.status === "fulfilled" && pointsRes.value) {
          setUserPoints(pointsRes.value.totalPoints || fakeData.points);
        } else {
          setUserPoints(fakeData.points);
        }

        if (
          leaderboardRes.status === "fulfilled" &&
          Array.isArray(leaderboardRes.value)
        ) {
          setLeaderboard(
            leaderboardRes.value.length ? leaderboardRes.value : fakeData.leaderboard
          );
        } else {
          setLeaderboard(fakeData.leaderboard);
        }

        setBadges(fakeData.badges);
        setLevel(Math.floor((pointsRes.value?.totalPoints || fakeData.points) / 500) + 1);
      } catch (err) {
        console.error("Error fetching data:", err);
        setUserPoints(fakeData.points);
        setBadges(fakeData.badges);
        setLeaderboard(fakeData.leaderboard);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // ⏱️ Fallback: after 10s, if still loading or no points, show fake data
  const timer = setTimeout(() => {
    setLoading(false);
    if (userPoints === 0) {
      console.warn("⚠️ Timeout: Using fake fallback data after 10s.");
      setUserPoints(fakeData.points);
      setBadges(fakeData.badges);
      setLeaderboard(fakeData.leaderboard);
    }
  }, 10000);

  return () => clearTimeout(timer);
  
  }, []);

  const progress = Math.min((userPoints / 1000) * 100, 100);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-purple-300 text-lg">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-gray-100 p-6 sm:p-10">
      {/* Header */}
      <motion.div
        className="flex flex-wrap items-center justify-between mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-500">
          <Trophy className="text-yellow-400 w-9 h-9" />
          {/* Points & Badges Dashboard */}
        </h1>
        {/* <Button>Redeem Rewards</Button> */}
      </motion.div>

      {/* Points Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="mb-8">
          <CardContent className="text-center">
            <h2 className="text-xl font-semibold text-purple-300 mb-2">
              Total Points
            </h2>
            <motion.p
              className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 drop-shadow-md"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {userPoints}
            </motion.p>
            <p className="text-sm text-gray-400 mt-2">
              Keep going! You’re {1000 - userPoints} points away from your next level.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Progress Section */}
      <ProgressLine points={userPoints} level={level} progress={progress} />

      {/* Badges Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-10"
      >
        <h2 className="text-2xl font-semibold mb-4 text-purple-300">
          Your Badges
        </h2>
        <BadgeDisplay badges={badges} />
      </motion.div>

      {/* Leaderboard Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10"
      >
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-indigo-300">
          <Medal className="text-yellow-400" /> Leaderboard
        </h2>
        <Leaderboard leaderboard={leaderboard} />
      </motion.div>
    </div>
  );
}
