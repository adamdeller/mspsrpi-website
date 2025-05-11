import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Mail, Globe, Building } from 'lucide-react';
import Navbar from './Navbar';

const TeamPage = () => {
  const [activeTab, setActiveTab] = useState('research');
  const [teamMembers, setTeamMembers] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/data/teamPage/teamMembers.json`)
      .then((response) => response.json())
      .then((data) => setTeamMembers(data.teamMembers))
      .catch((error) => console.error('Error loading team data:', error));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-slate-900 to-black text-gray-100 team-page-fade">
      <Navbar className="md:hidden" />
      <nav className="hidden md:block bg-slate-900/90 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold">MSPSR<span className="text-indigo-400">π</span></Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-300 hover:text-indigo-400 px-3 py-2 font-medium">Home</Link>
              <Link to="/project" className="text-gray-300 hover:text-indigo-400 px-3 py-2 font-medium">Project</Link>
              <Link to="/data-release" className="text-gray-300 hover:text-indigo-400 px-3 py-2 font-medium">Data Release</Link>
              <Link to="/publications" className="text-gray-300 hover:text-indigo-400 px-3 py-2 font-medium">Publications</Link>
              <Link to="/team" className="text-indigo-400 px-3 py-2 font-medium">Team</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative pt-16 pb-4">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-white mb-4">Our Team</h1>
            <p className="text-xl text-indigo-200 mb-4">
              Meet the researchers and developers behind the MSPSRπ project
            </p>
            <p className="text-gray-300 mb-2">
              MSPSRπ brings together astronomers, data scientists, and developers from institutions around the world.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-slate-900/90 via-indigo-950/30 to-slate-900/90 backdrop-blur-sm border border-indigo-500/30 rounded-lg overflow-hidden shadow-lg hover:shadow-indigo-500/20 hover:border-indigo-500/50 transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <div className="h-40 relative bg-black">
                  <div
                    className="absolute inset-0 opacity-60 animate-pulse"
                    style={{
                      backgroundImage: `radial-gradient(circle at 60% 40%, rgba(180, 200, 255, 0.25), transparent 70%)`
                    }}
                  />
                </div>
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                <div className="w-36 h-36 rounded-full border-4 border-slate-900 overflow-hidden bg-indigo-800/30 flex items-center justify-center">
                    <img 
                      src={member.photo} 
                      alt={member.name || "Team member"} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }} 
                    />
                  </div>
                </div>
              </div>
              <div className="pt-12 px-6 pb-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-indigo-200">{member.name}</h3>
                  <p className="text-cyan-400 text-sm">{member.role}</p>
                </div>
                <div className="flex items-center text-sm text-gray-400 mb-3">
                  <Building className="h-4 w-4 mr-2 text-indigo-400/70" />
                  <span>{member.institution}</span>
                </div>
                <p className="text-gray-300 text-sm mb-4 italic">"{member.quote}"</p>
                {member.email && (
                  <div className="mt-4">
                    <a 
                      href={`mailto:${member.email}`} 
                      className="inline-flex items-center px-3 py-1 border border-indigo-500 rounded-md text-sm text-indigo-300 hover:bg-indigo-800/30 transition"
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-indigo-900/80 text-white shadow-lg hover:bg-indigo-800 transition-all duration-300 backdrop-blur-sm border border-indigo-500/50"
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default TeamPage;
