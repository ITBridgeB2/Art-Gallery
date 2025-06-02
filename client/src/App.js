// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Pages/HomePage';
import Dashboard from './Pages/DashBoard';


const App = () => {
  return (
    <Router>
      <Routes>
   
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard/>}></Route>


 
      </Routes>
    </Router>
  );
};

export default App;
