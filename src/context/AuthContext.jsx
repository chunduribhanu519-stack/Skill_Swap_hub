import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { initialCommunityTutorials } from '../data/communityTutorials';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {

  // Logged in user state
  const [user, setUser] = useState(null);

  // Loading state while checking localStorage
  const [loading, setLoading] = useState(true);

  // Auth Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  // Community Tutorials State
  const [communityTutorials, setCommunityTutorials] = useState(initialCommunityTutorials);

  // ─────────────────────────────────────────────
  // Load tutorials correctly on component mount
  // ─────────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem('communityTutorials');
    if (stored) {
      try {
        const parsedTutorials = JSON.parse(stored);
        if (Array.isArray(parsedTutorials) && parsedTutorials.length > 0) {
          setCommunityTutorials(parsedTutorials);
        }
      } catch (e) {
        console.error("Failed to parse communityTutorials from localStorage", e);
        // Fallback to initial
        setCommunityTutorials(initialCommunityTutorials);
      }
    } else {
      // Initialize with seed data if empty
      localStorage.setItem('communityTutorials', JSON.stringify(initialCommunityTutorials));
    }
  }, []);

  // ─────────────────────────────────────────────
  // Load user from localStorage when app starts
  // ─────────────────────────────────────────────
  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  // ─────────────────────────────────────────────
  // LOGIN FUNCTION
  // ─────────────────────────────────────────────
  const login = (email, password) => {

    const users = JSON.parse(
      localStorage.getItem('registeredUsers') || '{}'
    );

    const registeredUser = users[email];

    // Check if account exists
    if (!registeredUser) {
      return {
        success: false,
        message: 'No account found with this email. Please register.',
      };
    }

    // Check password
    if (registeredUser.password !== password) {
      return {
        success: false,
        message: 'Incorrect password. Please try again.',
      };
    }

    // Load COMPLETE user profile data
    const loggedInUser = {
      id: registeredUser.id || Date.now(),
      name: registeredUser.name,
      email: registeredUser.email,
      // Load all profile fields saved during "Edit Profile"
      bio: registeredUser.bio || '',
      location: registeredUser.location || '',
      experience: registeredUser.experience || 'Beginner',
      avatar: registeredUser.avatar || null,
      skillsOffered: registeredUser.skillsOffered || [],
      skillsWanted: registeredUser.skillsWanted || [],
      // ── COIN ECONOMY ──
      coins: registeredUser.coins ?? 0,
      transactions: registeredUser.transactions || [],
    };

    // Save in state
    setUser(loggedInUser);

    // Save active session
    localStorage.setItem(
      'user',
      JSON.stringify(loggedInUser)
    );

    return { success: true };
  };

  // ─────────────────────────────────────────────
  // REGISTER FUNCTION
  // ─────────────────────────────────────────────
  const register = (name, email, password) => {

    const users = JSON.parse(
      localStorage.getItem('registeredUsers') || '{}'
    );

    // Check duplicate email
    if (users[email]) {
      return {
        success: false,
        message: 'Email already exists, please login',
      };
    }

    // Create COMPLETE user object
    users[email] = {
      id: Date.now(),

      name,
      email,
      password,

      bio: '',
      location: '',
      experience: 'Beginner',

      skillsOffered: [],
      skillsWanted: [],

      // ── LEARNING STREAK ──
      streak: {
        count: 0,
        lastDate: '',
        best: 0
      },

      // ── COIN ECONOMY INITIALIZATION ──
      // Every new user gets 200 coins to start swapping!
      coins: 200,
      transactions: [
        {
          id: 'init-' + Date.now(),
          amount: 200,
          reason: 'Welcome Bonus',
          timestamp: new Date().toISOString(),
          type: 'earned'
        }
      ],
    };

    // Save users database
    localStorage.setItem(
      'registeredUsers',
      JSON.stringify(users)
    );

    return { success: true };
  };

  // ─────────────────────────────────────────────
  // UPDATE COINS FUNCTION
  // ─────────────────────────────────────────────
  const updateCoins = (amount, reason) => {
    try {
      if (!user) return { success: false, message: 'No active session' };

      const currentBalance = user.coins ?? 0;
      const newBalance = currentBalance + amount;

      // Prevent negative balances
      if (newBalance < 0) {
        return { success: false, message: 'Insufficient coin balance!' };
      }

      const newTransaction = {
        id: 'tx-' + Date.now(),
        amount,
        reason,
        timestamp: new Date().toISOString(),
        type: amount >= 0 ? 'earned' : 'spent'
      };

      const updatedUser = {
        ...user,
        coins: newBalance,
        transactions: [newTransaction, ...(user.transactions || [])]
      };

      // 1. Update State
      setUser(updatedUser);

      // 2. Update Active Session
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // 3. Update Database
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      if (users[user.email]) {
        users[user.email] = {
          ...users[user.email],
          coins: newBalance,
          transactions: [newTransaction, ...(users[user.email].transactions || [])]
        };
        localStorage.setItem('registeredUsers', JSON.stringify(users));
      }

      return { success: true };
    } catch (err) {
      console.error("Coin Update Error:", err);
      return { success: false, message: 'Failed to update coin balance' };
    }
  };

  // ─────────────────────────────────────────────
  // LOGOUT FUNCTION
  // ─────────────────────────────────────────────
  const logout = () => {

    setUser(null);

    localStorage.removeItem('user');
  };

  // ─────────────────────────────────────────────
  // UPDATE PROFILE FUNCTION
  // ─────────────────────────────────────────────
  const updateProfile = (updatedData) => {
    try {
      // Security check: ensure there is an active session
      if (!user) {
        return { success: false, message: 'No active session found.' };
      }

      // Merge old + new data
      const updatedUser = {
        ...user,
        ...updatedData,
      };

      // Update state immediately for UI responsiveness
      setUser(updatedUser);

      // Update active session in storage
      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      );

      // Update registered users database (mock persistence)
      const users = JSON.parse(
        localStorage.getItem('registeredUsers') || '{}'
      );

      if (users[user.email]) {
        users[user.email] = {
          ...users[user.email],
          ...updatedData,
        };

        localStorage.setItem(
          'registeredUsers',
          JSON.stringify(users)
        );
      }

      return { success: true };
    } catch (error) {
      console.error("AuthContext Update Error:", error);

      // Check if localStorage is full (common with high-res Base64 images)
      if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
        return {
          success: false,
          message: 'Image is too large! Please try a smaller file (under 2MB).'
        };
      }

      return { success: false, message: 'An unexpected error occurred while saving.' };
    }
  };

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!user) {
      setRequests([]);
      return;
    }

    // Load requests from localStorage
    let storedRequests = localStorage.getItem('skillRequests');
    let parsedRequests = {};

    if (storedRequests) {
      try {
        parsedRequests = JSON.parse(storedRequests);
        // If it's the old array format, reset to empty object to avoid errors
        if (Array.isArray(parsedRequests)) {
          parsedRequests = {};
        }
      } catch (e) {
        parsedRequests = {};
      }
    }

    if (!parsedRequests[user.email]) {
      parsedRequests[user.email] = [];
      localStorage.setItem('skillRequests', JSON.stringify(parsedRequests));
    }

    setRequests(parsedRequests[user.email]);
  }, [user]);

  const sendRequest = (newRequest) => {
    if (!user) return { success: false, message: 'Not logged in' };

    const requestObj = { ...newRequest, id: Date.now(), status: 'pending', timestamp: 'Just now' };
    const allRequests = JSON.parse(localStorage.getItem('skillRequests') || '{}');

    if (!allRequests[user.email]) allRequests[user.email] = [];
    allRequests[user.email].push(requestObj);

    // Attempt to find recipient's email if possible
    if (newRequest.to) {
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      const toEmail = Object.keys(users).find(email => users[email].name === newRequest.to);
      if (toEmail) {
        if (!allRequests[toEmail]) allRequests[toEmail] = [];
        allRequests[toEmail].push(requestObj);
      }
    }

    localStorage.setItem('skillRequests', JSON.stringify(allRequests));
    setRequests(allRequests[user.email]);
    return { success: true };
  };

  // ─────────────────────────────────────────────
  // 💰 ADVANCED REQUEST SWAP (With Coin Locking)
  // ─────────────────────────────────────────────
  const requestSkillSwap = (trainer) => {
    // 1. Check if learner (current user) has 50 coins
    if (!user || (user.coins || 0) < 50) {
      return { success: false, message: 'Insufficient balance! You need 50 coins to request a swap.' };
    }

    // 2. Deduct 50 coins immediately (Locked)
    const coinResult = updateCoins(-50, `Requested ${trainer.skillsOffered[0]} from ${trainer.name}`);

    if (!coinResult.success) return coinResult;

    // 3. Create the request object
    const newRequest = {
      id: Date.now(),
      fromId: user.id,
      from: user.name,
      to: trainer.name,
      offeredSkill: user.skillsOffered[0] || 'Any Skill',
      requestedSkill: trainer.skillsOffered[0] || 'Any Skill',
      status: 'pending',
      timestamp: 'Just now',
      avatar: trainer.avatar || `https://api.dicebear.com/8.x/adventurer/svg?seed=${trainer.name}`
    };

    const allRequests = JSON.parse(localStorage.getItem('skillRequests') || '{}');

    // Add to current user's requests
    if (!allRequests[user.email]) allRequests[user.email] = [];
    allRequests[user.email].push(newRequest);

    // Add to trainer's requests
    if (trainer.email) {
      if (!allRequests[trainer.email]) allRequests[trainer.email] = [];
      allRequests[trainer.email].push(newRequest);
    }

    localStorage.setItem('skillRequests', JSON.stringify(allRequests));
    setRequests(allRequests[user.email]);

    return { success: true };
  };

  // ─────────────────────────────────────────────
  // 🤝 UPDATE REQUEST STATUS (With Reward Logic)
  // ─────────────────────────────────────────────
  const updateRequestStatus = (id, newStatus) => {
    const request = requests.find(req => req.id === id);
    if (!request) return;

    // ── TRAINER REWARD LOGIC ──
    if (newStatus === 'accepted') {
      // 1. Trainer immediately gets 5 coins advance
      updateCoins(5, `Advance for teaching ${request.requestedSkill} to ${request.from}`);
      toast.success('You earned 5 coins for accepting! 🪙');
    }
    else if (newStatus === 'rejected') {
      // 2. Refund learner their 50 coins if trainer rejects
      // Note: In a real app, we'd find the learner by ID
      updateCoins(50, `Refund: Request for ${request.requestedSkill} was declined`);
    }
    else if (newStatus === 'completed') {
      // 3. Trainer gets the remaining 45 coins after session ends
      updateCoins(45, `Final payment for teaching ${request.requestedSkill}`);
      toast.success('Session complete! You earned 45 coins. 💰');
    }

    const allRequests = JSON.parse(localStorage.getItem('skillRequests') || '{}');
    let updatedCurrent = false;

    // Update the request status for all users who have this request
    for (const email in allRequests) {
      if (Array.isArray(allRequests[email])) {
        const reqIndex = allRequests[email].findIndex(req => req.id === id);
        if (reqIndex !== -1) {
          allRequests[email][reqIndex] = { ...allRequests[email][reqIndex], status: newStatus };
          if (user && email === user.email) {
            updatedCurrent = true;
          }
        }
      }
    }

    localStorage.setItem('skillRequests', JSON.stringify(allRequests));
    if (updatedCurrent && user) {
      setRequests(allRequests[user.email]);
    }
  };

  // ─────────────────────────────────────────────
  // 📹 ADD MEET LINK FUNCTION
  // ─────────────────────────────────────────────
  const addMeetLink = (id, link) => {
    const allRequests = JSON.parse(localStorage.getItem('skillRequests') || '{}');
    let updatedCurrent = false;

    // Iterate through all users' request arrays to update the specific request
    for (const email in allRequests) {
      if (Array.isArray(allRequests[email])) {
        const reqIndex = allRequests[email].findIndex(req => req.id === id);
        if (reqIndex !== -1) {
          // Save the meetLink and update the status to 'link_shared'
          allRequests[email][reqIndex] = {
            ...allRequests[email][reqIndex],
            meetLink: link,
            status: 'link_shared' // Automatically advance status when link is shared
          };

          if (user && email === user.email) {
            updatedCurrent = true;
          }
        }
      }
    }

    localStorage.setItem('skillRequests', JSON.stringify(allRequests));
    if (updatedCurrent && user) {
      setRequests(allRequests[user.email]);
    }
    return { success: true };
  };

  // ─────────────────────────────────────────────
  // 🌟 SUBMIT REVIEW FUNCTION
  // ─────────────────────────────────────────────
  const submitReview = (trainerName, reviewData) => {
    try {
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      const trainerEmail = Object.keys(users).find(email => users[email].name === trainerName);

      if (!trainerEmail) return { success: false, message: 'Trainer not found' };
      const trainer = users[trainerEmail];

      const currentReviews = trainer.reviews || [];
      const newReview = {
        id: 'rev-' + Date.now(),
        reviewerName: user.name,
        ...reviewData,
        timestamp: new Date().toISOString()
      };

      const updatedReviews = [newReview, ...currentReviews];
      const totalStars = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
      const newAverage = (totalStars / updatedReviews.length).toFixed(1);

      users[trainerEmail] = {
        ...trainer,
        reviews: updatedReviews,
        averageRating: parseFloat(newAverage),
        totalReviews: updatedReviews.length
      };

      localStorage.setItem('registeredUsers', JSON.stringify(users));
      return { success: true, newAverage };
    } catch (err) {
      console.error("Review Error:", err);
      return { success: false };
    }
  };

  // ─────────────────────────────────────────────
  // ⚠️ REPORT PROBLEM FUNCTION
  // ─────────────────────────────────────────────
  const reportProblem = (requestId, reportData) => {
    try {
      const allReports = JSON.parse(localStorage.getItem('systemReports') || '[]');
      const newReport = {
        id: 'rep-' + Date.now(),
        requestId,
        reporter: user.name,
        ...reportData,
        timestamp: new Date().toISOString(),
        status: 'pending_review'
      };

      localStorage.setItem('systemReports', JSON.stringify([newReport, ...allReports]));
      return { success: true };
    } catch (err) {
      console.error("Report Error:", err);
      return { success: false };
    }
  };

  // ─────────────────────────────────────────────
  // 🔥 STREAK MAINTENANCE SYSTEM
  // ─────────────────────────────────────────────
  const updateStreak = (currentUser) => {
    if (!currentUser) return;

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastDate = currentUser.streak?.lastDate || "";

    // If we already updated today, don't do anything
    if (lastDate === today) return;

    const users = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    const userData = users[currentUser.email];

    if (!userData) return;

    // Initialize streak if it doesn't exist
    if (!userData.streak) {
      userData.streak = { count: 1, lastDate: today, best: 1 };
    } else {
      const last = new Date(lastDate);
      const now = new Date(today);
      const diffTime = Math.abs(now - last);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day!
        userData.streak.count += 1;
        if (userData.streak.count > userData.streak.best) {
          userData.streak.best = userData.streak.count;
        }

        // 💰 REWARD: Every 7 days
        if (userData.streak.count % 7 === 0) {
          userData.coins += 50;
          userData.transactions.push({
            id: 'streak-' + Date.now(),
            type: 'Streak Bonus',
            reason: `${userData.streak.count} Day Streak! 🔥`,
            amount: 50,
            timestamp: new Date().toISOString()
          });
          toast.success(`🔥 7-DAY STREAK! You earned 50 bonus coins!`);
        }
      } else {
        // Missed a day or first time in a while - reset to 1
        userData.streak.count = 1;
      }
      userData.streak.lastDate = today;
    }

    // Save back to storage and state
    users[currentUser.email] = userData;
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    setUser({ ...userData });
  };

  // Run streak check when user logs in or app loads
  useEffect(() => {
    if (user) {
      updateStreak(user);
    }
  }, [user?.email]);

  // ─────────────────────────────────────────────
  // 📚 COMMUNITY RESOURCES SYSTEM
  // ─────────────────────────────────────────────
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const storedResources = localStorage.getItem('communityResources');
    if (storedResources) {
      setResources(JSON.parse(storedResources));
    } else {
      // Mock resources for the first time
      const initialResources = [
        { id: 1, title: 'React Crash Course 2024', category: 'React', url: 'https://youtube.com/watch?v=SqcY0GlETPk', uploader: 'Admin', description: 'Master React in 60 minutes.', rating: 4.8, commentsCount: 12 },
        { id: 2, title: 'Python for Beginners', category: 'Python', url: 'https://youtube.com/watch?v=kqtD5dpn9C8', uploader: 'CodeGuru', description: 'The absolute basics of Python.', rating: 4.5, commentsCount: 8 },
        { id: 3, title: 'UI/UX Design Principles', category: 'UI/UX', url: 'https://youtube.com/watch?v=c9Wg6MeGuRY', uploader: 'DesignMaster', description: 'Learn how to make apps look premium.', rating: 4.9, commentsCount: 25 },
      ];
      setResources(initialResources);
      localStorage.setItem('communityResources', JSON.stringify(initialResources));
    }
  }, []);

  const addResource = (newResource) => {
    const updated = [{
      ...newResource,
      id: Date.now(),
      rating: 0,
      ratingCount: 0,
      rewardsEarned: [], // Tracks milestones like 'high_rating', 'popular'
      timestamp: new Date().toISOString()
    }, ...resources];
    setResources(updated);
    localStorage.setItem('communityResources', JSON.stringify(updated));
    return { success: true };
  };

  // ─────────────────────────────────────────────
  // 💰 RATE RESOURCE & REWARD SYSTEM
  // ─────────────────────────────────────────────
  const rateResource = (resourceId, newRating) => {
    try {
      const allResources = [...resources];
      const resIndex = allResources.findIndex(r => r.id === resourceId);
      if (resIndex === -1) return;

      const resource = allResources[resIndex];

      // 1. Update Rating Logic
      const totalScore = (resource.rating * resource.ratingCount) + newRating;
      const newCount = resource.ratingCount + 1;
      const newAverage = parseFloat((totalScore / newCount).toFixed(1));

      resource.rating = newAverage;
      resource.ratingCount = newCount;

      // 2. Milestone Reward Logic
      // Check if they qualify for the 'Quality Bonus' (+20 coins for > 4.5 stars)
      if (newAverage >= 4.5 && !resource.rewardsEarned.includes('quality_bonus')) {
        resource.rewardsEarned.push('quality_bonus');

        // Find uploader to give coins
        const users = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
        const uploaderEmail = Object.keys(users).find(email => users[email].name === resource.uploader);

        if (uploaderEmail) {
          const uploader = users[uploaderEmail];
          uploader.coins += 20;
          uploader.transactions.push({
            id: 'reward-' + Date.now(),
            type: 'Resource Bonus',
            reason: `High rating on "${resource.title}"`,
            amount: 20,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('registeredUsers', JSON.stringify(users));

          // If uploader is the current user, update their state too
          if (user.email === uploaderEmail) {
            setUser({ ...user, coins: uploader.coins, transactions: uploader.transactions });
          }

          toast.success(`🎉 Reward! ${resource.uploader} earned 20 coins for high-quality content!`);
        }
      }

      setResources(allResources);
      localStorage.setItem('communityResources', JSON.stringify(allResources));
      return { success: true, newAverage };
    } catch (err) {
      console.error("Rating Error:", err);
      return { success: false };
    }
  };

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Rahul Verma sent you a connection request', type: 'request', isRead: false, timestamp: '2 mins ago' },
    { id: 2, message: 'Priya Sharma accepted your skill swap request', type: 'accepted', isRead: false, timestamp: '1 hour ago' },
    { id: 3, message: 'Arjun Mehta declined your request for Python', type: 'rejected', isRead: true, timestamp: 'Yesterday' },
  ]);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  // ─────────────────────────────────────────────
  // RESET PASSWORD FUNCTION
  // ─────────────────────────────────────────────
  const resetPassword = (email, newPassword) => {
    const users = JSON.parse(
      localStorage.getItem('registeredUsers') || '{}'
    );

    // Check if account exists
    if (!users[email]) {
      return {
        success: false,
        message: 'No account found with this email.',
      };
    }

    // Update password
    users[email].password = newPassword;

    // Save back to storage
    localStorage.setItem(
      'registeredUsers',
      JSON.stringify(users)
    );

    return { success: true };
  };

  // ─────────────────────────────────────────────
  // COMMUNITY TUTORIAL & STREAK SYSTEM
  // ─────────────────────────────────────────────



  const awardCoinsToUser = (targetEmail, amount, reason) => {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    if (users[targetEmail]) {
      users[targetEmail].coins = (users[targetEmail].coins || 0) + amount;
      users[targetEmail].transactions.unshift({
        id: 'tx-' + Date.now(),
        type: amount > 0 ? 'earned' : 'spent',
        amount: Math.abs(amount),
        reason,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('registeredUsers', JSON.stringify(users));

      // If target is logged-in user, update state
      if (user && user.email === targetEmail) {
        setUser(users[targetEmail]);
        localStorage.setItem('user', JSON.stringify(users[targetEmail]));
      }
    }
  };

  const uploadTutorial = (tutorialData) => {
    if (!user) return { success: false, message: 'Must be logged in' };

    // Duplicate URL validation flow:
    // 1. Normalize the input URL (trim spaces, lowercase for case-insensitivity)
    const normalizedUrl = (tutorialData.youtubeUrl || '').trim().toLowerCase();

    // 1. Explicitly load from shared global local storage
    const existingTutorials = JSON.parse(localStorage.getItem('communityTutorials')) || [];

    console.log("DEBUG: LocalStorage Keys:", Object.keys(localStorage));
    console.log("DEBUG: Loaded tutorials from communityTutorials:", existingTutorials.length);

    const alreadyExists = existingTutorials.some(
      tutorial => (tutorial.youtubeUrl || '').trim().toLowerCase() === normalizedUrl
    );

    console.log("DEBUG: Duplicate check result:", alreadyExists);

    if (alreadyExists) {
      return { success: false, message: 'This tutorial already exists' };
    }

    const newTutorial = {
      id: `tut-${Date.now()}`,
      ...tutorialData,
      uploadedBy: user.name,
      uploaderId: user.email,
      likes: 0,
      dislikes: 0,
      rating: 0,
      reviewCount: 0,
      comments: [],
      helpfulCount: 0,
      createdAt: new Date().toISOString()
    };

    // 2. Append new tutorial to existing tutorials array
    const updatedTutorials = [
      ...existingTutorials,
      newTutorial
    ];

    // 3. Save back explicitly using the shared global key
    localStorage.setItem('communityTutorials', JSON.stringify(updatedTutorials));
    console.log("DEBUG: Saved tutorials to communityTutorials:", updatedTutorials.length);

    // 4. Update Context state so UI re-renders instantly
    setCommunityTutorials(updatedTutorials);

    // Safely reward the user with 5 coins for uploading
    updateCoins(5, 'Uploaded Tutorial');

    return { success: true };
  };

  const interactWithTutorial = (tutorialId, action, data) => {
    if (!user) return;

    setCommunityTutorials(prev => {
      const updated = [...prev];
      const tutIndex = updated.findIndex(t => t.id === tutorialId);
      if (tutIndex === -1) return prev;

      const tut = { ...updated[tutIndex] };
      tut.voters = tut.voters || {};

      if (action === 'like') {
        if (tut.voters[user.email] === 'like') return prev;
        if (tut.voters[user.email] === 'dislike') { tut.dislikes -= 1; }
        tut.likes += 1;
        tut.voters[user.email] = 'like';
        if (tut.uploaderId !== user.email) {
          awardCoinsToUser(tut.uploaderId, 2, 'Someone liked your tutorial');
        }
      } else if (action === 'dislike') {
        if (tut.voters[user.email] === 'dislike') return prev;
        if (tut.voters[user.email] === 'like') { tut.likes -= 1; }
        tut.dislikes += 1;
        tut.voters[user.email] = 'dislike';
      } else if (action === 'helpful') {
        if (tut.voters[`helpful_${user.email}`]) return prev;
        tut.helpfulCount += 1;
        tut.voters[`helpful_${user.email}`] = true;
        if (tut.uploaderId !== user.email) {
          awardCoinsToUser(tut.uploaderId, 5, 'Someone found your tutorial helpful');
        }
      } else if (action === 'rate') {
        // Initialize ratings array if missing
        tut.ratings = tut.ratings || [];

        const existingRatingIndex = tut.ratings.findIndex(r => r.userId === user.email);

        if (existingRatingIndex !== -1) {
          // Update existing rating value
          tut.ratings[existingRatingIndex].value = data.rating;
        } else {
          // Add new rating
          tut.ratings.push({ userId: user.email, value: data.rating });

          // Award coins only for the first time someone gives a high rating
          if (data.rating >= 4 && tut.uploaderId !== user.email) {
            awardCoinsToUser(tut.uploaderId, 10, 'Your tutorial received a high rating!');
          }
        }

        // Recalculate average rating and review count
        tut.reviewCount = tut.ratings.length;
        const totalRating = tut.ratings.reduce((sum, r) => sum + r.value, 0);
        tut.rating = tut.reviewCount > 0 ? (totalRating / tut.reviewCount) : 0;

        updateLearningStreak();
      } else if (action === 'comment') {
        tut.comments.push({
          id: Date.now(),
          author: user.name,
          text: data.text,
          date: new Date().toISOString()
        });
        updateLearningStreak();
      }

      updated[tutIndex] = tut;

      // Explicitly save the interactions back to shared community storage
      localStorage.setItem('communityTutorials', JSON.stringify(updated));

      return updated;
    });
  };
  const handleProtectedNavigation = useCallback((callback) => {
    if (user) {
      callback();
    } else {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    }
  }, [user, setAuthModalMode, setIsAuthModalOpen]);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    requests,
    sendRequest,
    requestSkillSwap,
    updateRequestStatus,
    addMeetLink,
    submitReview,
    reportProblem,
    resources,
    addResource,
    rateResource,
    notifications,
    markAsRead,
    resetPassword,
    updateCoins,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    communityTutorials,
    uploadTutorial,
    interactWithTutorial,
    updateStreak,
    handleProtectedNavigation,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
