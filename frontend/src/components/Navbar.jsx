import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SIDEBAR_WIDTH = 240;

const Navbar = ({ onSidebarToggle, sidebarOpen }) => {
  const [showSignupDropdown, setShowSignupDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleSignupClick = () => {
    setShowSignupDropdown((prev) => !prev);
  };

  const handleSignupOptionClick = (role) => {
    setShowSignupDropdown(false);
    navigate(`/signup/${role.toLowerCase()}`);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSignupDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 z-40 flex items-center h-[60px] bg-[#111019] border-b border-[#23232b] px-6 transition-all duration-300"
      style={{
        width: sidebarOpen ? `calc(100% - ${SIDEBAR_WIDTH}px)` : '100%',
        marginLeft: sidebarOpen ? SIDEBAR_WIDTH : 0,
      }}
    >
      <button
        onClick={onSidebarToggle}
        aria-label={sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
        className="mr-4 text-white focus:outline-none"
      >
        {sidebarOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      <div className="flex-1 flex items-center">
        <input
          type="text"
          placeholder="Search alumni, events, discuss"
          className="w-80 py-2 px-4 rounded-md bg-[#23232b] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
        />
      </div>

      <div className="hidden md:flex items-center space-x-8 text-white ml-12 text-sm">
        <span className="cursor-pointer hover:text-purple-400 transition">Language</span>
        <span className="cursor-pointer hover:text-purple-400 transition">Notifications</span>
        <span className="cursor-pointer hover:text-purple-400 transition">Chat</span>
      </div>

      <div className="flex items-center space-x-4 ml-8 relative" ref={dropdownRef}>
        <button
          onClick={handleSignupClick}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md font-semibold transition relative"
        >
          Signup
        </button>
        {showSignupDropdown && (
          <div className="absolute right-0 mt-25 w-40 bg-[#23232b] rounded-md shadow-lg text-white text-sm z-50">
            <button
              className="block w-full text-left px-4 py-2 hover:bg-purple-600 transition"
              onClick={() => handleSignupOptionClick('Student')}
            >
              Student
            </button>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-purple-600 transition"
              onClick={() => handleSignupOptionClick('Alumni')}
            >
              Alumni
            </button>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-purple-600 transition"
              onClick={() => handleSignupOptionClick('Admin')}
            >
              Admin
            </button>
          </div>
        )}
        <button
          onClick={handleLoginClick}
          className="bg-[#2d223f] hover:bg-[#3b2e58] text-white px-5 py-2 rounded-md font-semibold transition"
        >
          login
        </button>
        <div className="w-9 h-9 rounded-full bg-gray-400" />
      </div>
    </header>
  );
};

export default Navbar;