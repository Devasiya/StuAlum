
// import React from "react";
// import PointsDashboard from "../components/PointsSystem/PointsDashboard";
// import { motion } from "framer-motion";
// import { Sparkles } from "lucide-react";
// import Navbar from "../components/Navbar";

// export default function PointsPage({ onSidebarToggle }) {
//   const fakeUser = {
//     name: "Baljeet Kumar Patel",
//     email: "1by23cs277@bmsit.in",
//     points: 1200,
//   };

//   return (
//     <>
//       <Navbar onSidebarToggle={onSidebarToggle} />
//       <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#121232] to-[#060612] text-gray-100 p-6 sm:p-10 mt-20 sm:mt-15">
//         {/* ↑ Added pt-24 to push content below navbar */}

//         {/* Header Section */}
//         <motion.div
//           className="text-center mb-10"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <h1 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 drop-shadow-lg">
//             🎯 Reward Points Dashboard
//           </h1>
//           <div className="flex justify-center items-center gap-2 text-purple-400">
//             <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
//             <p className="text-sm tracking-wide">
//               Track your achievements, unlock badges, and rise to the top!
//             </p>
//           </div>
//         </motion.div>

//         {/* Dashboard Component */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3, duration: 0.7 }}
//         >
//           <PointsDashboard user={fakeUser} />
//         </motion.div>
//       </div>
//     </>
//   );
// }


// import React, { useEffect, useState } from "react";
// import PointsDashboard from "../components/PointsSystem/PointsDashboard";
// import { motion } from "framer-motion";
// import { Sparkles } from "lucide-react";
// import Navbar from "../components/Navbar";

// export default function PointsPage({ onSidebarToggle }) {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // Example: Fetch logged-in user from localStorage or API
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     if (storedUser) {
//       setUser(storedUser);
//     } else {
//       // Optionally fetch from backend if not in localStorage
//       fetch("http://localhost:5000/api/auth/me", { credentials: "include" })
//         .then((res) => res.json())
//         .then((data) => setUser(data.user))
//         .catch(() => console.warn("Failed to fetch user"));
//     }
//   }, []);

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a] text-gray-300">
//         Loading your points...
//       </div>
//     );
//   }

//   return (
//     <>
//       <Navbar onSidebarToggle={onSidebarToggle} />
//       <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#121232] to-[#060612] text-gray-100 p-6 sm:p-10">
//         {/* Header Section */}
//         <motion.div
//           className="text-center mb-10 mt-24"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <h1 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 drop-shadow-lg">
//             🎯 Reward Points Dashboard
//           </h1>
//           <div className="flex justify-center items-center gap-2 text-purple-400">
//             <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
//             <p className="text-sm tracking-wide">
//               Track your achievements, unlock badges, and rise to the top!
//             </p>
//           </div>
//         </motion.div>

//         {/* Dashboard Component */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3, duration: 0.7 }}
//         >
//           <PointsDashboard user={user} />
//         </motion.div>
//       </div>
//     </>
//   );
// }


import React, { useEffect, useState } from "react";
import PointsDashboard from "../components/PointsSystem/PointsDashboard";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";

export default function PointsPage({ onSidebarToggle }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fake user fallback
  const fakeUser = {
    name: "John Doe",
    email: "john@example.com",
    points: 1200,
  };

  useEffect(() => {
    let isMounted = true;
    let fallbackTimer;

    // ⏱️ Set 10-second timer for fallback
    fallbackTimer = setTimeout(() => {
      if (isMounted && !user) {
        console.warn("⚠️ Real user data not loaded in 10s — using fake data.");
        setUser(fakeUser);
        setLoading(false);
      }
    }, 10000);

    // 🧩 Simulate real API call
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/me?userId=671c1c5f4b1e4c89ab4e66d1&role=student"
        );
        const data = await response.json();

        if (isMounted && data && data.user) {
          setUser(data.user);
        } else {
          console.warn("No valid user data, using fallback.");
          setUser(fakeUser);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (isMounted) setUser(fakeUser);
      } finally {
        if (isMounted) setLoading(false);
        clearTimeout(fallbackTimer);
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <>
      <Navbar onSidebarToggle={onSidebarToggle} />
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#121232] to-[#060612] text-gray-100 p-6 sm:p-10">
        {/* Header Section */}
        <motion.div
          className="text-center mb-10 mt-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 drop-shadow-lg">
            🎯 Reward Points Dashboard
          </h1>
          <div className="flex justify-center items-center gap-2 text-purple-400">
            <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
            <p className="text-sm tracking-wide">
              Track your achievements, unlock badges, and rise to the top!
            </p>
          </div>
        </motion.div>

        {/* Dashboard Component */}
        {loading ? (
          <p className="text-center text-gray-400 mt-10">Loading your points...</p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <PointsDashboard user={user} />
          </motion.div>
        )}
      </div>
    </>
  );
}
