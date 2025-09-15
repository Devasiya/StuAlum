// App.js

import React from "react";

/* -------- Navbar -------- */
const Navbar = () => (
  <nav className="w-full bg-[#181824] border-b border-[#232138] sticky top-0 z-30">
    <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between h-16">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <span className="text-purple-400 font-extrabold text-2xl tracking-wider">✻ Logo</span>
        <div className="hidden md:flex space-x-6 text-white text-sm font-medium">
          <NavItem label="Dashboard" />
          <NavItem label="Forums" />
          <NavItem label="Mentorship" />
          <NavItem label="Career Guidance" />
          <NavItem label="Events" />
          <NavItem label="Alumni Directory" />
          <NavItem label="Student Directory" />
        </div>
      </div>
      {/* Menu Actions */}
      <div className="flex space-x-4 items-center">
        <button className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 px-4 py-1 text-white rounded-lg font-semibold text-sm transition">Signup</button>
        <button className="border border-purple-500 px-3 py-1 rounded-lg text-sm text-purple-300 hover:bg-purple-800 transition">Login</button>
        <span className="ml-2 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
          {/* Placeholder avatar icon */}
          <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="8" r="4" /><path d="M6 20v-2a6 6 0 1112 0v2"></path></svg>
        </span>
      </div>
    </div>
  </nav>
);
const NavItem = ({ label }) => (
  <span className="hover:text-purple-300 cursor-pointer transition">{label}</span>
);

/* -------- Hero Section -------- */
const Hero = () => (
  <section className="bg-[#231647] rounded-2xl shadow-lg mt-8 px-8 py-10 flex flex-col md:flex-row gap-7 items-center justify-between">
    <div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Connect.<br/>Learn.<br/>Grow.</h1>
      <p className="text-purple-200 font-medium text-lg mb-6">AI-powered Alumni–Student Networking Platform</p>
      <div className="flex gap-4">
        <button className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-5 py-2 rounded-lg hover:from-purple-600 hover:to-purple-800 font-semibold shadow transition">Find a Mentor</button>
        <button className="bg-[#232138] border border-purple-400 text-purple-200 px-5 py-2 rounded-lg hover:bg-purple-900 font-semibold transition">Explore Alumni</button>
      </div>
    </div>
    <img
      src="https://via.placeholder.com/280x160.png?text=Hero+Image"
      alt="Hero"
      className="rounded-2xl object-cover shadow-md"
    />
  </section>
);

/* -------- Stats Section -------- */
const Stats = () => (
  <section className="mt-14">
    <h2 className="text-center text-2xl font-bold font-[cursive] mb-7 text-white">Our Impact in Numbers</h2>
    <div className="flex flex-wrap gap-8 justify-center">
      <StatCard number="12,500" label="Registered Alumni" />
      <StatCard number="4,800" label="Active Mentorships" />
      <StatCard number="320" label="Events Hosted" />
      <StatCard number="18,700" label="Forum Discussions" />
    </div>
  </section>
);
const StatCard = ({ number, label }) => (
  <div className="bg-[#231647] px-10 py-8 rounded-2xl shadow flex flex-col items-center hover:scale-105 transition">
    <span className="text-purple-300 text-3xl font-bold mb-1">{number}</span>
    <span className="text-white text-base">{label}</span>
  </div>
);

/* -------- Alumni Network Section -------- */
const AlumniNetwork = () => (
  <section className="mt-16">
    <h2 className="text-center text-2xl font-bold font-[cursive] mb-8 text-white">Connect with Our Alumni Network</h2>
    <div className="flex flex-col md:flex-row items-center max-w-xl mx-auto mb-6">
      <input className="flex-1 bg-[#212136] border border-[#413775] px-4 py-2 text-white rounded-l-lg focus:outline-none" placeholder="Search by skill, industry, or location..." />
      <button className="bg-purple-700 rounded-r-lg px-6 py-2 text-white font-semibold hover:bg-purple-800 transition">Search</button>
    </div>
    <div className="flex flex-wrap gap-7 justify-center">
      {Array(4).fill().map((_, idx) => (
        <AlumniCard key={idx} />
      ))}
    </div>
  </section>
);
const AlumniCard = () => (
  <div className="bg-[#201d3a] rounded-2xl shadow-lg px-8 py-6 w-[240px] flex flex-col items-center hover:scale-105 transition">
    <img src="https://via.placeholder.com/64x64.png?text=Photo" alt="Avatar" className="rounded-full mb-4" />
    <span className="text-white font-semibold text-lg text-center">Jane Doe</span>
    <span className="text-sm text-gray-400 text-center mb-2">Senior Developer, Company</span>
    <div className="flex flex-wrap gap-1 justify-center text-xs mt-2">
      <span className="bg-purple-900 text-purple-300 rounded-full px-3 py-1 my-1">Leadership</span>
      <span className="bg-purple-900 text-purple-300 rounded-full px-3 py-1 my-1">Mentoring</span>
      <span className="bg-purple-900 text-purple-300 rounded-full px-3 py-1 my-1">AI/ML</span>
    </div>
  </div>
);

/* -------- Upcoming Events Section -------- */
const UpcomingEvents = () => (
  <section className="mt-16">
    <h2 className="text-center text-2xl font-bold font-[cursive] mb-8 text-white">Upcoming Events</h2>
    <div className="flex flex-wrap gap-7 justify-center">
      {Array(3)
        .fill()
        .map((_, idx) => (
          <EventCard key={idx} />
        ))}
    </div>
  </section>
);
const EventCard = () => (
  <div className="bg-[#231647] rounded-2xl shadow-lg overflow-hidden w-[290px] flex flex-col hover:scale-105 transition">
    <img src="https://via.placeholder.com/320x110.png?text=Event" alt="Event" className="h-28 w-full object-cover" />
    <div className="p-5 flex-1 flex flex-col">
      <span className="text-white font-semibold text-lg mb-1">Sample Event Title</span>
      <span className="text-purple-300 text-sm mb-2 block">Oct. 30, 2025 · 2:00PM</span>
      <p className="text-gray-300 text-sm mb-4">Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor.</p>
      <button className="bg-gradient-to-r from-purple-500 to-purple-700 text-white text-xs px-4 py-2 rounded-md shadow hover:from-purple-600 hover:to-purple-800 mt-auto">Register Now</button>
    </div>
  </div>
);

