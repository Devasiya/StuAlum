// frontend/src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import the HOC
import withSidebarToggle from './hocs/withSidebarToggle'; 

// Feature Pages
import Home from './pages/home';

// Forums & Forum Features
import Forums from './pages/Forum/Forums'; 
import PostDetail from './pages/Forum/PostDetail'; 
import CreatePostForm from './pages/Forum/CreatePostForm'; 
import EditPostForm from './pages/Forum/EditPostForm'; 

// Admin
import ReportDashboard from './pages/Admin/ReportDashboard'; 

// Registration & Auth
import AlumniRegistration from './components/Registration/AlumniRegistration';
import StudentRegistration from './components/Registration/StudentRegistration';
import AdminRegistration from './components/Registration/AdminRegistration';
import AdminLogin from './pages/Login/AdminLogin';
import AlumniLogin from './pages/Login/AlumniLogin';
import StudentLogin from './pages/Login/StudentLogin';

// Alumni Directory & Profile
import AlumniDirectory from './pages/AlumniDirectory'; 
// 🛑 ADDED: Import the component for the individual profile page
import AlumniProfilePage from './pages/AlumniProfilePage'; 

// --- WRAP FEATURE COMPONENTS WITH HOC ---
const LayoutHome = withSidebarToggle(Home);
const LayoutForums = withSidebarToggle(Forums);
const LayoutPostDetail = withSidebarToggle(PostDetail);
const LayoutCreatePostForm = withSidebarToggle(CreatePostForm);
const LayoutEditPostForm = withSidebarToggle(EditPostForm);
const LayoutReportDashboard = withSidebarToggle(ReportDashboard);

// NEW: Wrap the AlumniDirectory page with HOC
const LayoutAlumniDirectory = withSidebarToggle(AlumniDirectory);
// 🛑 ADDED: Wrap the AlumniProfilePage component
const LayoutAlumniProfilePage = withSidebarToggle(AlumniProfilePage);


const App = () => {
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

                {/* Admin Dashboard */}
                <Route path="/admin/reports" element={<LayoutReportDashboard />} />

                {/* Alumni Directory & Profile Routes */}
                <Route path="/alumni-directory" element={<LayoutAlumniDirectory />} />
                {/* 🛑 ADDED: Dynamic route for the single alumni profile */}
                <Route path="/alumni/profile/:id" element={<LayoutAlumniProfilePage />} />
                
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