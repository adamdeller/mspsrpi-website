//------------------------------------------------------------------
//                        LIBRARY IMPORTS
//------------------------------------------------------------------
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Import icons for mobile menu

//------------------------------------------------------------------
//                     COMPONENT DEFINITION
//------------------------------------------------------------------
const Navbar = ({ navLinks, colorTheme = 'default' }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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
          
          {/* Desktop navigation menu - hidden on mobile */}
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
          
          {/* Mobile menu button - visible only on mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`${location.pathname === '/' ? 'bg-slate-800 ' + activeColor : 'text-gray-300 hover:bg-slate-800 hover:' + activeColor} block px-3 py-2 rounded-md text-base font-medium`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {links.home}
            </Link>
            <Link
              to="/project"
              className={`${location.pathname.includes('project') ? 'bg-slate-800 ' + activeColor : 'text-gray-300 hover:bg-slate-800 hover:' + activeColor} block px-3 py-2 rounded-md text-base font-medium`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {links.project}
            </Link>
            <Link
              to="/data-release"
              className={`${location.pathname === '/data-release' ? 'bg-slate-800 ' + activeColor : 'text-gray-300 hover:bg-slate-800 hover:' + activeColor} block px-3 py-2 rounded-md text-base font-medium`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {links.dataRelease}
            </Link>
            <Link
              to="/publications"
              className={`${location.pathname === '/publications' ? 'bg-slate-800 ' + activeColor : 'text-gray-300 hover:bg-slate-800 hover:' + activeColor} block px-3 py-2 rounded-md text-base font-medium`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {links.publications}
            </Link>
            <Link
              to="/team"
              className={`${location.pathname === '/team' ? 'bg-slate-800 ' + activeColor : 'text-gray-300 hover:bg-slate-800 hover:' + activeColor} block px-3 py-2 rounded-md text-base font-medium`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {links.team}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;