/* -------- Features Section -------- */
const Features = () => (
  <section className="mt-16">
    <h2 className="text-center text-2xl font-bold font-[cursive] mb-8 text-white">Discover Our Features</h2>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 justify-center">
      <FeatureCard icon="💼" title="Mentorship" desc="Connect with experienced alumni for personalized support." />
      <FeatureCard icon="🎓" title="Career Guidance" desc="Access resources and direct advice for your career journey." />
      <FeatureCard icon="📆" title="Events" desc="Register for webinars and meetings to boost your network." />
      <FeatureCard icon="💬" title="Discussion Forums" desc="Engage in vibrant discussions and share insights." />
    </div>
  </section>
);
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-[#201d3a] rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transition">
    <span className="text-4xl mb-3">{icon}</span>
    <span className="text-white font-semibold text-lg mb-1">{title}</span>
    <span className="text-gray-300 text-sm">{desc}</span>
  </div>
);

/* -------- Journey Section -------- */
const Journey = () => (
  <section className="mt-16">
    <h2 className="text-center text-2xl font-bold font-[cursive] mb-8 text-white">How AI Powers Your Journey</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
      <JourneyCard icon="🤝" title="Smart Mentor Matching" desc="Our AI analyzes profiles to connect you with mentors." />
      <JourneyCard icon="🛡️" title="AI-Powered Moderation" desc="Ensures a safe and respectful community environment." />
      <JourneyCard icon="✨" title="Personalized Recommendations" desc="Get suggestions for events, forums, and more." />
    </div>
  </section>
);
const JourneyCard = ({ icon, title, desc }) => (
  <div className="bg-[#201d3a] rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transition">
    <span className="text-4xl mb-3">{icon}</span>
    <span className="text-white font-semibold text-lg mb-1">{title}</span>
    <span className="text-gray-300 text-sm">{desc}</span>
  </div>
);

/* -------- Community Section -------- */
const Community = () => (
  <section className="mt-16">
    <h2 className="text-center text-2xl font-bold font-[cursive] mb-8 text-white">What Our Community Says</h2>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {Array(4)
        .fill()
        .map((_, idx) => (
          <Testimonial key={idx} />
        ))}
    </div>
  </section>
);
const Testimonial = () => (
  <div className="bg-[#231647] rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
    <img src="https://via.placeholder.com/40x40.png?text=A" alt="Avatar" className="w-9 h-9 rounded-full mb-4" />
    <span className="text-white italic mb-4 font-medium">
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae, officia!"
    </span>
    <span className="text-purple-300 font-bold">Alex Johnson</span>
    <span className="text-xs text-gray-400">Software Developer, Placeholder Co.</span>
  </div>
);

/* -------- Footer -------- */
const Footer = () => (
  <footer className="bg-[#181824] border-t border-[#232138] py-8 px-4 mt-20">
    <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
      <div className="flex flex-col items-center md:items-start">
        <span className="text-purple-400 font-bold text-2xl mb-3">✻ Logo</span>
        <span className="text-gray-400 text-sm mb-3 text-center md:text-left">Fostering connections and learning through an AI-powered alumni-student networking platform.</span>
        <div className="flex space-x-4 text-purple-400">
          <FooterIcon icon="fab fa-facebook-f" />
          <FooterIcon icon="fab fa-twitter" />
          <FooterIcon icon="fab fa-linkedin-in" />
          <FooterIcon icon="fab fa-instagram" />
        </div>
      </div>
      <div className="flex flex-wrap gap-12">
        <div>
          <h4 className="text-white font-semibold mb-2">Company</h4>
          <FooterLink label="About Us" />
          <FooterLink label="Contact" />
          <FooterLink label="Blog" />
          <FooterLink label="Careers" />
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Platform</h4>
          <FooterLink label="Membership" />
          <FooterLink label="Forums" />
          <FooterLink label="Events" />
          <FooterLink label="Career Guidance" />
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Support</h4>
          <FooterLink label="Help Center" />
          <FooterLink label="FAQs" />
          <FooterLink label="Privacy Policy" />
          <FooterLink label="Terms of Service" />
        </div>
      </div>
    </div>
    <hr className="mt-8 border-[#232138]" />
    <div className="text-center text-gray-500 text-xs mt-4">&copy; 2024 AlumniConnect. All rights reserved.</div>
  </footer>
);
const FooterIcon = ({ icon }) => (
  <span className="text-xl hover:text-purple-500 cursor-pointer transition">
    <svg className="w-5 h-5 inline" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9"/></svg>
  </span>
);
const FooterLink = ({ label }) => (
  <div className="text-gray-400 text-sm hover:text-purple-400 cursor-pointer mb-1 transition">{label}</div>
);

/* -------- Page Layout -------- */
const App = () => (
  <div className="bg-[#16161c] min-h-screen text-white font-sans">
    <Navbar />
    <main className="px-2 md:px-6 py-8 max-w-screen-2xl mx-auto">
      <Hero />
      <Stats />
      <AlumniNetwork />
      <UpcomingEvents />
      <Features />
      <Journey />
      <Community />
    </main>
    <Footer />
  </div>
);

export default App;
