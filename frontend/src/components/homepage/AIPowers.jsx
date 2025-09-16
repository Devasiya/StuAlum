import React from 'react';

const aiFeatures = [
  {
    icon: (
      <svg className="w-7 h-7 text-purple-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="8" cy="7" r="3" />
        <circle cx="16" cy="7" r="3" />
        <path d="M2 21v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2" />
        <path d="M14 21v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2" />
      </svg>
    ),
    title: 'Smart Mentor Matching',
    description: 'Our AI analyzes profiles to connect you with the most relevant mentors for your goals.',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-purple-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M7 8l5 4 5-4" />
      </svg>
    ),
    title: 'AI-Powered Moderation',
    description: 'Ensuring a safe and respectful community environment with intelligent content filtering.',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-purple-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 2v10" />
        <circle cx="12" cy="16" r="6"/>
      </svg>
    ),
    title: 'Personalized Recommendations',
    description: 'Get tailored suggestions for events, forums, and career resources based on your interests.',
  },
];

const AIPowersJourney = () => (
  <section className="py-10 px-4">
    <div className="bg-[#252734] rounded-3xl py-8 px-4 md:px-10 w-full mx-auto max-w-5xl">
      <h2 className="text-3xl font-bold font-cursive text-white text-center mb-8">
        How AI Powers Your Journey
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {aiFeatures.map((feature) => (
          <div
            key={feature.title}
            className="bg-[#191825] rounded-xl shadow flex flex-col items-start px-7 py-8 min-h-[180px]"
          >
            {feature.icon}
            <div className="text-white font-cursive font-bold text-lg mb-2">{feature.title}</div>
            <div className="text-gray-300 text-base">{feature.description}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AIPowersJourney;
