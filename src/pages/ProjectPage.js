import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const ProjectPage = () => {
  const [activePhase, setActivePhase] = useState('mspsrpi2');
  
  // Add state for data, loading, and refresh tracking 
  const [projectData, setProjectData] = useState(null);
  const [observationData, setObservationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  
  // Function to fetch data - with timestamp check added
  const fetchData = useCallback(async () => {
    // Check if it's been less than 24 hours since the last update
    // If we have a lastUpdated time and it's been less than 24 hours, skip fetch
    if (lastUpdated && (new Date() - lastUpdated < 86400000)) {
      return; // Skip the fetch if less than a day has passed
    }
    
    // If refreshing, set refreshing state, otherwise set loading state
    if (projectData && observationData) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      // Fetch both JSON files in parallel
      const [projectResponse, observationResponse] = await Promise.all([
        fetch(`/data/projectpage/projectData.json?t=${Date.now()}`),
        fetch(`/data/mspsrpi2/observationData.json?t=${Date.now()}`)
      ]);
      
      // Check if both responses are ok
      if (!projectResponse.ok) {
        throw new Error(`HTTP error fetching project data! Status: ${projectResponse.status}`);
      }
      
      if (!observationResponse.ok) {
        throw new Error(`HTTP error fetching observation data! Status: ${observationResponse.status}`);
      }
      
      // Parse both JSON responses
      const projectDataJson = await projectResponse.json();
      const observationDataJson = await observationResponse.json();
      
      // Update state with the fetched data
      setProjectData(projectDataJson);
      setObservationData(observationDataJson);
      const now = new Date();
      setLastUpdated(now);
      // Single console log here when data is actually updated
      console.log(`Data refreshed at: ${now.toLocaleTimeString()}`);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [projectData, observationData, lastUpdated]); // Added lastUpdated as dependency
  
  // Initial data load and set up auto-refresh
  useEffect(() => {
    // Initial fetch
    fetchData();
    
    // Set up auto-refresh daily
    const refreshInterval = setInterval(() => {
      fetchData();
    }, 86400000); // 24 hours = 86,400,000 milliseconds
    
    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []); // Removed fetchData dependency to prevent unnecessary interval resets
  
  // Calculate simplified progress statistics - now using the state data
  const progressStats = React.useMemo(() => {
    // If no observation data yet, return empty stats
    if (!observationData) {
      return {
        total: 0,
        scheduled: 0,
        inProgress: 0,
        complete: 0,
        issue: 0,
        percentComplete: 0
      };
    }
    
    // We'll track unique pulsars by their status
    const pulsarStatusMap = new Map();
    
    // Process all observations to determine the final status for each pulsar
    observationData.forEach(obs => {
      const currentStatus = pulsarStatusMap.get(obs.srcname);
      
      // Prioritize statuses: complete > in-progress > issue > scheduled
      if (!currentStatus || 
          (currentStatus === 'scheduled' && obs.status !== 'scheduled') ||
          (currentStatus === 'issue' && (obs.status === 'in-progress' || obs.status === 'complete')) ||
          (currentStatus === 'in-progress' && obs.status === 'complete')) {
        pulsarStatusMap.set(obs.srcname, obs.status);
      }
    });
    
    // Count pulsars in each status category
    let complete = 0;
    let inProgress = 0;
    let scheduled = 0;
    let issue = 0;
    
    pulsarStatusMap.forEach(status => {
      if (status === 'complete') complete++;
      else if (status === 'in-progress') inProgress++;
      else if (status === 'scheduled') scheduled++;
      else if (status === 'issue') issue++;
    });
    
    // Total unique pulsars
    const total = pulsarStatusMap.size;
    
    return {
      total,
      scheduled,
      inProgress,
      complete,
      issue,
      percentComplete: Math.round((complete / total) * 100)
    };
  }, [observationData]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-slate-900 to-black text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-400 border-r-transparent"></div>
          <p className="mt-4 text-xl">Loading project data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-slate-900 to-black text-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">!</div>
          <h2 className="text-2xl mb-4">Something went wrong</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={fetchData}
            className="px-4 py-2 bg-indigo-800 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If we have no data even though we're not loading
  if (!projectData || !observationData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-slate-900 to-black text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">No data available. Please refresh the page.</p>
          <button 
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-indigo-800 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>
    );
  }

  // Extract data from projectData now that we know it exists
  const siteInfo = projectData.siteInfo;
  const projectPhases = {
    psrpi: projectData.psrpi,
    mspsrpi: projectData.mspsrpi,
    mspsrpi2: projectData.mspsrpi2
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-slate-900 to-black text-gray-100">
      {/* Navigation - Same as homepage */}
      <nav className="bg-slate-900/90 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">MSPSR<span className="text-indigo-400">π</span></span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-300 hover:text-indigo-400 px-3 py-2 font-medium">Home</a>
              <a href="/project" className="text-indigo-400 px-3 py-2 font-medium">Project</a>
              <a href="/data-release" className="text-gray-300 hover:text-indigo-400 px-3 py-2 font-medium">Data Release</a>
              <a href="/publications" className="text-gray-300 hover:text-indigo-400 px-3 py-2 font-medium">Publications</a>
              <a href="/team" className="text-gray-300 hover:text-indigo-400 px-3 py-2 font-medium">Team</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Combined Hero Section with Timeline */}
      <div className="relative pt-16 pb-4">
        <div className="absolute inset-0 overflow-hidden">
          {/* Dark starry background with multiple star layers for depth */}
          <div className="w-full h-full bg-slate-950">
            {/* Large stars layer */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjI1IiBjeT0iMjUiIHI9IjEiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjE3NSIgY3k9IjE1MCIgcj0iMS4yIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjciLz48Y2lyY2xlIGN4PSI3NSIgY3k9IjEwMCIgcj0iMSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42Ii8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTUiIHI9IjEuNSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC43Ii8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iNTAiIHI9IjEuMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSIxNzUiIHI9IjEuNCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC43Ii8+PGNpcmNsZSBjeD0iMTI1IiBjeT0iMTc1IiByPSIxIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYiLz48L3N2Zz4=')] opacity-50"></div>
            
            {/* Small stars layer */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjAuNCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iMzAiIGN5PSIxMCIgcj0iMC4zIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjIwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjcwIiBjeT0iMTAiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PGNpcmNsZSBjeD0iOTAiIGN5PSIzMCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSIxMCIgY3k9IjUwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iNzAiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSI5MCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSI3MCIgY3k9IjUwIiByPSIwLjMiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjkwIiBjeT0iNzAiIHI9IjAuNCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PGNpcmNsZSBjeD0iMjAiIGN5PSIzMCIgcj0iMC4zIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iMzAiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iODAiIGN5PSI0MCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjgwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iNjAiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iNjAiIGN5PSI4MCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSI4MCIgY3k9IjYwIiByPSIwLjMiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] opacity-60"></div>
            
            {/* Star Field Layer 1 for timeline - Distant small stars */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjAuNCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4zIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iNzUiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iNTAiIHI9IjAuNSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4zNSIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjgwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMyIvPjxjaXJjbGUgY3g9IjI1MCIgY3k9IjUwIiByPSIwLjMiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMjUiLz48Y2lyY2xlIGN4PSIzMDAiIGN5PSI3NSIgcj0iMC41IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjMiLz48Y2lyY2xlIGN4PSIzNTAiIGN5PSI1MCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjM1Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSIxMjUiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTUwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMyIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEyNSIgcj0iMC4zIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjI1Ii8+PGNpcmNsZSBjeD0iMjAwIiBjeT0iMTUwIiByPSIwLjUiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMyIvPjxjaXJjbGUgY3g9IjI1MCIgY3k9IjEyNSIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjM1Ii8+PGNpcmNsZSBjeD0iMzAwIiBjeT0iMTUwIiByPSIwLjMiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxjaXJjbGUgY3g9IjM1MCIgY3k9IjEyNSIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjMiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjIwMCIgcj0iMC41IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjMiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSIyMjUiIHI9IjAuNCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4zNSIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjIwMCIgcj0iMC4zIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjIiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIyMjUiIHI9IjAuNCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4zIi8+PGNpcmNsZSBjeD0iMjUwIiBjeT0iMjAwIiByPSIwLjMiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMjUiLz48Y2lyY2xlIGN4PSIzMDAiIGN5PSIyMjUiIHI9IjAuNSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4zIi8+PGNpcmNsZSBjeD0iMzUwIiBjeT0iMjAwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMzUiLz48L3N2Zz4=')] opacity-40"></div>
          
            {/* Star Field Layer 2 for timeline - Mid-distance medium stars */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjI1IiBjeT0iMjUiIHI9IjAuNyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iNzUiIGN5PSI1MCIgcj0iMC42IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSIxMjUiIGN5PSIyNSIgcj0iMC44IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYiLz48Y2lyY2xlIGN4PSIxNzUiIGN5PSI1MCIgcj0iMC42IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSIyMjUiIGN5PSIyNSIgcj0iMC43IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSIyNzUiIGN5PSI1MCIgcj0iMC44IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYiLz48Y2lyY2xlIGN4PSIzMjUiIGN5PSIyNSIgcj0iMC42IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSIzNzUiIGN5PSI1MCIgcj0iMC43IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSI0MjUiIGN5PSIyNSIgcj0iMC44IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYiLz48Y2lyY2xlIGN4PSI0NzUiIGN5PSI1MCIgcj0iMC42IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSI1MCIgY3k9Ijc1IiByPSIwLjciIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9Ijc1IiByPSIwLjgiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9Ijc1IiByPSIwLjYiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9Ijc1IiByPSIwLjciIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjI1MCIgY3k9Ijc1IiByPSIwLjgiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjMwMCIgY3k9Ijc1IiByPSIwLjYiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjM1MCIgY3k9Ijc1IiByPSIwLjciIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjQwMCIgY3k9Ijc1IiByPSIwLjgiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjQ1MCIgY3k9Ijc1IiByPSIwLjYiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] opacity-25"></div>
            
            {/* Subtle blue glow effect for nebula-like impression */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900/10 to-transparent"></div>
            
            {/* Cosmic nebula glow effects for timeline */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent opacity-50"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent opacity-30"></div>
            
            {/* Darker gradient overlay at the edges */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 opacity-40"></div>
          </div>
        </div>

        {/* Hero content - Now using data from siteInfo */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-white mb-4">{siteInfo.heroTitle}</h1>
            <p className="text-xl text-indigo-200 mb-6">
              {siteInfo.heroSubtitle}
            </p>
            <p className="text-gray-300 mb-4">
              {siteInfo.heroDescription}
            </p>
          </div>
        </div>
        
        {/* Timeline section - Now using data from siteInfo.timeline */}
        <div className="relative py-6 mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-900/50 via-indigo-500/50 to-indigo-900/50"></div>
              
              {/* Timeline points - Dynamically rendered from siteInfo.timeline */}
              <div className="relative flex justify-around items-center px-20 py-4">
                {siteInfo.timeline.map((timepoint, index) => {
                  // Determine the appropriate styling based on the phase
                  let colorClass = "text-green-300";
                  let borderClass = "border-green-400";
                  let shadowClass = "shadow-[0_0_12px_rgba(74,222,128,0.8)]";
                  
                  if (timepoint.phase === "MSPSRPI") {
                    colorClass = "text-purple-300";
                    borderClass = "border-purple-400";
                    shadowClass = "shadow-[0_0_12px_rgba(192,132,252,0.8)]";
                  } else if (timepoint.phase === "MSPSRPI2") {
                    colorClass = "text-blue-300";
                    borderClass = "border-blue-400";
                    shadowClass = "shadow-[0_0_12px_rgba(96,165,250,0.8)]";
                  }
                  
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div className={`w-5 h-5 rounded-full bg-black border-2 ${borderClass} z-10 ${shadowClass}`}></div>
                      {timepoint.current && (
                        <div className="absolute -top-10">
                          <div className="bg-indigo-900/80 backdrop-blur-sm text-indigo-100 text-xs px-2 py-1 rounded border border-indigo-500/50 shadow-lg shadow-indigo-500/20">
                            We are here
                          </div>
                        </div>
                      )}
                      <p className={`mt-2 ${colorClass} text-sm font-medium`}>{timepoint.period}</p>
                      <p className="text-gray-300 text-xs">{timepoint.phase}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Phases Section */}
      <div id="project-phases" className="py-12 bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Project Phases</h2>
            <p className="text-xl text-indigo-300 max-w-3xl mx-auto">
              Spanning over a decade of research, our program has evolved through three distinct phases
            </p>
          </div>

          {/* Phase navigation tabs with different colored neon effects */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex rounded-md shadow-sm bg-slate-900/70 backdrop-blur-sm p-1 border border-slate-700/50">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                  activePhase === 'psrpi'
                    ? 'text-green-300 shadow-[0_0_12px_rgba(74,222,128,0.6)] border border-green-400/50'
                    : 'text-gray-400 hover:text-green-300 hover:shadow-[0_0_8px_rgba(74,222,128,0.3)]'
                }`}
                onClick={() => setActivePhase('psrpi')}
              >
                PSRPI
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                  activePhase === 'mspsrpi'
                    ? 'text-purple-300 shadow-[0_0_12px_rgba(192,132,252,0.6)] border border-purple-400/50'
                    : 'text-gray-400 hover:text-purple-300 hover:shadow-[0_0_8px_rgba(192,132,252,0.3)]'
                }`}
                onClick={() => setActivePhase('mspsrpi')}
              >
                MSPSRPI
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                  activePhase === 'mspsrpi2'
                    ? 'text-blue-300 shadow-[0_0_12px_rgba(96,165,250,0.6)] border border-blue-400/50'
                    : 'text-gray-400 hover:text-blue-300 hover:shadow-[0_0_8px_rgba(96,165,250,0.3)]'
                }`}
                onClick={() => setActivePhase('mspsrpi2')}
              >
                MSPSRPI2
              </button>
            </div>
          </div>

          {/* Active phase content */}
          <div className="bg-slate-900/40 backdrop-blur-sm border border-indigo-900/30 rounded-xl p-6 mb-12 shadow-xl">
            <div className="grid md:grid-cols-1 gap-6 mb-8">
              <div>
                <div className="flex md:flex-row flex-col justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{projectPhases[activePhase].title}</h3>
                    <p className="text-lg text-indigo-300 mt-1">{projectPhases[activePhase].subtitle}</p>
                  </div>
                  
                  {/* Phase Statistics inline with title */}
                  <div className="flex space-x-8 mt-4 md:mt-0">
                    <div className="text-center">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">PULSARS</p>
                      <p className="text-3xl font-bold text-white">{projectPhases[activePhase].stats.pulsars}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">PRECISION</p>
                      <p className="text-3xl font-bold text-white">{projectPhases[activePhase].stats.precision}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">PUBLICATIONS</p>
                      <p className="text-3xl font-bold text-white">{projectPhases[activePhase].stats.publications}</p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 mb-6">
                  {projectPhases[activePhase].description}
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Simplified Project Objectives */}
                  <div>
                    <h4 className="text-lg font-semibold text-indigo-200 mb-4">Project Objectives</h4>
                    <ul className="space-y-2">
                      {projectPhases[activePhase].objectives.map((objective, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-indigo-400 mr-3">•</span>
                          <span className="text-gray-300">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Key Achievements */}
                  <div>
                    <h4 className="text-lg font-semibold text-indigo-200 mb-4">Key Achievements</h4>
                    <ul className="space-y-2">
                      {projectPhases[activePhase].achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-400 mr-3">✓</span>
                          <span className="text-gray-300">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              {activePhase !== 'psrpi' && (
                <a 
                  href={`/projects/${activePhase}-details`} 
                  className="inline-flex items-center px-5 py-2 border border-indigo-500/40 rounded-md text-indigo-300 bg-indigo-900/30 hover:bg-indigo-800/50 transition duration-300 shadow-[0_0_10px_rgba(79,70,229,0.3)] hover:shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                >
                  View Detailed Project Information <ChevronRight className="ml-2 h-4 w-4" />
                </a>
              )}  
              {activePhase === 'psrpi' && (
                <a 
                  href="https://safe.nrao.edu/vlba/psrpi/home.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 ml-4 border border-indigo-500/40 rounded-md text-indigo-300 bg-indigo-900/30 hover:bg-indigo-900/50 transition duration-300"
                >
                  Visit Original PSRPI Website <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PROGRESS TRACKER SECTION */}
      <div id="progress-tracker" className="py-12 bg-gradient-to-b from-slate-950 via-slate-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">MSPSRPI2 Progress Tracker</h2>
            <p className="text-xl text-indigo-300 max-w-3xl mx-auto">
              Current status of pulsar observations
            </p>
          </div>

          {/* Simplified Progress Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {/* Target Pulsars */}
            <div className="bg-slate-900/60 backdrop-blur-sm border-2 border-blue-500/30 rounded-lg p-4 text-center relative overflow-hidden group transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <h3 className="text-lg font-semibold text-blue-300 mb-2 relative z-10">Target</h3>
              <p className="text-4xl font-bold text-gray-100 relative z-10">{progressStats.total}</p>
              <p className="text-sm text-blue-200 relative z-10">Total number of pulsars</p>
            </div>
            
            {/* Scheduled */}
            <div className="bg-slate-900/60 backdrop-blur-sm border-2 border-indigo-500/30 rounded-lg p-4 text-center relative overflow-hidden group transition-all duration-300 hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <h3 className="text-lg font-semibold text-indigo-300 mb-2 relative z-10">Scheduled</h3>
              <p className="text-4xl font-bold text-gray-100 relative z-10">{progressStats.scheduled}</p>
              <p className="text-sm text-indigo-200 relative z-10">Waiting for initial observation</p>
            </div>
            
            {/* In Progress */}
            <div className="bg-slate-900/60 backdrop-blur-sm border-2 border-amber-500/30 rounded-lg p-4 text-center relative overflow-hidden group transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(217,119,6,0.3)]">
              <h3 className="text-lg font-semibold text-amber-300 mb-2 relative z-10">In Progress</h3>
              <p className="text-4xl font-bold text-gray-100 relative z-10">{progressStats.inProgress}</p>
              <p className="text-sm text-amber-200 relative z-10">Currently being observed</p>
            </div>
            
            {/* Completed */}
            <div className="bg-slate-900/60 backdrop-blur-sm border-2 border-emerald-500/30 rounded-lg p-4 text-center relative overflow-hidden group transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <h3 className="text-lg font-semibold text-emerald-300 mb-2 relative z-10">Completed</h3>
              <p className="text-4xl font-bold text-gray-100 relative z-10">{progressStats.complete}</p>
              <p className="text-sm text-emerald-200 relative z-10">All observations completed</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="bg-slate-800/50 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full"
                style={{ width: `${progressStats.percentComplete}%` }}
              ></div>
            </div>
            <p className="text-center text-indigo-300 mt-2">{progressStats.percentComplete}% Complete</p>
          </div>
        </div>
      </div>
      
      {/* Removed the in-render console.log that was causing multiple logs */}
      
      {/* Footer */}
      <div className="py-6 border-t border-slate-800/50 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © 2025 - MSPSRπ Project. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;