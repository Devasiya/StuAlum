// frontend/src/components/hocs/withSidebarToggle.jsx

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar'; 
import { useNavigate } from 'react-router-dom';

const withSidebarToggle = (WrappedComponent) => {
    
    const WithSidebarToggle = (props) => {
        const [sidebarOpen, setSidebarOpen] = useState(false);
        const navigate = useNavigate();
        
        const handleLogoClick = () => {
            navigate('/');
        };

        // Function passed to the Navbar/Page component to open the sidebar
        const onSidebarToggle = () => setSidebarOpen(true); 

        return (
            // Outermost container is relative for absolute children and spans full width
            <div className="relative min-h-screen w-full"> 
                
                {/* 1. RENDER THE TOGGLEABLE SIDEBAR (z-50) */}
                <Sidebar 
                    isOpen={sidebarOpen} 
                    onClose={() => setSidebarOpen(false)} 
                    onLogoClick={handleLogoClick}
                />
                
                {/* 2. RENDER THE WRAPPED PAGE COMPONENT */}
                {/* The page component (Home/Forums) renders the Navbar and content flow. */}
                <WrappedComponent 
                    {...props} 
                    // CRUCIAL: Pass the function for the Navbar button to use
                    onSidebarToggle={onSidebarToggle} 
                />
            </div>
        );
    };

    WithSidebarToggle.displayName = `withSidebarToggle(${WrappedComponent.name || 'Component'})`;
    return WithSidebarToggle;
};

export default withSidebarToggle;