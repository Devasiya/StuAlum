import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Policies() {
  const items = [
    {
      q: "Data Privacy Policy",
      a: "Your data is stored securely with end-to-end encryption and will not be shared without consent.",
    },
    {
      q: "Code of Conduct",
      a: "All users must maintain respectful behavior in discussions, submissions, and feedback channels.",
    },
    {
      q: "Academic Integrity",
      a: "Plagiarism or unauthorized collaboration on assignments is strictly prohibited.",
    },
    {
      q: "Content Usage Policy",
      a: "Resources shared on the portal are for educational use only and may not be redistributed.",
    },
  ];

  const [open, setOpen] = useState(null);

  return (
    <div className="bg-[#150035] text-white rounded-3xl p-8 shadow-2xl border border-purple-800 mt-10">
      <h2 className="text-3xl font-bold mb-6 text-purple-200">Policies & Transparency 📜</h2>
      {items.map((item, i) => (
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
