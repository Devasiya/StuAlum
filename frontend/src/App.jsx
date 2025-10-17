// frontend/src/App.jsx (CORRECTED AND FINALIZED)

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import the HOC
import withSidebarToggle from './hocs/withSidebarToggle'; 

// Import all page components
import Home from './pages/home';
import Forums from './pages/Forum/Forums'; 
import PostDetail from './pages/Forum/PostDetail'; 
import CreatePostForm from './pages/Forum/CreatePostForm'; 
import EditPostForm from './pages/Forum/EditPostForm'; 
import ReportDashboard from './pages/Admin/ReportDashboard'; 

import AlumniRegistration from './components/Registration/AlumniRegistration';
import StudentRegistration from './components/Registration/StudentRegistration';
import AdminRegistration from './components/Registration/AdminRegistration';
import AdminLogin from './pages/Login/AdminLogin';
import AlumniLogin from './pages/Login/AlumniLogin';
import StudentLogin from './pages/Login/StudentLogin';
import EventsCalendar from './pages/Events/EventsCalendar'; 
import CreateEventForm from './pages/Events/CreateEventForm';

// 🚨 FIX 1: Import base component (renamed to avoid conflict with the layout constant)
import CareerGuidanceComponent from './pages/Career/CareerGuidance';
// 🚨 FIX 2: Import the base component for the chat interface
import AIChatInterface from './pages/Career/AIChatInterface'; 

// Import the utility function to get user role
import { getCurrentUserRole } from './utils/authUtils'; 

// --- WRAP FEATURE COMPONENTS WITH HOC ---
const LayoutHome = withSidebarToggle(Home);
const LayoutForums = withSidebarToggle(Forums);
const LayoutPostDetail = withSidebarToggle(PostDetail);
const LayoutCreatePostForm = withSidebarToggle(CreatePostForm);
const LayoutEditPostForm = withSidebarToggle(EditPostForm);
const LayoutReportDashboard = withSidebarToggle(ReportDashboard);
const LayoutEvents = withSidebarToggle(EventsCalendar);
const LayoutCreateEventForm = withSidebarToggle(CreateEventForm);

// 🚨 FIX 3: Correctly wrap the imported Career Guidance component
const LayoutCareer = withSidebarToggle(CareerGuidanceComponent); 
// 🚨 FIX 4: Correctly wrap the imported AI Chat component
const LayoutAIChat = withSidebarToggle(AIChatInterface); 


// Main App Component
const App = () => {
    const userRole = getCurrentUserRole(); 

    return(
        <>
            <Routes>
                {/* --- FEATURE ROUTES --- */}
                <Route path="/" element={<LayoutHome />} />
                
                {/* Forums Routes */}
                <Route path="/forums" element={<LayoutForums />} />
                <Route path="/forums/posts/:postId" element={<LayoutPostDetail />} /> 
                <Route path="/forums/new" element={<LayoutCreatePostForm />} /> 
                <Route path="/forums/edit/:postId" element={<LayoutEditPostForm />} /> 
                
                {/* ADMIN ROUTE */}
                <Route path="/admin/reports" element={<LayoutReportDashboard />} />

                {/* EVENTS ROUTES */}
                <Route path="/events" element={<LayoutEvents />} />
                <Route path="/events/new" element={<LayoutCreateEventForm />} /> 

                {/* 🚨 CAREER ROUTES */}
                <Route path="/career-guidance" element={<LayoutCareer />} />
                <Route path="/career-guidance/ai-chat" element={<LayoutAIChat />} /> {/* Now correctly wrapped */}
                
                {/* --- AUTH ROUTES --- */}
                <Route path="/login/admin" element={<AdminLogin />} />
                <Route path="/login/alumni" element={<AlumniLogin />} />
                <Route path="/login/student" element={<StudentLogin />} />
                <Route path="/signup/alumni" element={<AlumniRegistration />} />
                <Route path="/signup/student" element={<StudentRegistration />} />
                <Route path="/signup/admin" element={<AdminRegistration />} />

                {/* --- CATCH-ALL ROUTE --- */}
                <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
        </>
    );
};

export default App;