import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Star, Book, ChevronRight, Users, ExternalLink, Search, Download } from 'lucide-react';
import { Rocket, Telescope, MapPinned, BookOpenText, Stars, Ruler, BookOpen, Sparkles } from "lucide-react";
import PulsarVisualizations from './PulsarVisualizations'; // Import the PulsarVisualizations component


const Homepage = () => {
  const location = useLocation(); // Add this line to get current location
  const [activeResearchQuestion, setActiveResearchQuestion] = useState(null);
  const [questionSlide, setQuestionSlide] = useState(0);
  const [teamMemberSlide, setTeamMemberSlide] = useState(0);
  const [projectStats, setProjectStats] = useState([]);
  const [phase2Progress, setPhase2Progress] = useState({
    totalPulsars: 0,
    observedPulsars: 0,
    percentComplete: 0
  });
  const [phase1Progress, setPhase1Progress] = useState([]);
  const [researchQuestions, setResearchQuestions] = useState([]);
  const [researchQuestionsVisible, setResearchQuestionsVisible] = useState(true);
  const [keyDiscoveriesVisible, setKeyDiscoveriesVisible] = useState(true);
  const [keyFindings, setKeyFindings] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [headings, setHeadings] = useState({});
  const [pulsarJourney, setPulsarJourney] = useState({ title: "", subtitle: "", steps: [] });
  const [pulsarJourneyVisible, setPulsarJourneyVisible] = useState(true);
  const [pulsarInfoVisible, setPulsarInfoVisible] = useState(true);
  const journeyIcons = [<Telescope />, <Rocket />, <Ruler />, <BookOpen />, <Sparkles />];
    // Calculate max slides for team members (showing 2 at a time)
  const maxTeamSlides = Math.ceil(teamMembers.length / 2) - 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homepageRes, observationRes, teamRes] = await Promise.all([
          fetch(`${process.env.PUBLIC_URL}/data/homepage/HomePage.json`),
          fetch(`${process.env.PUBLIC_URL}/data/mspsrpi2/observationData.json`),
          fetch(`${process.env.PUBLIC_URL}/data/teamPage/teamMembers.json`)
        ]);

        const homepageData = await homepageRes.json();
        const observationData = await observationRes.json();
        const teamMemberData = await teamRes.json();

        // Compute dynamic stats
        const uniqueSources = new Set();
        const completedSources = new Set();
        let earliestDate = new Date();

        observationData.forEach(obs => {
          uniqueSources.add(obs.srcname);
          const obsDate = new Date(obs.obsDate);
          if (obsDate < earliestDate) earliestDate = obsDate;
          if (obs.status === 'complete') {
            completedSources.add(obs.srcname);
          }
        });

        const total = uniqueSources.size;
        const completed = completedSources.size;
        const percent = total ? Math.round((completed / total) * 100) : 0;
        const yearsOfResearch = new Date().getFullYear() - earliestDate.getFullYear();

        setProjectStats([
          { value: total.toString(), label: "Pulsars Observed" },
          { ...homepageData.projectStats.find(stat => stat.label === "Parallax Precision") },
          { value: `${completed}+`, label: "Precise Distances" },
          { ...homepageData.projectStats.find(stat => stat.label === "Years of Research") }
        ]);

        setPhase2Progress({
          totalPulsars: total,
          observedPulsars: completed,
          percentComplete: percent
        });

        setPhase1Progress(homepageData.phase1Progress);
        setPulsarJourney(homepageData.pulsarJourney);
        setHeadings(homepageData.sectionHeaders);
        setResearchQuestions(homepageData.researchQuestions);
        setResearchQuestionsVisible(homepageData.researchQuestionsVisible !== false);
        setPulsarJourneyVisible(homepageData.pulsarJourneyVisible !== false);
        setKeyDiscoveriesVisible(homepageData.keyDiscoveriesVisible !== false);
        setPulsarInfoVisible(homepageData.pulsarInfoVisible !== false);
        setKeyFindings(homepageData.keyFindings);
        setTeamMembers(teamMemberData.teamMembers);
      } catch (err) {
        console.error('Failed to load homepage or observation data:', err);
      }
    };

    fetchData();
  }, []);



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

      {/* Hero Section - With starry background */}
      <div className="relative min-h-screen pt-16">
        <div className="absolute inset-0 overflow-hidden">
          {/* Dark starry background with multiple star layers for depth */}
          <div className="w-full h-full bg-slate-950">
            {/* Large stars layer - reduced density */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjI1IiBjeT0iMjUiIHI9IjEiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjE3NSIgY3k9IjE1MCIgcj0iMS4yIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjciLz48Y2lyY2xlIGN4PSI3NSIgY3k9IjEwMCIgcj0iMSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42Ii8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTUiIHI9IjEuNSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC43Ii8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iNTAiIHI9IjEuMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSIxNzUiIHI9IjEuNCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC43Ii8+PGNpcmNsZSBjeD0iMTI1IiBjeT0iMTc1IiByPSIxIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYiLz48L3N2Zz4=')] opacity-50"></div>

            {/* Small stars layer - reduced density */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjAuNCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iMzAiIGN5PSIxMCIgcj0iMC4zIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjIwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjcwIiBjeT0iMTAiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PGNpcmNsZSBjeD0iOTAiIGN5PSIzMCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSIxMCIgY3k9IjUwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iNzAiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSI5MCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSI3MCIgY3k9IjUwIiByPSIwLjMiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjkwIiBjeT0iNzAiIHI9IjAuNCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PGNpcmNsZSBjeD0iMjAiIGN5PSIzMCIgcj0iMC4zIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iMzAiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iODAiIGN5PSI0MCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjgwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iNjAiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iNjAiIGN5PSI4MCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSI4MCIgY3k9IjYwIiByPSIwLjMiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] opacity-60"></div>

            {/* Subtle blue glow effect for nebula-like impression */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900/10 to-transparent"></div>

            {/* Darker gradient overlay at the edges */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 opacity-40"></div>
          </div>
        </div>

        <div className="relative flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Mapping the Galaxy with Pulsar Astrometry</h1>
            <p className="text-xl text-indigo-200 mb-8">
              Precisely measuring distances to neutron stars for gravitational wave research and Galactic structure mapping
            </p>

            {/* Progress Card for the project (the one you see first on the page) */}
            <div className="bg-indigo-950/60 backdrop-blur-sm border border-indigo-500/30 rounded-xl p-5 shadow-lg mb-8">
              <h3 className="text-lg font-semibold text-indigo-100 mb-3">MSPSRπ Phase 2 Progress: {phase2Progress.totalPulsars} pulsars targeted</h3>

              <div className="mb-2">
                <div className="h-2.5 bg-indigo-950/70 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full relative overflow-hidden"
                    style={{ width: `${phase2Progress.percentComplete}%` }}
                  >
                    {/* Neon animated progress bar with glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-indigo-400 to-purple-500 animate-pulse"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-indigo-400 to-purple-500 opacity-70 animate-shimmer"></div>
                  </div>
                </div>
                <div className="flex justify-end text-sm text-indigo-200 mt-1">
                  <span>{phase2Progress.percentComplete}% Complete</span>
                </div>
              </div>

              <div className="flex justify-between text-sm text-indigo-300 mb-3">
                {/* <span>Phase 1: {phase1Progress.observedPulsars}/{phase1Progress.totalPulsars} Pulsars observed ✓</span> */}
                <span>Phase 2: {phase2Progress.observedPulsars}/{phase2Progress.totalPulsars} Pulsars observed</span>
              </div>

              <div className="text-center">
                {/* Direct link to MSPSRPI2 Progress Tracker section */}
                <Link to="/project#progress-tracker" className="inline-block text-sm bg-indigo-900/50 px-4 py-2 rounded-md border border-indigo-600/30 text-indigo-300 transition-all duration-300 hover:border-indigo-400/80 hover:text-indigo-200 hover:shadow-indigo-500/40 hover:shadow-[0_0_10px_rgba(79,70,229,0.4)]">
                  View Detailed Progress
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smooth gradient transition container for middle sections - unified background transition */}
      <div className="bg-gradient-to-b from-indigo-950 via-slate-900 via-slate-950 to-black">
        {/* Stats Section (the boxes with summary numbers - but we don't have any result for the current phase) */}
        <div className="py-10 pb-4 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {projectStats.map((stat, index) => (
                <div key={index} className="bg-gradient-to-b from-slate-900/90 to-slate-950 backdrop-blur-sm border border-slate-700/30 rounded-lg py-10 px-6 text-center transition hover:transform hover:-translate-y-1 hover:shadow-lg flex flex-col justify-center items-center h-full shadow-md">
                  <p className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-cyan-300 mb-4">
                    {stat.value}
                  </p>
                  <p className="text-slate-300 text-lg">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {pulsarJourneyVisible && (
          <div className="py-16 bg-slate-900/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">{pulsarJourney.title}</h2>
                <p className="text-indigo-300 text-lg">{pulsarJourney.subtitle}</p>
              </div>

              <div className="grid md:grid-cols-5 gap-6">
                {pulsarJourney.steps.map((step, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 border border-indigo-700/30 shadow-lg flex flex-col items-center text-center transition hover:scale-105"
                  >
                    <div className="mb-4 text-white">{journeyIcons[index]}</div>
                    <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                    <p className="text-indigo-200 text-sm">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Research Questions Section */}
        {researchQuestionsVisible && (
          <div id="research" className="py-8 pt-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">{headings.researchTitle}</h2>
                <p className="text-xl text-indigo-300">{headings.researchSubtitle}</p>
              </div>

              <div className="w-full">
                <div className="mb-8">
                  <p className="text-gray-300 mb-6 text-center max-w-3xl mx-auto">
                    Our research explores fundamental questions about our universe through precise pulsar position measurements. Below are some of the key research questions driving our work.
                  </p>
                </div>

                {/* Questions container - with stars and consistent styling */}
                <div className="w-full pt-10 pb-16 mb-0 rounded-xl relative overflow-hidden bg-slate-950/70 backdrop-blur-md shadow-xl">
                  {/* Added starry background */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjI1IiBjeT0iMjUiIHI9IjEiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjE3NSIgY3k9IjE1MCIgcj0iMS4yIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjciLz48Y2lyY2xlIGN4PSI3NSIgY3k9IjEwMCIgcj0iMSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42Ii8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTUiIHI9IjEuNSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC43Ii8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iNTAiIHI9IjEuMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSIxNzUiIHI9IjEuNCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC43Ii8+PGNpcmNsZSBjeD0iMTI1IiBjeT0iMTc1IiByPSIxIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYiLz48L3N2Zz4=')] opacity-30"></div>

                  {/* Small stars layer */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjAuNCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iMzAiIGN5PSIxMCIgcj0iMC4zIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjIwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjcwIiBjeT0iMTAiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PGNpcmNsZSBjeD0iOTAiIGN5PSIzMCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSIxMCIgY3k9IjUwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iNzAiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSI5MCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSI3MCIgY3k9IjUwIiByPSIwLjMiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjkwIiBjeT0iNzAiIHI9IjAuNCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PGNpcmNsZSBjeD0iMjAiIGN5PSIzMCIgcj0iMC4zIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iMzAiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iODAiIGN5PSI0MCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjgwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iNjAiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iNjAiIGN5PSI4MCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSI4MCIgY3k9IjYwIiByPSIwLjMiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] opacity-20"></div>

                  {/* Cosmic nebula glow effect */}
                  <div className="absolute inset-0 bg-gradient-radial from-blue-950/20 via-slate-950/5 to-transparent opacity-70"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent opacity-50"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent opacity-50"></div>

                  {/* Navigation arrows */}
                  <button
                    onClick={() => setQuestionSlide(prev => Math.max(0, prev - 1))}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-slate-800/40 backdrop-blur-sm rounded-full border border-indigo-600/30 text-indigo-300 transition-all duration-300 shadow-lg hover:border-indigo-400/80 hover:text-indigo-200 hover:shadow-indigo-500/40 hover:shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                    disabled={questionSlide === 0}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Updated card container to better center relative to arrows */}
                  <div className="relative w-full h-full flex items-center justify-center z-20">
                    <div className="flex justify-center items-stretch px-20 mx-auto w-full max-w-5xl">
                      {/* Show only 3 questions at a time based on current slide - with consistent sizing */}
                      {researchQuestions.slice(questionSlide, questionSlide + 3).map((question, index) => {
                        // Single consistent gradient for all cards
                        const cardGradient = "bg-gradient-to-br from-slate-900/95 via-indigo-950/50 to-slate-900/95";

                        return (
                          <div
                            key={index + questionSlide}
                            className={`${cardGradient} backdrop-blur-sm border border-indigo-800/30 rounded-lg p-6 mx-3 w-full transition duration-300 hover:transform hover:scale-105 shadow-xl flex flex-col`}
                            style={{ minHeight: "220px" }}
                          >
                            <div className="mb-4">
                              <h3 className="text-lg font-bold text-indigo-100">{question.title}</h3>
                            </div>
                            <p className="text-base text-indigo-200 leading-relaxed opacity-90 flex-grow">{question.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => setQuestionSlide(prev => Math.min(researchQuestions.length - 3, prev + 1))}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-slate-800/40 backdrop-blur-sm rounded-full border border-indigo-600/30 text-indigo-300 transition-all duration-300 shadow-lg hover:border-indigo-400/80 hover:text-indigo-200 hover:shadow-indigo-500/40 hover:shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                    disabled={questionSlide >= researchQuestions.length - 3}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Explore button - ethereal design */}
                  <div className="relative mt-10 text-center z-20">
                    <Link to="/project" className="inline-flex items-center px-6 py-3 border border-indigo-600/30 rounded-md shadow-xl text-base font-medium text-indigo-300 bg-slate-800/70 backdrop-blur-sm transition-all duration-300 hover:border-indigo-400/80 hover:text-indigo-200 hover:shadow-indigo-500/40 hover:shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                      Explore The Project
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Millisecond Pulsars Explainer Section - the visualisation content goes here */}
        {pulsarJourneyVisible && (
          <div className="py-16 bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">What Are Millisecond Pulsars?</h2>
                <p className="text-xl text-indigo-300">Cosmic Lighthouses Spinning Hundreds of Times Per Second</p>
              </div>

              {/* PulsarVisualizations component */}
              <div className="mb-12">
                <PulsarVisualizations />
              </div>
            </div>
          </div>
        )}

        {/* Key Findings Section */}
        {keyDiscoveriesVisible && (
          <div className="py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Key Discoveries</h2>
                <p className="text-xl text-indigo-300">Our research has led to several important scientific insights</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {keyFindings.map((finding, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-b ${index === 0
                      ? "from-slate-900/95 via-blue-950/30 to-slate-900/95"
                      : index === 1
                        ? "from-slate-900/95 via-purple-950/30 to-slate-900/95"
                        : "from-slate-900/95 via-emerald-950/20 to-slate-900/95"
                      } backdrop-blur-sm border border-slate-700/30 rounded-lg p-8 transition hover:transform hover:-translate-y-1 shadow-lg relative overflow-hidden group`}
                  >
                    {/* Background effects */}
                    <div
                      className={`absolute inset-0 bg-[radial-gradient(ellipse_at_${index === 0
                        ? "top_right"
                        : index === 1
                          ? "top_left"
                          : "bottom_right"
                        },_var(--tw-gradient-stops))] ${index === 0
                          ? "from-cyan-900/20"
                          : index === 1
                            ? "from-purple-900/20"
                            : "from-teal-900/20"
                        } via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-700`}
                    ></div>

                    <div
                      className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjMwMCIgY3k9IjMwMCIgcj0iMC44IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIyMDAiIHI9IjAuNCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4zIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMzAwIiByPSIwLjYiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjMwMCIgY3k9IjEwMCIgcj0iMC41IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjMiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjM1MCIgY3k9IjM1MCIgcj0iMC4zIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjMiLz48L3N2Zz4=')] opacity-10 group-hover:opacity-20 transition-opacity duration-700"
                    ></div>

                    {/* Icon placeholder */}
                    <div className="flex justify-center items-center mb-6">
                      <div
                        className={`w-16 h-16 ${index === 0
                          ? "bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-blue-700/30 shadow-cyan-800/20"
                          : index === 1
                            ? "bg-gradient-to-br from-purple-900/40 to-violet-900/40 border-purple-700/30 shadow-purple-800/20"
                            : "bg-gradient-to-br from-teal-900/40 to-emerald-900/40 border-teal-700/30 shadow-teal-800/20"
                          } backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg relative z-10 overflow-hidden`}
                      >
                        <div
                          className={`absolute inset-0 ${index === 0
                            ? "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400/20 via-blue-600/10 to-transparent"
                            : index === 1
                              ? "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-400/20 via-purple-600/10 to-transparent"
                              : "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-400/20 via-teal-600/10 to-transparent"
                            }`}
                        ></div>
                        {/* You can add different icons based on index here if needed */}
                        <MapPin className="h-8 w-8 text-cyan-300" />
                      </div>
                    </div>

                    {/* Dynamic content */}
                    <h3 className="text-xl font-semibold text-blue-100 mb-4 relative z-10 text-center">
                      {finding.title}
                    </h3>
                    <p className="text-slate-300 relative z-10 leading-relaxed text-center">
                      {finding.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Team Member Carousel Section */}
        <div className="py-16 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Meet Our Researchers</h2>
              <p className="text-xl text-indigo-300">The brilliant minds behind our discoveries</p>
            </div>

            {/* Team Member Carousel */}
            <div className="w-full rounded-xl relative overflow-hidden bg-slate-950/70 backdrop-blur-md shadow-xl py-12 mb-8">
              {/* Starry background for carousel */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjI1IiBjeT0iMjUiIHI9IjEiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjE3NSIgY3k9IjE1MCIgcj0iMS4yIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjciLz48Y2lyY2xlIGN4PSI3NSIgY3k9IjEwMCIgcj0iMSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42Ii8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTUiIHI9IjEuNSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC43Ii8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iNTAiIHI9IjEuMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSIxNzUiIHI9IjEuNCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC43Ii8+PGNpcmNsZSBjeD0iMTI1IiBjeT0iMTc1IiByPSIxIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYiLz48L3N2Zz4=')] opacity-20"></div>

              {/* Small stars layer */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjAuNCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iMzAiIGN5PSIxMCIgcj0iMC4zIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjIwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjcwIiBjeT0iMTAiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PGNpcmNsZSBjeD0iOTAiIGN5PSIzMCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSIxMCIgY3k9IjUwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iNzAiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSI5MCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSI3MCIgY3k9IjUwIiByPSIwLjMiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjkwIiBjeT0iNzAiIHI9IjAuNCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PGNpcmNsZSBjeD0iMjAiIGN5PSIzMCIgcj0iMC4zIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iMzAiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iODAiIGN5PSI0MCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjgwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iNjAiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iNjAiIGN5PSI4MCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSI4MCIgY3k9IjYwIiByPSIwLjMiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] opacity-10"></div>

              {/* Cosmic nebula glow effect */}
              <div className="absolute inset-0 bg-gradient-radial from-blue-950/20 via-slate-950/5 to-transparent opacity-70"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent opacity-50"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent opacity-50"></div>

              {/* Navigation arrows for team carousel */}
              <button
                onClick={() => setTeamMemberSlide(prev => Math.max(0, prev - 1))}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-slate-800/40 backdrop-blur-sm rounded-full border border-indigo-600/30 text-indigo-300 transition-all duration-300 shadow-lg hover:border-indigo-400/80 hover:text-indigo-200 hover:shadow-indigo-500/40 hover:shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                disabled={teamMemberSlide === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Team Member Cards - two at a time */}
              <div className="flex justify-center px-20">
                <div className="w-full max-w-6xl flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
                  {/* First Team Member Card */}
                  {teamMemberSlide * 2 < teamMembers.length && (
                    <div className="w-full md:w-1/2">
                      <div className="bg-gradient-to-b from-indigo-900/30 to-slate-900/30 backdrop-blur-sm border border-indigo-500/20 rounded-xl overflow-hidden shadow-xl h-full">
                        <div className="p-6 flex flex-col items-center h-full">
                          <div className="w-28 h-28 rounded-full border-2 border-indigo-400/50 overflow-hidden mb-4 shadow-xl shadow-indigo-900/20">
                            <img src={teamMembers[teamMemberSlide * 2].photo} alt={teamMembers[teamMemberSlide * 2].name} className="w-full h-full object-cover" />
                          </div>
                          <h3 className="text-xl font-bold text-white">{teamMembers[teamMemberSlide * 2].name}</h3>
                          <p className="text-indigo-300 mb-1">{teamMembers[teamMemberSlide * 2].role}</p>
                          <p className="text-indigo-400/70 text-sm mb-4">{teamMembers[teamMemberSlide * 2].institution}</p>
                          <div className="bg-indigo-950/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg p-5 relative flex-grow">
                            <div className="absolute top-3 left-3 text-indigo-300 opacity-30 text-4xl">"</div>
                            <div className="absolute bottom-3 right-3 text-indigo-300 opacity-30 text-4xl">"</div>
                            <p className="text-indigo-100 text-base italic relative z-10">
                              {teamMembers[teamMemberSlide * 2].quote}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Second Team Member Card */}
                  {teamMemberSlide * 2 + 1 < teamMembers.length && (
                    <div className="w-full md:w-1/2">
                      <div className="bg-gradient-to-b from-indigo-900/30 to-slate-900/30 backdrop-blur-sm border border-indigo-500/20 rounded-xl overflow-hidden shadow-xl h-full">
                        <div className="p-6 flex flex-col items-center h-full">
                          <div className="w-28 h-28 rounded-full border-2 border-indigo-400/50 overflow-hidden mb-4 shadow-xl shadow-indigo-900/20">
                            <img src={teamMembers[teamMemberSlide * 2 + 1].photo} alt={teamMembers[teamMemberSlide * 2 + 1].name} className="w-full h-full object-cover" />
                          </div>
                          <h3 className="text-xl font-bold text-white">{teamMembers[teamMemberSlide * 2 + 1].name}</h3>
                          <p className="text-indigo-300 mb-1">{teamMembers[teamMemberSlide * 2 + 1].role}</p>
                          <p className="text-indigo-400/70 text-sm mb-4">{teamMembers[teamMemberSlide * 2 + 1].institution}</p>
                          <div className="bg-indigo-950/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg p-5 relative flex-grow">
                            <div className="absolute top-3 left-3 text-indigo-300 opacity-30 text-4xl">"</div>
                            <div className="absolute bottom-3 right-3 text-indigo-300 opacity-30 text-4xl">"</div>
                            <p className="text-indigo-100 text-base italic relative z-10">
                              {teamMembers[teamMemberSlide * 2 + 1].quote}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setTeamMemberSlide(prev => Math.min(maxTeamSlides, prev + 1))}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-slate-800/40 backdrop-blur-sm rounded-full border border-indigo-600/30 text-indigo-300 transition-all duration-300 shadow-lg hover:border-indigo-400/80 hover:text-indigo-200 hover:shadow-indigo-500/40 hover:shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                disabled={teamMemberSlide >= maxTeamSlides}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Team indicator dots */}
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: Math.ceil(teamMembers.length / 2) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setTeamMemberSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === teamMemberSlide
                      ? "bg-indigo-400 shadow-lg shadow-indigo-400/50"
                      : "bg-slate-600 hover:bg-slate-500"
                      }`}
                    aria-label={`Go to team members ${index * 2 + 1}-${index * 2 + 2}`}
                  />
                ))}
              </div>

              {/* Meet the team button */}
              <div className="flex justify-center mt-8">
              <Link to="/team#top" className="inline-flex items-center px-5 py-2.5 border border-indigo-600/30 rounded-md shadow-xl text-base font-medium text-indigo-300 bg-slate-800/70 backdrop-blur-sm transition-all duration-300 hover:border-indigo-400/80 hover:text-indigo-200 hover:shadow-indigo-500/40 hover:shadow-[0_0_15px_rgba(79,70,229,0.4)]">
  <Users className="mr-2 h-5 w-5" />
  Meet the Team
</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Check the data section */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-800/30 rounded-xl p-8 shadow-lg">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Ready to explore the data?</h2>
              <p className="text-indigo-200 mb-6">Browse our comprehensive pulsar catalog with interactive visualizations</p>

              <div className="flex justify-center">
                <Link to="/data-release" className="inline-flex items-center justify-center px-5 py-3 border border-indigo-500/40 text-base font-medium rounded-md shadow-md text-indigo-200 bg-indigo-700/50 backdrop-blur-sm transition-all duration-300 hover:border-indigo-400/80 hover:text-white hover:shadow-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Pulsar Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Watermark - With black background */}
      <div className="relative py-6 border-t border-slate-800/50 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <p className="text-center text-gray-500 text-sm">
            © 2025 Pulsar Astrometry Research Initiative. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Homepage;