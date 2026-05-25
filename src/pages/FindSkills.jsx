import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { toast } from 'react-toastify';
import { tutorialVideos } from '../data/tutorialVideos';

// ─────────────────────────────────────────────
// REUSABLE CHILD COMPONENT: UploadTutorialModal
// ─────────────────────────────────────────────
const UploadTutorialModal = ({ isOpen, onClose, uploadTutorial }) => {
  const [skill, setSkill] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    let videoId = '';
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = youtubeUrl.match(regex);
    if (match && match[1]) {
      videoId = match[1];
    }
    const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : 'https://via.placeholder.com/640x360?text=Tutorial+Video';
    
    const result = uploadTutorial({ skill, title, description, youtubeUrl, thumbnail });
    
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    
    toast.success('Tutorial uploaded successfully! Earned +5 Coins bonus!');
    
    onClose();
    setSkill(''); setTitle(''); setDescription(''); setYoutubeUrl('');
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-800">Upload Tutorial</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✖</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Skill</label>
            <input required type="text" value={skill} onChange={e => setSkill(e.target.value)} placeholder="e.g. React" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Title</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Tutorial Title" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Description</label>
            <textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="What will they learn?" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">YouTube URL</label>
            <input required type="url" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} placeholder="https://youtube.com/..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg">Upload to Community</button>
        </form>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// REUSABLE CHILD COMPONENT: SmartSuggestionsModal
