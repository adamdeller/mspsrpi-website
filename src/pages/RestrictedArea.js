import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import GitHubLoginButton from './GitHubLoginButton';
import { 
  Lock, Eye, EyeOff, MessageSquare, FileText, Download, 
  User, Calendar, Search, ArrowLeft, Filter, Clock, 
  LogOut, Star, BookOpen, Users, Bell
} from 'lucide-react';

/* HI EVERYONE! 
This is the design of the restricted section that we will try to build in the end after the MPV*/

// Login component
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

// Main dashboard component
const Dashboard = ({ onLogout }) => {
  const username = localStorage.getItem('githubUser') || 'Team Member';
  const [selectedPulsar, setSelectedPulsar] = useState([]);
  const [pulsars, setPulsars] = useState([]);
  
  useEffect(() => {
    const fetchPulsars = async () => {
      try {
        const res = await fetch(`${process.env.PUBLIC_URL}/data/restricted/pulsarlist.json`);
        const data = await res.json();
        setPulsars(data);
        if (data.length > 0) setSelectedPulsar(data[0]);
      } catch (err) {
        console.error("Failed to fetch pulsarlist.json:", err);
      }
    };
    fetchPulsars();
  }, []);
  
  const [comments, setComments] = useState(() => {
    // Try to get comments from localStorage, or use empty object
    const savedComments = localStorage.getItem('pulsarComments');
    return savedComments ? JSON.parse(savedComments) : {};
  });
  
  const [newComment, setNewComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Save comments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pulsarComments', JSON.stringify(comments));
  }, [comments]);

  // Handle filtering of pulsars
  const filteredPulsars = pulsars.filter(pulsar => {
    const matchesSearch = pulsar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        pulsar.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || pulsar.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || pulsar.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Add a new comment
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const pulsarId = selectedPulsar.id;
    const newCommentObj = {
      id: Date.now(),
      author: String(username), // In a real app, this would be the logged-in user
      timestamp: new Date().toISOString(),
      text: newComment,
      replies: []
    };
    
    setComments(prevComments => ({
      ...prevComments,
      [pulsarId]: [...(prevComments[pulsarId] || []), newCommentObj]
    }));
    
    setNewComment('');
  };

  // Add a reply to a comment
  const handleAddReply = (commentId) => {
    if (!replyText.trim()) return;
    
    const pulsarId = selectedPulsar.id;
    const reply = {
      id: Date.now(),
      author: String(username), // In a real app, this would be the logged-in user
      timestamp: new Date().toISOString(),
      text: replyText
    };
    
    setComments(prevComments => {
      const updatedComments = prevComments[pulsarId].map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, reply]
          };
        }
        return comment;
      });
      
      return {
        ...prevComments,
        [pulsarId]: updatedComments
      };
    });
    
    setReplyingTo(null);
    setReplyText('');
  };

  // Format dates in a readable way
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
                          ${selectedPulsar.id === pulsar.id ? 'bg-indigo-900/30 border-l-4 border-indigo-500' : ''}
                        `}
                        onClick={() => setSelectedPulsar(pulsar)}
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-indigo-100">{pulsar.name}</h3>
                          <span className={`
                            text-xs px-2 py-1 rounded-full 
                            ${pulsar.status === 'Verified' ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30' : 
                              pulsar.status === 'Analyzed' ? 'bg-blue-900/40 text-blue-300 border border-blue-500/30' :
                              'bg-amber-900/40 text-amber-300 border border-amber-500/30'}
                          `}>
                            {pulsar.status}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center space-x-2 text-xs text-indigo-400">
                          <span className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            {pulsar.lastUpdated}
                          </span>
                          <span className="flex items-center">
                            <BookOpen className="h-3.5 w-3.5 mr-1" />
                            {pulsar.category}
                          </span>
                        </div>
                        <div className="mt-1 text-xs flex items-center text-indigo-300">
                          <MessageSquare className="h-3.5 w-3.5 mr-1" />
                          {comments[pulsar.id] ? comments[pulsar.id].length : 0} comments
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          
          {/* Main Content - Pulsar Details and Comments */}
          <div className="lg:col-span-2">
            {/* Pulsar Details Card */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-indigo-500/20 rounded-xl shadow-xl mb-6 overflow-hidden">
              <div className="p-5 border-b border-indigo-500/20 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">{selectedPulsar.name} Details</h2>
                {/* <button className="flex items-center px-3 py-1.5 bg-indigo-700/50 hover:bg-indigo-700/70 text-indigo-200 text-sm rounded-md border border-indigo-600/40 transition-colors duration-200">
                  <Download className="h-4 w-4 mr-1" />
                  Download Dataset
                </button> */}
              </div>
              
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-indigo-500/10 shadow-inner">
                    <h3 className="text-sm font-medium text-indigo-300 mb-2">Astrometric Parameters</h3>
                    <div className="space-y-2 text-indigo-100">
                      <div className="flex justify-between">
                        <span className="text-indigo-400 text-sm">Distance:</span>
                        <span className="text-white font-medium">{selectedPulsar.distance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-indigo-400 text-sm">Parallax:</span>
                        <span className="text-white font-medium">{selectedPulsar.parallax}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-indigo-400 text-sm">Proper Motion:</span>
                        <span className="text-white font-medium">{selectedPulsar.properMotion}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-indigo-500/10 shadow-inner">
                    <h3 className="text-sm font-medium text-indigo-300 mb-2">Dataset Information</h3>
                    <div className="space-y-2 text-indigo-100">
                      <div className="flex justify-between">
                        <span className="text-indigo-400 text-sm">Last Updated:</span>
                        <span className="text-white font-medium">{selectedPulsar.lastUpdated}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-indigo-400 text-sm">Category:</span>
                        <span className="text-white font-medium">{selectedPulsar.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-indigo-400 text-sm">Status:</span>
                        <span className={`font-medium
                          ${selectedPulsar.status === 'Verified' ? 'text-emerald-300' :
                            selectedPulsar.status === 'Analyzed' ? 'text-blue-300' :
                            'text-amber-300'}
                        `}>
                          {selectedPulsar.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-indigo-400 text-sm">Dataset Size:</span>
                        <span className="text-white font-medium">{selectedPulsar.datasetSize}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Visualization placeholder */}
                <div className="mt-4 bg-slate-800/30 rounded-lg p-4 border border-indigo-500/10 text-center h-48 flex items-center justify-center">
                  <div className="text-indigo-300">
                    <div className="text-4xl mb-2">📊</div>
                    <p>Interactive visualization would be displayed here</p>
                    <p className="text-sm text-indigo-400 mt-1">
                      (Parallax and proper motion visualization)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Comments Section */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-indigo-500/20 rounded-xl shadow-xl">
              <div className="p-5 border-b border-indigo-500/20">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <MessageSquare className="h-5 w-5 text-indigo-400 mr-2" />
                  Discussion
                  {comments[selectedPulsar.id] && comments[selectedPulsar.id].length > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-indigo-900/70 text-indigo-300 rounded-full">
                      {comments[selectedPulsar.id].length}
                    </span>
                  )}
                </h2>
              </div>
              
              {/* Comment list */}
              <div className="p-5 max-h-[calc(100vh-700px)] min-h-[200px] overflow-y-auto">
                {(!comments[selectedPulsar.id] || comments[selectedPulsar.id].length === 0) ? (
                  <div className="text-center py-6 text-indigo-400">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No comments yet for this pulsar.</p>
                    <p className="text-sm mt-1">Start the discussion by adding a comment below.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {comments[selectedPulsar.id].map((comment) => (
                      <div key={comment.id} className="bg-slate-800/30 rounded-lg p-4 border border-indigo-500/10">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-indigo-800/70 rounded-full flex items-center justify-center text-indigo-200 font-medium text-sm">
                              {comment.author.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="ml-3">
                              <span className="text-indigo-200 font-medium">{comment.author}</span>
                              <div className="text-xs text-indigo-400">
                                {formatDate(comment.timestamp)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 text-indigo-100 whitespace-pre-line">
                          {comment.text}
                        </div>
                        
                        {/* Reply button */}
                        <div className="mt-2">
                          <button
                            onClick={() => {
                              setReplyingTo(replyingTo === comment.id ? null : comment.id);
                              setReplyText('');
                            }}
                            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center"
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            {replyingTo === comment.id ? 'Cancel' : 'Reply'}
                          </button>
                        </div>
                        
                        {/* Reply form */}
                        {replyingTo === comment.id && (
                          <div className="mt-3 pl-4 border-l-2 border-indigo-700/30">
                            <textarea
                              className="w-full px-3 py-2 bg-slate-800/80 border border-indigo-600/30 rounded-md text-indigo-100 placeholder-indigo-400/70 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                              placeholder="Write a reply..."
                              rows={2}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                            />
                            <div className="mt-2 flex justify-end">
                              <button
                                onClick={() => handleAddReply(comment.id)}
                                className="px-3 py-1 bg-indigo-700/50 hover:bg-indigo-700/70 text-indigo-200 text-xs rounded-md border border-indigo-600/40 transition-colors duration-200"
                              >
                                Post Reply
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {/* Replies */}
                        {comment.replies.length > 0 && (
                          <div className="mt-4 space-y-4 pl-4 border-l-2 border-indigo-700/30">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="bg-slate-800/20 rounded-lg p-3">
                                <div className="flex items-center">
                                  <div className="w-6 h-6 bg-indigo-800/70 rounded-full flex items-center justify-center text-indigo-200 font-medium text-xs">
                                    {reply.author.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div className="ml-2">
                                    <span className="text-indigo-200 font-medium text-sm">{reply.author}</span>
                                    <div className="text-xs text-indigo-400">
                                      {formatDate(reply.timestamp)}
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-2 text-indigo-100 text-sm">
                                  {reply.text}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Add comment form */}
              <div className="p-5 border-t border-indigo-500/20">
                <textarea
                  className="w-full px-4 py-3 bg-slate-800/60 border border-indigo-600/30 rounded-md text-indigo-100 placeholder-indigo-400/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Add a comment or share insights about this pulsar..."
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className={`
                      px-4 py-2 rounded-md text-sm flex items-center
                      ${newComment.trim() ? 
                        'bg-indigo-700 hover:bg-indigo-600 text-white border border-indigo-500 cursor-pointer' : 
                        'bg-slate-700/50 text-slate-400 border border-slate-600/30 cursor-not-allowed'}
                    `}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component
const RestrictedArea = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('authenticated') === 'true';
  });

  const handleLogin = () => {
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