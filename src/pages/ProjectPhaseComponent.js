//------------------------------------------------------------------
//                        LIBRARY IMPORTS
//------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ExternalLink,
  Download,
  FileText,
  Radio,
  ChevronUp,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

//------------------------------------------------------------------
//               CENTRALIZED THEME CONFIGURATIONS
//------------------------------------------------------------------
export const PROJECT_THEMES = {
  psrpi: {
    // Background and general styling
    backgroundGradient: "bg-gradient-to-b from-green-950 via-slate-900 to-black",
    heroGlow: "absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-slate-900/10 to-transparent",
    
    // Button styling
    button: "bg-green-800",
    buttonHover: "bg-green-700",
    buttonPrimary: "border border-green-500/40 text-green-300 bg-green-900/30 hover:bg-green-800/50 shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]",
    buttonSecondary: "border border-indigo-500/40 text-indigo-300 bg-indigo-900/30 hover:bg-indigo-800/50",
    publicationButton: "border border-green-500/40 rounded-md text-green-300 bg-green-900/30 hover:bg-green-800/50",
    
    // Text styling
    linkText: "text-green-300 hover:text-green-400",
    heroSubtitle: "text-green-200",
    prose: "prose-green",
    statTitle: "text-green-300",
    objectiveTitle: "text-green-300",
    cardTitle: "text-green-300",
    pipelineTitle: "text-green-300",
    iconColor: "text-green-300",
    
    // Border and container styling
    heroTag: "bg-green-900/60 text-green-300 border-green-700/50",
    navBorder: "border-green-900/30",
    contentBorder: "border border-green-900/30",
    statBox: "bg-slate-800/50 border border-green-500/20",
    cardBorder: "border border-green-700/30 hover:border-green-500/50",
    publicationBorder: "border border-green-700/20",
    infoBox: "border-green-500/30",
    objectiveBorder: "border-green-500",
    
    // Navigation styling
    navHighlight: "text-green-300 bg-green-900/40 shadow-[0_0_8px_rgba(34,197,94,0.4)]",
    navHover: "text-green-300",
    
    // Timeline styling
    timeline: "bg-green-700/50",
    timelineCircle: "bg-green-900/60 shadow-[0_0_15px_rgba(34,197,94,0.4)] border border-green-500/50 flex items-center justify-center",
    timelineText: "text-green-200 text-center text-sm",
    
    // Table styling
    tableDivider: "divide-green-900/50",
    tableTh: "text-green-300",
    tableLink: "text-green-400 hover:text-green-300",
    radioIcon: "text-green-500",
    
    // Filter styling
    filterActive: "bg-green-900 text-green-100",
    paginationBtn: "text-green-300 hover:bg-green-900/30",
    
    // Scroll button styling
    scrollTopBtn: "bg-green-900/80 hover:bg-green-800 border border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.4)]",
    
    // Loading indicator
    spinnerBorder: "border-green-400"
  },
  mspsrpi: {
    // Background and general styling
    backgroundGradient: "bg-gradient-to-b from-purple-950 via-slate-900 to-black",
    heroGlow: "absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/10 to-transparent",
    
    // Button styling
    button: "bg-purple-800",
    buttonHover: "bg-purple-700",
    buttonPrimary: "border border-purple-500/40 text-purple-300 bg-purple-900/30 hover:bg-purple-800/50 shadow-[0_0_10px_rgba(147,51,234,0.3)] hover:shadow-[0_0_15px_rgba(147,51,234,0.5)]",
    buttonSecondary: "border border-indigo-500/40 text-indigo-300 bg-indigo-900/30 hover:bg-indigo-800/50",
    publicationButton: "border border-purple-500/40 rounded-md text-purple-300 bg-purple-900/30 hover:bg-purple-800/50",
    
    // Text styling
    linkText: "text-purple-300 hover:text-purple-400",
    heroSubtitle: "text-purple-200",
    prose: "prose-purple",
    statTitle: "text-purple-300",
    objectiveTitle: "text-purple-300",
    cardTitle: "text-purple-300",
    pipelineTitle: "text-purple-300",
    iconColor: "text-purple-300",
    
    // Border and container styling
    heroTag: "bg-purple-900/60 text-purple-300 border-purple-700/50",
    navBorder: "border-purple-900/30",
    contentBorder: "border border-purple-900/30",
    statBox: "bg-slate-800/50 border border-purple-500/20",
    cardBorder: "border border-purple-700/30 hover:border-purple-500/50",
    publicationBorder: "border border-purple-700/20",
    infoBox: "border-purple-500/30",
    objectiveBorder: "border-purple-500",
    
    // Navigation styling
    navHighlight: "text-purple-300 bg-purple-900/40 shadow-[0_0_8px_rgba(147,51,234,0.4)]",
    navHover: "text-purple-300",
    
    // Timeline styling
    timeline: "bg-purple-700/50",
    timelineCircle: "bg-purple-900/60 shadow-[0_0_15px_rgba(147,51,234,0.4)] border border-purple-500/50 flex items-center justify-center",
    timelineText: "text-purple-200 text-center text-sm",
    
    // Table styling
    tableDivider: "divide-purple-900/50",
    tableTh: "text-purple-300",
    tableLink: "text-purple-400 hover:text-purple-300",
    radioIcon: "text-purple-500",
    
    // Filter styling
    filterActive: "bg-purple-900 text-purple-100",
    paginationBtn: "text-purple-300 hover:bg-purple-900/30",
    
    // Scroll button styling
    scrollTopBtn: "bg-purple-900/80 hover:bg-purple-800 border border-purple-500/50 shadow-[0_0_10px_rgba(147,51,234,0.4)]",
    
    // Loading indicator
    spinnerBorder: "border-purple-400"
  },
  mspsrpi2: {
    // Background and general styling
    backgroundGradient: "bg-gradient-to-b from-indigo-950 via-slate-900 to-black",
    heroGlow: "absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/10 to-transparent",
    
    // Button styling
    button: "bg-blue-800",
    buttonHover: "bg-blue-700",
    buttonPrimary: "border border-blue-500/40 text-blue-300 bg-blue-900/30 hover:bg-blue-800/50 shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]",
    buttonSecondary: "border border-indigo-500/40 text-indigo-300 bg-indigo-900/30 hover:bg-indigo-800/50",
    publicationButton: "border border-blue-500/40 rounded-md text-blue-300 bg-blue-900/30 hover:bg-blue-800/50",
    
    // Text styling
    linkText: "text-blue-300 hover:text-blue-400",
    heroSubtitle: "text-blue-200",
    prose: "prose-blue",
    statTitle: "text-blue-300",
    objectiveTitle: "text-blue-300",
    cardTitle: "text-blue-300",
    pipelineTitle: "text-blue-300",
    iconColor: "text-blue-300",
    
    // Border and container styling
    heroTag: "bg-blue-900/60 text-blue-300 border-blue-700/50",
    navBorder: "border-blue-900/30",
    contentBorder: "border border-blue-900/30",
    statBox: "bg-slate-800/50 border border-blue-500/20",
    cardBorder: "border border-blue-700/30 hover:border-blue-500/50",
    publicationBorder: "border border-blue-700/20",
    infoBox: "border-blue-500/30",
    objectiveBorder: "border-blue-500",
    
    // Navigation styling
    navHighlight: "text-blue-300 bg-blue-900/40 shadow-[0_0_8px_rgba(59,130,246,0.4)]",
    navHover: "text-blue-300",
    
    // Timeline styling
    timeline: "bg-blue-700/50",
    timelineCircle: "bg-blue-900/60 shadow-[0_0_15px_rgba(59,130,246,0.4)] border border-blue-500/50 flex items-center justify-center",
    timelineText: "text-blue-200 text-center text-sm",
    
    // Table styling
    tableDivider: "divide-blue-900/50",
    tableTh: "text-blue-300",
    tableLink: "text-blue-400 hover:text-blue-300",
    radioIcon: "text-blue-500",
    
    // Filter styling
    filterActive: "bg-blue-900 text-blue-100",
    paginationBtn: "text-blue-300 hover:bg-blue-900/30",
    
    // Scroll button styling
    scrollTopBtn: "bg-blue-900/80 hover:bg-blue-800 border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.4)]",
    
    // Loading indicator
    spinnerBorder: "border-blue-400"
  }
};

