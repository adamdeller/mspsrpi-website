//------------------------------------------------------------------
//                        LIBRARY IMPORTS
//------------------------------------------------------------------
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

//------------------------------------------------------------------
//                     COMPONENT DEFINITION
//------------------------------------------------------------------
const Navbar = ({ navLinks, colorTheme = 'default' }) => {
  const location = useLocation();

  // Default navigation links if not provided
  const defaultNavLinks = {
    home: "Home",
    project: "Project",
    dataRelease: "Data Release",
    publications: "Publications",
    team: "Team"
  };

  // Use provided navLinks or fallback to defaults
  const links = navLinks || defaultNavLinks;

  // Define theme colors for each project variant
  const themeColors = {
    default: 'text-indigo-400',
    psrpi: 'text-green-400',
    mspsrpi: 'text-purple-400',
    mspsrpi2: 'text-blue-400'
  };

  // Get the correct active color based on theme
  const activeColor = themeColors[colorTheme] || themeColors.default;

  return (
    <nav className="bg-slate-900/90 backdrop-blur-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            {/* Logo color also changes based on theme */}
            <Link to="/" className="text-xl font-bold">
              MSPSR<span className={activeColor}>π</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`${location.pathname === '/' ? activeColor : 'text-gray-300 hover:' + activeColor} px-3 py-2 font-medium`}
            >
              {links.home}
            </Link>
            <Link
              to="/project"
              className={`${location.pathname.includes('project') ? activeColor : 'text-gray-300 hover:' + activeColor} px-3 py-2 font-medium`}
            >
              {links.project}
            </Link>
            <Link
              to="/data-release"
              className={`${location.pathname === '/data-release' ? activeColor : 'text-gray-300 hover:' + activeColor} px-3 py-2 font-medium`}
            >
              {links.dataRelease}
            </Link>
            <Link
              to="/publications"
              className={`${location.pathname === '/publications' ? activeColor : 'text-gray-300 hover:' + activeColor} px-3 py-2 font-medium`}
            >
              {links.publications}
            </Link>
            <Link
              to="/team"
              className={`${location.pathname === '/team' ? activeColor : 'text-gray-300 hover:' + activeColor} px-3 py-2 font-medium`}
            >
              {links.team}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;