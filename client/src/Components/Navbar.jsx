// src/components/UI/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaPlusCircle, FaChartBar } from 'react-icons/fa';


const Navbar = () => {
  const location = useLocation();

  const navLinkStyle = (path) =>
    `transition px-3 py-2 rounded-md text-sm font-medium ${
      location.pathname === path
        ? 'bg-purple-700 text-white'
        : 'text-white hover:bg-purple-500 hover:text-white'
    }`;

  return (
    <nav className="bg-purple-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-white tracking-tight">
            🎨 Art Gallery
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link to="/" className={navLinkStyle('/')}>
              Home
            </Link>
            <Link to="/add" className={`${navLinkStyle('/add')} flex items-center gap-1`}>
              <FaPlusCircle className="text-sm" />
              <span>Add Art</span>
            </Link>
            <Link to="/dashboard" className={`${navLinkStyle('/dashboard')} flex items-center gap-1`}>
              <FaChartBar className="text-sm" />
              <span>Analytics</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