// ─────────────────────────────────────────────
// Purpose: Provides contextual help when clicking the bulb (💡) icon.
// Why it improves UX: Smart suggestions help users understand the fallback learning
// ecosystem, clarifying how they can still learn and earn coins even if no live trainers are available.
const SmartSuggestionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white/90 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-300 to-amber-500"></div>
        
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">💡</span>
            <h2 className="text-2xl font-black text-gray-800">Smart Suggestions</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 bg-gray-100 rounded-full hover:bg-gray-200 leading-none">
            ✕
          </button>
        </div>
        
        <p className="text-gray-600 mb-6 font-medium leading-relaxed">
          If no trainers are available for a skill, Skill Swap Hub automatically recommends community tutorials, peer learning resources, and YouTube learning content so you can keep learning!
        </p>

        <ul className="space-y-4 mb-8">
          <li className="flex items-start gap-3">
            <span className="bg-amber-100 text-amber-600 p-2 rounded-xl text-sm">💰</span>
            <div>
              <p className="font-bold text-gray-800 text-sm">Earn Bonus Coins</p>
              <p className="text-xs text-gray-500">Uploaders earn passive coin bonuses when their tutorials get likes, ratings, or are marked helpful.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="bg-indigo-100 text-indigo-600 p-2 rounded-xl text-sm">⭐</span>
            <div>
              <p className="font-bold text-gray-800 text-sm">Rate & Review</p>
              <p className="text-xs text-gray-500">All tutorials can be rated and reviewed to ensure only the highest quality content stays visible.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="bg-emerald-100 text-emerald-600 p-2 rounded-xl text-sm">🤝</span>
            <div>
              <p className="font-bold text-gray-800 text-sm">Help the Community</p>
              <p className="text-xs text-gray-500">By sharing helpful tutorials, you contribute directly to the peer-learning ecosystem.</p>
            </div>
          </li>
        </ul>

        <button onClick={onClose} className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-black rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all">
          Got it, thanks!
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// REUSABLE CHILD COMPONENT: CommunityTutorialCard
// ─────────────────────────────────────────────
const CommunityTutorialCard = ({ tutorial, interactWithTutorial, updateLearningStreak }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const { user } = useAuth();
  
  const handleComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    interactWithTutorial(tutorial.id, 'comment', { text: commentText });
    setCommentText('');
  };

  const handleWatch = () => {
    updateLearningStreak();
  };

  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[2.5rem] p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full relative overflow-hidden group">
      <div className="relative aspect-video rounded-3xl overflow-hidden mb-4 shadow-inner bg-gray-100 group">
        <img src={tutorial.thumbnail} alt={tutorial.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
          ⭐ {tutorial.rating ? tutorial.rating.toFixed(1) : '0.0'}
        </div>
      </div>
      
      <h3 className="text-lg font-black text-gray-800 mb-1 leading-tight line-clamp-2">{tutorial.title}</h3>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">By {tutorial.uploadedBy}</p>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2 italic">"{tutorial.description}"</p>
      
      {/* Interaction Bar */}
      <div className="flex items-center justify-between bg-white/50 p-2 rounded-2xl mb-4 border border-white/50">
        <div className="flex gap-2">
          <button onClick={() => interactWithTutorial(tutorial.id, 'like')} className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition">
            👍 {tutorial.likes}
          </button>
          <button onClick={() => interactWithTutorial(tutorial.id, 'dislike')} className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition">
            👎 {tutorial.dislikes}
          </button>
          <button onClick={() => interactWithTutorial(tutorial.id, 'helpful')} className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition">
            💡 {tutorial.helpfulCount}
          </button>
        </div>
        <div className="flex gap-1">
          {[1,2,3,4,5].map(star => {
            // Check if current user has already rated this tutorial
            const userRatingObj = tutorial.ratings?.find(r => r.userId === user?.email);
            // Highlight based on hover, or user's rating, or fallback to average tutorial rating
            const displayRating = hoverRating || userRatingObj?.value || Math.round(tutorial.rating || 0);

            return (
              <button 
                key={star} 
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => interactWithTutorial(tutorial.id, 'rate', { rating: star })} 
                className={`text-sm hover:scale-125 transition-transform ${displayRating >= star ? 'grayscale-0' : 'grayscale opacity-30'}`}
              >
                ⭐
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex gap-2 mb-3">
          <a 
            href={tutorial.youtubeUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={handleWatch}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 transition-all shadow-lg active:scale-95"
          >
            ▶ Watch
          </a>
          <button onClick={() => setShowComments(!showComments)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-200 transition shadow-sm">
            💬 {tutorial.comments?.length || 0}
          </button>
        </div>
        
        {/* Comments Section */}
        {showComments && (
          <div className="border-t border-gray-100 pt-3 mt-2 animate-in fade-in slide-in-from-top-2">
            <div className="max-h-32 overflow-y-auto space-y-2 mb-3 pr-1">
              {tutorial.comments?.length === 0 && <p className="text-xs text-gray-400 text-center">No comments yet.</p>}
              {tutorial.comments?.map(c => (
                <div key={c.id} className="bg-white/60 p-2 rounded-lg text-xs">
                  <span className="font-bold text-indigo-600">{c.author}: </span>
                  <span className="text-gray-700">{c.text}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleComment} className="flex gap-2">
              <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Add a comment..." className="flex-1 text-xs px-3 py-2 bg-white/80 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500" />
              <button type="submit" className="px-3 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700">Post</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// REUSABLE CHILD COMPONENT: UserCard
// ─────────────────────────────────────────────
const UserCard = ({ user }) => {
  const { requestSkillSwap, requests } = useAuth();
  
  const isAlreadySent = requests.some(req => req.to === user.name && req.status === 'pending');
  const [requestSent, setRequestSent] = useState(isAlreadySent);

  const handleConnect = () => {
    const result = requestSkillSwap(user);
    if (result.success) {
      setRequestSent(true);
      toast.success(`50 Coins locked! Request sent to ${user.name} 🚀`);
    } else {
      toast.error(result.message || "Failed to send request");
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group">
      <div className="flex items-center gap-4 mb-5">
        <img
          src={user.avatar || `https://api.dicebear.com/8.x/adventurer/svg?seed=${user.name}`}
          alt={user.name}
          className="w-16 h-16 rounded-full border-4 border-indigo-200 object-cover shadow-sm"
        />
        <div>
          <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
          <p className="text-indigo-600 text-sm font-medium">{user.experience} Level</p>
          <p className="text-gray-400 text-xs">📍 {user.location}</p>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-5 leading-relaxed italic">
        "{user.bio}"
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-2">Can Teach</p>
          <div className="flex flex-wrap gap-1">
            {user.skillsOffered.map((skill) => (
              <span key={skill} className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-100">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-purple-500 uppercase tracking-widest mb-2">Wants to Learn</p>
          <div className="flex flex-wrap gap-1">
            {user.skillsWanted.map((skill) => (
              <span key={skill} className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-100">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleConnect}
        disabled={requestSent}
        className={`w-full py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${
          requestSent
            ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed shadow-inner'
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
        }`}
      >
        {requestSent ? '✅ Connection Request Sent' : '🤝 Send Connection Request'}
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────
// REUSABLE CHILD COMPONENT: ResourceCard
// ─────────────────────────────────────────────
const ResourceCard = ({ resource }) => {
  const { rateResource } = useAuth();
  const [hoverRating, setHoverRating] = useState(0);

  const handleRate = (stars) => {
    rateResource(resource.id, stars);
  };

  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[2.5rem] p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
      {resource.rewardsEarned?.includes('quality_bonus') && (
        <div className="absolute -left-12 top-6 -rotate-45 bg-amber-500 text-white py-1.5 px-12 text-[8px] font-black uppercase tracking-widest shadow-lg z-20 animate-bounce">
          Quality Pick 🏆
        </div>
      )}

      <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 bg-gray-100 shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
          <span className="text-4xl group-hover:scale-125 transition-transform duration-500">📺</span>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
          {resource.category}
        </div>
      </div>

      <h3 className="text-lg font-black text-gray-800 mb-2 leading-tight">{resource.title}</h3>
      <p className="text-xs text-gray-500 mb-6 flex-1 line-clamp-2 italic">"{resource.description}"</p>

      <div className="mb-6 p-3 bg-white/50 rounded-2xl border border-white/50">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rate this lesson</p>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
            {resource.ratingCount || 0} Ratings
          </span>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleRate(star)}
              className={`text-xl transition-all duration-200 transform hover:scale-125 ${
                (hoverRating || resource.rating) >= star ? 'grayscale-0' : 'grayscale opacity-30'
              }`}
            >
              ⭐
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
        <div className="flex flex-col">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shared By</p>
          <p className="text-xs font-black text-indigo-600">{resource.uploader}</p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-full">
          <span className="text-xs font-black text-amber-700">⭐ {resource.rating || '0.0'}</span>
        </div>
      </div>

      <a 
        href={resource.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full mt-6 py-3 bg-gray-900 text-white rounded-2xl font-bold text-xs text-center hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
      >
        Open Resource ↗
      </a>
    </div>
  );
};

// ─────────────────────────────────────────────
// REUSABLE CHILD COMPONENT: TutorialCard (Legacy fallback)
// ─────────────────────────────────────────────
const TutorialCard = ({ tutorial }) => {
  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[2.5rem] p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
      <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 shadow-inner bg-gray-100">
        <img 
          src={tutorial.thumbnail} 
          alt={tutorial.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
        <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded-lg text-[10px] font-black tracking-widest shadow-sm">
          {tutorial.duration}
        </div>
      </div>
      
      <h3 className="text-lg font-black text-gray-800 mb-2 leading-tight group-hover:text-red-600 transition-colors line-clamp-2">{tutorial.title}</h3>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">{tutorial.creator}</p>
      
      <div className="mt-auto pt-4 border-t border-gray-100">
        <a 
          href={tutorial.youtubeUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 text-white rounded-2xl font-bold text-xs hover:bg-red-700 transition-all shadow-lg active:scale-95"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          Watch Tutorial
        </a>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN PAGE COMPONENT: FindSkills
// ─────────────────────────────────────────────
const FindSkills = () => {
  const { user, resources, communityTutorials, uploadTutorial, interactWithTutorial, updateLearningStreak } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSmartSuggestionsOpen, setIsSmartSuggestionsOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('query');

  useEffect(() => {
    setIsLoading(true);
    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    const usersList = Object.values(storedUsers);
    const otherUsers = usersList.filter(u => u.email !== user?.email);
    setAllUsers(otherUsers);
    if (queryParam) setSearchTerm(queryParam);
    setTimeout(() => setIsLoading(false), 600);
  }, [user?.email, queryParam]);

  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');

  const allAvailableSkills = ['All', ...new Set(allUsers.flatMap(u => u.skillsOffered || []))];

  const filteredUsers = allUsers.filter((u) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = u.name?.toLowerCase().includes(searchLower);
    const skillsOfferedMatch = u.skillsOffered?.some(s => s.toLowerCase().includes(searchLower));
    const skillsWantedMatch = u.skillsWanted?.some(s => s.toLowerCase().includes(searchLower));
    const matchesSearch = nameMatch || skillsOfferedMatch || skillsWantedMatch;
    const matchesLevel = selectedLevel === 'All' || u.experience === selectedLevel;
    const matchesSkill = selectedSkill === 'All' || (u.skillsOffered || []).includes(selectedSkill);
    return matchesSearch && matchesLevel && matchesSkill;
  });

  const filteredResources = resources.filter(res => {
    const searchLower = searchTerm.toLowerCase();
    return res.title.toLowerCase().includes(searchLower) || res.category.toLowerCase().includes(searchLower);
  });

  const filteredTutorials = tutorialVideos.filter(tut => {
    const searchLower = searchTerm.toLowerCase();
    return tut.skill.toLowerCase().includes(searchLower) || tut.title.toLowerCase().includes(searchLower);
  });

  // Filter community tutorials (show ALL when search is empty; filter when user is searching)
  // When searchTerm is empty, ALL community tutorials are valid suggestions
  const filteredCommunityTutorials = searchTerm.trim() === ''
    ? communityTutorials
    : communityTutorials.filter(tut => {
        const searchLower = searchTerm.toLowerCase();
        return tut.skill.toLowerCase().includes(searchLower) || tut.title.toLowerCase().includes(searchLower);
      });

  console.log('DEBUG: communityTutorials loaded:', communityTutorials.length);
  console.log('DEBUG: filteredCommunityTutorials:', filteredCommunityTutorials.length);
  console.log('DEBUG: localStorage keys:', Object.keys(localStorage));

  return (
    <>
      {isLoading && <Loader message="Connecting to community..." />}
      <div className="min-h-[85vh] py-12 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-300 rounded-full blur-[180px] opacity-20 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-300 rounded-full blur-[180px] opacity-20 -z-10"></div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 mb-4">
              Explore Community
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-8">
              Connect with real learners who have shared their skills on the hub.
            </p>
            <div className="flex justify-center gap-4">
              <span className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-2xl font-bold text-xs border border-indigo-100">
                👤 {allUsers.length} Members Online
              </span>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-xl mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Search Keywords</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                  <input
                    type="text"
                    placeholder="Search names, React, Python..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-5 py-3.5 bg-white/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Experience Level</label>
                <select 
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-5 py-3.5 bg-white/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm appearance-none cursor-pointer"
                >
                  {['All', 'Beginner', 'Intermediate', 'Expert'].map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Looking for Skill</label>
                <select 
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full px-5 py-3.5 bg-white/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all shadow-sm appearance-none cursor-pointer"
                >
                  {allAvailableSkills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-16">
            
            {filteredUsers.length > 0 && (
              <div>
                <div className="flex items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-black text-gray-800">Available Partners</h2>
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">{filteredUsers.length} Found</span>
                  </div>
                  {/* Upload button always visible even when users exist */}
                  <button 
                    onClick={() => setIsUploadModalOpen(true)} 
                    className="flex-shrink-0 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  >
                    + Upload Tutorial
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredUsers.map((u) => (
                    <UserCard key={u.email} user={u} />
                  ))}
                </div>
              </div>
            )}

            {/* Community Tutorials Section - Always visible */}
            <div>
              <div className="bg-indigo-50/50 p-10 rounded-[3rem] border border-indigo-100 mb-12 animate-in zoom-in duration-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                  <div className="max-w-2xl">
                    <h2 className="text-3xl font-black text-indigo-900 mb-2 flex items-center gap-2">
                      Community Tutorials 
                      <button 
                        onClick={() => setIsSmartSuggestionsOpen(true)}
                        className="hover:scale-125 transition-transform hover:rotate-12 outline-none cursor-pointer p-1 rounded-full hover:bg-amber-100/50"
                        title="Learn about Smart Suggestions"
                      >
                        💡
                      </button>
                    </h2>
                    <p className="text-indigo-700 font-medium">
                      {filteredUsers.length === 0 && searchTerm
                        ? <>No users found for <span className="underline decoration-indigo-300">"{searchTerm}"</span>. Check out community tutorials or upload your own!</>
                        : 'Explore community-uploaded tutorials or contribute your own!'}
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsUploadModalOpen(true)} 
                    className="flex-shrink-0 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                  >
                    + Upload Tutorial
                  </button>
                </div>

                {filteredCommunityTutorials.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                      {filteredCommunityTutorials.map((tut) => (
                        <CommunityTutorialCard 
                          key={tut.id} 
                          tutorial={tut} 
                          interactWithTutorial={interactWithTutorial} 
                          updateLearningStreak={updateLearningStreak} 
                        />
                      ))}
                    </div>
                  )}

                  {filteredCommunityTutorials.length === 0 && filteredTutorials.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                      {filteredTutorials.map((tut) => (
                        <TutorialCard key={tut.id} tutorial={tut} />
                      ))}
                    </div>
                  )}

                  {filteredResources.length > 0 && (
                    <div className="mt-12">
                      <h3 className="text-xl font-black text-indigo-900 mb-6">Community Shared Links</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredResources.map((res) => (
                          <ResourceCard key={res.id} resource={res} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

          </div>
        </div>
      </div>
      
      <UploadTutorialModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        uploadTutorial={uploadTutorial} 
      />
      
      <SmartSuggestionsModal 
        isOpen={isSmartSuggestionsOpen} 
        onClose={() => setIsSmartSuggestionsOpen(false)} 
      />
    </>
  );
};

export default FindSkills;
