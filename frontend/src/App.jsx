import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import AlumniRegistration from './components/Registration/AlumniRegistration';

const App = () => {
  return(
    <>
         <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/signup/alumni" element={<AlumniRegistration />} />
         </Routes>
    </>
  )
};

export default App;
