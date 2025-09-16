import React from 'react';

const actions = [
  {
    label: 'Post in Forum',
    icon: (
      <svg className="w-8 h-8 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M6 8h12" />
        <path d="M6 12h8" />
      </svg>
    ),
  },
  {
    label: 'Request Mentorship',
    icon: (
      <svg className="w-8 h-8 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="8" cy="7" r="3" />
        <circle cx="16" cy="7" r="3" />
        <path d="M2 21v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2" />
        <path d="M14 21v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2" />
      </svg>
    ),
  },
  {
    label: 'View Events',
    icon: (
      <svg className="w-8 h-8 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
      </svg>
    ),
  },
  {
    label: 'Alumni Directory',
    icon: (
      <svg className="w-8 h-8 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="7" r="4" />
        <path d="M2 21v-2a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7v2" />
      </svg>
    ),
  },
];

const QuickActions = () => (
  <section className="px-8 pt-8">
    <h2 className="text-2xl font-semibold text-white mb-6">Quick Actions</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {actions.map((action) => (
        <button
          key={action.label}
          className="bg-[#191825] rounded-xl shadow flex flex-col items-center justify-center h-32 cursor-pointer transition-colors duration-200 hover:bg-[#22203a] focus:outline-none"
        >
          {action.icon}
          <span className="text-white font-semibold">{action.label}</span>
        </button>
      ))}
    </div>
  </section>
);

export default QuickActions;
