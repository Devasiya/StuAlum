import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import AlumniRegistration from './components/Registration/AlumniRegistration';
import StudentRegistration from './components/Registration/StudentRegistration';
import AdminRegistration from './components/Registration/AdminRegistration';
import AdminLogin from './pages/Login/AdminLogin';
import AlumniLogin from './pages/Login/AlumniLogin';
import StudentLogin from './pages/Login/StudentLogin';

const App = () => {
  return(
    <>
         <Routes>
             <Route path="/" element={<Home />} />
              {/* Login Routes */}
              <Route path="/login/admin" element={<AdminLogin />} />
              <Route path="/login/alumni" element={<AlumniLogin />} />
              <Route path="/login/student" element={<StudentLogin />} />

               <Route path="/123" element={<div>Page Not Found</div>} />

              {/* Registration Routes */}
             <Route path="/signup/alumni" element={<AlumniRegistration />} />
             <Route path="/signup/student" element={<StudentRegistration />} />
             <Route path="/signup/admin" element={<AdminRegistration />} />
         </Routes>
    </>
  )
};

export default App;
