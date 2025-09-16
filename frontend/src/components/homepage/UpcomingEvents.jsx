import React from 'react';

const events = [
  {
    title: 'AI in Industry: Future Trends',
    date: 'October 26, 2024 - 2:00 PM EST',
    description: 'Join leading experts to explore the latest advancements and trends in AI for industry.',
    image: 'https://images.unsplash.com/photo-1468600201329-4c58262ce0ad?auto=format&fit=crop&w=400&q=80', // Replace with your event image URL
    link: '#',
  },
  {
    title: 'Resume & Interview Workshop',
    date: 'November 10, 2024 - 10:00 AM PST',
    description: 'Master the art of crafting a compelling resume and acing your next job interview.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80', // Replace with your event image URL
    link: '#',
  },
  {
    title: 'Networking Mixer: Tech & Finance',
    date: 'December 5, 2024 - 6:30 PM GMT',
    description: 'Connect with alumni working in the tech and finance sectors. Expand your professional network.',
    image: 'https://images.unsplash.com/photo-1485218129697-190e7b6a3afb?auto=format&fit=crop&w=400&q=80', // Replace with your event image URL
    link: '#',
  },
];

const UpcomingEvents = () => (
  <section className="px-4 py-10">
    <div className="bg-[#252734] rounded-3xl py-8 px-4 md:px-10 w-full mx-auto max-w-6xl">
      <h2 className="text-3xl font-bold font-cursive text-white text-center mb-8">
        Upcoming Events
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {events.map((event) => (
          <div key={event.title} className="bg-[#191825] rounded-xl shadow flex flex-col overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-36 object-cover"
            />
            <div className="p-6 flex flex-col flex-1">
              <div className="text-white font-cursive font-bold text-lg mb-2">{event.title}</div>
              <div className="text-gray-300 text-sm mb-2">{event.date}</div>
              <div className="text-gray-400 text-sm flex-1 mb-4">{event.description}</div>
              <a
                href={event.link}
                className="inline-block mt-auto bg-purple-700 hover:bg-purple-800 text-white text-center rounded-lg px-6 py-2 font-semibold transition"
              >
                Register Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default UpcomingEvents;
