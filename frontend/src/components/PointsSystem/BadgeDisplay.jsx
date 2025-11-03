// import React from "react";
// export default function BadgeDisplay({ badges = [] }) {
//   return (
//     <div className="flex flex-wrap gap-4 justify-center mt-4">
//       {badges.length === 0 ? (
//         <p className="text-gray-500 text-sm">No badges earned yet.</p>
//       ) : (
//         badges.map((badge, i) => (
//           <div
//             key={i}
//             className="flex flex-col items-center bg-white shadow-md rounded-2xl p-3 w-28 hover:scale-105 transition-transform"
//           >
//             <img
//               src={badge.icon || "/badges/default.png"}
//               alt={badge.name}
//               className="w-12 h-12 mb-2"
//             />
//             <p className="text-xs font-semibold text-gray-700 text-center">
//               {badge.name}
//             </p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }


import React from "react";
import { motion } from "framer-motion";

export default function BadgeDisplay({ badges = [] }) {
  if (!badges.length)
    return <p className="text-gray-400 text-center">No badges earned yet.</p>;

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
      {badges.map((badge, index) => (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gradient-to-br from-[#151530] via-[#1c1c44] to-[#0f0f25] rounded-2xl p-5 shadow-lg border border-purple-700/40 hover:border-purple-400/70 transition"
        >
          <div className="flex flex-col items-center text-center">
            <img
              src={badge.icon}
              alt={badge.name}
              className="w-16 h-16 mb-3 drop-shadow-lg"
            />
            <h3 className="text-lg font-semibold text-purple-300">
              {badge.name}
            </h3>
            <p className="text-gray-400 text-sm mt-2">{badge.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
