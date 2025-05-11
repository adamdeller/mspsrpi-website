import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import GitHubLoginButton from './GitHubLoginButton';
import { 
  Lock, Eye, EyeOff, MessageSquare, FileText, 
  User, Calendar, Search, ArrowLeft, Filter, Clock, 
  LogOut, Star, BookOpen, Users, Bell, Image,
  X
} from 'lucide-react';

// Login component remains unchanged
const Login = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-slate-900 to-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Starry background for login card */}
        <div className="relative bg-slate-900/90 backdrop-blur-md border border-indigo-500/30 rounded-xl p-8 shadow-xl overflow-hidden">
          {/* Star particles background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjAuNCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iMzAiIGN5PSIxMCIgcj0iMC4zIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjIwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjcwIiBjeT0iMTAiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PGNpcmNsZSBjeD0iOTAiIGN5PSIzMCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSIxMCIgY3k9IjUwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iNzAiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSI5MCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSI3MCIgY3k9IjUwIiByPSIwLjMiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjkwIiBjeT0iNzAiIHI9IjAuNCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PC9zdmc+')] opacity-20"></div>
          
          {/* Cosmic glow effect */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent opacity-40"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="mx-auto flex justify-center">
                <div className="w-16 h-16 bg-indigo-950/80 rounded-full flex items-center justify-center border border-indigo-500/50 shadow-lg shadow-indigo-500/20">
                  <Lock className="h-8 w-8 text-indigo-300" />
                </div>
              </div>
              <h2 className="mt-6 text-3xl font-bold text-white">Restricted Area</h2>
              <p className="mt-2 text-indigo-300">Team access only</p>
              <GitHubLoginButton />
            </div>

            <div className="mt-8 text-center">
              <Link to="/" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Return to public site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main dashboard component - updated to fetch data from JSON
const Dashboard = ({ onLogout }) => {
  const username = localStorage.getItem('githubUser') || 'Team Member';
  const [selectedPulsar, setSelectedPulsar] = useState(null);
  const [pulsars, setPulsars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  
  // Function to open image modal
  const openImageModal = (imageSrc) => {
    setModalImage(imageSrc);
    setModalOpen(true);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };
  
  // Function to close image modal
  const closeImageModal = () => {
    setModalOpen(false);
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  };
  
  useEffect(() => {
    const loadPulsarData = () => {
      setIsLoading(true);
      setLoadError(null);
      
      // Fetch the pulsar data from the JSON file
      fetch(`${process.env.PUBLIC_URL}/data/restricted/pulsarlist.json`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Successfully loaded pulsar data:', data);
          setPulsars(data);
          if (data.length > 0) setSelectedPulsar(data[0]);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error loading pulsar data:', error);
          setLoadError(`Failed to load pulsar data: ${error.message}`);
          setIsLoading(false);
        });
    };
    
    loadPulsarData();
  }, []);
  
  // Handle filtering of pulsars
  const filteredPulsars = pulsars.filter(pulsar => {
    const matchesSearch = 
      pulsar.pulsar_details.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pulsar.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || pulsar.pulsar_details.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || pulsar.pulsar_details.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Get available image links for the current pulsar
  const getImageLinks = () => {
    if (!selectedPulsar) return [];
    
    const visData = selectedPulsar.visualisation_and_notes;
    const links = [];
    
    // Add PUBLIC_URL prefix to ensure proper path resolution
    if (visData.imageLink1) {
      links.push(`${process.env.PUBLIC_URL}${visData.imageLink1}`);
    }
    if (visData.imageLink2) {
      links.push(`${process.env.PUBLIC_URL}${visData.imageLink2}`);
    }
    if (visData.imageLink3) {
      links.push(`${process.env.PUBLIC_URL}${visData.imageLink3}`);
    }
    
    return links;
  };
  
  // Format date in a readable way
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Move to next/previous image
  const navigateImages = (direction) => {
    const imageLinks = getImageLinks();
    if (imageLinks.length <= 1) return;
    
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % imageLinks.length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + imageLinks.length) % imageLinks.length);
    }
    // Reset image load error state when navigating
    setImageLoadError(false);
  };

  // Handle image load error
  const handleImageError = () => {
    setImageLoadError(true);
    console.error("Failed to load image:", getImageLinks()[currentImageIndex]);
  };

  // If still loading, show a loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-slate-900 to-black flex items-center justify-center">
        <div className="text-indigo-300 text-xl">Loading pulsar data...</div>
      </div>
    );
  }

  // If there was an error loading data, show error message
  if (loadError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-slate-900 to-black flex items-center justify-center">
        <div className="bg-slate-900/60 backdrop-blur-sm border border-red-500/30 rounded-xl p-8 max-w-md">
          <h2 className="text-xl font-semibold text-white mb-4">Error Loading Data</h2>
          <p className="text-red-300 mb-4">{loadError}</p>
          <button
            onClick={onLogout}
            className="flex items-center gap-1 text-sm bg-slate-800 px-4 py-2 rounded-md text-indigo-300 hover:bg-slate-700"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-slate-900 to-black">
      {/* Navigation */}
      <nav className="bg-slate-900/90 backdrop-blur-md border-b border-indigo-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-white">MSPSR<span className="text-indigo-400">π</span></span>
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-indigo-900/70 text-indigo-300 rounded-md border border-indigo-700/30">
                  Research Hub
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-5">
              <button className="text-indigo-300 hover:text-indigo-100">
                <Bell className="h-5 w-5" />
              </button>
              <button className="flex items-center text-indigo-300 hover:text-indigo-100 gap-1">
                <User className="h-5 w-5" />
                <span className="text-sm">{username}</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-1 text-sm text-indigo-300 hover:text-indigo-100"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Pulsar Data Collaboration Hub</h1>
          <p className="text-indigo-300">
            Analyze, discuss, and collaborate on pulsar data with your research team
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Pulsar List */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/60 backdrop-blur-sm border border-indigo-500/20 rounded-xl shadow-xl overflow-hidden">
              <div className="p-4 border-b border-indigo-500/20">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <Star className="h-5 w-5 text-indigo-400 mr-2" />
                  Pulsar Catalog
                </h2>
                
                <div className="mt-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search pulsars..."
                      className="w-full px-4 py-2 pl-10 bg-slate-800/60 border border-indigo-600/30 rounded-md text-indigo-100 placeholder-indigo-400/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="h-5 w-5 text-indigo-400 absolute left-3 top-2.5" />
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <div className="w-1/2">
                    <label className="block text-xs text-indigo-300 mb-1">Status</label>
                    <select
                      className="w-full px-2 py-1.5 bg-slate-800/60 border border-indigo-600/30 rounded-md text-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Analyzed">Analyzed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Verified">Verified</option>
                    </select>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs text-indigo-300 mb-1">Phase</label>
                    <select
                      className="w-full px-2 py-1.5 bg-slate-800/60 border border-indigo-600/30 rounded-md text-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="All">All Phases</option>
                      <option value="Phase 1">Phase 1</option>
                      <option value="Phase 2">Phase 2</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                {filteredPulsars.length === 0 ? (
                  <div className="p-4 text-center text-indigo-400">
                    No pulsars match your search criteria
                  </div>
                ) : (
                  <ul className="divide-y divide-indigo-500/20">
                    {filteredPulsars.map((pulsar) => (
                      <li 
                        key={pulsar.id}
                        className={`
                          cursor-pointer p-4 transition-all hover:bg-indigo-900/20
                          ${selectedPulsar && selectedPulsar.id === pulsar.id ? 'bg-indigo-900/30 border-l-4 border-indigo-500' : ''}
                        `}
                        onClick={() => {
                          setSelectedPulsar(pulsar);
                          setCurrentImageIndex(0); // Reset image index when changing pulsars
                          setImageLoadError(false); // Reset image error state when changing pulsars
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-indigo-100">{pulsar.pulsar_details.name}</h3>
                          <span className={`
                            text-xs px-2 py-1 rounded-full 
                            ${pulsar.pulsar_details.status === 'Verified' ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30' : 
                              pulsar.pulsar_details.status === 'Analyzed' ? 'bg-blue-900/40 text-blue-300 border border-blue-500/30' :
                              'bg-amber-900/40 text-amber-300 border border-amber-500/30'}
                          `}>
                            {pulsar.pulsar_details.status}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center space-x-2 text-xs text-indigo-400">
                          <span className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            {pulsar.pulsar_details.lastUpdated}
                          </span>
                          <span className="flex items-center">
                            <BookOpen className="h-3.5 w-3.5 mr-1" />
                            {pulsar.pulsar_details.category}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          
          {/* Main Content - Pulsar Details and Visualizations */}
          {selectedPulsar && (
            <div className="lg:col-span-2">
              {/* Pulsar Details Card */}
              <div className="bg-slate-900/60 backdrop-blur-sm border border-indigo-500/20 rounded-xl shadow-xl mb-6 overflow-hidden">
                <div className="p-5 border-b border-indigo-500/20 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">{selectedPulsar.pulsar_details.name} Details</h2>
                  {/* Download button removed as requested */}
                </div>
                
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-indigo-500/10 shadow-inner">
                      <h3 className="text-sm font-medium text-indigo-300 mb-2">Astrometric Parameters</h3>
                      <div className="space-y-2 text-indigo-100">
                        <div className="flex justify-between">
                          <span className="text-indigo-400 text-sm">Distance:</span>
                          <span className="text-white font-medium">{selectedPulsar.pulsar_details.distance}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-indigo-400 text-sm">Parallax:</span>
                          <span className="text-white font-medium">{selectedPulsar.pulsar_details.parallax}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-indigo-400 text-sm">Proper Motion:</span>
                          <span className="text-white font-medium">{selectedPulsar.pulsar_details.properMotion}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-indigo-500/10 shadow-inner">
                      <h3 className="text-sm font-medium text-indigo-300 mb-2">Dataset Information</h3>
                      <div className="space-y-2 text-indigo-100">
                        <div className="flex justify-between">
                          <span className="text-indigo-400 text-sm">Last Updated:</span>
                          <span className="text-white font-medium">{selectedPulsar.pulsar_details.lastUpdated}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-indigo-400 text-sm">Category:</span>
                          <span className="text-white font-medium">{selectedPulsar.pulsar_details.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-indigo-400 text-sm">Status:</span>
                          <span className={`font-medium
                            ${selectedPulsar.pulsar_details.status === 'Verified' ? 'text-emerald-300' :
                              selectedPulsar.pulsar_details.status === 'Analyzed' ? 'text-blue-300' :
                              'text-amber-300'}
                          `}>
                            {selectedPulsar.pulsar_details.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-indigo-400 text-sm">Dataset Size:</span>
                          <span className="text-white font-medium">{selectedPulsar.pulsar_details.datasetSize}</span>
                        </div>
                        {/* Added Observation Date */}
                        <div className="flex justify-between">
                          <span className="text-indigo-400 text-sm">Observation Date:</span>
                          <span className="text-white font-medium">{formatDate(selectedPulsar.pulsar_details.ObsDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Visualization section - updated title and improved error handling */}
                  <div className="mt-4 bg-slate-800/30 rounded-lg border border-indigo-500/10 overflow-hidden">
                    <div className="p-3 bg-slate-800/50 border-b border-indigo-500/20 flex justify-between items-center">
                      <h3 className="text-sm font-medium text-indigo-300">Data Visualization</h3>
                      
                      {/* Image navigation controls - only show if multiple images exist */}
                      {getImageLinks().length > 1 && (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => navigateImages('prev')}
                            className="p-1 text-indigo-300 hover:text-indigo-100 bg-slate-700/50 rounded"
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </button>
                          <span className="text-xs text-indigo-300">
                            {currentImageIndex + 1}/{getImageLinks().length}
                          </span>
                          <button 
                            onClick={() => navigateImages('next')}
                            className="p-1 text-indigo-300 hover:text-indigo-100 bg-slate-700/50 rounded rotate-180"
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 flex items-center justify-center">
                      {getImageLinks().length > 0 ? (
                        <div className="relative w-full">
                          {!imageLoadError ? (
                            <img 
                              src={getImageLinks()[currentImageIndex]} 
                              alt={`${selectedPulsar.pulsar_details.name} visualization`}
                              className="w-full h-auto max-h-64 object-contain mx-auto cursor-pointer hover:opacity-90 transition-opacity"
                              onError={handleImageError}
                              onClick={() => openImageModal(getImageLinks()[currentImageIndex])}
                            />
                          ) : (
                            <div className="text-indigo-300 text-center py-8 bg-slate-800/30 rounded-lg border border-indigo-500/10">
                              <Image className="h-12 w-12 mx-auto mb-3 opacity-30" />
                              <p>Visualization data not available</p>
                              <p className="text-xs mt-2 text-indigo-400">Image could not be loaded</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-indigo-300 text-center py-12">
                          <Image className="h-12 w-12 mx-auto mb-3 opacity-30" />
                          <p>No visualization available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Notes Section - simplified as requested */}
              <div className="bg-slate-900/60 backdrop-blur-sm border border-indigo-500/20 rounded-xl shadow-xl">
                <div className="p-5 border-b border-indigo-500/20">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <FileText className="h-5 w-5 text-indigo-400 mr-2" />
                    Research Notes
                  </h2>
                </div>
                
                {/* Display notes - simplified version */}
                <div className="p-5">
                  {selectedPulsar.visualisation_and_notes.notes ? (
                    <div className="bg-slate-800/30 rounded-lg p-4 border border-indigo-500/10 whitespace-pre-line">
                      <div className="text-xs text-indigo-400 mb-2">
                        Last updated: {selectedPulsar.pulsar_details.lastUpdated}
                      </div>
                      <div className="text-indigo-100">
                        {selectedPulsar.visualisation_and_notes.notes}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-indigo-400">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>No research notes available for this pulsar.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Image Modal */}
      {modalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center cursor-pointer transition-opacity duration-300"
          onClick={closeImageModal}
        >
          <div className="max-w-4xl max-h-[90vh] p-2 relative">
            <img 
              src={modalImage} 
              alt="Enlarged visualization" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent click from closing modal when clicking on the image itself
            />
            <button 
              className="absolute top-4 right-4 p-2 rounded-full bg-indigo-900/80 text-white hover:bg-indigo-800 transition-colors"
              onClick={closeImageModal}
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main component
const RestrictedArea = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('authenticated') === 'true';
  });

  const handleLogin = () => {
    localStorage.removeItem('pulsarComments'); // Clear old comments since we're using notes now
    localStorage.setItem('authenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    setIsAuthenticated(false);
  };

  return (
    <>
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
};

export default RestrictedArea;