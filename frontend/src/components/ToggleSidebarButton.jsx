// frontend/src/components/ToggleSidebarButton.jsx

import React from 'react';

// NOTE: This component is simple because the complex logic (onClick, SVG rendering) 
// is implemented directly in Navbar.jsx for styling flexibility.
const ToggleSidebarButton = ({ onClick, className }) => (
    <button 
        className={`text-white p-2 rounded-full hover:bg-white/10 transition z-50 ${className}`}
        onClick={onClick}
        aria-label="Toggle Sidebar Menu"
    >
        {/* Hamburger Icon (SVG) - Use the same SVG you placed in Navbar.jsx if needed here */}
        <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    </button>
);

export default ToggleSidebarButton;