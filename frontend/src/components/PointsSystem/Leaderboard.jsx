// import React from "react";

// export default function Leaderboard({ leaderboard }) {
//   return (
//     <div className="mt-8 bg-white rounded-2xl shadow-md p-5">
//       <h2 className="text-lg font-bold text-center mb-4">🏆 Leaderboard</h2>
//       <table className="w-full text-sm text-gray-600">
//         <thead>
//           <tr className="text-left border-b">
//             <th className="py-2">Rank</th>
//             <th className="py-2">User</th>
//             <th className="py-2 text-right">Points</th>
//           </tr>
//         </thead>
//         <tbody>
//           {leaderboard.map((user, i) => (
//             <tr
//               key={i}
//               className="border-b hover:bg-gray-50 transition"
//             >
//               <td className="py-2">{i + 1}</td>
//               <td className="py-2">{user.name}</td>
//               <td className="py-2 text-right font-semibold">{user.points}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import React from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";

export default function Leaderboard({ leaderboard = [] }) {
  if (!leaderboard.length)
    return <p className="text-gray-400 text-center">No leaderboard data available.</p>;

  return (
    <div className="overflow-x-auto rounded-2xl border border-purple-700/40 shadow-lg bg-gradient-to-br from-[#151530] via-[#1b1b3d] to-[#0f0f25]">
      <table className="min-w-full text-left text-gray-200">
        <thead>
          <tr className="bg-[#1a1a3b]/60 text-purple-300">
            <th className="py-3 px-4">Rank</th>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4 text-right">Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border-t border-purple-800/30 hover:bg-[#2a2a55]/40 transition`}
            >
              <td className="py-3 px-4 font-medium flex items-center gap-2">
                {index === 0 && (
                  <Crown className="text-yellow-400 w-5 h-5 drop-shadow-md" />
                )}
                <span className={`${index === 0 ? "text-yellow-400 font-bold" : ""}`}>
                  {index + 1}
                </span>
              </td>
              <td className="py-3 px-4">{user.name}</td>
              <td className="py-3 px-4 text-right text-purple-300 font-semibold">
                {user.points}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

