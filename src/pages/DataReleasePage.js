import React, { useState, useEffect, useMemo } from 'react';
import PulsarGalaxy from './Galatic'
import Navbar from './Navbar'; // Import the Navbar component
import DownloadModal from './DownloadModal';
import BatchDownloadHandler from './BatchDownloadHandler';
import {
  Search,
  Download,
  Map,
  ChevronRight,
  Filter,
  ExternalLink,
  MaximizeIcon,
  ZoomIn
} from 'lucide-react';

const DataReleasePage = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParallaxRange, setSelectedParallaxRange] = useState('all');
  const [selectedObsPhase, setSelectedObsPhase] = useState('MSPSRPI2');
  const [selectedObsStatus, setSelectedObsStatus] = useState('all');
  const [selectedMembership, setSelectedMembership] = useState('all');
  const [pulsars, setPulsars] = useState([]);
  const [activePulsar, setActivePulsar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGalacticMaximized, setIsGalacticMaximized] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeVisualization, setActiveVisualization] = useState(null);

  const [downloadPulsar, setDownloadPulsar] = useState(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const [allPhasesPulsars, setAllPhasesPulsars] = useState({
    PSRPI: [],
    MSPSRPI: [],
    MSPSRPI2: []
  });

  const { handleBatchDownloadClick, BatchDownloadModalComponent } = BatchDownloadHandler({
    allPhasesPulsars,
    currentPulsars: pulsars
  });

  //check if the pulsar has visualisations
  const hasPulsarVisualizations = (pulsar) => {
    return true;
  };

  //Handling the download button clicking
  const handleDownloadClick = (pulsar, e) => {
    if (e) e.stopPropagation(); // 防止触发其他点击事件
    setDownloadPulsar(pulsar);
    setIsDownloadModalOpen(true);
  };

  //Closing download modal
  const closeDownloadModal = () => {
    setIsDownloadModalOpen(false);
    setDownloadPulsar(null);
  };

  const showFullScreenVisualization = (visualization, pulsarName) => {
    setActiveVisualization({
      ...visualization,
      pulsarName
    });
  };

  useEffect(() => {
    setIsLoading(true);

    // 加载所有三个阶段的数据
    const loadAllPhasesData = async () => {
      try {
        if (allPhasesPulsars && Object.keys(allPhasesPulsars).length > 0) {
          setPulsars(allPhasesPulsars[selectedObsPhase] || []);
        }
        // 加载 MSPSRPI 数据
        const mspsrpiResponse = await fetch(`${process.env.PUBLIC_URL}/data/nishatest/pulsars.json`);
        const mspsrpiData = await mspsrpiResponse.json();

        // 加载 MSPSRPI2 数据
        const mspsrpi2Response = await fetch(`${process.env.PUBLIC_URL}/data/nishatest/mspsrpi2Pulsars.json`);
        const mspsrpi2Data = await mspsrpi2Response.json();

        // 假设 PSRPI 数据在另一个文件中，如果不存在，可以准备一个空数组
        let psrpiData = [];
        try {
          const psrpiResponse = await fetch(`${process.env.PUBLIC_URL}/data/nishatest/psrpiPulsars.json`);
          psrpiData = await psrpiResponse.json();
        } catch (error) {
          console.warn('PSRPI data file not found, using empty array', error);
        }

        // 格式化并存储所有阶段的数据
        setAllPhasesPulsars({
          PSRPI: formatPSRPIData(psrpiData),
          MSPSRPI: formatMSPSRPIData(mspsrpiData),
          MSPSRPI2: formatMSPSRPI2Data(mspsrpi2Data)
        });

        // 加载当前选择的阶段数据
        const currentPhaseData = selectedObsPhase === 'MSPSRPI'
          ? formatMSPSRPIData(mspsrpiData)
          : selectedObsPhase === 'MSPSRPI2'
            ? formatMSPSRPI2Data(mspsrpi2Data)
            : formatPSRPIData(psrpiData);

        setPulsars(currentPhaseData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading pulsar data:', error);
        setIsLoading(false);
      }
    };

    loadAllPhasesData();
  }, [selectedObsPhase]);

  // Format PSRPI data (psrpiPulsars.json)
  const formatPSRPIData = (data) => {
    // Check if data is an array or has a pulsars property
    const pulsarsArray = Array.isArray(data) ? data : (data.pulsars || []);

    return pulsarsArray.map((pulsar, index) => ({
      id: index.toString(),
      name: pulsar.name || `PSR ${pulsar.name}`,
      display_name: pulsar.display_name || pulsar.name,
      phase: 'PSRPI',
      status: 'Complete',
      parallax: pulsar.astrometry?.parallax || 'N/A',
      distance: pulsar.distance?.value || 'N/A',
      properMotionRA: pulsar.astrometry?.proper_motion_ra || 'N/A',
      properMotionDec: pulsar.astrometry?.proper_motion_dec || 'N/A',
      position: pulsar.position || { rightAscension: 'N/A', declination: 'N/A' },
      type: pulsar.type || 'Pulsar',
      description: pulsar.description || '',
      memberships: pulsar.memberships || [],
      visualizations: pulsar.visualizations || [],
      // Store the original pulsar data for full display
      originalData: pulsar
    }));
  };

  // Format MSPSRPI data (pulsars.json)
  const formatMSPSRPIData = (data) => {
    // Check if data is an array or has a pulsars property
    const pulsarsArray = Array.isArray(data) ? data : (data.pulsars || []);

    return pulsarsArray.map((pulsar, index) => ({
      id: index.toString(),
      name: pulsar.name || pulsar.display_name,
      display_name: pulsar.display_name,
      phase: 'MSPSRPI',
      status: 'Complete',
      parallax: pulsar.astrometry?.parallax || 'N/A',
      distance: pulsar.distance?.value || 'N/A',
      properMotionRA: pulsar.astrometry?.proper_motion_ra || 'N/A',
      properMotionDec: pulsar.astrometry?.proper_motion_dec || 'N/A',
      position: pulsar.position || { rightAscension: 'N/A', declination: 'N/A' },
      type: pulsar.type || 'Unknown',
      description: pulsar.description || '',
      memberships: pulsar.memberships || [],
      visualizations: pulsar.visualizations,
      // Store the original pulsar data for full display
      originalData: pulsar
    }));
  };

  // Format MSPSRPI2 data (mspsrpi2Pulsars.json)
  const formatMSPSRPI2Data = (data) => {
    return (Array.isArray(data) ? data : []).map((pulsar, index) => ({
      id: index.toString(),
      name: pulsar.name,
      phase: 'MSPSRPI2',
      status: pulsar.status || 'Planned',
      fluxDensity: pulsar.fluxDensity,
      distance: pulsar.distance,
      properMotion: pulsar.properMotion,
      properMotionRA: 'TBD', // Placeholder
      properMotionDec: 'TBD', // Placeholder
      sessionDuration: pulsar.sessionDuration,
      fluxCategory: pulsar.fluxCategory,
      position: pulsar.position,
      referenceDate: pulsar.referenceDate || 'N/A',
      notes: pulsar.notes,
      type: pulsar.fluxCategory, // Using fluxCategory as a type equivalent
      searchSession: pulsar.searchSession,
      astrometrySession: pulsar.astrometrySession,
      description: pulsar.notes,
      memberships: pulsar.memberships || [],
      visualizations: pulsar.visualizations,
      originalData: pulsar
    }));
  };

  // Get unique list of memberships from pulsars
  const uniqueMemberships = useMemo(() => {
    const memberships = new Set();
    pulsars.forEach(pulsar => {
      if (Array.isArray(pulsar.memberships)) {
        pulsar.memberships.forEach(membership => memberships.add(membership));
      }
    });
    return Array.from(memberships);
  }, [pulsars]);

  const filteredPulsars = useMemo(() => {
    return pulsars.filter((pulsar) => {
      const matchesSearch = pulsar.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesParallax = selectedParallaxRange === 'all' ||
        (selectedParallaxRange === 'low' && parseFloat(pulsar.distance) < 1) ||
        (selectedParallaxRange === 'medium' && parseFloat(pulsar.distance) >= 1 && parseFloat(pulsar.distance) < 2) ||
        (selectedParallaxRange === 'high' && parseFloat(pulsar.distance) >= 2);
      const matchesPhase = selectedObsPhase === 'all' || pulsar.phase === selectedObsPhase;
      const matchesStatus = selectedObsStatus === 'all' || pulsar.status === selectedObsStatus;
      const matchesMembership = selectedMembership === 'all' ||
        (Array.isArray(pulsar.memberships) && pulsar.memberships.includes(selectedMembership));

      return matchesSearch && matchesParallax && matchesPhase && matchesStatus && matchesMembership;
    });
  }, [pulsars, searchQuery, selectedParallaxRange, selectedObsPhase, selectedObsStatus, selectedMembership]);

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

      {/* Use the Navbar component instead of inline navbar */}
      <Navbar colorTheme="default" />

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
            <button
              onClick={() => setSelectedObsPhase('PSRPI')}
              className={`inline-flex items-center px-4 py-2 border rounded-md text-sm transition duration-300 ${selectedObsPhase === 'PSRPI' ? 'border-teal-500 text-teal-300 bg-slate-800/80' : 'border-teal-500/30 text-teal-300 bg-slate-900/60 hover:bg-slate-800/80'}`}
            >
              PSRPI
            </button>
            <button
              onClick={() => {
                document.getElementById('visualization').scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center px-4 py-2 border border-cyan-500/30 rounded-md text-cyan-300 bg-slate-900/60 hover:bg-slate-800/80 transition duration-300"
            >
              <Map className="mr-2 h-4 w-4" />
              View Visualizations
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mb-6 bg-slate-800/60 p-4 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-indigo-300 mb-3">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select
                  className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-md text-white"
                  value={selectedObsStatus}
                  onChange={(e) => setSelectedObsStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="Planned">Planned</option>
                  <option value="Active">Active</option>
                  <option value="Complete">Complete</option>
                </select>
              </div>

              {/* Distance Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Distance Range</label>
                <select
                  className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-md text-white"
                  value={selectedParallaxRange}
                  onChange={(e) => setSelectedParallaxRange(e.target.value)}
                >
                  <option value="all">All Distances</option>
                  <option value="low">Near (&lt; 1 kpc)</option>
                  <option value="medium">Medium (1-2 kpc)</option>
                  <option value="high">Far (&gt; 2 kpc)</option>
                </select>
              </div>

              {/* Membership Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Membership</label>
                <select
                  className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-md text-white"
                  value={selectedMembership}
                  onChange={(e) => setSelectedMembership(e.target.value)}
                >
                  <option value="all">All Memberships</option>
                  {uniqueMemberships.map((membership) => (
                    <option key={membership} value={membership}>{membership}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

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
              ) : pulsar.phase === 'MSPSRPI' ? (
                // Display for MSPSRPI phase
                <div className="text-sm text-gray-300 space-y-2">
                  {pulsar.originalData?.astrometry && (
                    <>
                      <div className="flex justify-between items-center border-b border-slate-700 pb-1">
                        <span className="text-purple-400 font-medium">Type</span>
                        <span className="text-white">{pulsar.type || "Unknown"}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-700 pb-1">
                        <span className="text-purple-400 font-medium">Parallax</span>
                        <span className="text-white">{pulsar.parallax || "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-700 pb-1">
                        <span className="text-purple-400 font-medium">PM_RA</span>
                        <span className="text-white">{pulsar.properMotionRA}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-400 font-medium">PM_Dec</span>
                        <span className="text-white">{pulsar.properMotionDec}</span>
                      </div>
                    </>
                  )}

                  {/* Membership tags if available */}
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
                // Display for PSRPI phase
                <div className="text-sm text-gray-300 space-y-2">
                  {pulsar.originalData?.astrometry && (
                    <>
                      <div className="flex justify-between items-center border-b border-slate-700 pb-1">
                        <span className="text-teal-400 font-medium">Type</span>
                        <span className="text-white">{pulsar.type || "Pulsar"}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-700 pb-1">
                        <span className="text-teal-400 font-medium">Parallax</span>
                        <span className="text-white">{pulsar.parallax || "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-700 pb-1">
                        <span className="text-teal-400 font-medium">PM_RA</span>
                        <span className="text-white">{pulsar.properMotionRA}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-teal-400 font-medium">PM_Dec</span>
                        <span className="text-white">{pulsar.properMotionDec}</span>
                      </div>
                    </>
                  )}

                  {/* Membership tags if available */}
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
              )}
            </div>
          ))}
        </div>

        {/* Pulsar Popup Modal */}
        {activePulsar && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              // Close the tail card when users click outside of the tail card
              if (e.target === e.currentTarget) {
                setActivePulsar(null);
              }
            }}
          >
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
                // Display MSPSRPi JSON data
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

                  {/* Position */}
                  {activePulsar.originalData.position && (
                    <div>
                      <h4 className="text-indigo-300 font-medium mb-1">Position</h4>
                      <div className="bg-slate-800/60 p-3 rounded">
                        <div className="mb-2">
                          <span className="text-cyan-300">Right Ascension:</span>
                          <span className="text-white ml-2">{activePulsar.originalData.position.rightAscension}</span>
                        </div>
                        <div>
                          <span className="text-cyan-300">Declination:</span>
                          <span className="text-white ml-2">{activePulsar.originalData.position.declination}</span>
                        </div>
                      </div>
                    </div>
                  )}

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

                  {/* 2D visualization section - Replaced the Recommended Visualizations */}
                  <div className="mt-4 pt-3 border-t border-slate-700">
                    <h4 className="text-indigo-300 font-medium mb-3">Visualizations</h4>

                    {/* Check if visualization data exists */}
                    {activePulsar.visualizations && activePulsar.visualizations.length > 0 ? (
                      // Display grid layout when visualization data is available
                      <div className={`grid ${activePulsar.visualizations.length === 1 ? 'grid-cols-1' :
                        activePulsar.visualizations.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                          'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'} gap-4`}>

                        {activePulsar.visualizations.map((viz, index) => (
                          <div key={index} className="bg-slate-800/30 rounded-lg p-3 border border-slate-700">
                            <div className="flex justify-between items-start">
                              <h5 className="text-cyan-300 text-sm font-medium mb-2">{viz.title}</h5>
                              {/* Add Maximize button */}
                              <button
                                className="text-cyan-400 hover:text-cyan-300"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  showFullScreenVisualization(viz, activePulsar.name);
                                }}
                                title="View full screen"
                              >
                                <ZoomIn size={16} />
                              </button>
                            </div>

                            {/* Chart image container */}
                            <div className="relative aspect-[4/3] bg-slate-800/50 rounded-md overflow-hidden flex items-center justify-center">
                              {/* For MSPSRPI phase, directly attempt to load images */}
                              <img
                                src={`${process.env.PUBLIC_URL}${encodeURI(viz.path)}`}
                                alt={`${activePulsar.name} - ${viz.title}`}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  // Display placeholder and overlay when image loading fails
                                  e.target.src = `${process.env.PUBLIC_URL}/images/placeholder-chart.svg`;

                                  // Dynamically create overlay
                                  const parent = e.target.parentNode;
                                  // Check if overlay already exists to avoid duplicate creation
                                  if (!parent.querySelector('.visualization-overlay')) {
                                    const overlay = document.createElement('div');
                                    overlay.className = 'absolute inset-0 flex flex-col items-center justify-center bg-slate-800/80 p-4 text-center visualization-overlay';
                                    overlay.innerHTML = `
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p class="text-sm text-indigo-300 font-medium">Visualization</p>
                      <p class="text-xs text-gray-400 mt-1">Digitization in progress</p>
                    `;
                                    parent.appendChild(overlay);
                                  }
                                }}
                              />
                            </div>

                            {/* Chart description text */}
                            {viz.description && (
                              <p className="mt-2 text-xs text-gray-400">{viz.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      // When no visualization data is available, use recommended visualizations as prompts
                      <div className="bg-slate-800/40 rounded-lg p-6 text-center">
                        <div className="text-gray-400 mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                          </svg>
                          <p className="text-lg font-medium text-indigo-300">Visualizations Being Prepared</p>
                        </div>
                        <p className="text-gray-400">
                          Visualizations for this historical pulsar data are currently being digitized from archival records.
                          Check back soon for updates.
                        </p>
                        {activePulsar.originalData.recommended_visualizations && activePulsar.originalData.recommended_visualizations.length > 0 && (
                          <div className="mt-4 border-t border-slate-700 pt-4">
                            <p className="text-sm font-medium text-cyan-300 mb-2">Planned Visualizations:</p>
                            <ul className="text-left list-disc pl-6 text-gray-400 text-sm">
                              {activePulsar.originalData.recommended_visualizations.map((viz, index) => (
                                <li key={index}>{viz}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                    )}
                  </div>
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
                      onClick={(e) => handleDownloadClick(activePulsar, e)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download {activePulsar.name} Data
                    </button>
                  </div>
                </div>
              ) : activePulsar.phase === 'PSRPI' ? (
                // Display for PSRPI phase
                <div className="space-y-4">
                  {/* Type and Discovery */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderPulsarProperty("Type", activePulsar.originalData?.type || "Pulsar")}
                    {activePulsar.originalData?.discovery_year && (
                      <div>
                        <h4 className="text-teal-300 font-medium mb-1">Discovery</h4>
                        <p className="text-white">
                          Discovered in {activePulsar.originalData.discovery_year}
                          {activePulsar.originalData.discovered_by && ` by ${activePulsar.originalData.discovered_by}`}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {activePulsar.originalData?.description && (
                    <div>
                      <h4 className="text-teal-300 font-medium mb-1">Description</h4>
                      <p className="text-gray-300">{activePulsar.originalData.description}</p>
                    </div>
                  )}

                  {/* Key Facts */}
                  {activePulsar.originalData?.key_facts && (
                    <div>
                      <h4 className="text-teal-300 font-medium mb-1">Key Facts</h4>
                      {renderList(activePulsar.originalData.key_facts)}
                    </div>
                  )}

                  {/* Period & Distance */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderPulsarProperty("Period", activePulsar.originalData?.period)}
                    {activePulsar.originalData?.distance && renderPulsarProperty(
                      "Distance",
                      `${activePulsar.originalData.distance.value} ${activePulsar.originalData.distance.uncertainty ? ` ${activePulsar.originalData.distance.uncertainty}` : ''}`
                    )}
                  </div>

                  {/* Position */}
                  {activePulsar.originalData?.position && (
                    <div>
                      <h4 className="text-teal-300 font-medium mb-1">Position</h4>
                      <div className="bg-slate-800/60 p-3 rounded">
                        <div className="mb-2">
                          <span className="text-yellow-300">Right Ascension:</span>
                          <span className="text-white ml-2">{activePulsar.originalData.position.rightAscension}</span>
                        </div>
                        <div>
                          <span className="text-yellow-300">Declination:</span>
                          <span className="text-white ml-2">{activePulsar.originalData.position.declination}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Astrometry Properties */}
                  {activePulsar.originalData?.astrometry && (
                    <div>
                      <h4 className="text-teal-300 font-medium mb-1">Astrometry</h4>
                      <div className="bg-slate-800/60 p-3 rounded">
                        {Object.entries(activePulsar.originalData.astrometry).map(([key, value]) => (
                          <div key={key} className="mb-2">
                            <span className="text-teal-300">{key.replace(/_/g, ' ')}:</span> <span className="text-white">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2D visualization section */}
                  <div className="mt-4 pt-3 border-t border-slate-700">
                    <h4 className="text-teal-300 font-medium mb-3">Visualizations</h4>

                    {/* Check if visualization data exists */}
                    {activePulsar.visualizations && activePulsar.visualizations.length > 0 ? (
                      // Display grid layout when visualization data is available
                      <div className={`grid ${activePulsar.visualizations.length === 1 ? 'grid-cols-1' :
                        activePulsar.visualizations.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                          'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'} gap-4`}>

                        {activePulsar.visualizations.map((viz, index) => (
                          <div key={index} className="bg-slate-800/30 rounded-lg p-3 border border-slate-700">
                            <div className="flex justify-between items-start">
                              <h5 className="text-teal-300 text-sm font-medium mb-2">{viz.title}</h5>
                              {/* Add Maximize button */}
                              <button
                                className="text-teal-400 hover:text-teal-300"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  showFullScreenVisualization(viz, activePulsar.name);
                                }}
                                title="View full screen"
                              >
                                <ZoomIn size={16} />
                              </button>
                            </div>

                            {/* Chart image container */}
                            <div className="relative aspect-[4/3] bg-slate-800/50 rounded-md overflow-hidden flex items-center justify-center">
                              <img
                                src={`${process.env.PUBLIC_URL}${encodeURI(viz.path)}`}
                                alt={`${activePulsar.name} - ${viz.title}`}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  // Display placeholder when image loading fails
                                  e.target.src = `${process.env.PUBLIC_URL}/images/placeholder-chart.svg`;

                                  // Add visualization overlay
                                  const parent = e.target.parentNode;
                                  if (!parent.querySelector('.visualization-overlay')) {
                                    const overlay = document.createElement('div');
                                    overlay.className = 'absolute inset-0 flex flex-col items-center justify-center bg-slate-800/80 p-4 text-center visualization-overlay';
                                    overlay.innerHTML = `
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-teal-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p class="text-sm text-teal-300 font-medium">Visualization</p>
                                    <p class="text-xs text-gray-400 mt-1">Data digitization in progress</p>
                                  `;
                                    parent.appendChild(overlay);
                                  }
                                }}
                              />
                            </div>

                            {/* Chart description text */}
                            {viz.description && (
                              <p className="mt-2 text-xs text-gray-400">{viz.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      // When no visualization data is available
                      <div className="bg-slate-800/40 rounded-lg p-6 text-center">
                        <div className="text-gray-400 mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                          </svg>
                          <p className="text-lg font-medium text-teal-300">PSRPI Visualizations</p>
                        </div>
                        <p className="text-gray-400">
                          Visualizations for historical PSRPI pulsars are currently being digitized from archive records.
                          Check back soon for available visualizations.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* References */}
                  {activePulsar.originalData?.references && (
                    <div>
                      <h4 className="text-teal-300 font-medium mb-1">References</h4>
                      {renderList(activePulsar.originalData.references)}
                    </div>
                  )}

                  {/* Add a download button for this specific pulsar's data */}
                  <div className="mt-6 pt-4 border-t border-slate-700">
                    <button
                      className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md flex items-center justify-center"
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
                          <div>
                            <h5 className="text-cyan-300 text-sm font-medium">Reference Date (MJD)</h5>
                            <p className="text-white">{activePulsar.referenceDate}</p>
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

                  {/* Membership section */}
                  {activePulsar.memberships && activePulsar.memberships.length > 0 && (
                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                      <h4 className="text-lg font-semibold text-indigo-300 mb-3">Collaboration Memberships</h4>
                      <div className="flex flex-wrap gap-2">
                        {activePulsar.memberships.map((org, idx) => (
                          <span key={idx} className={`px-3 py-1.5 rounded-lg text-sm ${org === 'NANOGrav' ? 'bg-indigo-900/60 text-indigo-300 border border-indigo-500/30' :
                            org === 'CPTA' ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/30' :
                              org === 'MPTA' ? 'bg-violet-900/60 text-violet-300 border border-violet-500/30' :
                                org === 'EPTA' ? 'bg-rose-900/60 text-rose-300 border border-rose-500/30' :
                                  org === 'PPTA' ? 'bg-amber-900/60 text-amber-300 border border-amber-500/30' :
                                    'bg-gray-800 text-gray-300 border border-gray-700'
                            }`}>
                            {org}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes section */}
                  {activePulsar.notes && (
                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                      <h4 className="text-lg font-semibold text-indigo-300 mb-2">Notes</h4>
                      <p className="text-gray-300">{activePulsar.notes}</p>
                    </div>
                  )}

                  {/* 2D visualization section */}
                  <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                    <h4 className="text-lg font-semibold text-indigo-300 mb-4">Pulsar Visualizations</h4>

                    {/* Check if visualization data exists */}
                    {activePulsar.visualizations && activePulsar.visualizations.length > 0 ? (
                      /* Display grid layout when visualization data is available */
                      <div className={`grid ${activePulsar.visualizations.length === 1 ? 'grid-cols-1' :
                        activePulsar.visualizations.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                          'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'} gap-4`}>

                        {activePulsar.visualizations.map((viz, index) => (
                          <div key={index} className="bg-slate-900/60 rounded-lg p-3 border border-slate-700">
                            <div className="flex justify-between items-start">
                              <h5 className="text-cyan-300 text-sm font-medium mb-2">{viz.title}</h5>
                              {/* Add Maximize view button */}
                              <button
                                className="text-cyan-400 hover:text-cyan-300"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  showFullScreenVisualization(viz, activePulsar.name);
                                }}
                                title="View full screen"
                              >
                                <ZoomIn size={16} />
                              </button>
                            </div>

                            {/* Chart image container */}
                            <div className="relative aspect-[4/3] bg-slate-800/50 rounded-md overflow-hidden flex items-center justify-center">
                              {activePulsar.status === 'Planned' ? (
                                // For planned pulsars, display status placeholder
                                <div className="text-center p-4">
                                  <div className="text-amber-400 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm font-medium">Coming Soon</p>
                                  </div>
                                  <p className="text-gray-400 text-xs">
                                    {activePulsar.status === 'Planned' ?
                                      'Visualizations will be available after observations begin.' :
                                      'Visualizations are being processed from ongoing observations.'}
                                  </p>
                                </div>
                              ) : (
                                // For completed pulsars, attempt to load images
                                <img
                                  src={`${process.env.PUBLIC_URL}${encodeURI(viz.path)}`}
                                  alt={`${activePulsar.name} - ${viz.title}`}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    // Display placeholder and overlay when image loading fails
                                    e.target.src = `${process.env.PUBLIC_URL}/images/placeholder-chart.svg`;
                                    e.target.alt = "Visualization not available";
                                  }}
                                />
                              )}
                            </div>

                            {/* Chart description text */}
                            {viz.description && (
                              <p className="mt-2 text-xs text-gray-400">{viz.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* When no visualization data is available, use recommended visualizations as prompts */
                      <div className="bg-slate-900/60 rounded-lg p-6 text-center">
                        <div className="text-gray-400 mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                          </svg>
                          <p className="text-lg font-medium text-cyan-300">No Visualizations Available Yet</p>
                        </div>
                        <p className="text-gray-400">
                          {activePulsar.status === 'Planned' ?
                            'Visualizations will be added after observations begin for this pulsar.' :
                            activePulsar.status === 'Active' ?
                              'This pulsar is currently under observation. Visualizations will be added as data is processed.' :
                              'Visualizations for this pulsar are being prepared and will be available soon.'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Download button */}
                  <div className="mt-6 pt-4 border-t border-slate-700">
                    <button
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center justify-center"
                      onClick={(e) => handleDownloadClick(activePulsar, e)}
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
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-cyan-300">Galactic Distribution</h3>
                <button
                  onClick={() => setIsGalacticMaximized(true)}
                  className="inline-flex items-center px-2 py-1 text-xs border border-cyan-500/30 rounded-md text-cyan-300 bg-slate-800/60 hover:bg-slate-700/80 transition duration-300"
                >
                  <ZoomIn size={16} />
                </button>
              </div>
              <div className="h-96 bg-slate-800/50 rounded-md">
                <PulsarGalaxy pulsars={filteredPulsars} />
              </div>
            </div>

            {/* Maximized Galactic View Modal */}
            {isGalacticMaximized && (
              <div
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setIsGalacticMaximized(false);
                  }
                }}
              >
                <div className="bg-slate-900 border border-cyan-500/30 rounded-lg p-6 shadow-xl w-full max-w-6xl max-h-[90vh]">
                  {/* Header with title and close button */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-cyan-300">Galactic Distribution (Expanded View)</h3>
                    <button
                      className="text-gray-400 hover:text-white text-2xl"
                      onClick={() => setIsGalacticMaximized(false)}
                    >
                      ×
                    </button>
                  </div>

                  {/* Expanded visualization */}
                  <div className="h-[70vh] bg-slate-800/50 rounded-md">
                    <PulsarGalaxy pulsars={filteredPulsars} />
                  </div>

                  {/* Optional: Add additional controls or information here */}
                  <div className="mt-4 text-gray-300 text-sm">
                    <p>Tip: You can rotate the 3D view by clicking and dragging within the visualization.</p>
                  </div>
                </div>
              </div>
            )}

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
          <div className="mt-6 bg-slate-900/60 backdrop-blur-sm border border-pink-500/30 rounded-lg p-4 shadow-lg">
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
                <button
                  onClick={() => handleBatchDownloadClick('PSRPI')}
                  className="inline-flex items-center px-3 py-1.5 border border-green-500/30 rounded-md text-green-300 text-sm bg-slate-900/60 hover:bg-slate-800/80 transition duration-300"
                >
                  <Download className="mr-1 h-4 w-4" />
                  Download
                </button>
              </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-sm border border-purple-500/30 rounded-lg p-5 shadow-lg">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">MSPSRPI Data Release 2.0</h3>
              <p className="text-gray-300 mb-4">
                Millisecond pulsar data from 2015-2018 observations of 18 millisecond pulsars.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Released: December 2019</span>
                <button
                  onClick={() => handleBatchDownloadClick('MSPSRPI')}
                  className="inline-flex items-center px-3 py-1.5 border border-purple-500/30 rounded-md text-purple-300 text-sm bg-slate-900/60 hover:bg-slate-800/80 transition duration-300"
                >
                  <Download className="mr-1 h-4 w-4" />
                  Download
                </button>
              </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-sm border border-blue-500/30 rounded-lg p-5 shadow-lg">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">MSPSRPI2 Initial Data</h3>
              <p className="text-gray-300 mb-4">
                Preliminary data from Phase 2 observations (27 of 44 targets completed).
              </p>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Updated: March 2025</span>
                <button
                  onClick={() => handleBatchDownloadClick('MSPSRPI2')}
                  className="inline-flex items-center px-3 py-1.5 border border-blue-500/30 rounded-md text-blue-300 text-sm bg-slate-900/60 hover:bg-slate-800/80 transition duration-300"
                >
                  <Download className="mr-1 h-4 w-4" />
                  Download
                </button>
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

      {/* Maximize visualization modal */}
      {activeVisualization && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setActiveVisualization(null)}
        >
          <div
            className="bg-slate-900 border border-cyan-500/30 rounded-lg p-6 shadow-xl w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-cyan-300">
                {activeVisualization.title} - {activeVisualization.pulsarName}
              </h3>
              <button
                className="text-gray-400 hover:text-white text-2xl"
                onClick={() => setActiveVisualization(null)}
              >
                ×
              </button>
            </div>

            {/* Image display area */}
            <div className="bg-slate-800/50 rounded-md overflow-hidden flex items-center justify-center">
              <div className="relative w-full" style={{ minHeight: '60vh' }}>
                <img
                  src={`${process.env.PUBLIC_URL}${activeVisualization.path}`}
                  alt={`${activeVisualization.pulsarName} - ${activeVisualization.title}`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = `${process.env.PUBLIC_URL}/images/placeholder-chart.svg`;

                    // Dynamically create overlay
                    const parent = e.target.parentNode;
                    if (!parent.querySelector('.fullscreen-overlay')) {
                      const overlay = document.createElement('div');
                      overlay.className = 'absolute inset-0 flex flex-col items-center justify-center bg-slate-800/80 p-4 text-center fullscreen-overlay';
                      overlay.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-indigo-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="text-lg text-indigo-300 font-medium">Visualization Not Available</p>
                  <p class="text-sm text-gray-400 mt-2">The requested visualization is being processed.</p>
                `;
                      parent.appendChild(overlay);
                    }
                  }}
                />
              </div>
            </div>

            {/* Description text */}
            {activeVisualization.description && (
              <div className="mt-4 p-4 bg-slate-800/40 rounded-md">
                <p className="text-gray-300">{activeVisualization.description}</p>
              </div>
            )}

            {/* Download button */}
            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md flex items-center"
                onClick={() => {
                  // Create download link
                  const link = document.createElement('a');
                  link.href = `${process.env.PUBLIC_URL}${activeVisualization.path}`;
                  link.download = `${activeVisualization.pulsarName}_${activeVisualization.title}.jpg`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add download modal component */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        pulsar={downloadPulsar}
        onClose={closeDownloadModal}
      />

      {BatchDownloadModalComponent}
    </div>
  );
};

export default DataReleasePage;