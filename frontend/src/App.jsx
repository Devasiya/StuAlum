import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import the HOC
import withSidebarToggle from './hocs/withSidebarToggle'; 

// Import all page components
import Home from './pages/home';
import Forums from './pages/Forums';
import PostDetail from './pages/PostDetail';
import AlumniRegistration from './components/Registration/AlumniRegistration';
import StudentRegistration from './components/Registration/StudentRegistration';
import AdminRegistration from './components/Registration/AdminRegistration';
import AdminLogin from './pages/Login/AdminLogin';
import AlumniLogin from './pages/Login/AlumniLogin';
import StudentLogin from './pages/Login/StudentLogin';

// --- WRAP FEATURE COMPONENTS WITH HOC ---
// This ensures these pages have the sidebar rendering logic attached
const LayoutHome = withSidebarToggle(Home);
const LayoutForums = withSidebarToggle(Forums);
const LayoutPostDetail = withSidebarToggle(PostDetail);
// NOTE: You must apply this wrapper to all your feature pages (Mentorship, Events, etc.)

const App = () => {
  return(
    <>
      <Routes>
          {/* --- FEATURE ROUTES (Use the wrapped components) --- */}
          <Route path="/" element={<LayoutHome />} />
          <Route path="/forums" element={<LayoutForums />} />
          <Route path="/forums/posts/:postId" element={<LayoutPostDetail />} /> 
          
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