//------------------------------------------------------------------
//             CENTRALIZED PROJECT CONFIGURATIONS
//------------------------------------------------------------------
export const PROJECT_CONFIGS = {
  psrpi: {
    projectType: "psrpi",
    projectName: "PSRπ",
    dataUrl: "/data/psrpi/psrpiDetails.json",
    backLinkPath: "/project",
    nextLinkPath: "/projects/mspsrpi-details",
    nextLinkText: "Go to MSPSRπ",
    fluxRanges: {
      low: [0.5, 2.0],
      medium: [2.0, 5.0], 
      high: [5.0, null]
    }
  },
  mspsrpi: {
    projectType: "mspsrpi",
    projectName: "MSPSRπ",
    dataUrl: "/data/mspsrpi/mspsrpiDetails.json",
    backLinkPath: "/project",
    nextLinkPath: "/projects/mspsrpi2-details",
    nextLinkText: "Go to MSPSRπ2",
    fluxRanges: {
      low: [0.2, 0.76],
      medium: [0.76, 1.2], 
      high: [1.2, null]
    }
  },
  mspsrpi2: {
    projectType: "mspsrpi2",
    projectName: "MSPSRπ2",
    dataUrl: "/data/mspsrpi2/mspsrpi2Details.json",
    pulsarsDataUrl: "/data/mspsrpi2/mspsrpi2Pulsars.json",
    hasSeparatePulsarData: true,
    backLinkPath: "/project",
    nextLinkPath: "/projects/psrpi-details",
    nextLinkText: "Go to PSRπ",
    fluxRanges: {
      low: [0.2, 0.76],
      medium: [0.76, 1.2], 
      high: [1.2, null]
    },
    showResultsOverlay: true,
    showPublicationsPlaceholder: true
  }
};

