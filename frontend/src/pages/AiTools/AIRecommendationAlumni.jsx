

// import { useState } from "react";
// import axios from "axios";

// export default function Recommendation() {
//   const [form, setForm] = useState({
//     branch: "",
//     skills: "",
//     career_goals: "",
//     mentorship_area: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [results, setResults] = useState([]);

//   // 🧹 Clean and normalize input
//   const cleanInput = (text) => text.trim().toLowerCase();

//   const handleSubmit = async () => {
//     if (!form.branch || !form.skills || !form.career_goals) {
//       alert("Please fill all required fields.");
//       return;
//     }

//     setLoading(true);
//     setResults([]);

//     try {
//       const res = await axios.post("http://localhost:5000/api/recommendations/generate", {
//         manualData: {
//           branch: cleanInput(form.branch),
//           skills: form.skills.split(",").map((s) => cleanInput(s)),
//           career_goals: cleanInput(form.career_goals),
//           mentorship_area: cleanInput(form.mentorship_area),
//         },
//       });
//       setResults(res.data.recommendations || []);
//     } catch (err) {
//       console.error("❌ API Error:", err);
//       alert("Error generating recommendations. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#0f001a] to-[#2a014f] py-12 px-4 flex justify-center">
//       <div className="w-full max-w-6xl bg-[#20003a]/80 backdrop-blur-lg p-10 rounded-2xl shadow-[0_0_40px_rgba(155,92,255,0.3)] border border-[#7b1fa2]/30">
//         {/* Header */}
//         <h1 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-[#b95cff] to-[#7b1fa2] bg-clip-text text-transparent">
//           🎓 AI Alumni Recommendation Engine
//         </h1>

//         {/* Form Section */}
//         <div className="md:flex md:gap-10">
//           <div className="md:w-1/2 sticky top-10 self-start space-y-4">
//             <input
//               className="w-full p-3 bg-[#2a014f]/50 border border-[#8e24aa]/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9b5cff]"
//               placeholder="Branch (e.g., CSE)"
//               value={form.branch}
//               onChange={(e) => setForm({ ...form, branch: e.target.value })}
//             />
//             <input
//               className="w-full p-3 bg-[#2a014f]/50 border border-[#8e24aa]/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9b5cff]"
//               placeholder="Skills (e.g., React, Python, ML, Data Science)"
//               value={form.skills}
//               onChange={(e) => setForm({ ...form, skills: e.target.value })}
//             />
//             <input
//               className="w-full p-3 bg-[#2a014f]/50 border border-[#8e24aa]/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9b5cff]"
//               placeholder="Career Goals (e.g., Software Engineer)"
//               value={form.career_goals}
//               onChange={(e) => setForm({ ...form, career_goals: e.target.value })}
//             />
//             <input
//               className="w-full p-3 bg-[#2a014f]/50 border border-[#8e24aa]/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9b5cff]"
//               placeholder="Mentorship Area (e.g., Interview Preparation)"
//               value={form.mentorship_area}
//               onChange={(e) => setForm({ ...form, mentorship_area: e.target.value })}
//             />
//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className={`w-full py-3 mt-4 text-lg font-semibold rounded-lg transition-all ${
//                 loading
//                   ? "bg-gray-600 cursor-not-allowed"
//                   : "bg-gradient-to-r from-[#9b5cff] to-[#7b1fa2] hover:from-[#b95cff] hover:to-[#8e24aa] text-white shadow-[0_0_20px_rgba(155,92,255,0.4)]"
//               }`}
//             >
//               {loading ? "Generating Recommendations..." : "Generate Recommendations"}
//             </button>
//           </div>

//           {/* Results Section */}
//           <div className="md:w-1/2 mt-10 md:mt-0">
//             <h2 className="text-2xl font-semibold text-center mb-6 text-[#e0b3ff]">
//               💡 AI Suggested Alumni
//             </h2>

//             {loading && (
//               <p className="text-center text-purple-300 animate-pulse">
//                 ⏳ Analyzing data and finding the best alumni for you...
//               </p>
//             )}

