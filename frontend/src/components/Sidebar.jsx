// frontend/src/components/Sidebar.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';


const menuItems = [
    // --- START OF MENU DATA (UNCHANGED) ---
    {
        label: 'Dashboard',
        route: '/',
        icon: (
            <svg
                className="w-6 h-6 mr-4"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M3 13h7v8H3z" />
                <path d="M14 3h7v18h-7z" />
            </svg>
        ),
    },
    {
        label: 'Forums',
        route: '/forums',
        icon: (
            <svg
                className="w-6 h-6 mr-4"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M6 8h12" />
                <path d="M6 12h8" />
            </svg>
        ),
    },
    {
        label: 'Mentorship',
        route: '/mentorship',
        icon: (
            <svg
                className="w-6 h-6 mr-4"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <circle cx="8" cy="7" r="3" />
                <circle cx="16" cy="7" r="3" />
                <path d="M2 21v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2" />
                <path d="M14 21v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2" />
            </svg>
        ),
    },
    {
        label: 'Career Guidance',
        route: '/career-guidance',
        icon: (
            <svg
                className="w-6 h-6 mr-4"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <rect x="1" y="7" width="22" height="13" rx="2" />
                <path d="M16 3a4 4 0 0 0-8 0" />
            </svg>
        ),
    },
    {
        label: 'Events',
        route: '/events',
        icon: (
            <svg
                className="w-6 h-6 mr-4"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4" />
                <path d="M8 2v4" />
                <path d="M3 10h18" />
            </svg>
        ),
    },
    {
        label: 'Alumni Directory',
        route: '/alumni-directory',
        icon: (
            <svg
                className="w-6 h-6 mr-4"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <circle cx="12" cy="7" r="4" />
                <path d="M2 21v-2a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7v2" />
            </svg>
        ),
    },
    {
        label: 'Student Directory',
        route: '/student-directory',
        icon: (
            <svg
                className="w-6 h-6 mr-4"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <path d="M12 12c2.28 0 4-1.72 4-4s-1.72-4-4-4-4 1.72-4 4 1.72 4 4 4z" />
                <path d="M4 20c0-4 8-4 8-4s8 0 8 4v1H4v-1z" />
            </svg>
        ),
    },
    {
        label: 'AI Tools',
        route: '/ai-tools',
        icon: (
            <svg
                className="w-6 h-6 mr-4"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
            </svg>
        ),
    },
    {
        label: 'Messages',
        route: '/messages',
        icon: (
            <svg
                className="w-6 h-6 mr-4"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M22 5l-10 7L2 5" />
            </svg>
        ),
        badge: 9,
    },
    {
        label: 'Badges/Points',
        route: '/badges-points',
        icon: (
            <svg
                className="w-6 h-6 mr-4"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <circle cx="12" cy="8" r="5" />
                <path d="M17 21v-2a5 5 0 0 0-10 0v2" />
            </svg>
        ),
    },
    {
        label: 'Analytics',
        route: '/analytics',
        icon: (
            <svg
                className="w-6 h-6 mr-4"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <rect x="3" y="12" width="4" height="8" />
                <rect x="10" y="8" width="4" height="12" />
                <rect x="17" y="4" width="4" height="16" />
            </svg>
        ),
    },
    {
        label: 'Settings',
        route: '/settings',
        icon: (
            <svg
                className="w-6 h-6 mr-4"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 8.6 15a1.65 1.65 0 0 0-1.82-.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 4.3l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 15.4 9c.09.47.33.9.68 1.24l.06.06A1.65 1.65 0 0 0 19.4 15Z" />
            </svg>
        ),
    },
    {
        label: 'Help & Support',
        route: '/help-support',
        icon: (
            <svg
                className="w-6 h-6 mr-4"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <circle cx="12" cy="12" r="10" />
                <path d="M9 9a3 3 0 0 1 6 0c0 2-3 3-3 6" />
                <circle cx="12" cy="17" r="1" />
            </svg>
        ),
    },
    // --- END OF MENU DATA ---
];


// KEY CHANGES: 
// 1. Added isOpen and onClose props.
// 2. Added conditional styling to hide/show the sidebar.
// 3. Added the backdrop.
const Sidebar = ({ onLogoClick, isOpen, onClose }) => {
    const navigate = useNavigate();

    // Conditional classes for showing/hiding the sidebar off-canvas
    const sidebarClasses = `
        fixed top-0 z-50 h-screen w-60 bg-[#1A1D26] text-white flex flex-col shadow-lg 
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
    `;

    // Function handles navigation AND closes the sidebar
    const handleNavigation = (route) => {
        navigate(route);
        onClose(); 
    };

    return (
        <>
            {/* 1. Backdrop (Renders a click-to-close overlay when the sidebar is open) */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black opacity-50 z-40" 
                    onClick={onClose} 
                />
            )}

            {/* 2. Sidebar Panel */}
            <aside className={sidebarClasses}>
                <div
                    className="py-4 pl-8 flex items-center cursor-pointer select-none"
                    // Close sidebar after navigating home
                    onClick={() => { onLogoClick(); onClose(); }} 
                >
                    <img src="/logo.png" alt="Logo" className="h-10 w-auto mr-3" />
                    <span className="text-xl font-bold tracking-wide text-purple-400">RECONNECT</span>
                </div>
                
                <nav className="flex-1 overflow-y-auto">
                    <ul className="list-none p-0 m-0">
                        {menuItems.map((item) => (
                            <li
                                key={item.label}
                                // Use the new handler for navigation and closing
                                onClick={() => handleNavigation(item.route)}
                                className="flex items-center pl-8 py-4 cursor-pointer font-normal hover:bg-white/10 transition relative"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') handleNavigation(item.route);
                                }}
                                role="button"
                                aria-label={`Maps to ${item.label}`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                                {item.badge && (
                                    <span className="bg-red-600 text-white rounded-full w-5 h-5 text-xs text-center absolute right-5 flex items-center justify-center">
                                        {item.badge}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    );
};


export default Sidebar;