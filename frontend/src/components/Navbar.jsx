import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Note: SIDEBAR_WIDTH is no longer needed in Navbar for styling, 
// but is kept here if it's used elsewhere in the file.
const SIDEBAR_WIDTH = 240; 

// The Navbar now only needs the onSidebarToggle prop for the button click
const Navbar = ({ onSidebarToggle }) => {
    const [showSignupDropdown, setShowSignupDropdown] = useState(false);
    const [showLoginDropdown, setShowLoginDropdown] = useState(false);
    const navigate = useNavigate();
    const signupDropdownRef = useRef(null);
    const loginDropdownRef = useRef(null);

    const handleSignupClick = () => {
        setShowSignupDropdown((prev) => !prev);
        setShowLoginDropdown(false);
    };

    const handleSignupOptionClick = (role) => {
        setShowSignupDropdown(false);
        navigate(`/signup/${role.toLowerCase()}`);
    };

    const handleLoginClick = () => {
        setShowLoginDropdown((prev) => !prev);
        setShowSignupDropdown(false);
    };

    const handleLoginOptionClick = (role) => {
        setShowLoginDropdown(false);
        navigate(`/login/${role.toLowerCase()}`);
    };

    // Close dropdowns if click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                (signupDropdownRef.current && !signupDropdownRef.current.contains(event.target)) &&
                (loginDropdownRef.current && !loginDropdownRef.current.contains(event.target))
            ) {
                setShowSignupDropdown(false);
                setShowLoginDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header
            // KEY CHANGE: Removed complex width/marginLeft styles. 
            // The header should be fixed, full width across the top.
            className="fixed top-0 w-full z-40 flex items-center h-[60px] bg-[#111019] border-b border-[#23232b] px-6 transition-all duration-300"
        >
            {/* 1. Sidebar Toggle Button */}
            <button
                // CRITICAL: Calls the function passed down from the HOC to open the sidebar
                onClick={onSidebarToggle} 
                aria-label={'Open Sidebar'} // Simplify aria label since it just opens now
                className="mr-4 text-white focus:outline-none"
            >
                {/* Hamburger Icon SVG */}
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
            </button>

            {/* 2. Search Bar */}
            <div className="flex-1 flex items-center">
                <input
                    type="text"
                    placeholder="Search alumni, events, discuss"
                    className="w-80 py-2 px-4 rounded-md bg-[#23232b] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                />
            </div>

            {/* 3. Right-Side Links */}
            <div className="hidden md:flex items-center space-x-8 text-white ml-12 text-sm">
                <span className="cursor-pointer hover:text-purple-400 transition">Language</span>
                <span className="cursor-pointer hover:text-purple-400 transition">Notifications</span>
                <span className="cursor-pointer hover:text-purple-400 transition">Chat</span>
            </div>

            {/* 4. Auth Dropdowns */}
            <div className="flex items-center space-x-4 ml-8 relative">
                {/* Signup Dropdown */}
                <div ref={signupDropdownRef} className="relative">
                    <button
                        onClick={handleSignupClick}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md font-semibold transition relative"
                    >
                        Signup
                    </button>
                    {showSignupDropdown && (
                        <div className="absolute right-0 mt-10 w-40 bg-[#23232b] rounded-md shadow-lg text-white text-sm z-50">
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
                </div>

                {/* Login Dropdown */}
                <div ref={loginDropdownRef} className="relative">
                    <button
                        onClick={handleLoginClick}
                        className="bg-[#2d223f] hover:bg-[#3b2e58] text-white px-5 py-2 rounded-md font-semibold transition ml-3"
                    >
                        Login
                    </button>
                    {showLoginDropdown && (
                        <div className="absolute right-0 mt-10 w-40 bg-[#23232b] rounded-md shadow-lg text-white text-sm z-50">
                            <button
                                className="block w-full text-left px-4 py-2 hover:bg-purple-600 transition"
                                onClick={() => handleLoginOptionClick('Student')}
                            >
                                Student
                            </button>
                            <button
                                className="block w-full text-left px-4 py-2 hover:bg-purple-600 transition"
                                onClick={() => handleLoginOptionClick('Alumni')}
                            >
                                Alumni
                            </button>
                            <button
                                className="block w-full text-left px-4 py-2 hover:bg-purple-600 transition"
                                onClick={() => handleLoginOptionClick('Admin')}
                            >
                                Admin
                            </button>
                        </div>
                    )}
                </div>

                {/* Profile Icon Placeholder */}
                <div className="w-9 h-9 rounded-full bg-gray-400" />
            </div>
        </header>
    );
};

export default Navbar;