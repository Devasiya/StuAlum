import React from "react";
import { useNavigate } from "react-router-dom";

export default function AiToolCard({ title, description, link }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-transform transform hover:-translate-y-2 hover:shadow-xl"
      onClick={() => navigate(link)}
    >
      <h2 className="text-2xl font-semibold text-indigo-600 mb-3">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition">
        Open Tool
      </button>
    </div>
  );
}
