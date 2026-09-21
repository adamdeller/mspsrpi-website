import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Radio, 
  Search, 
  MapPin, 
  Database, 
  BookOpen, 
  Users, 
  ExternalLink, 
  ChevronRight, 
  Sparkles,
  Layers,
  Zap,
  Globe,
  Award,
  ArrowRight
} from 'lucide-react';

const HomePage = () => {
  const [homepageContent, setHomepageContent] = useState(null);
  const [projectStats, setProjectStats] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [phase2Progress, setPhase2Progress] = useState({
    totalHours: 0,
    observedHours: 0,
    percentComplete: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homepageRes, observationRes, teamRes] = await Promise.all([
          fetch(`${process.env.PUBLIC_URL}/data/homepage/HomePage.json`),
          fetch(`${process.env.PUBLIC_URL}/data/mspsrpi2/observationTrack.json`),
          fetch(`${process.env.PUBLIC_URL}/data/teamPage/teamMembers.json`)
        ]);

        const homepageData = await homepageRes.json();
        const observationData = await observationRes.json();
        const teamMemberData = await teamRes.json();

        // Compute dynamic observation statistics based on hours
        let totalHours = 0;
        let observedHours = 0;

        observationData.forEach(obs => {
          const duration = obs.dur ?? obs.duration ?? 0;
          totalHours += duration;

          const obsDate = obs.obsDate ?? obs.obs_date;
          if (obsDate !== null && obsDate !== undefined) {
            observedHours += duration;
          }
        });

        const percent = totalHours > 0 ? Math.round((observedHours / totalHours) * 100) : 0;

        setProjectStats([
          { value: `${totalHours}`, label: "Total Hours Planned" },
          { ...homepageData.projectStats.find(stat => stat.label === "Parallax Precision") },
          { value: `${observedHours}`, label: "Hours Observed" },
          { ...homepageData.projectStats.find(stat => stat.label === "Years of Research") }
        ]);

        setPhase2Progress({
          totalHours: totalHours,
          observedHours: observedHours,
          totalPulsars: totalHours, // Retained for compatibility with existing progress components
          observedPulsars: observedHours,
          percentComplete: percent
        });

        setHomepageContent(homepageData);
        setTeamMembers(teamMemberData.slice(0, 4)); // Show top team members on home page
        setLoading(false);
      } catch (error) {
        console.error("Error loading homepage data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin"></div>
          <p className="text-indigo-300 font-mono text-sm animate-pulse">Loading MSPSRπ Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-900/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <header className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden border-b border-indigo-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Mission Header */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>VLBA Astrometric Survey</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none">
                  {homepageContent?.title || "MSPSRπ Astrometric Project"}
                </h1>

                <p className="text-lg sm:text-xl text-indigo-200/80 max-w-2xl font-light leading-relaxed mx-auto lg:mx-0">
                  {homepageContent?.subtitle || "Measuring precise trigonometric parallaxes and proper motions of millisecond pulsars using the Very Long Baseline Array."}
                </p>

                <div className="pt-4 flex flex-wrap gap-4 justify-center lg:justify-start">
                  <Link
                    to="/observations"
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-950 transition-all duration-200 hover:translate-y-[-1px]"
                  >
                    <Search className="w-4 h-4" />
                    <span>Explore Observations</span>
                  </Link>

                  <Link
                    to="/publications"
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-indigo-200 border border-indigo-800/50 font-medium transition-all duration-200"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>View Publications</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Observation Progress Tracking */}
              <div className="lg:col-span-5">
                <div className="bg-slate-900/80 border border-indigo-800/40 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono">
                      Tracking Status
                    </span>
                    <span className="inline-flex items-center text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-ping"></span>
                      Active Campaign
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-indigo-100 mb-3">
                    MSPSRπ Progress: {phase2Progress.observedHours} / {phase2Progress.totalHours} Hours Observed
                  </h3>

                  {/* Progress Bar Container */}
                  <div className="mb-4">
                    <div className="h-3 bg-indigo-950/80 rounded-full overflow-hidden border border-indigo-800/30">
                      <div
                        className="h-full rounded-full relative overflow-hidden transition-all duration-1000 ease-out"
                        style={{ width: `${phase2Progress.percentComplete}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 opacity-60 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-indigo-300 mt-2 font-mono">
                      <span>{phase2Progress.observedHours} hrs completed</span>
                      <span className="font-bold text-cyan-400">{phase2Progress.percentComplete}% Complete</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-indigo-900/40 grid grid-cols-2 gap-4 text-center">
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-indigo-900/30">
                      <div className="text-2xl font-bold text-white font-mono">{phase2Progress.totalHours}</div>
                      <div className="text-xs text-indigo-300">Total Planned Hours</div>
                    </div>
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-indigo-900/30">
                      <div className="text-2xl font-bold text-cyan-400 font-mono">{phase2Progress.observedHours}</div>
                      <div className="text-xs text-indigo-300">Hours Completed</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </header>

        {/* Project Statistics Banner */}
        <section className="py-10 bg-slate-900/50 border-b border-indigo-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {projectStats.map((stat, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/40 border border-indigo-900/20">
                  <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-cyan-300 font-mono">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-indigo-300 mt-1 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Overview & Key Science Objectives */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-white tracking-tight">Key Science Goals</h2>
              <p className="text-indigo-200/70 mt-3 text-base">
                Precise astrometry unlocks vital astrophysical parameters for gravitational wave detection, neutron star equation of state, and binary evolution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-indigo-800/30 hover:border-indigo-600/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-indigo-950 flex items-center justify-center text-cyan-400 mb-5 border border-indigo-800/40">
                  <Radio className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">High-Precision Parallaxes</h3>
                <p className="text-sm text-indigo-200/70 leading-relaxed">
                  Obtaining microarcsecond trigonometric parallaxes directly yields distance measurements independent of interstellar medium models.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-indigo-800/30 hover:border-indigo-600/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-indigo-950 flex items-center justify-center text-indigo-400 mb-5 border border-indigo-800/40">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Pulsar Timing Arrays</h3>
                <p className="text-sm text-indigo-200/70 leading-relaxed">
                  Accurate astrometric parameters eliminate timing model degeneracies for nanoHertz gravitational wave detectors like NANOGrav.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-indigo-800/30 hover:border-indigo-600/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-indigo-950 flex items-center justify-center text-purple-400 mb-5 border border-indigo-800/40">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Transverse Velocities</h3>
                <p className="text-sm text-indigo-200/70 leading-relaxed">
                  Proper motions reveal 3D space velocities, supernova kick physics, and galactic orbital kinematics for compact binaries.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Preview Section */}
        {teamMembers.length > 0 && (
          <section className="py-16 bg-slate-900/30 border-t border-indigo-900/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Project Team</h2>
                  <p className="text-indigo-200/70 mt-2 text-sm">International collaboration of radio astronomers and astrometrists.</p>
                </div>
                <Link
                  to="/team"
                  className="mt-4 md:mt-0 inline-flex items-center space-x-1 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>View All Members</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map((member, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-slate-900/80 border border-indigo-800/30 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-950 border-2 border-indigo-600/40 flex items-center justify-center text-indigo-300 text-xl font-bold mb-4 overflow-hidden">
                      {member.imageUrl ? (
                        <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{member.name.split(' ').map(n => n[0]).join('')}</span>
                      )}
                    </div>
                    <h4 className="text-lg font-semibold text-white">{member.name}</h4>
                    <p className="text-xs text-indigo-300 mt-1">{member.role || member.institution}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default HomePage;