//------------------------------------------------------------------
//                     COMPONENT DEFINITION
//------------------------------------------------------------------
const ProjectPhaseComponent = ({
  // Project identification
  projectType,
  projectName,
  
  // Theme configuration
  theme,
  colors,
  
  // Data paths and configuration
  dataUrl,
  pulsarsDataUrl,
  hasSeparatePulsarData = false,
  
  // Navigation configuration
  backLinkPath = "/project",
  nextLinkPath,
  nextLinkText,
  
  // Flux density ranges for filtering
  fluxRanges = {
    low: [0.2, 0.76],    // Default range for low flux density
    medium: [0.76, 1.2], // Default range for medium flux density
    high: [1.2, null]    // Default range for high flux density, null means no upper limit
  },
  
  // MSPSRπ2 specific flags
  showResultsOverlay = false,
  showPublicationsPlaceholder = false
}) => {
  // STATE VARIABLES AND HOOKS
  const [activeTab, setActiveTab] = useState('overview');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [data, setData] = useState(null);
  const [pulsars, setPulsars] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For pulsar list pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pulsarsPerPage = 8;

  // For flux density filtering
  const [fluxFilter, setFluxFilter] = useState('all');

  // DATA FETCHING
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Build the URL to fetch data
        const detailsUrl = `${process.env.PUBLIC_URL}${dataUrl}`;
        
        let requests = [fetch(detailsUrl)];
        
        // For MSPSRπ2, fetch the separate pulsars file if needed
        if (hasSeparatePulsarData && pulsarsDataUrl) {
          const pulsarsUrl = `${process.env.PUBLIC_URL}${pulsarsDataUrl}`;
          requests.push(fetch(pulsarsUrl));
        }
        
        const responses = await Promise.all(requests);
        
        // Check if all responses are OK
        for (const response of responses) {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        }
        
        // Parse JSON data
        const detailsData = await responses[0].json();
        setData(detailsData);
        
        // If we have separate pulsar data, parse and set it
        if (hasSeparatePulsarData && responses[1]) {
          const pulsarsData = await responses[1].json();
          setPulsars(pulsarsData);
        } else {
          // Otherwise, pulsars are included in the main data file
          setPulsars(detailsData.pulsars || []);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dataUrl, pulsarsDataUrl, hasSeparatePulsarData]);

  //------------------------------------------------------------------
  //                     FILTERING AND PAGINATION
  //------------------------------------------------------------------
  // Filter pulsars based on selected flux category
  const filteredPulsars = React.useMemo(() => {
    if (!pulsars || pulsars.length === 0) return [];
    
    // Return all pulsars when the 'all' filter is selected
    if (fluxFilter === 'all') return pulsars;
    
    // Use the same filtering logic for all projects
    return pulsars.filter(pulsar => {
      if (!pulsar) return false;
      
      // If the pulsar has a fluxCategory field, use that for filtering
      if (pulsar.fluxCategory) {
        return pulsar.fluxCategory === fluxFilter;
      }
      
      // Otherwise, filter by numerical flux density
      const flux = parseFloat(pulsar.flux_density_1_4GHz);
      if (isNaN(flux)) return false;
      
      switch (fluxFilter) {
        case 'low':
          return flux >= fluxRanges.low[0] && (fluxRanges.low[1] === null || flux < fluxRanges.low[1]);
        case 'medium':
          return flux >= fluxRanges.medium[0] && (fluxRanges.medium[1] === null || flux < fluxRanges.medium[1]);
        case 'high':
          return flux >= fluxRanges.high[0] && (fluxRanges.high[1] === null || flux < fluxRanges.high[1]);
        default:
          return true;
      }
    });
  }, [pulsars, fluxFilter, fluxRanges]);

  // Calculate pulsars to display based on pagination
  const currentPulsars = filteredPulsars.slice(
    (currentPage - 1) * pulsarsPerPage,
    currentPage * pulsarsPerPage
  );

  const totalPages = Math.ceil(filteredPulsars.length / pulsarsPerPage);

  // Format flux ranges for display
  const getFluxRangeText = (rangeType) => {
    const range = fluxRanges[rangeType];
    if (!range) return '';
    
    if (range[1] === null) {
      return `>${range[0]} mJy`;
    } else {
      return `${range[0]}-${range[1]} mJy`;
    }
  };

  // DEBUG HELPER - log pulsar data structure
  useEffect(() => {
    if (pulsars && pulsars.length > 0 && hasSeparatePulsarData) {
      console.log('Sample pulsar data structure:', pulsars[0]);
    }
  }, [pulsars, hasSeparatePulsarData]);

  // SCROLL TO TOP FUNCTIONALITY
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Reset to first page when filter changes
  const handleFilterChange = (category) => {
    setFluxFilter(category);
    setCurrentPage(1);
    
    // Add debug log to see which category was selected
    console.log('Filter changed to:', category);
  };

  // Show/hide scroll button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  //------------------------------------------------------------------
  //                     CONDITIONAL RENDERING
  //------------------------------------------------------------------
  // Show loading state
  if (loading) {
    return (
      <div className={`min-h-screen ${colors.backgroundGradient} text-gray-100 flex items-center justify-center`}>
        <div className="text-center">
          <div className={`inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid ${colors.spinnerBorder} border-r-transparent`}></div>
          <p className="mt-4 text-xl">Loading {projectName} data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`min-h-screen ${colors.backgroundGradient} text-gray-100 flex items-center justify-center`}>
        <div className="text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">!</div>
          <h2 className="text-2xl mb-4">{data?.errorTitle || "Something went wrong"}</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={`px-4 py-2 ${colors.button} text-white rounded-md hover:${colors.buttonHover} transition-colors`}
          >
            {data?.tryAgainText || "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  // If we have no data even though we're not loading
  if (!data) {
    return (
      <div className={`min-h-screen ${colors.backgroundGradient} text-gray-100 flex items-center justify-center`}>
        <div className="text-center">
          <p className="text-xl">{data?.noDataText || "No data available. Please refresh the page."}</p>
          <button
            onClick={() => window.location.reload()}
            className={`mt-4 px-4 py-2 ${colors.button} text-white rounded-md hover:${colors.buttonHover} transition-colors`}
          >
            {data?.refreshText || "Refresh Data"}
          </button>
        </div>
      </div>
    );
  }

  //------------------------------------------------------------------
  //                  MAIN RENDERING / UI CONTENT
  //------------------------------------------------------------------
  return (
    <div className={`min-h-screen ${colors.backgroundGradient} text-gray-100`}>
      {/* Use the Navbar component with appropriate theme */}
      <Navbar navLinks={data.navLinks} colorTheme={theme} />

      {/* Back to project navigation and page navigation */}
      <div className="pt-20 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to={backLinkPath} className={`inline-flex items-center ${colors.linkText} transition`}>
          <ChevronLeft className="w-5 h-5 mr-1" />
          {data.backLinkText || "Back to Project Overview"}
        </Link>
        {nextLinkPath && (
          <Link 
            to={nextLinkPath} 
            className={`inline-flex items-center ${colors.linkText} transition`}
          >
            {nextLinkText || data.nextLinkText || "Next Project"}
            <ArrowRight className="w-5 h-5 ml-1" />
          </Link>
        )}
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden">
          {/* Dark starry background with multiple star layers for depth */}
          <div className="w-full h-full bg-slate-950">
            {/* Same background elements as the main page for consistency */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjI1IiBjeT0iMjUiIHI9IjEiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjE3NSIgY3k9IjE1MCIgcj0iMS4yIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjciLz48Y2lyY2xlIGN4PSI3NSIgY3k9IjEwMCIgcj0iMSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42Ii8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTUiIHI9IjEuNSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC43Ii8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iNTAiIHI9IjEuMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSIxNzUiIHI9IjEuNCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC43Ii8+PGNpcmNsZSBjeD0iMTI1IiBjeT0iMTc1IiByPSIxIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYiLz48L3N2Zz4=')] opacity-50"></div>

            {/* Small stars layer */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjAuNCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iMzAiIGN5PSIxMCIgcj0iMC4zIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjIwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjcwIiBjeT0iMTAiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PGNpcmNsZSBjeD0iOTAiIGN5PSIzMCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSIxMCIgY3k9IjUwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iNzAiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSI5MCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSI3MCIgY3k9IjUwIiByPSIwLjMiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjkwIiBjeT0iNzAiIHI9IjAuNCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PGNpcmNsZSBjeD0iMjAiIGN5PSIzMCIgcj0iMC4zIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iMzAiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iODAiIGN5PSI0MCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjgwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iNjAiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iNjAiIGN5PSI4MCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSI4MCIgY3k9IjYwIiByPSIwLjMiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] opacity-60"></div>

            {/* Theme-specific glow effect */}
            <div className={colors.heroGlow}></div>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <div className={`inline-block mb-4 px-4 py-1 ${colors.heroTag} backdrop-blur-sm rounded-full text-sm font-medium`}>
              {data.heroTagline || `Project Phase`}
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              {data.heroTitle || projectName}
            </h1>
            <p className={`text-xl ${colors.heroSubtitle} mb-6`}>
              {data.heroSubtitle}
            </p>
            <p className="text-gray-300 mb-8 text-lg">
              {data.heroDescription}
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href={data.dataReleaseUrl}
                className={`inline-flex items-center px-5 py-2 ${colors.buttonPrimary} rounded-md transition duration-300`}
              >
                <Download className="mr-2 h-5 w-5" />
                {data.dataReleaseButtonText || "Access Data Release"}
              </a>
              <a 
                href={data.publicationsUrl}
                className={`inline-flex items-center px-5 py-2 ${colors.buttonSecondary} rounded-md transition duration-300`}
              >
                <FileText className="mr-2 h-5 w-5" />
                {data.publicationsButtonText || "View Publications"}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={`sticky top-16 z-40 bg-slate-900/80 backdrop-blur-md border-y ${colors.navBorder}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-hide">
            {['overview', 'objectives', 'results', 'pulsars'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                  activeTab === tab
                    ? colors.navHighlight
                    : `text-gray-400 hover:${colors.navHover}`
                }`}
              >
                {data.tabLabels?.[tab] || 
                  (tab === 'overview' ? "Overview" : 
                  tab === 'objectives' ? "Details" : 
                  tab === 'results' ? "Key Results" : "Target Pulsars")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area - Conditionally display content based on active tab */}
      <div className="py-12 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Overview Tab Content */}
          {activeTab === 'overview' && (
            <div>
              <div className={`bg-slate-900/40 backdrop-blur-sm ${colors.contentBorder} rounded-xl p-6 mb-8 shadow-xl`}>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {data.sectionTitles?.overview || "Project Overview"}
                </h2>
                <div className={`prose prose-invert ${colors.prose} max-w-none`}>
                  {data.overview.map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-300">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Project Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                  {data.statistics.map((stat, index) => (
                    <div key={index} className={`${colors.statBox} backdrop-blur-sm rounded-lg p-4 text-center`}>
                      <h3 className={`text-lg font-semibold ${colors.statTitle} mb-2`}>{stat.label}</h3>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-gray-400 mt-1">{stat.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Timeline */}
              <div className={`bg-slate-900/40 backdrop-blur-sm ${colors.contentBorder} rounded-xl p-6 shadow-xl`}>
                <h2 className="text-2xl font-bold text-white mb-6">
                  {data.sectionTitles?.timeline || "Project Timeline"}
                </h2>
                <div className="relative">
                  {/* Timeline line */}
                  <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${colors.timeline} ml-6 md:ml-8`}></div>

                  {/* Timeline events */}
                  <div className="space-y-12">
                    {data.timeline.map((event, index) => (
                      <div key={index} className="relative pl-20 md:pl-24">
                        <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full ${colors.timelineCircle}`}>
                          <span className={`${colors.timelineText} block leading-tight`}>{event.date}</span>
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold ${colors.objectiveTitle}`}>{event.title}</h3>
                          <p className="text-gray-300 mt-2">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Objectives Tab Content */}
          {activeTab === 'objectives' && (
            <div className={`bg-slate-900/40 backdrop-blur-sm ${colors.contentBorder} rounded-xl p-6 shadow-xl`}>
              <h2 className="text-2xl font-bold text-white mb-6">
                {data.sectionTitles?.objectives || "Project Objectives"}
              </h2>

              <div className="space-y-6">
                {data.objectives.map((objective, index) => (
                  <div key={index} className={`border-l-4 ${colors.objectiveBorder} pl-4 py-1`}>
                    <h3 className={`text-xl font-bold ${colors.objectiveTitle} mb-2`}>{objective.title}</h3>
                    <p className="text-gray-300">{objective.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-bold text-white mb-4">
                  {data.sectionTitles?.technicalApproach || "Technical Approach"}
                </h3>
                <div className={`prose prose-invert ${colors.prose} max-w-none`}>
                  {data.technicalApproach.map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-300">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Key Results Tab Content */}
          {activeTab === 'results' && (
            <div className={`bg-slate-900/40 backdrop-blur-sm ${colors.contentBorder} rounded-xl p-6 shadow-xl`}>
              <h2 className="text-2xl font-bold text-white mb-6">
                {data.sectionTitles?.keyResults || "Key Results & Discoveries"}
              </h2>

              {/* Conditional overlay for MSPSRπ2 */}
              {projectType === 'mspsrpi2' && showResultsOverlay && (
                <div className="relative overflow-hidden rounded-xl mb-8">
                  {/* Starry background for the temporary overlay */}
                  <div className="absolute inset-0 bg-blue-950/90 overflow-hidden">
                    {/* Multiple star layers for depth */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjI1IiBjeT0iMjUiIHI9IjEiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjE3NSIgY3k9IjE1MCIgcj0iMS4yIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjciLz48Y2lyY2xlIGN4PSI3NSIgY3k9IjEwMCIgcj0iMSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42Ii8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTUiIHI9IjEuNSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC43Ii8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iNTAiIHI9IjEuMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSIxNzUiIHI9IjEuNCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC43Ii8+PGNpcmNsZSBjeD0iMTI1IiBjeT0iMTc1IiByPSIxIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYiLz48L3N2Zz4=')] opacity-70"></div>

                    {/* Blue cosmic glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-blue-900/10 to-transparent"></div>

                    {/* Animated stars effect */}
                    <div className="absolute inset-0">
                      <div className="absolute h-1 w-1 bg-white rounded-full top-[10%] left-[15%] opacity-70 animate-pulse"></div>
                      <div className="absolute h-1 w-1 bg-white rounded-full top-[20%] left-[25%] opacity-80 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      <div className="absolute h-1 w-1 bg-white rounded-full top-[15%] left-[65%] opacity-60 animate-pulse" style={{ animationDelay: '1.2s' }}></div>
                      <div className="absolute h-1 w-1 bg-white rounded-full top-[40%] left-[80%] opacity-70 animate-pulse" style={{ animationDelay: '0.7s' }}></div>
                      <div className="absolute h-1 w-1 bg-white rounded-full top-[70%] left-[35%] opacity-80 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                      <div className="absolute h-1 w-1 bg-white rounded-full top-[60%] left-[15%] opacity-60 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                      <div className="absolute h-1 w-1 bg-white rounded-full top-[80%] left-[75%] opacity-70 animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>
                  </div>

                  {/* Content of the overlay */}
                  <div className="relative py-16 px-8 text-center">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${colors.timelineCircle} mb-6 backdrop-blur-md`}>
                      <span className="text-3xl">{data.resultsOverlay?.icon || "🔭"}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {data.resultsOverlay?.title || "Results Coming Soon"}
                    </h3>
                    <p className={`text-xl ${colors.heroSubtitle} max-w-2xl mx-auto mb-6`}>
                      {data.resultsOverlay?.subtitle || "The key results will be available shortly after the observations are complete"}
                    </p>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                      {data.resultsOverlay?.description || "Our team is currently conducting observations and analyzing data. Check back later to see the groundbreaking discoveries from the project."}
                    </p>
                  </div>
                </div>
              )}

              {/* Actual results content - conditionally shown based on overlay flag */}
              <div className={projectType === 'mspsrpi2' && showResultsOverlay ? "hidden" : ""}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                  {data.keyResults.map((result, index) => (
                    <div key={index} className={`bg-slate-800/50 backdrop-blur-sm rounded-lg p-5 ${colors.cardBorder} transition-all duration-300`}>
                      <h3 className={`text-xl font-bold ${colors.cardTitle} mb-3`}>{result.title}</h3>
                      <p className="text-gray-300 mb-4">{result.description}</p>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-bold text-white mb-4">
                  {data.sectionTitles?.scientificImpact || "Scientific Impact"}
                </h3>
                <div className={`prose prose-invert ${colors.prose} max-w-none mb-6`}>
                  {data.scientificImpact.map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-300">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Publications section with conditional placeholder for MSPSRπ2 */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-4">
                  {data.sectionTitles?.publications || `${projectName} Publications`}
                </h3>

                {/* Conditional publications placeholder for MSPSRπ2 */}
                {projectType === 'mspsrpi2' && showPublicationsPlaceholder ? (
                  <div className={`bg-slate-800/40 backdrop-blur-sm rounded-lg p-6 ${colors.publicationBorder}`}>
                    <div className="flex flex-col items-center justify-center text-center py-6">
                      <div className={`w-16 h-16 ${colors.timelineCircle} rounded-full flex items-center justify-center mb-4 backdrop-blur-md`}>
                        <FileText className={`h-8 w-8 ${colors.iconColor}`} />
                      </div>
                      <h4 className={`text-xl font-semibold ${colors.cardTitle} mb-3`}>
                        {data.publicationsPlaceholder?.title || "Publications Coming Soon"}
                      </h4>
                      <p className="text-gray-300 max-w-2xl">
                        {data.publicationsPlaceholder?.description || `Publications related to the ${projectName} project will be listed here once research papers have been published. Please check back later.`}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.publications.map((pub, index) => (
                      <div key={index} className={`bg-slate-800/30 p-4 rounded-lg ${colors.publicationBorder}`}>
                        <p className="text-gray-300 mb-2">{pub.citation}</p>
                        <div className="flex items-center space-x-4">
                          <a 
                            href={pub.doi}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm ${colors.tableLink} transition flex items-center`}
                          >
                            DOI <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                          {pub.arxiv && (
                            <a 
                              href={pub.arxiv}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-sm ${colors.tableLink} transition flex items-center`}
                            >
                              arXiv <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="mt-4 text-center">
                      <a 
                        href={data.publicationsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center px-4 py-2 ${colors.publicationButton} rounded-md transition duration-300`}
                      >
                        {data.viewAllPublicationsText || "View All Publications"} <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pulsars Studied Tab Content */}
          {activeTab === 'pulsars' && (
            <div>
              <div className={`bg-slate-900/40 backdrop-blur-sm ${colors.contentBorder} rounded-xl p-6 shadow-xl mb-8`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {data.sectionTitles?.pulsars || "Pulsars Studied"}
                    </h2>
                    <p className="text-gray-300 mt-1">
                      {data.pulsarsStudied?.overview}
                    </p>
                  </div>
                </div>

                {/* Information about catalogue paper */}
                <div className={`bg-slate-800/50 rounded-lg p-4 mb-6 ${colors.infoBox}`}>
                  <p className="text-gray-300">
                    {data.pulsarsStudied?.catalogueInfo}
                  </p>
                  {data.pulsarsStudied?.catalogueUrl && (
                    <a 
                      href={data.pulsarsStudied.catalogueUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center mt-2 ${colors.linkText} transition`}
                    >
                      "{data.pulsarsStudied?.catalogueTitle}" <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  )}
                </div>

                {/* Flux Density Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    <span className="flex items-center">
                      <Filter className="w-5 h-5 mr-2" /> {data.fluxFilterTitle || "Filter by Flux Density"}
                    </span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        fluxFilter === 'all'
                          ? colors.filterActive
                          : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                      }`}
                      onClick={() => handleFilterChange('all')}
                    >
                      {data.fluxFilterLabels?.all || "All Pulsars"}
                    </button>
                    <button
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        fluxFilter === 'low'
                          ? colors.filterActive
                          : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                      }`}
                      onClick={() => handleFilterChange('low')}
                    >
                      {data.fluxFilterLabels?.low || getFluxRangeText('low')}
                    </button>
                    <button
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        fluxFilter === 'medium'
                          ? colors.filterActive
                          : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                      }`}
                      onClick={() => handleFilterChange('medium')}
                    >
                      {data.fluxFilterLabels?.medium || getFluxRangeText('medium')}
                    </button>
                    <button
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        fluxFilter === 'high'
                          ? colors.filterActive
                          : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                      }`}
                      onClick={() => handleFilterChange('high')}
                    >
                      {data.fluxFilterLabels?.high || getFluxRangeText('high')}
                    </button>
                  </div>
                </div>

                {/* Pulsars Table */}
                <div className="overflow-x-auto">
                  <table className={`min-w-full divide-y ${colors.tableDivider}`}>
                    <thead className="bg-slate-800/50">
                      <tr>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${colors.tableTh} uppercase tracking-wider`}>
                          {data.pulsarTableHeaders?.name || "Pulsar"}
                        </th>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${colors.tableTh} uppercase tracking-wider`}>
                          {data.pulsarTableHeaders?.ra || "RA"}
                        </th>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${colors.tableTh} uppercase tracking-wider`}>
                          {data.pulsarTableHeaders?.dec || "Dec"}
                        </th>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${colors.tableTh} uppercase tracking-wider`}>
                          {data.pulsarTableHeaders?.fluxDensity || "1.4 GHz flux density (mJy)"}
                        </th>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${colors.tableTh} uppercase tracking-wider`}>
                          {data.pulsarTableHeaders?.inbeamCalibrators || "Number of inbeam calibrators"}
                        </th>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${colors.tableTh} uppercase tracking-wider`}>
                          {data.pulsarTableHeaders?.epochsObserved || "Number of epochs observed"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-slate-900/30 divide-y divide-slate-800/50">
                      {currentPulsars.length > 0 ? (
                        currentPulsars.map((pulsar, index) => (
                          <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                              <div className="flex items-center space-x-2">
                                <Radio className={`h-4 w-4 ${colors.radioIcon}`} />
                                <div>
                                  <span>{pulsar.name}</span>
                                  {pulsar.sessionDuration && (
                                    <div className="text-xs text-gray-400">
                                      Session: {pulsar.sessionDuration}
                                      {pulsar.status && <span> • {pulsar.status}</span>}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {pulsar.ra}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {pulsar.dec}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {pulsar.flux_density_1_4GHz}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {pulsar.inbeam_calibrators}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {pulsar.epochs_observed}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                            {data.noResultsText || "No pulsars match the selected filter."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-4 px-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === 1
                          ? 'text-gray-500 cursor-not-allowed'
                          : colors.paginationBtn
                      }`}
                    >
                      {data.paginationLabels?.previous || "Previous"}
                    </button>
                    <span className="text-gray-300">
                      {data.paginationLabels?.pageLabel || "Page"} {currentPage} {data.paginationLabels?.ofLabel || "of"} {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === totalPages
                          ? 'text-gray-500 cursor-not-allowed'
                          : colors.paginationBtn
                      }`}
                    >
                      {data.paginationLabels?.next || "Next"}
                    </button>
                  </div>
                )}
              </div>

              {/* Data Processing Pipeline */}
              <div className={`bg-slate-900/40 backdrop-blur-sm ${colors.contentBorder} rounded-xl p-6 shadow-xl`}>
                <h3 className="text-xl font-bold text-white mb-4">
                  {data.sectionTitles?.dataPipeline || "Data Processing Pipeline"}
                </h3>
                <p className="text-gray-300 mb-6">
                  {data.dataPipeline?.description}
                </p>

                {/* Pipeline Steps */}
                <div className="relative">
                  {/* Vertical line */}
                  <div className={`absolute left-8 top-0 h-full w-0.5 ${colors.timeline}`}></div>

                  <div className="space-y-12">
                    {data.dataPipeline?.steps.map((step, index) => (
                      <div key={index} className="relative pl-20">
                        <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-16 h-16 rounded-full ${colors.timelineCircle}`}>
                          <span className={`${colors.timelineText} text-xl font-bold`}>{index + 1}</span>
                        </div>
                        <div>
                          <h4 className={`text-lg font-semibold ${colors.pipelineTitle}`}>{step.title}</h4>
                          <p className="text-gray-300 mt-1">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <div className="py-6 border-t border-slate-800/50 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            {data.footerText || `© 2025 - ${projectName} Project. All rights reserved.`}
          </p>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 p-3 rounded-full ${colors.scrollTopBtn} text-white shadow-lg transition-all duration-300 backdrop-blur-sm`}
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default ProjectPhaseComponent;