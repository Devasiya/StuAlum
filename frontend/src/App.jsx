// frontend/src/App.jsx

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
// 🚨 NEW IMPORT: Admin Report Dashboard
import ReportDashboard from './pages/Admin/ReportDashboard'; 

import AlumniRegistration from './components/Registration/AlumniRegistration';
import StudentRegistration from './components/Registration/StudentRegistration';
import AdminRegistration from './components/Registration/AdminRegistration';
import AdminLogin from './pages/Login/AdminLogin';
import AlumniLogin from './pages/Login/AlumniLogin';
import StudentLogin from './pages/Login/StudentLogin';

// Import the utility function to get user role
import { getCurrentUserRole } from './utils/authUtils'; // Assuming you have a function to get the role

// --- WRAP FEATURE COMPONENTS WITH HOC ---
const LayoutHome = withSidebarToggle(Home);
const LayoutForums = withSidebarToggle(Forums);
const LayoutPostDetail = withSidebarToggle(PostDetail);
const LayoutCreatePostForm = withSidebarToggle(CreatePostForm);
const LayoutEditPostForm = withSidebarToggle(EditPostForm);
// 🚨 NEW WRAPPER for the admin dashboard
const LayoutReportDashboard = withSidebarToggle(ReportDashboard);


const App = () => {
    // 🚨 FETCH USER ROLE: This is a simplification; use your actual auth context/hook
    const userRole = getCurrentUserRole(); 

    return(
        <>
            <Routes>
                {/* --- FEATURE ROUTES (Use the wrapped components) --- */}
                <Route path="/" element={<LayoutHome />} />
                
                {/* Forums Routes */}
                <Route path="/forums" element={<LayoutForums />} />
                <Route path="/forums/posts/:postId" element={<LayoutPostDetail />} /> 
                <Route path="/forums/new" element={<LayoutCreatePostForm />} /> 
                <Route path="/forums/edit/:postId" element={<LayoutEditPostForm />} /> 
                
                {/* 🚨 NEW ADMIN ROUTE */}
                <Route path="/admin/reports" element={<LayoutReportDashboard />} />
                
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
    )
};

export default App;