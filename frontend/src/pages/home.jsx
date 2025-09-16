// Home.jsx
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import HeroSection from '../components/homepage/HeroSection';
import ImpactNumbers from '../components/homepage/ImpactNumbers';
import QuickActions from '../components/homepage/QuickActions';
import AIRecommendations from '../components/homepage/AIRecommendations';
import AlumniNetwork from '../components/homepage/AlumniNetwork';
import UpcomingEvents from '../components/homepage/UpcomingEvents';
import DiscoverFeatures from '../components/homepage/Features';
import AIPowersJourney from '../components/homepage/AIPowers';
import CommunitySays from '../components/homepage/CommunitySays';
import Footer from '../components/Footer';

const SIDEBAR_WIDTH = 240;

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex bg-[#111019] min-h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#1A1D26] z-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: SIDEBAR_WIDTH }}
      >
        <Sidebar onLogoClick={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-margin duration-300"
        style={{
          marginLeft: sidebarOpen ? SIDEBAR_WIDTH : 0,
        }}
      >
        <Navbar onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto mt-[60px] px-10 py-5">
          <HeroSection />
          <ImpactNumbers />
          <QuickActions />
          <AIRecommendations />
          <AlumniNetwork />
          <UpcomingEvents />
          <DiscoverFeatures />
          <AIPowersJourney />
          <CommunitySays />
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Home;
