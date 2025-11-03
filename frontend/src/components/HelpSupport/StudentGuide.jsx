import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function StudentGuide() {
  const steps = [
    {
      question: "How to create a student account?",
      answer:
        "Students can register using their institute email ID. A verification link will be sent to activate your account.",
    },
    {
      question: "Profile Completion",
      answer: "Fill in your personal details, department, and batch info for a personalized experience.",
    },
    {
      question: "How can i  register in event?",
      answer:
        "After logging in, go to the 'Event' section. You can view, register button.",
    },
    {
      question: "Can I edit my profile details?",
      answer:
        "Yes, navigate to the Profile section to update details like your department, year, and contact info.",
    },
    {
      question: "How do I get notified about new update/event?",
      answer: "You’ll receive in-app and email notifications when admin/Alumni post or update Event/Information.",
    },
    {
      question: "How can I contact support?",
      answer:
        "Go to the 'Help & Support' tab and submit a ticket. Our team will reach out within 24 hours.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-[#150035] text-white rounded-3xl p-8 shadow-2xl border border-purple-800 mt-10">
      <h2 className="text-3xl font-bold mb-6 text-purple-200">
        Student Guide 🎓
      </h2>

      <div className="space-y-4">
        {steps.map((item, index) => (
          <div key={index}>
            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between items-center bg-[#1e004f] hover:bg-[#2b007a] text-left text-white px-5 py-4 rounded-2xl transition-all duration-300 border border-purple-900"
            >
              <span className="font-semibold text-lg">{item.question}</span>
              {openIndex === index ? (
                <ChevronUp className="text-purple-300" />
              ) : (
                <ChevronDown className="text-purple-300" />
              )}
            </button>

            {openIndex === index && (
              <div className="bg-[#230060] border border-purple-800 text-gray-300 p-5 rounded-2xl mt-2">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
