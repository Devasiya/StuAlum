import React from 'react';

const alumni = [
  {
    name: 'Dr. Anya Sharma',
    title: 'Head of AI Research, Tech Innovations',
    skills: ['AI Development', 'Machine Learning', 'Leadership', 'Data Science'],
    image: '/Anya-Sharma-Web-Profile.webp',
  },
  {
    name: 'Mr. David Lee',
    title: 'Senior Software Engineer, Google',
    skills: ['Frontend Development', 'React', 'Cloud Computing', 'UI/UX'],
    image: '/Mr. David Lee.webp',
  },
  {
    name: 'Ms. Emily Chen',
    title: 'Product Manager, Microsoft',
    skills: ['Product Strategy', 'Market Analysis', 'Agile Methodologies', 'Leadership'],
    image: '/Ms. Emily Chen.png',
  },
  {
    name: 'Mr. Mark Johnson',
    title: 'Founder & CEO, InnovateX',
    skills: ['Entrepreneurship', 'Venture Capital', 'Business Development', 'Strategy'],
    image: '/Mr. Mark Johnson.png',
  },
];

const AlumniNetwork = () => (
  <section className="px-6 pt-10">
    <h2 className="text-3xl font-bold text-white text-center mb-6 font-cursive">
      Connect with Our Alumni Network
    </h2>
    <div className="flex justify-center mb-6">
      <input
        type="text"
        placeholder="Search by skill, industry, or location..."
        className="bg-[#252734] text-white px-4 py-2 rounded-lg w-[260px] mr-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
      />
      <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold text-white text-sm transition">
        <svg className="w-4 h-4" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" stroke="currentColor" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" />
        </svg>
        Search
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-center">
      {alumni.map((alum) => (
        <div
          key={alum.name}
          className="bg-[#252734] rounded-xl shadow flex flex-col items-center px-6 py-6 min-w-[220px]"
        >
          <img
            src={alum.image}
            alt={alum.name}
            className="rounded-full mb-4 w-20 h-20 object-cover border-2 border-[#191825]"
          />
          <div className="text-white font-cursive text-xl font-bold mb-2 text-center">{alum.name}</div>
          <div className="text-gray-400 mb-3 text-sm text-center">{alum.title}</div>
          <div className="flex flex-wrap gap-2 justify-center">
            {alum.skills.map((skill) => (
              <span
                key={skill}
                className="bg-[#191825] px-3 py-1 rounded text-sm font-semibold text-gray-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default AlumniNetwork;