//             {!loading && results.length > 0 && (
//               <div className="space-y-6">
//                 {results.map((r, i) => (
//                   <div
//                     key={i}
//                     className="bg-[#2b0055]/80 border border-[#7b1fa2]/40 p-6 rounded-2xl shadow-[0_0_25px_rgba(155,92,255,0.3)] hover:shadow-[0_0_35px_rgba(155,92,255,0.5)] transition-all duration-300"
//                   >
//                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
//                       <div>
//                         <h3 className="text-xl font-bold text-white">{r.name}</h3>
//                         <p className="text-gray-300 text-sm">
//                           Company: <span className="text-[#d1a3ff]">{r.company}</span>
//                         </p>
//                         <p className="text-gray-400 text-sm">
//                           Experience:{" "}
//                           <span className="text-[#c084fc]">{r.experience} years</span>
//                         </p>
//                       </div>
//                       <div className="mt-3 sm:mt-0">
//                         <span className="px-3 py-1 bg-[#9b5cff]/20 border border-[#9b5cff]/40 rounded-full text-sm text-purple-200">
//                           Match Score: {(r.hybrid_score * 100).toFixed(1)}%
//                         </span>
//                       </div>
//                     </div>
//                     <p className="mt-2 text-sm text-gray-300 italic leading-relaxed">
//                       “{r.reason || "Strong match based on experience and skills."}”
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {!loading && results.length === 0 && (
//               <p className="text-center text-gray-400 mt-6">
//                 No recommendations yet. Fill in your details and click{" "}
//                 <span className="text-[#b95cff] font-medium">Generate Recommendations</span>.
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import axios from "axios";

export default function Recommendation() {
  const [form, setForm] = useState({
    branch: "",
    skills: "",
    career_goals: "",
    mentorship_area: "",
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("manual"); // "auto" | "manual"
  const [studentId, setStudentId] = useState(null);

  // 🧠 Auto-detect logged-in student (use session or JWT logic)
  useEffect(() => {
    const storedStudent = localStorage.getItem("studentId");
    if (storedStudent) {
      setStudentId(storedStudent);
      setMode("auto");
      fetchAutoRecommendations(storedStudent);
    }
  }, []);

  // 🧩 Clean text input for manual entry
  const cleanInput = (text) => text.trim().toLowerCase();

  // ✅ Auto Fetch for Logged-In Students
  const fetchAutoRecommendations = async (id) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/recommendations/generate", {
        studentId: id,
      });
      setResults(res.data.recommendations || []);
    } catch (err) {
      console.error("❌ Auto Fetch Error:", err);
      alert("Error fetching AI recommendations for your profile.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Manual Recommendation (existing behavior)
  const handleManualSubmit = async () => {
    if (!form.branch || !form.skills || !form.career_goals) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const res = await axios.post("http://localhost:5000/api/recommendations/generate", {
        manualData: {
          branch: cleanInput(form.branch),
          skills: form.skills.split(",").map((s) => cleanInput(s)),
          career_goals: cleanInput(form.career_goals),
          mentorship_area: cleanInput(form.mentorship_area),
        },
      });
      setResults(res.data.recommendations || []);
    } catch (err) {
      console.error("❌ Manual API Error:", err);
      alert("Error generating manual recommendations.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Switch Modes (Manual / Auto)
  const handleSwitchMode = () => {
    if (mode === "auto") {
      setMode("manual");
      setResults([]);
    } else {
      if (!studentId) return alert("No student profile found. Please log in first.");
      setMode("auto");
      fetchAutoRecommendations(studentId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f001a] to-[#2a014f] py-12 px-4 flex justify-center">
      <div className="w-full max-w-6xl bg-[#20003a]/80 backdrop-blur-lg p-10 rounded-2xl shadow-[0_0_40px_rgba(155,92,255,0.3)] border border-[#7b1fa2]/30">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#b95cff] to-[#7b1fa2] bg-clip-text text-transparent">
            🎓 AI Alumni Recommendation Engine
          </h1>

          {/* Mode Toggle */}
          <button
            onClick={handleSwitchMode}
            className="text-sm px-4 py-2 bg-[#8e24aa]/30 border border-[#b95cff]/40 rounded-lg text-[#e0b3ff] hover:bg-[#9b5cff]/40 transition"
          >
            {mode === "auto" ? "Switch to Manual Mode" : "Use My Profile"}
          </button>
        </div>

        {/* Form + Results */}
        <div className="md:flex md:gap-10">
          {/* 🧾 Left Section (Form or Auto Info) */}
          <div className="md:w-1/2 sticky top-10 self-start space-y-4">
            {mode === "manual" ? (
              <>
                <input
                  className="w-full p-3 bg-[#2a014f]/50 border border-[#8e24aa]/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9b5cff]"
                  placeholder="Branch (e.g., CSE)"
                  value={form.branch}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}
                />
                <input
                  className="w-full p-3 bg-[#2a014f]/50 border border-[#8e24aa]/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9b5cff]"
                  placeholder="Skills (e.g., React, Python, ML, Data Science)"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                />
                <input
                  className="w-full p-3 bg-[#2a014f]/50 border border-[#8e24aa]/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9b5cff]"
                  placeholder="Career Goals (e.g., Software Engineer)"
                  value={form.career_goals}
                  onChange={(e) => setForm({ ...form, career_goals: e.target.value })}
                />
                <input
                  className="w-full p-3 bg-[#2a014f]/50 border border-[#8e24aa]/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9b5cff]"
                  placeholder="Mentorship Area (e.g., Interview Preparation)"
                  value={form.mentorship_area}
                  onChange={(e) => setForm({ ...form, mentorship_area: e.target.value })}
                />
                <button
                  onClick={handleManualSubmit}
                  disabled={loading}
                  className={`w-full py-3 mt-4 text-lg font-semibold rounded-lg transition-all ${
                    loading
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#9b5cff] to-[#7b1fa2] hover:from-[#b95cff] hover:to-[#8e24aa] text-white shadow-[0_0_20px_rgba(155,92,255,0.4)]"
                  }`}
                >
                  {loading ? "Generating..." : "Generate Recommendations"}
                </button>
              </>
            ) : (
              <div className="text-gray-300 bg-[#2a014f]/30 p-6 rounded-xl border border-[#9b5cff]/30 shadow-inner">
                <p className="text-lg font-semibold text-[#d1a3ff] mb-3">
                  Auto Mode: Using Your Profile
                </p>
                <p className="text-sm text-gray-400">
                  Your profile data is automatically analyzed to recommend the most relevant alumni.
                </p>
                <button
                  onClick={() => fetchAutoRecommendations(studentId)}
                  disabled={loading}
                  className="mt-5 w-full py-2 bg-gradient-to-r from-[#b95cff] to-[#7b1fa2] text-white rounded-lg font-semibold hover:from-[#c77dff] hover:to-[#8e24aa] transition-all"
                >
                  {loading ? "Analyzing..." : "Recalculate Recommendations"}
                </button>
              </div>
            )}
          </div>

          {/* 🎯 Right Section (Results) */}
          <div className="md:w-1/2 mt-10 md:mt-0">
            <h2 className="text-2xl font-semibold text-center mb-6 text-[#e0b3ff]">
              💡 AI Suggested Alumni
            </h2>

            {loading && (
              <p className="text-center text-purple-300 animate-pulse">
                ⏳ Analyzing and matching your profile...
              </p>
            )}

            {!loading && results.length > 0 && (
              <div className="space-y-6">
                {results.map((r, i) => (
                  <div
                    key={i}
                    className="bg-[#2b0055]/80 border border-[#7b1fa2]/40 p-6 rounded-2xl shadow-[0_0_25px_rgba(155,92,255,0.3)] hover:shadow-[0_0_35px_rgba(155,92,255,0.5)] transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-white">{r.name}</h3>
                        <p className="text-gray-300 text-sm">
                          Company: <span className="text-[#d1a3ff]">{r.company}</span>
                        </p>
                        <p className="text-gray-400 text-sm">
                          Experience:{" "}
                          <span className="text-[#c084fc]">{r.experience} years</span>
                        </p>
                      </div>
                      <div className="mt-3 sm:mt-0">
                        <span className="px-3 py-1 bg-[#9b5cff]/20 border border-[#9b5cff]/40 rounded-full text-sm text-purple-200">
                          Match Score: {(r.hybrid_score * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-300 italic leading-relaxed">
                      “{r.reason || "Strong match based on skills and branch."}”
                    </p>
                  </div>
                ))}
              </div>
            )}

            {!loading && results.length === 0 && (
              <p className="text-center text-gray-400 mt-6">
                No recommendations yet. Fill in your details or use your profile to start.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
