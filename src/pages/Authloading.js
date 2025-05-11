import React, { useState, useEffect } from 'react';

const Authloading = () => {
  // State for interactive elements and loading progress
  const [stars, setStars] = useState([]);
  const [pulsars, setPulsars] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initiating GitHub authentication...');
  const [theme, setTheme] = useState('default'); // default, psrpi, mspsrpi, mspsrpi2

  // Function to add stars on click
  const addStar = (e) => {
    if (!e.target.closest('.card-container')) { // Only add stars if clicking outside the card
      const newStar = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 3 + 1,
        opacity: 1,
        color: getThemeColor(),
      };
      
      setStars(prev => [...prev, newStar]);
      
      // Star fades out after 3 seconds
      setTimeout(() => {
        setStars(prev => prev.filter(star => star.id !== newStar.id));
      }, 3000);
    }
  };

  // Get color based on selected theme
  const getThemeColor = () => {
    switch(theme) {
      case 'psrpi': return `rgba(34, 197, 94, ${Math.random() * 0.4 + 0.6})`; // Green
      case 'mspsrpi': return `rgba(192, 132, 252, ${Math.random() * 0.4 + 0.6})`; // Purple
      case 'mspsrpi2': return `rgba(59, 130, 246, ${Math.random() * 0.4 + 0.6})`; // Blue
      default: return `rgba(99, 102, 241, ${Math.random() * 0.4 + 0.6})`; // Indigo
    }
  };

  // Get glow color based on selected theme
  const getGlowColor = () => {
    switch(theme) {
      case 'psrpi': return 'from-green-900/20 via-slate-900/10 to-transparent';
      case 'mspsrpi': return 'from-purple-900/20 via-slate-900/10 to-transparent';
      case 'mspsrpi2': return 'from-blue-900/20 via-slate-900/10 to-transparent';
      default: return 'from-indigo-900/20 via-slate-900/10 to-transparent';
    }
  };

  // Cycle through themes
  useEffect(() => {
    const themes = ['default', 'psrpi', 'mspsrpi', 'mspsrpi2'];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % themes.length;
      setTheme(themes[currentIndex]);
    }, 8000); // Change theme every 8 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Simulate loading progress
  useEffect(() => {
    // Different loading messages to show during authentication
    const loadingMessages = [
      'Initiating GitHub authentication...',
      'Establishing secure connection...',
      'Verifying credentials...',
      'Preparing secure workspace access...',
      'Almost there! Finalizing secure session...'
    ];
    
    // Simulate progress with random increments
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        // Calculate new progress (slower near end)
        const remaining = 100 - prev;
        const increment = Math.random() * (remaining / 15) + 0.5;
        const newValue = Math.min(prev + increment, 99); // Cap at 99%
        
        // Update message based on progress
        const messageIndex = Math.floor(newValue / 20);
        if (messageIndex < loadingMessages.length) {
          setLoadingText(loadingMessages[messageIndex]);
        }
        
        return newValue;
      });
    }, 800);
    
    return () => clearInterval(interval);
  }, []);

  // Create pulsars (animated signal elements)
  useEffect(() => {
    const createPulsars = () => {
      const newPulsars = Array.from({ length: 5 }, (_, i) => ({
        id: `pulsar-${i}`,
        x: Math.random() * 80 + 10, // percentage position (10% to 90%)
        y: Math.random() * 80 + 10,
        size: Math.random() * 100 + 50,
        delay: Math.random() * 5,
        duration: Math.random() * 4 + 3
      }));
      
      setPulsars(newPulsars);
    };
    
    createPulsars();
  }, []);

  // Theme-specific accent color class
  const getAccentColorClass = () => {
    switch(theme) {
      case 'psrpi': return 'text-green-400'; 
      case 'mspsrpi': return 'text-purple-400';
      case 'mspsrpi2': return 'text-blue-400';
      default: return 'text-indigo-400';
    }
  };

  // Theme-specific progress bar gradient
  const getProgressGradient = () => {
    switch(theme) {
      case 'psrpi': return 'from-green-600 to-green-400';
      case 'mspsrpi': return 'from-purple-600 to-purple-400';
      case 'mspsrpi2': return 'from-blue-600 to-blue-400';
      default: return 'from-indigo-600 to-indigo-400';
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-gray-100 relative overflow-hidden"
      onClick={addStar}
    >
      {/* Starry background with multiple star layers for depth - same as other pages */}
      <div className="absolute inset-0">
        {/* Large stars layer */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjI1IiBjeT0iMjUiIHI9IjEiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjE3NSIgY3k9IjE1MCIgcj0iMS4yIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjciLz48Y2lyY2xlIGN4PSI3NSIgY3k9IjEwMCIgcj0iMSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42Ii8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTUiIHI9IjEuNSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC43Ii8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iNTAiIHI9IjEuMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSIxNzUiIHI9IjEuNCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC43Ii8+PGNpcmNsZSBjeD0iMTI1IiBjeT0iMTc1IiByPSIxIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYiLz48L3N2Zz4=')] opacity-50"></div>
        
        {/* Small stars layer */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjAuNCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iMzAiIGN5PSIxMCIgcj0iMC4zIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjIwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjcwIiBjeT0iMTAiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PGNpcmNsZSBjeD0iOTAiIGN5PSIzMCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSIxMCIgY3k9IjUwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iNzAiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSI5MCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSI3MCIgY3k9IjUwIiByPSIwLjMiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjkwIiBjeT0iNzAiIHI9IjAuNCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PGNpcmNsZSBjeD0iMjAiIGN5PSIzMCIgcj0iMC4zIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iMzAiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iODAiIGN5PSI0MCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjgwIiByPSIwLjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iNjAiIHI9IjAuMyIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iNjAiIGN5PSI4MCIgcj0iMC40IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSI4MCIgY3k9IjYwIiByPSIwLjMiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] opacity-60"></div>
        
        {/* Theme-specific glow effect */}
        <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${getGlowColor()}`}></div>

        {/* Cosmic nebula glow effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent opacity-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent opacity-30"></div>
      </div>

      {/* Pulsars - animated radio signal visualizations */}
      {pulsars.map(pulsar => (
        <div 
          key={pulsar.id}
          className="absolute rounded-full opacity-0"
          style={{
            left: `${pulsar.x}%`,
            top: `${pulsar.y}%`,
            width: '4px',
            height: '4px',
            backgroundColor: 'white',
            boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
            animation: `pulsar ${pulsar.duration}s infinite ${pulsar.delay}s`,
          }}
        />
      ))}

      {/* User-created stars (on click) */}
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full animate-pulse transition-opacity duration-1000"
          style={{
            left: `${star.x}px`,
            top: `${star.y}px`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            opacity: star.opacity,
            boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
          }}
        />
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 z-10">
        <div className="card-container max-w-md w-full bg-slate-900/40 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-slate-800/50">
          {/* Logo with theme-based accent color */}
          <div className="flex justify-center mb-8">
            <div className="text-3xl font-bold">
              MSPSR<span className={getAccentColorClass()}>π</span>
              <span className="text-sm ml-1 text-gray-400">Research Portal</span>
            </div>
          </div>

          {/* Pulsar Signal Visualization */}
          <div className="relative h-24 mb-8 overflow-hidden">
            <div className="absolute inset-0 flex items-center">
              {/* Animated pulsar signal wave - multiple waves with different properties */}
              <div className="w-full">
                <div className="pulsar-wave h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full opacity-70"></div>
                <div className="pulsar-wave pulsar-wave-2 h-1 mt-4 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full opacity-60"></div>
                <div className="pulsar-wave pulsar-wave-3 h-1 mt-4 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full opacity-50"></div>
                <div className="pulsar-wave pulsar-wave-4 h-1 mt-4 bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full opacity-40"></div>
                <div className="pulsar-wave pulsar-wave-5 h-1 mt-4 bg-gradient-to-r from-transparent via-indigo-400 to-transparent rounded-full opacity-30"></div>
              </div>
            </div>
            
            {/* Central signal dot - pulsing with the current theme color */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className={`w-4 h-4 rounded-full animate-ping ${getAccentColorClass()} opacity-75`}></div>
              <div className={`absolute w-2 h-2 rounded-full ${getAccentColorClass()} left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2`}></div>
            </div>
          </div>
          
          {/* Loading Text */}
          <div className="text-center mb-6">
            <p className="text-gray-100 mb-2">{loadingText}</p>
            <p className="text-gray-400 text-sm">Please wait while we establish your secure session</p>
          </div>
          
          {/* Progress Bar - theme-specific gradient */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 mb-8">
            <div 
              className={`bg-gradient-to-r ${getProgressGradient()} h-1.5 rounded-full transition-all duration-300 ease-out`}
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          
          {/* Interactive tips */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">Click anywhere in space to create stars</p>
          </div>
        </div>
      </div>

      {/* CSS for the animations */}
      <style jsx>{`
        @keyframes pulsar {
          0%, 100% {
            box-shadow: 0 0 8px 4px rgba(255, 255, 255, 0.1);
            opacity: 0.1;
          }
          50% {
            box-shadow: 0 0 16px 8px rgba(255, 255, 255, 0.3);
            opacity: 0.7;
          }
        }
        
        .pulsar-wave {
          animation: wave 6s ease-in-out infinite;
          transform-origin: center;
        }
        
        .pulsar-wave-2 {
          animation: wave 6s ease-in-out infinite;
          animation-delay: 0.2s;
        }
        
        .pulsar-wave-3 {
          animation: wave 6s ease-in-out infinite;
          animation-delay: 0.4s;
        }
        
        .pulsar-wave-4 {
          animation: wave 6s ease-in-out infinite;
          animation-delay: 0.6s;
        }
        
        .pulsar-wave-5 {
          animation: wave 6s ease-in-out infinite;
          animation-delay: 0.8s;
        }
        
        @keyframes wave {
          0%, 100% {
            transform: scaleX(0.2);
            opacity: 0.1;
          }
          50% {
            transform: scaleX(1);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};

export default Authloading;