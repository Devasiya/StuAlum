// import React from "react";
// import AiToolCard from "../components/AiTools/AiToolCard";

// const tools = [
//   {
//     id: 1,
//     name: "Text Generator",
//     description:
//       "Generate creative and meaningful text using advanced AI models.",
//     route: "/aitools/text-generator",
//   },
//   {
//     id: 2,
//     name: "Grammar Checker",
//     description:
//       "Check and correct grammar errors instantly with AI-powered suggestions.",
//     route: "/aitools/grammar-checker",
//   },
//   {
//     id: 3,
//     name: "Summarizer",
//     description:
//       "Summarize long articles or essays into concise summaries instantly.",
//     route: "/aitools/summarizer",
//   },
// ];

// export default function Ai() {
//   return (
//     <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-green-100 px-6 py-12">
//       <div className="max-w-6xl mx-auto text-center">
//         <h1 className="text-4xl font-bold text-gray-800 mb-4">
//           AI Tools Dashboard
//         </h1>
//         <p className="text-gray-600 mb-12">
//           Choose an AI tool below to get started.
//         </p>

//         {/* AI Tools Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {tools.map((tool) => (
//             <AiToolCard
//               key={tool.id}
//               title={tool.name}
//               description={tool.description}
//               link={tool.route}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
