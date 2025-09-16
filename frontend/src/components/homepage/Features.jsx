import React from 'react';

const features = [
  {
    icon: (
      <svg className="w-8 h-8 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="8" cy="7" r="3" />
        <circle cx="16" cy="7" r="3" />
        <path d="M2 21v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2" />
        <path d="M14 21v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2" />
      </svg>
    ),
    title: 'Mentorship',
    description: 'Connect with experienced alumni for personalized guidance and support.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="1" y="7" width="22" height="13" rx="2" />
        <path d="M16 3a4 4 0 0 0-8 0" />
      </svg>
    ),
    title: 'Career Guidance',
    description: 'Access resources, workshops, and direct advice to advance your professional journey.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
      </svg>
    ),
    title: 'Events',
    description: 'Discover and register for exclusive webinars, workshops, and networking events.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M7 8l5 4 5-4" />
      </svg>
    ),
    title: 'Discussion Forums',
    description: 'Engage in vibrant discussions, share insights, and get answers to your questions.',
  },
];

const DiscoverFeatures = () => (
  <section className="px-6 pt-10">
    <h2 className="text-3xl font-bold font-cursive text-white text-center mb-8">
      Discover Our Features
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-center">
      {features.map((feature) => (
        <div key={feature.title} className="bg-[#252734] rounded-xl shadow flex flex-col items-center px-6 py-8 min-w-[210px] text-center">
          {feature.icon}
          <div className="text-white font-cursive font-bold text-lg mb-3">{feature.title}</div>
          <div className="text-gray-300 text-base">{feature.description}</div>
        </div>
      ))}
    </div>
  </section>
);

export default DiscoverFeatures;
