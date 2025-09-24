import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import AlumniRegistration from './components/Registration/AlumniRegistration';
import StudentRegistration from './components/Registration/StudentRegistration';

const App = () => {
  return(
    <>
         <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/signup/alumni" element={<AlumniRegistration />} />
             <Route path="/signup/student" element={<StudentRegistration />} />
         </Routes>
    </>
  )
};

export default App;
