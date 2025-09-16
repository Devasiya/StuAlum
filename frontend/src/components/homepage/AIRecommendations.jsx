import React from 'react';

const recommendations = [
  {
    icon: (
      <svg className="w-7 h-7 text-blue-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="8" cy="7" r="3" />
        <circle cx="16" cy="7" r="3" />
        <path d="M2 21v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2" />
        <path d="M14 21v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2" />
      </svg>
    ),
    title: 'Connect with a Data Science Mentor',
    subtitle: <>
      Based on your profile, we recommend Dr. Anya Sharma<br/>(Head of AI Research).
    </>,
  },
  {
    icon: (
      <svg className="w-7 h-7 text-blue-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M6 8h12" />
        <path d="M6 12h8" />
      </svg>
    ),
    title: 'Join the "AI in Healthcare" Forum',
    subtitle: (
      <>Discover discussions on cutting-edge applications of AI in the medical field.</>
    ),
  },
  {
    icon: (
      <svg className="w-7 h-7 text-blue-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="1" y="7" width="22" height="13" rx="2" />
        <path d="M16 3a4 4 0 0 0-8 0" />
      </svg>
    ),
    title: 'Explore Frontend Developer Roles',
    subtitle: (
      <>Access tailored resources and job postings for frontend development positions.</>
    ),
  },
];

const AIRecommendations = () => (
  <section className="px-8 pt-8">
    <h2 className="text-2xl font-semibold text-white mb-6">AI-Powered Recommendations</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {recommendations.map((rec, idx) => (
        <div
          key={idx}
          className="bg-[#191825] rounded-xl shadow flex flex-row items-start p-6 h-40 min-h-[10rem]"
        >
          {rec.icon}
          <div>
            <div className="text-white font-semibold mb-1">{rec.title}</div>
            <div className="text-gray-300 text-sm leading-snug">{rec.subtitle}</div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default AIRecommendations;
