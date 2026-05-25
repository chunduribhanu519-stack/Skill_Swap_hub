import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';
import { toast } from 'react-toastify';

const Requests = () => {
  // Use global state from AuthContext
  const { user, requests, updateRequestStatus, addMeetLink, submitReview, reportProblem } = useAuth();

  // Local state
  const [activeTab, setActiveTab] = useState('pending');
  const [meetInputs, setMeetInputs] = useState({});
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [showReviewFor, setShowReviewFor] = useState(null);
  const [reportData, setReportData] = useState({ type: 'Trainer Absent', details: '' });
  const [showReportFor, setShowReportFor] = useState(null);

  const handleUpdateStatus = (id, newStatus) => {
    updateRequestStatus(id, newStatus);
    
    const statusMessages = {
      accepted: 'Request accepted! Advance coins sent. 🤝',
      link_shared: 'Link shared! Session is now active. 🎓',
      completed: 'Session marked as finished by trainer. ✅',
      closed: 'Session closed! Final payment released. 💰',
      rejected: 'Request declined. Coins refunded.',
    };

    if (statusMessages[newStatus]) {
      toast.success(statusMessages[newStatus]);
    }
  };

  const handleReviewSubmit = (trainerName, requestId) => {
    const result = submitReview(trainerName, reviewData);
    if (result.success) {
      toast.success(`Review submitted! Trainer average is now ⭐ ${result.newAverage}`);
      setShowReviewFor(null);
      setReviewData({ rating: 5, comment: '' });
    }
  };

  const handleReportSubmit = (requestId) => {
    if (!reportData.details) {
      toast.error("Please provide some details about the issue.");
      return;
    }
    const result = reportProblem(requestId, reportData);
    if (result.success) {
      toast.warning("Report submitted. Our team will review this session. ⚠️");
      setShowReportFor(null);
      setReportData({ type: 'Trainer Absent', details: '' });
    }
  };

  const handleSetLink = (id) => {
    const link = meetInputs[id];
    // Requirement 7: Validation - do not allow empty links
    if (!link || link.trim() === '') {
      toast.error("Link cannot be empty. Please paste a valid meeting link.");
      return;
    }
    if (!link.startsWith('http')) {
      toast.error("Please enter a valid meeting URL (starting with http/https)");
      return;
    }
    addMeetLink(id, link);
    toast.success("Meeting link saved! Session is now active. 📹");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied! 📋");
  };

  // Filter the global requests list
  const filteredRequests = requests.filter(req => {
    if (activeTab === 'pending') return req.status === 'pending';
    if (activeTab === 'active') return req.status === 'accepted' || req.status === 'link_shared';
    if (activeTab === 'completed') return req.status === 'completed' || req.status === 'closed';
    return req.status === activeTab;
  });

  const navigate = useNavigate();

  return (
    <div className="min-h-[85vh] py-12 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-300 rounded-full blur-[180px] opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-300 rounded-full blur-[180px] opacity-20 -z-10"></div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 mb-2">
            Session Hub
          </h1>
          <p className="text-gray-600">Coordinate your meetings and access your learning sessions.</p>
        </div>

        {/* ── TAB NAVIGATION ── */}
        <div className="flex justify-center gap-2 mb-10 bg-white/40 p-1.5 rounded-2xl backdrop-blur-md w-fit mx-auto border border-white/60 shadow-sm">
          {[
            { id: 'pending', label: 'Inbox', icon: '📬' },
            { id: 'active', label: 'Active', icon: '⚡' },
            { id: 'completed', label: 'History', icon: '📁' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-700 shadow-md scale-105'
                  : 'text-gray-500 hover:text-indigo-600 hover:bg-white/50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── REQUESTS LIST ── */}
        <div className="space-y-6">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req) => {
              const isTrainer = user?.name === req.to;
              const isLearner = user?.name === req.from;

              return (
                <div 
                  key={req.id} 
                  className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-8 shadow-lg hover:shadow-xl transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  <div className="flex flex-col gap-8">
                    
                    {/* Header: Roles & Status */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={req.avatar} 
                          alt={req.from} 
                          className="w-14 h-14 rounded-2xl border-2 border-indigo-100 shadow-sm object-cover" 
                        />
                        <div>
                          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">
                            {isTrainer ? 'Learner' : 'Trainer'}
                          </p>
                          <h3 className="text-lg font-bold text-gray-800">{isTrainer ? req.from : req.to}</h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                          req.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                          req.status === 'accepted' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                          req.status === 'link_shared' ? 'bg-indigo-50 border-indigo-200 text-indigo-600 animate-pulse' :
                          req.status === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                          'bg-gray-50 border-gray-200 text-gray-500'
                        }`}>
                          {req.status === 'link_shared' ? 'Link Shared' : req.status}
                        </span>
                        <p className="text-[10px] text-gray-400 font-bold">{req.timestamp}</p>
                      </div>
                    </div>

                    {/* Progress Timeline */}
                    <div className="relative h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="absolute h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                        style={{ width: 
                          req.status === 'pending' ? '10%' :
                          req.status === 'accepted' ? '40%' :
                          req.status === 'link_shared' ? '70%' :
                          '100%'
                        }}
                      />
                    </div>

                    {/* Swap Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/50 dark:bg-gray-800/20 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Subject</p>
                        <p className="font-bold text-gray-800 dark:text-gray-200">{req.requestedSkill}</p>
                      </div>
                      
                      {/* 📹 MEETING LINK INTEGRATION */}
                      <div>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">Virtual Classroom</p>
                        {req.meetLink ? (
                          <div className="flex items-center gap-2">
                            {/* Learner should see Join Session button */}
                            <a 
                              href={req.meetLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all flex items-center gap-2"
                            >
                              📹 Join Session
                            </a>
                            <button 
                              onClick={() => copyToClipboard(req.meetLink)}
                              className="text-xs text-gray-400 hover:text-indigo-600 p-2 bg-gray-100 rounded-xl transition-all"
                              title="Copy Link"
                            >
                              📋
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic">No link provided yet.</p>
                        )}
                      </div>
                    </div>

                    {/* 🌟 REVIEW FORM (Inline) */}
                    {showReviewFor === req.id && (
                      <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 animate-in zoom-in duration-300">
                        <h4 className="font-bold text-indigo-900 mb-4 text-sm">How was your session with {req.to}?</h4>
                        <div className="flex gap-2 mb-4">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button 
                              key={star} 
                              onClick={() => setReviewData({ ...reviewData, rating: star })}
                              className={`text-2xl transition-transform hover:scale-125 ${reviewData.rating >= star ? 'grayscale-0' : 'grayscale'}`}
                            >
                              ⭐
                            </button>
                          ))}
                        </div>
                        <textarea 
                          placeholder="Share your experience... (optional)"
                          className="w-full p-4 bg-white border border-indigo-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                          rows="3"
                          value={reviewData.comment}
                          onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                        ></textarea>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleReviewSubmit(req.to, req.id)}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-xs shadow-md"
                          >
                            Submit Feedback
                          </button>
                          <button 
                            onClick={() => setShowReviewFor(null)}
                            className="text-gray-500 px-4 py-2 text-xs font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ⚠️ REPORT FORM (Inline) */}
                    {showReportFor === req.id && (
                      <div className="bg-red-50/50 p-6 rounded-3xl border border-red-100 animate-in slide-in-from-top-4 duration-300">
                        <h4 className="font-bold text-red-900 mb-4 text-sm">Report a Problem</h4>
                        <select 
                          className="w-full p-3 bg-white border border-red-100 rounded-xl text-sm outline-none mb-4"
                          value={reportData.type}
                          onChange={(e) => setReportData({ ...reportData, type: e.target.value })}
                        >
                          <option>Trainer Absent</option>
                          <option>Poor Teaching</option>
                          <option>Invalid Link</option>
                          <option>Session Cancelled Unexpectedly</option>
                          <option>Other</option>
                        </select>
                        <textarea 
                          placeholder="What happened? Please be specific."
                          className="w-full p-4 bg-white border border-red-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-red-500 mb-4"
                          rows="3"
                          value={reportData.details}
                          onChange={(e) => setReportData({ ...reportData, details: e.target.value })}
                        ></textarea>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleReportSubmit(req.id)}
                            className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold text-xs shadow-md"
                          >
                            Submit Report
                          </button>
                          <button 
                            onClick={() => setShowReportFor(null)}
                            className="text-gray-500 px-4 py-2 text-xs font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 pt-2">
                      
                      {/* MEET LINK INPUT (For Trainers) */}
                      {/* Requirement 1: Show input field when trainer accepts request */}
                      {isTrainer && req.status === 'accepted' && !req.meetLink && (
                        <div className="w-full md:max-w-md flex flex-col gap-2">
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Paste Google Meet, Zoom, or Classroom link..."
                              className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                              value={meetInputs[req.id] || ''}
                              onChange={(e) => setMeetInputs({ ...meetInputs, [req.id]: e.target.value })}
                            />
                            {/* Requirement 3: Add "Save Link" button */}
                            <button 
                              onClick={() => handleSetLink(req.id)}
                              className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-indigo-700 shadow-md transition-all whitespace-nowrap"
                            >
                              Save Link
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end gap-3 w-full md:w-auto">
                        {/* TRAINER ACTIONS */}
                        {isTrainer && req.status === 'pending' && (
                          <>
                            <button onClick={() => handleUpdateStatus(req.id, 'accepted')} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-indigo-500/30 transition-all">Accept Request</button>
                            <button onClick={() => handleUpdateStatus(req.id, 'rejected')} className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-red-50 hover:text-red-600 transition-all">Decline</button>
                          </>
                        )}

                        {/* Once link is shared, session is active. Show Finish Session button */}
                        {isTrainer && req.status === 'link_shared' && (
                          <button onClick={() => handleUpdateStatus(req.id, 'completed')} className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-emerald-500/30 transition-all">Finish Session</button>
                        )}

                        {/* LEARNER ACTIONS */}
                        {isLearner && req.status === 'completed' && (
                          <button onClick={() => handleUpdateStatus(req.id, 'closed')} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-indigo-500/40 transition-all">Confirm & Release Payment</button>
                        )}

                        {isLearner && req.status === 'closed' && !showReviewFor && (
                          <button 
                            onClick={() => setShowReviewFor(req.id)}
                            className="bg-amber-100 text-amber-700 px-8 py-3 rounded-xl font-bold text-sm hover:bg-amber-200 transition-all flex items-center gap-2"
                          >
                            🌟 Leave Feedback
                          </button>
                        )}

                        {/* ⚠️ REPORT BUTTON */}
                        {isLearner && (req.status === 'accepted' || req.status === 'link_shared') && !showReportFor && (
                          <button 
                            onClick={() => setShowReportFor(req.id)}
                            className="text-[10px] font-black text-gray-400 hover:text-red-600 uppercase tracking-widest px-2 flex items-center gap-1"
                          >
                            ⚠️ Report Issue
                          </button>
                        )}

                        {/* CANCEL/REPORT */}
                        {(req.status === 'accepted' || req.status === 'link_shared') && (
                          <button onClick={() => handleUpdateStatus(req.id, 'rejected')} className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest px-2">Cancel Session</button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })
          ) : (
            <EmptyState 
              icon={activeTab === 'pending' ? "📬" : activeTab === 'active' ? "⚡" : "📁"}
              title={`No sessions in ${activeTab}`}
              message={`Nothing to show in ${activeTab} at the moment.`}
              actionLabel={activeTab === 'pending' ? "Find Skills" : null}
              onAction={() => navigate('/find-skills')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Requests;
