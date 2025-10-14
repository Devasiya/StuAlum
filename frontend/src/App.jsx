import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import the HOC
import withSidebarToggle from './hocs/withSidebarToggle'; 

import Home from './pages/home';
import Forums from './pages/Forum/Forums'; 
import PostDetail from './pages/Forum/PostDetail'; 
import CreatePostForm from './pages/Forum/CreatePostForm'; 
import EditPostForm from './pages/Forum/EditPostForm'; 

import AlumniRegistration from './components/Registration/AlumniRegistration';
import StudentRegistration from './components/Registration/StudentRegistration';
import AdminRegistration from './components/Registration/AdminRegistration';
import AdminLogin from './pages/Login/AdminLogin';
import AlumniLogin from './pages/Login/AlumniLogin';
import StudentLogin from './pages/Login/StudentLogin';

// --- WRAP FEATURE COMPONENTS WITH HOC ---
const LayoutHome = withSidebarToggle(Home);
const LayoutForums = withSidebarToggle(Forums);
const LayoutPostDetail = withSidebarToggle(PostDetail);
const LayoutCreatePostForm = withSidebarToggle(CreatePostForm);
const LayoutEditPostForm = withSidebarToggle(EditPostForm);

const App = () => {
    return(
        <>
            <Routes>
                {/* --- FEATURE ROUTES (Use the wrapped components) --- */}
                <Route path="/" element={<LayoutHome />} />
                
                {/* Forums Routes */}
                <Route path="/forums" element={<LayoutForums />} />
                
                {/* Post Detail Route */}
                <Route path="/forums/posts/:postId" element={<LayoutPostDetail />} /> 
                
                {/* Create Post Route (The key to fixing the last issue) */}
                <Route path="/forums/new" element={<LayoutCreatePostForm />} /> 
                <Route path="/forums/edit/:postId" element={<LayoutEditPostForm />} /> 
                
                {/* --- AUTH ROUTES (Do NOT use the HOC wrapper) --- */}
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