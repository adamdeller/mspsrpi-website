import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  Download,
  Map,
  ChevronRight
} from 'lucide-react';

const DataReleasePage = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParallaxRange, setSelectedParallaxRange] = useState('all');
  const [selectedObsPhase, setSelectedObsPhase] = useState('MSPSRPI2');
  const [selectedObsStatus, setSelectedObsStatus] = useState('all');
  const [pulsars, setPulsars] = useState([]);
  const [activePulsar, setActivePulsar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Determine which file to load based on the selected phase
    const file =
      selectedObsPhase === 'MSPSRPI'
        ? `${process.env.PUBLIC_URL}/data/nishatest/pulsars.json`
        : selectedObsPhase === 'MSPSRPI2'
          ? `${process.env.PUBLIC_URL}/data/nishatest/mspsrpi2Pulsars.json`
          : `${process.env.PUBLIC_URL}/data/nishatest/pulsars.json`;

    fetch(file)
      .then((response) => response.json())
      .then((data) => {
        // Transform the data if needed to match the expected format
        const formattedData = selectedObsPhase === 'MSPSRPI'
          ? data.pulsars.map((pulsar, index) => ({
            id: index.toString(),
            name: pulsar.name || pulsar.display_name,
            display_name: pulsar.display_name,
            phase: 'MSPSRPI',
            status: 'Complete',
            parallax: pulsar.distance?.value ? (1 / parseFloat(pulsar.distance.value.replace(/[^\d.-]/g, ''))) : null,
            properMotionRA: pulsar.binary_properties?.orbital_period || "N/A",
            properMotionDec: pulsar.period || "N/A",
            coordinates: {
              ra: pulsar.recommended_visualizations?.[0] || 'N/A',
              dec: pulsar.recommended_visualizations?.[1] || 'N/A'
            },
            description: pulsar.description,
            // Store the original pulsar data for full display
            originalData: pulsar
          }))
          : selectedObsPhase === 'MSPSRPI2'
            ? data.map((pulsar, index) => ({
              id: index.toString(),
              name: pulsar.name,
              phase: 'MSPSRPI2',
              status: pulsar.status || 'Planned',
              fluxDensity: pulsar.fluxDensity,
              distance: pulsar.distance,
              properMotion: pulsar.properMotion,
              sessionDuration: pulsar.sessionDuration,
              fluxCategory: pulsar.fluxCategory,
              position: pulsar.position,
              notes: pulsar.notes,
              searchSession: pulsar.searchSession,
              astrometrySession: pulsar.astrometrySession,
              description: pulsar.notes,
              memberships: pulsar.memberships || []
            }))
            : data;

        setPulsars(formattedData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading pulsar data:', error);
        setIsLoading(false);
      });
  }, [selectedObsPhase]);

  const filteredPulsars = useMemo(() => {
    return pulsars.filter((pulsar) => {
      const matchesSearch = pulsar.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesParallax = selectedParallaxRange === 'all' ||
        (selectedParallaxRange === 'low' && pulsar.parallax < 0.8) ||
        (selectedParallaxRange === 'medium' && pulsar.parallax >= 0.8 && pulsar.parallax < 1.5) ||
        (selectedParallaxRange === 'high' && pulsar.parallax >= 1.5);
      const matchesPhase = selectedObsPhase === 'all' || pulsar.phase === selectedObsPhase;
      const matchesStatus = selectedObsStatus === 'all' || pulsar.status === selectedObsStatus;
      return matchesSearch && matchesParallax && matchesPhase && matchesStatus;
    });
  }, [pulsars, searchQuery, selectedParallaxRange, selectedObsPhase, selectedObsStatus]);

  // Helper function to render pulsar property
  const renderPulsarProperty = (label, value) => {
    if (value === undefined || value === null) return null;
    return (
      <div>
        <h4 className="text-indigo-300 font-medium mb-1">{label}</h4>
        <p className="text-white">{value}</p>
      </div>
    );
  };

  // Helper function to render array as list
  const renderList = (items) => {
    if (!items || !items.length) return null;
    return (
      <ul className="list-disc pl-5 text-white">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-slate-900 to-black text-gray-100">
      <nav className="bg-slate-900/90 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/test-deploy" className="text-xl font-bold">MSPSR<span className="text-indigo-400">π</span></Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/test-deploy"
                className={`${location.pathname === '/test-deploy' ? 'text-indigo-400' : 'text-gray-300 hover:text-indigo-400'} px-3 py-2 font-medium`}
              >
                Home
              </Link>
              <Link
                to="/project"
                className={`${location.pathname === '/project' ? 'text-indigo-400' : 'text-gray-300 hover:text-indigo-400'} px-3 py-2 font-medium`}
              >
                Project
              </Link>
              <Link
                to="/data-release"
                className={`${location.pathname === '/data-release' ? 'text-indigo-400' : 'text-gray-300 hover:text-indigo-400'} px-3 py-2 font-medium`}
              >
                Data Release
              </Link>
              <Link
                to="/publications"
                className={`${location.pathname === '/publications' ? 'text-indigo-400' : 'text-gray-300 hover:text-indigo-400'} px-3 py-2 font-medium`}
              >
                Publications
              </Link>
              <Link
                to="/team"
                className={`${location.pathname === '/team' ? 'text-indigo-400' : 'text-gray-300 hover:text-indigo-400'} px-3 py-2 font-medium`}
              >
                Team
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative pt-16 pb-4">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-white mb-4">Pulsar Data Release</h1>
            <p className="text-xl text-indigo-200 mb-4">
              Explore our catalog of millisecond pulsar astrometric measurements
            </p>
            <p className="text-gray-300 mb-2">
              This catalog includes measurements for pulsars observed across MSPSRπ and MSPSRπ2 phases of the MSPSRπ program. Data is continuously updated as new observations
              are processed.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-white">Pulsar Catalog</h2>
            <p className="text-indigo-300">
              {isLoading ? 'Loading data...' : `${filteredPulsars.length} pulsars found`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedObsPhase('MSPSRPI2')}
              className={`inline-flex items-center px-4 py-2 border rounded-md text-sm transition duration-300 ${selectedObsPhase === 'MSPSRPI2' ? 'border-cyan-500 text-cyan-300 bg-slate-800/80' : 'border-cyan-500/30 text-cyan-300 bg-slate-900/60 hover:bg-slate-800/80'}`}
            >
              MSPSRPI2
            </button>
            <button
              onClick={() => setSelectedObsPhase('MSPSRPI')}
              className={`inline-flex items-center px-4 py-2 border rounded-md text-sm transition duration-300 ${selectedObsPhase === 'MSPSRPI' ? 'border-purple-500 text-purple-300 bg-slate-800/80' : 'border-purple-500/30 text-purple-300 bg-slate-900/60 hover:bg-slate-800/80'}`}
            >
              MSPSRPI
            </button>
            <Link to="#visualization" className="inline-flex items-center px-4 py-2 border border-cyan-500/30 rounded-md text-cyan-300 bg-slate-900/60 hover:bg-slate-800/80 transition duration-300">
              <Map className="mr-2 h-4 w-4" />
              View Visualizations
            </Link>
            <a href="/downloads/mspsrpi-data.zip" className="inline-flex items-center px-4 py-2 border border-indigo-500/30 rounded-md text-indigo-300 bg-slate-900/60 hover:bg-slate-800/80 transition duration-300">
              <Download className="mr-2 h-4 w-4" />
              Download Dataset
            </a>
          </div>
        </div>
        {/* Search Bar */}
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-cyan-500/70" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-700/80 rounded-md leading-5 bg-slate-800/60 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/30"
            placeholder="Search pulsar name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPulsars.map((pulsar) => (
            <div
              key={pulsar.id}
              onClick={() => setActivePulsar(pulsar)}
              className="cursor-pointer bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-5 rounded-2xl border border-slate-700 shadow-md hover:border-indigo-400 hover:shadow-indigo-500/30 transition"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-indigo-300 tracking-wide">{pulsar.name}</h3>
                {/* Status badge */}
                <span className={`text-xs px-2 py-1 rounded-full ${pulsar.status === 'Planned' ? 'bg-amber-900/60 text-amber-300' :
                  pulsar.status === 'Active' ? 'bg-green-900/60 text-green-300' :
                    pulsar.status === 'Complete' ? 'bg-blue-900/60 text-blue-300' :
                      'bg-gray-800 text-gray-300'
                  }`}>
                  {pulsar.status}
                </span>
              </div>

              {pulsar.phase === 'MSPSRPI2' ? (
                <div className="text-sm text-gray-300 space-y-2">
                  {/* Core information */}
                  <div className="flex justify-between items-center border-b border-slate-700 pb-1">
                    <span className="text-cyan-300 font-medium">Flux Density</span>
                    <span className="text-white">{pulsar.fluxDensity} mJy</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-700 pb-1">
                    <span className="text-cyan-300 font-medium">Distance</span>
                    <span className="text-white">{pulsar.distance} kpc</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-700 pb-1">
                    <span className="text-cyan-300 font-medium">Proper Motion</span>
                    <span className="text-white">{pulsar.properMotion}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-300 font-medium">Next Session</span>
                    <span className="text-white">{pulsar.sessionDuration}</span>
                  </div>

                  {/* Membership tags */}
                  {pulsar.memberships && pulsar.memberships.length > 0 && (
                    <div className="pt-2 mt-2 border-t border-slate-700">
                      <div className="flex flex-wrap gap-1">
                        {pulsar.memberships.map((org, idx) => (
                          <span key={idx} className={`text-xs px-2 py-0.5 rounded-md ${org === 'NANOGrav' ? 'bg-indigo-900/60 text-indigo-300' :
                            org === 'CPTA' ? 'bg-emerald-900/60 text-emerald-300' :
                              org === 'MPTA' ? 'bg-violet-900/60 text-violet-300' :
                                org === 'EPTA' ? 'bg-rose-900/60 text-rose-300' :
                                  org === 'PPTA' ? 'bg-amber-900/60 text-amber-300' :
                                    'bg-gray-800 text-gray-300'
                            }`}>
                            {org}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // For the MSPSRPI phase (keep existing code)
                pulsar.originalData?.astrometry && (
                  <div className="text-sm text-gray-300 space-y-2">
                    <div className="flex justify-between items-center border-b border-slate-700 pb-1">
                      <span className="text-indigo-400 font-medium">PM_RA</span>
                      <span className="text-white">{pulsar.originalData.astrometry.proper_motion_ra}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-700 pb-1">
                      <span className="text-indigo-400 font-medium">PM_Dec</span>
                      <span className="text-white">{pulsar.originalData.astrometry.proper_motion_dec}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-400 font-medium">Parallax</span>
                      <span className="text-white">{pulsar.originalData.astrometry.parallax}</span>
                    </div>
                  </div>
                )
              )}
            </div>
          ))}
        </div>

        {/* Pulsar Popup Modal */}
        {activePulsar && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-indigo-500/30 rounded-lg p-6 shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              {/* Header with name and close button */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-white">{activePulsar.name}</h3>
                <button
                  className="text-gray-400 hover:text-white text-2xl"
                  onClick={() => setActivePulsar(null)}
                >
                  ×
                </button>
              </div>

              {selectedObsPhase === 'MSPSRPI' && activePulsar.originalData ? (
                // Display MSPSRPi JSON data (keep existing code)
                <div className="space-y-4">
                  {/* Type and Discovery */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderPulsarProperty("Type", activePulsar.originalData.type)}
                    {activePulsar.originalData.discovery_year && (
                      <div>
                        <h4 className="text-indigo-300 font-medium mb-1">Discovery</h4>
                        <p className="text-white">
                          Discovered in {activePulsar.originalData.discovery_year}
                          {activePulsar.originalData.discovered_by && ` by ${activePulsar.originalData.discovered_by}`}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {activePulsar.originalData.description && (
                    <div>
                      <h4 className="text-indigo-300 font-medium mb-1">Description</h4>
                      <p className="text-gray-300">{activePulsar.originalData.description}</p>
                    </div>
                  )}

                  {/* Key Facts */}
                  {activePulsar.originalData.key_facts && (
                    <div>
                      <h4 className="text-indigo-300 font-medium mb-1">Key Facts</h4>
                      {renderList(activePulsar.originalData.key_facts)}
                    </div>
                  )}

                  {/* Period & Distance */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderPulsarProperty("Period", activePulsar.originalData.period)}
                    {activePulsar.originalData.distance && renderPulsarProperty(
                      "Distance",
                      `${activePulsar.originalData.distance.value} ${activePulsar.originalData.distance.uncertainty ? `± ${activePulsar.originalData.distance.uncertainty}` : ''}`
                    )}
                  </div>

                  {/* Binary Properties */}
                  {activePulsar.originalData.binary_properties && (
                    <div>
                      <h4 className="text-indigo-300 font-medium mb-1">Binary Properties</h4>
                      <div className="bg-slate-800/60 p-3 rounded">
                        {Object.entries(activePulsar.originalData.binary_properties).map(([key, value]) => (
                          <div key={key} className="mb-2">
                            <span className="text-cyan-300">{key.replace(/_/g, ' ')}:</span> <span className="text-white">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Astrometry Properties */}
                  {activePulsar.originalData.astrometry && (
                    <div>
                      <h4 className="text-indigo-300 font-medium mb-1">Astrometry</h4>
                      <div className="bg-slate-800/60 p-3 rounded">
                        {Object.entries(activePulsar.originalData.astrometry).map(([key, value]) => (
                          <div key={key} className="mb-2">
                            <span className="text-cyan-300">{key.replace(/_/g, ' ')}:</span> <span className="text-white">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Emission Properties */}
                  {activePulsar.originalData.emission_properties && (
                    <div>
                      <h4 className="text-indigo-300 font-medium mb-1">Emission Properties</h4>
                      <div className="bg-slate-800/60 p-3 rounded">
                        {Object.entries(activePulsar.originalData.emission_properties).map(([key, value]) => (
                          <div key={key} className="mb-2">
                            <span className="text-cyan-300">{key.replace(/_/g, ' ')}:</span> <span className="text-white">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Visualizations */}
                  {activePulsar.originalData.recommended_visualizations && (
                    <div>
                      <h4 className="text-indigo-300 font-medium mb-1">Recommended Visualizations</h4>
                      {renderList(activePulsar.originalData.recommended_visualizations)}
                    </div>
                  )}

                  {/* References */}
                  {activePulsar.originalData.references && (
                    <div>
                      <h4 className="text-indigo-300 font-medium mb-1">References</h4>
                      {renderList(activePulsar.originalData.references)}
                    </div>
                  )}

                  {/* Add a download button for this specific pulsar's data */}
                  <div className="mt-6 pt-4 border-t border-slate-700">
                    <button
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center justify-center"
                      onClick={() => {/* Handle download or link to detailed data */ }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download {activePulsar.name} Data
                    </button>
                  </div>
                </div>
              ) : (
                // Enhanced display for MSPSRPI2 data
                <div className="space-y-6">
                  {/* Main details section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Core properties column */}
                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                      <h4 className="text-lg font-semibold text-indigo-300 mb-3 border-b border-slate-700 pb-2">Core Properties</h4>
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-cyan-300 text-sm font-medium">Status</h5>
                          <p className="text-white">{activePulsar.status}</p>
                        </div>
                        <div>
                          <h5 className="text-cyan-300 text-sm font-medium">Flux Density</h5>
                          <p className="text-white">{activePulsar.fluxDensity} mJy</p>
                        </div>
                        <div>
                          <h5 className="text-cyan-300 text-sm font-medium">Distance</h5>
                          <p className="text-white">{activePulsar.distance} kpc</p>
                        </div>
                        <div>
                          <h5 className="text-cyan-300 text-sm font-medium">Flux Category</h5>
                          <p className="text-white">{activePulsar.fluxCategory}</p>
                        </div>
                      </div>
                    </div>

                    {/* Position information column */}
                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                      <h4 className="text-lg font-semibold text-indigo-300 mb-3 border-b border-slate-700 pb-2">Position</h4>
                      {activePulsar.position ? (
                        <div className="space-y-3">
                          <div>
                            <h5 className="text-cyan-300 text-sm font-medium">Right Ascension</h5>
                            <p className="text-white font-mono">{activePulsar.position.rightAscension}</p>
                          </div>
                          <div>
                            <h5 className="text-cyan-300 text-sm font-medium">Declination</h5>
                            <p className="text-white font-mono">{activePulsar.position.declination}</p>
                          </div>
                          <div>
                            <h5 className="text-cyan-300 text-sm font-medium">Proper Motion</h5>
                            <p className="text-white">{activePulsar.properMotion}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-400 italic">Position data not available</p>
                      )}
                    </div>

                    {/* Observation details column */}
                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                      <h4 className="text-lg font-semibold text-indigo-300 mb-3 border-b border-slate-700 pb-2">Observation Schedule</h4>
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-cyan-300 text-sm font-medium">Session Duration</h5>
                          <p className="text-white">{activePulsar.sessionDuration}</p>
                        </div>
                        <div>
                          <h5 className="text-cyan-300 text-sm font-medium">Search Session</h5>
                          <p className="text-white">{activePulsar.searchSession}</p>
                        </div>
                        <div>
                          <h5 className="text-cyan-300 text-sm font-medium">Astrometry Session</h5>
                          <p className="text-white">{activePulsar.astrometrySession}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes section */}
                  {activePulsar.notes && (
                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                      <h4 className="text-lg font-semibold text-indigo-300 mb-2">Notes</h4>
                      <p className="text-gray-300">{activePulsar.notes}</p>
                    </div>
                  )}

                  {/* Download button */}
                  <div className="mt-6 pt-4 border-t border-slate-700">
                    <button
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center justify-center"
                      onClick={() => {/* Handle download or link to detailed data */ }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download {activePulsar.name} Data
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Data Visualization Section */}
        <div id="visualization" className="pt-12 mb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Data Visualizations</h2>
            <p className="text-indigo-300">
              Interactive visualizations of MSPSRπ parallax and proper motion measurements
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Galactic Distribution */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 shadow-lg">
              <h3 className="text-lg font-semibold text-cyan-300 mb-3">Galactic Distribution</h3>
              <div className="h-80 bg-slate-800/50 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <svg className="mx-auto h-48 w-48 text-cyan-300" viewBox="0 0 400 400">
                    <ellipse cx="200" cy="200" rx="150" ry="30" stroke="#0e7490" strokeWidth="1" fill="none" />
                    <path d="M200,200 C240,180 270,140 290,90" stroke="#0e7490" strokeWidth="1" fill="none" />
                    <path d="M200,200 C160,180 130,140 110,90" stroke="#0e7490" strokeWidth="1" fill="none" />
                    <path d="M200,200 C240,220 270,260 290,310" stroke="#0e7490" strokeWidth="1" fill="none" />
                    <path d="M200,200 C160,220 130,260 110,310" stroke="#0e7490" strokeWidth="1" fill="none" />
                    <circle cx="200" cy="200" r="8" fill="#0e7490" />
                    <circle cx="180" cy="170" r="3" fill="#0ea5e9" />
                    <circle cx="220" cy="190" r="3" fill="#0ea5e9" />
                    <circle cx="170" cy="220" r="3" fill="#0ea5e9" />
                    <circle cx="240" cy="160" r="3" fill="#0ea5e9" />
                    <circle cx="160" cy="230" r="3" fill="#0ea5e9" />
                    <circle cx="210" cy="240" r="3" fill="#0ea5e9" />
                    <circle cx="250" cy="210" r="3" fill="#0ea5e9" />
                    <circle cx="150" cy="190" r="3" fill="#0ea5e9" />
                    <circle cx="230" cy="140" r="3" fill="#0ea5e9" />
                    <circle cx="170" cy="250" r="3" fill="#0ea5e9" />
                  </svg>
                  <p className="text-gray-400 text-sm mt-2">Galactic distribution of observed pulsars</p>
                </div>
              </div>
            </div>

            {/* Parallax vs Proper Motion */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-indigo-500/30 rounded-lg p-4 shadow-lg">
              <h3 className="text-lg font-semibold text-indigo-300 mb-3">Parallax vs. Proper Motion</h3>
              <div className="h-80 bg-slate-800/50 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <svg className="mx-auto h-48 w-48 text-indigo-300" viewBox="0 0 400 400">
                    <line x1="50" y1="350" x2="350" y2="350" stroke="#6366f1" strokeWidth="2" />
                    <line x1="50" y1="350" x2="50" y2="50" stroke="#6366f1" strokeWidth="2" />
                    <text x="200" y="380" textAnchor="middle" fill="#6366f1" fontSize="12">Parallax (mas)</text>
                    <text x="30" y="200" textAnchor="middle" fill="#6366f1" fontSize="12" transform="rotate(-90, 20, 200)">Proper Motion (mas/yr)</text>
                    <circle cx="100" cy="300" r="4" fill="#818cf8" />
                    <circle cx="150" cy="250" r="4" fill="#818cf8" />
                    <circle cx="120" cy="280" r="4" fill="#818cf8" />
                    <circle cx="200" cy="200" r="4" fill="#818cf8" />
                    <circle cx="250" cy="150" r="4" fill="#818cf8" />
                    <circle cx="180" cy="220" r="4" fill="#818cf8" />
                    <circle cx="220" cy="180" r="4" fill="#818cf8" />
                    <circle cx="140" cy="260" r="4" fill="#818cf8" />
                    <circle cx="280" cy="120" r="4" fill="#818cf8" />
                    <circle cx="300" cy="100" r="4" fill="#818cf8" />
                  </svg>
                  <p className="text-gray-400 text-sm mt-2">Correlation between parallax and proper motion</p>
                </div>
              </div>
            </div>
          </div>
          {/* Pulsar Types Comparison */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-pink-500/30 rounded-lg p-4 shadow-lg">
            <h3 className="text-lg font-semibold text-pink-300 mb-3">Pulsar Types Comparison</h3>
            <div className="h-80 bg-slate-800/50 rounded-md flex items-center justify-center">
              <div className="text-center">
                <svg className="mx-auto h-48 w-48 text-pink-300" viewBox="0 0 400 400">
                  {/* Pie chart segments (fake data for now) */}
                  <circle cx="200" cy="200" r="100" fill="none" stroke="#f472b6" strokeWidth="50" strokeDasharray="94 206" strokeDashoffset="0" />
                  <circle cx="200" cy="200" r="100" fill="none" stroke="#ec4899" strokeWidth="50" strokeDasharray="66 234" strokeDashoffset="-94" />
                  <circle cx="200" cy="200" r="100" fill="none" stroke="#db2777" strokeWidth="50" strokeDasharray="40 260" strokeDashoffset="-160" />

                  {/* Center circle */}
                  <circle cx="200" cy="200" r="30" fill="#1e1b4b" />
                </svg>
                <div className="text-sm mt-3 space-y-1">
                  <p><span className="inline-block w-3 h-3 mr-2 rounded-full bg-pink-300"></span>Millisecond</p>
                  <p><span className="inline-block w-3 h-3 mr-2 rounded-full bg-pink-400"></span>Binary</p>
                  <p><span className="inline-block w-3 h-3 mr-2 rounded-full bg-pink-500"></span>Solitary</p>
                </div>
                <p className="text-gray-400 text-sm mt-2">Distribution of pulsar types in the dataset</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <a href="/visualizations" className="inline-flex items-center px-5 py-3 border border-cyan-500/40 rounded-md text-cyan-300 bg-slate-900/60 hover:bg-slate-800/80 transition duration-300">
              View Full Interactive Visualizations <ChevronRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Data Releases Section */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Data Releases</h2>
            <p className="text-indigo-300">
              Download complete datasets from each project phase
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-5 shadow-lg">
              <h3 className="text-lg font-semibold text-green-300 mb-2">PSRPI Data Release 1.0</h3>
              <p className="text-gray-300 mb-4">
                Original pulsar parallax data from 2011-2013 observations of 60 pulsars.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Released: May 2014</span>
                <a href="/downloads/psrpi-v1.0.zip" className="inline-flex items-center px-3 py-1.5 border border-green-500/30 rounded-md text-green-300 text-sm bg-slate-900/60 hover:bg-slate-800/80 transition duration-300">
                  <Download className="mr-1 h-4 w-4" />
                  Download
                </a>
              </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-sm border border-purple-500/30 rounded-lg p-5 shadow-lg">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">MSPSRPI Data Release 2.0</h3>
              <p className="text-gray-300 mb-4">
                Millisecond pulsar data from 2015-2018 observations of 18 millisecond pulsars.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Released: December 2019</span>
                <a href="/downloads/mspsrpi-v2.0.zip" className="inline-flex items-center px-3 py-1.5 border border-purple-500/30 rounded-md text-purple-300 text-sm bg-slate-900/60 hover:bg-slate-800/80 transition duration-300">
                  <Download className="mr-1 h-4 w-4" />
                  Download
                </a>
              </div>
            </div>
            <div className="bg-slate-900/60 backdrop-blur-sm border border-blue-500/30 rounded-lg p-5 shadow-lg">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">MSPSRPI2 Initial Data</h3>
              <p className="text-gray-300 mb-4">
                Preliminary data from Phase 2 observations (27 of 44 targets completed).
              </p>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Updated: March 2025</span>
                <a href="/downloads/mspsrpi2-initial.zip" className="inline-flex items-center px-3 py-1.5 border border-blue-500/30 rounded-md text-blue-300 text-sm bg-slate-900/60 hover:bg-slate-800/80 transition duration-300">
                  <Download className="mr-1 h-4 w-4" />
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 border-t border-slate-800/50 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © 2025 Pulsar Astrometry Research Initiative. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataReleasePage;
