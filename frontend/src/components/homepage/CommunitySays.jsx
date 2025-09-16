import React from 'react';

const testimonials = [
  {
    text: `The mentorship program completely transformed my career path. I found invaluable guidance and a true advocate in my alumni mentor.`,
    name: 'Aisha Rahman',
    title: 'Software Developer, Oracle',
    image: 'https://randomuser.me/api/portraits/women/44.jpg', // Replace as needed
  },
  {
    text: `Attending the alumni events opened so many doors. I landed my dream job after meeting a recruiter at one of the networking mixers.`,
    name: 'Ben Carter',
    title: 'Financial Analyst, J.P. Morgan',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    text: `The career guidance resources are top-notch. From resume reviews to interview prep, I felt fully prepared and supported.`,
    name: 'Chloe Dupont',
    title: 'Marketing Specialist, Adobe',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    text: `The forums are a goldmine of information and peer support. It's incredible to connect with alumni who've walked the same path.`,
    name: `Liam O'Connell`,
    title: 'Data Scientist, IBM',
    image: 'https://randomuser.me/api/portraits/men/40.jpg',
  },
];

const CommunitySays = () => (
  <section className="px-6 pt-10">
    <h2 className="text-3xl font-bold font-cursive text-white text-center mb-8">
      What Our Community Says
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-center">
      {testimonials.map((t) => (
        <div key={t.name} className="bg-[#252734] rounded-xl shadow flex flex-col items-center px-6 py-8 min-w-[210px] text-center">
          <blockquote className="text-white italic mb-6">&quot;{t.text}&quot;</blockquote>
          <img
            src={t.image}
            alt={t.name}
            className="rounded-full mb-2 w-12 h-12 object-cover border-2 border-[#191825]"
          />
          <div className="text-white font-bold">{t.name}</div>
          <div className="text-gray-400 text-sm">{t.title}</div>
        </div>
      ))}
    </div>
  </section>
);

export default CommunitySays;
