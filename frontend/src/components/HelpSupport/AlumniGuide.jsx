import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function AlumniGuide() {
  const faq = [
    {
      q: "How can alumni register?",
      a: "Use your old student ID or registered email to activate your alumni account. Verification may take up to 24 hours.",
    },
    {
      q: "Can alumni access student resources?",
      a: "Yes, you’ll have access to limited resources such as events, career guidance, and networking features.",
    },
    {
      q: "How to connect with current students?",
      a: "Join alumni forums or mentorship programs under the 'Community' section.",
    },
    {
      q: "Can alumni update their employment details?",
      a: "Yes. Go to Profile → Career Info → Edit Employment Details.",
    },
  ];

  const [open, setOpen] = useState(null);

  return (
    <div className="bg-[#150035] text-white rounded-3xl p-8 shadow-2xl border border-purple-800 mt-10">
      <h2 className="text-3xl font-bold mb-6 text-purple-200">Alumni Guide 🧑‍🏫</h2>
      {faq.map((item, i) => (
        <div key={i} className="mb-3">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex justify-between items-center bg-[#1e004f] hover:bg-[#2b007a] text-left px-5 py-4 rounded-2xl border border-purple-900"
          >
            <span className="font-semibold text-lg">{item.q}</span>
            {open === i ? (
              <ChevronUp className="text-purple-300" />
            ) : (
              <ChevronDown className="text-purple-300" />
            )}
          </button>
          {open === i && (
            <p className="bg-[#230060] border border-purple-800 text-gray-300 p-5 rounded-2xl mt-2">
              {item.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
