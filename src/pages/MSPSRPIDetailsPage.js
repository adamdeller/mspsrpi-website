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
import { Link, useLocation } from 'react-router-dom';

//------------------------------------------------------------------
//                     COMPONENT DEFINITION
//------------------------------------------------------------------
const MSPSRPIDetailsPage = () => {

  // STATE VARIABLES AND HOOKS
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [data, setData] = useState(null);
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
        // Fetch the JSON data from the public URL
        const response = await fetch(`${process.env.PUBLIC_URL}/data/mspsrpi/mspsrpiDetails.json`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonData = await response.json();
        setData(jsonData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Only runs once on component mount

  //------------------------------------------------------------------
  //                     FILTERING AND PAGINATION
  //------------------------------------------------------------------
  // Filter pulsars based on flux density
  const filteredPulsars = data?.pulsars
    ? data.pulsars.filter(pulsar => {
      const flux = parseFloat(pulsar.flux_density_1_4GHz);

      switch (fluxFilter) {
        case 'low':
          return flux >= 0.2 && flux < 0.76;
        case 'medium':
          return flux >= 0.76 && flux < 1.2;
        case 'high':
          return flux >= 1.2;
        default:
          return true; // 'all' filter
      }
    })
    : [];

  // Calculate pulsars to display based on pagination
  const currentPulsars = filteredPulsars
    ? filteredPulsars.slice(
      (currentPage - 1) * pulsarsPerPage,
      currentPage * pulsarsPerPage
    )
    : [];

  const totalPages = filteredPulsars
    ? Math.ceil(filteredPulsars.length / pulsarsPerPage)
    : 0;

  // SCROLL TO TOP FUNCTIONALITY
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
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
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-black text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-400 border-r-transparent"></div>
          <p className="mt-4 text-xl">Loading MSPSRπ data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-black text-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">!</div>
          <h2 className="text-2xl mb-4">Something went wrong</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If we have no data even though we're not loading
  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-black text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">No data available. Please refresh the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>
    );
  }

  //------------------------------------------------------------------
  //                  MAIN RENDERING / UI CONTENT
  //------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-slate-900 to-black text-gray-100">
      {/* Navigation */}
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
                className={`${location.pathname.includes('project') ? 'text-indigo-400' : 'text-gray-300 hover:text-indigo-400'} px-3 py-2 font-medium`}
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

      {/* Back to project navigation and page navigation */}
      <div className="pt-20 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/project" className="inline-flex items-center text-purple-300 hover:text-purple-400 transition">
          <ChevronLeft className="w-5 h-5 mr-1" />
          {data.backLinkText || "Back to Project Overview"}
        </Link>
        <Link to="/projects/mspsrpi2-details" className="inline-flex items-center text-purple-300 hover:text-purple-400 transition">
          {data.nextLinkText || "Go to MSPSRπ2"}
          <ArrowRight className="w-5 h-5 ml-1" />
        </Link>
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

            {/* Purple glow effect for MSPSRPI theme */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/10 to-transparent"></div>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <div className="inline-block mb-4 px-4 py-1 bg-purple-900/60 backdrop-blur-sm rounded-full text-purple-300 text-sm font-medium border border-purple-700/50">
              {data.heroTagline || "Project Phase 2014-2018"}
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              {data.heroTitle || "MSPSRπ"}
            </h1>
            <p className="text-xl text-purple-200 mb-6">
              {data.heroSubtitle}
            </p>
            <p className="text-gray-300 mb-8 text-lg">
              {data.heroDescription}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={data.dataReleaseUrl}
                className="inline-flex items-center px-5 py-2 border border-purple-500/40 rounded-md text-purple-300 bg-purple-900/30 hover:bg-purple-800/50 transition duration-300 shadow-[0_0_10px_rgba(147,51,234,0.3)] hover:shadow-[0_0_15px_rgba(147,51,234,0.5)]"
              >
                <Download className="mr-2 h-5 w-5" />
                {data.dataReleaseButtonText || "Access Data Release"}
              </a>
              <a
                href={data.publicationsUrl}
                className="inline-flex items-center px-5 py-2 border border-indigo-500/40 rounded-md text-indigo-300 bg-indigo-900/30 hover:bg-indigo-800/50 transition duration-300"
              >
                <FileText className="mr-2 h-5 w-5" />
                {data.publicationsButtonText || "View Publications"}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-16 z-40 bg-slate-900/80 backdrop-blur-md border-y border-purple-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-hide">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${activeTab === 'overview'
                ? 'text-purple-300 bg-purple-900/40 shadow-[0_0_8px_rgba(147,51,234,0.4)]'
                : 'text-gray-400 hover:text-purple-300'
                }`}
            >
              {data.tabLabels?.overview || "Overview"}
            </button>
            <button
              onClick={() => setActiveTab('objectives')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${activeTab === 'objectives'
                ? 'text-purple-300 bg-purple-900/40 shadow-[0_0_8px_rgba(147,51,234,0.4)]'
                : 'text-gray-400 hover:text-purple-300'
                }`}
            >
              {data.tabLabels?.objectives || "Details"}
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${activeTab === 'results'
                ? 'text-purple-300 bg-purple-900/40 shadow-[0_0_8px_rgba(147,51,234,0.4)]'
                : 'text-gray-400 hover:text-purple-300'
                }`}
            >
              {data.tabLabels?.results || "Key Results"}
            </button>
            <button
              onClick={() => setActiveTab('pulsars')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${activeTab === 'pulsars'
                ? 'text-purple-300 bg-purple-900/40 shadow-[0_0_8px_rgba(147,51,234,0.4)]'
                : 'text-gray-400 hover:text-purple-300'
                }`}
            >
              {data.tabLabels?.pulsars || "Target Pulsars"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Conditionally display content based on active tab */}
      <div className="py-12 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Overview Tab Content */}
          {activeTab === 'overview' && (
            <div>
              <div className="bg-slate-900/40 backdrop-blur-sm border border-purple-900/30 rounded-xl p-6 mb-8 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {data.sectionTitles?.overview || "Project Overview"}
                </h2>
                <div className="prose prose-invert prose-purple max-w-none">
                  {data.overview.map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-300">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Project Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                  {data.statistics.map((stat, index) => (
                    <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 text-center">
                      <h3 className="text-lg font-semibold text-purple-300 mb-2">{stat.label}</h3>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-gray-400 mt-1">{stat.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Timeline */}
              <div className="bg-slate-900/40 backdrop-blur-sm border border-purple-900/30 rounded-xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {data.sectionTitles?.timeline || "Project Timeline"}
                </h2>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-purple-700/50 ml-6 md:ml-8"></div>

                  {/* Timeline events */}
                  <div className="space-y-8">
                    {data.timeline.map((event, index) => (
                      <div key={index} className="relative pl-16 md:pl-20">
                        <div className="absolute left-0 top-1 w-12 h-12 md:w-16 md:h-16 bg-purple-900/60 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.4)] border border-purple-500/50">
                          <span className="text-purple-200 text-sm md:text-base">{event.date}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-purple-300">{event.title}</h3>
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
            <div className="bg-slate-900/40 backdrop-blur-sm border border-purple-900/30 rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">
                {data.sectionTitles?.objectives || "Project Objectives"}
              </h2>

              <div className="space-y-6">
                {data.objectives.map((objective, index) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-4 py-1">
                    <h3 className="text-xl font-bold text-purple-300 mb-2">{objective.title}</h3>
                    <p className="text-gray-300">{objective.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-bold text-white mb-4">
                  {data.sectionTitles?.technicalApproach || "Technical Approach"}
                </h3>
                <div className="prose prose-invert prose-purple max-w-none">
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
            <div className="bg-slate-900/40 backdrop-blur-sm border border-purple-900/30 rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">
                {data.sectionTitles?.keyResults || "Key Results & Discoveries"}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                {data.keyResults.map((result, index) => (
                  <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-5 border border-purple-700/30 hover:border-purple-500/50 transition-all duration-300">
                    <h3 className="text-xl font-bold text-purple-300 mb-3">{result.title}</h3>
                    <p className="text-gray-300 mb-4">{result.description}</p>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold text-white mb-4">
                {data.sectionTitles?.scientificImpact || "Scientific Impact"}
              </h3>
              <div className="prose prose-invert prose-purple max-w-none mb-6">
                {data.scientificImpact.map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-300">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Publications List */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-4">
                  {data.sectionTitles?.publications || "MSPSRπ Publications"}
                </h3>
                <div className="space-y-4">
                  {data.publications.map((pub, index) => (
                    <div key={index} className="bg-slate-800/30 p-4 rounded-lg border border-purple-700/20">
                      <p className="text-gray-300 mb-2">{pub.citation}</p>
                      <div className="flex items-center space-x-4">
                        <a
                          href={pub.doi}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-purple-400 hover:text-purple-300 transition flex items-center"
                        >
                          DOI <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                        {pub.arxiv && (
                          <a
                            href={pub.arxiv}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-purple-400 hover:text-purple-300 transition flex items-center"
                          >
                            arXiv <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <a
                    href={data.publicationsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-purple-500/40 rounded-md text-purple-300 bg-purple-900/30 hover:bg-purple-800/50 transition duration-300"
                  >
                    {data.viewAllPublicationsText || "View All Publications"} <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Pulsars Studied Tab Content */}
          {activeTab === 'pulsars' && (
            <div>
              <div className="bg-slate-900/40 backdrop-blur-sm border border-purple-900/30 rounded-xl p-6 shadow-xl mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {data.sectionTitles?.pulsars || "Pulsars Studied"}
                    </h2>
                    <p className="text-gray-300 mt-1">
                      {data.pulsarsStudied.overview}
                    </p>
                  </div>
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
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${fluxFilter === 'all'
                        ? 'bg-blue-900 text-blue-100'
                        : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                        }`}
                      onClick={() => setFluxFilter('all')}
                    >
                      {data.fluxFilterLabels?.all || "All Pulsars"}
                    </button>
                    <button
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${fluxFilter === 'low'
                        ? 'bg-blue-900 text-blue-100'
                        : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                        }`}
                      onClick={() => setFluxFilter('low')}
                    >
                      {data.fluxFilterLabels?.low || "0.2-0.76 mJy"}
                    </button>
                    <button
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${fluxFilter === 'medium'
                        ? 'bg-blue-900 text-blue-100'
                        : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                        }`}
                      onClick={() => setFluxFilter('medium')}
                    >
                      {data.fluxFilterLabels?.medium || "0.76-1.2 mJy"}
                    </button>
                    <button
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${fluxFilter === 'high'
                        ? 'bg-blue-900 text-blue-100'
                        : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                        }`}
                      onClick={() => setFluxFilter('high')}
                    >
                      {data.fluxFilterLabels?.high || ">1.2 mJy"}
                    </button>
                  </div>
                </div>

                {/* Information about catalogue paper */}
                <div className="bg-slate-800/50 rounded-lg p-4 mb-6 border border-purple-500/30">
                  <p className="text-gray-300">
                    {data.pulsarsStudied.catalogueInfo}
                  </p>
                  <a
                    href={data.pulsarsStudied.catalogueUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 text-purple-300 hover:text-purple-200 transition"
                  >
                    "{data.pulsarsStudied.catalogueTitle}" <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </div>

                {/* Pulsars Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-purple-900/50">
                    <thead className="bg-slate-800/50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                          {data.pulsarTableHeaders?.name || "Pulsar"}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                          {data.pulsarTableHeaders?.ra || "RA"}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                          {data.pulsarTableHeaders?.dec || "Dec"}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                          {data.pulsarTableHeaders?.fluxDensity || "1.4 GHz flux density (mJy)"}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                          {data.pulsarTableHeaders?.inbeamCalibrators || "Number of inbeam calibrators"}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                          {data.pulsarTableHeaders?.epochsObserved || "Number of epochs observed"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-slate-900/30 divide-y divide-slate-800/50">
                      {currentPulsars.map((pulsar, index) => (
                        <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            <div className="flex items-center space-x-2">
                              <Radio className="h-4 w-4 text-purple-500" />
                              <span>{pulsar.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{pulsar.ra}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{pulsar.dec}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{pulsar.flux_density_1_4GHz}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{pulsar.inbeam_calibrators}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{pulsar.epochs_observed}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-4 px-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${currentPage === 1
                        ? 'text-gray-500 cursor-not-allowed'
                        : 'text-purple-300 hover:bg-purple-900/30'
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
                      className={`px-3 py-1 rounded-md ${currentPage === totalPages
                        ? 'text-gray-500 cursor-not-allowed'
                        : 'text-purple-300 hover:bg-purple-900/30'
                        }`}
                    >
                      {data.paginationLabels?.next || "Next"}
                    </button>
                  </div>
                )}
              </div>

              {/* Data Processing Pipeline */}
              <div className="bg-slate-900/40 backdrop-blur-sm border border-purple-900/30 rounded-xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4">
                  {data.sectionTitles?.dataPipeline || "Data Processing Pipeline"}
                </h3>
                <p className="text-gray-300 mb-6">
                  {data.dataPipeline.description}
                </p>

                {/* Pipeline Steps */}
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-8 top-0 h-full w-0.5 bg-purple-700/30"></div>

                  <div className="space-y-8">
                    {data.dataPipeline.steps.map((step, index) => (
                      <div key={index} className="relative flex">
                        <div className="flex-shrink-0 h-16 w-16 rounded-full bg-purple-900/40 border border-purple-500/50 flex items-center justify-center z-10">
                          <span className="text-xl font-bold text-purple-300">{index + 1}</span>
                        </div>
                        <div className="ml-6 mt-2">
                          <h4 className="text-lg font-semibold text-purple-300">{step.title}</h4>
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
            {data.footerText || "© 2025 - MSPSRπ Project. All rights reserved."}
          </p>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-purple-900/80 text-white shadow-lg hover:bg-purple-800 transition-all duration-300 backdrop-blur-sm border border-purple-500/50 shadow-[0_0_10px_rgba(147,51,234,0.4)]"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default MSPSRPIDetailsPage;