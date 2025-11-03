import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

export default function FAQsSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "What is StuAlum?",
      a: "EMAMA Terminal is an integrated platform designed for seamless connection and analytics experience.",
    },
    {
      q: "What should I do after creating an account?",
      a: "After creating an account, verify your email and complete your profile to start using the services.",
    },
    { q: "How can I reset my password?", a: "Go to login → Forgot Password → follow the email link." },
    { q: "How do I report an issue?", a: "Use 'Report a Problem' form to describe your issue and attach screenshots." },
    { q: "Can alumni access the portal?", a: "Yes, alumni can log in with their registered email ID." },
    {
      q: "How do I build my first list?",
      a: "Navigate to the Lists tab, click 'Create New List', and add your selected assets or metrics.",
    },
    {
      q: "What is the Analytical Dashboard?",
      a: "The Analytical Dashboard provides real-time metrics, insights, and visualization tools for your data.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-[#150035] text-white rounded-3xl p-8 shadow-2xl border border-purple-800 mt-10">
    <section
      id="faqs"
      className="bg-[#1a083d] text-white py-10 px-6 rounded-2xl shadow-lg"
    >
      <h2 className="text-3xl font-semibold mb-8 text-[#c2a8ff]">FAQs ❓</h2>

      <div className="flex flex-col space-y-3">
        {faqs.map((item, idx) => (
          <div
            key={idx}
            className={`transition-all duration-300 rounded-xl border border-[#3b2170] hover:border-[#7b5cff] overflow-hidden ${
              openIndex === idx ? "bg-[#2a1558]" : "bg-[#1e0e46]"
            }`}
          >
            <button
              onClick={() => toggleFAQ(idx)}
              className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
            >
              <span className="font-medium text-lg">{item.q}</span>
              <ChevronRight
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                  openIndex === idx ? "rotate-90 text-[#a78bfa]" : ""
                }`}
              />
            </button>

            {openIndex === idx && (
              <div className="px-4 pb-4 text-gray-300 text-sm transition-all duration-300">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
    </div>
  );
}
