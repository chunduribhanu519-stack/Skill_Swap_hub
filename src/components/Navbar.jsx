import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import EmptyState from './EmptyState';
import Loader from './Loader';


const Navbar = () => {
  const { user, logout, notifications, markAsRead, setIsAuthModalOpen, setAuthModalMode, handleProtectedNavigation } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // State to manage notification dropdown visibility
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Calculate unread count
  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  // Hide navbar only on root redirect
  if (location.pathname === '/') {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  const handleNotifyClick = (id) => {
    markAsRead(id);
    // Optionally redirect based on notification type
  };

  return (
    <>
    {isNavigating && <Loader message="Refreshing..." />}
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-white/20 dark:border-gray-800 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo/Brand - Text Design */}
        <div className="flex items-center">
          {/* Dynamically navigate based on auth state */}
          <Link
            to={user ? "/home" : "/"}
            onClick={(e) => {
              e.preventDefault();
              setIsNavigating(true);
              setTimeout(() => {
                navigate(user ? "/home" : "/");
                setIsNavigating(false);
              }, 800);
            }}
            className="group transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span className="text-2xl md:text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Skill Swap Hub
            </span>
          </Link>
        </div>

        {/* ── DESKTOP NAVIGATION Links (Hidden on Mobile) ── */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/home" 
            onClick={(e) => {
              e.preventDefault();
              handleProtectedNavigation(() => navigate('/home'));
            }}
            className="text-gray-700 dark:text-gray-300 font-medium hover:text-indigo-600 transition"
          >
            Home
          </Link>

          <Link 
            to="/find-skills" 
            onClick={(e) => {
              e.preventDefault();
              handleProtectedNavigation(() => navigate('/find-skills'));
            }}
            className="text-gray-700 dark:text-gray-300 font-medium hover:text-indigo-600 transition"
          >
            Find Skills
          </Link>

          <Link 
            to="/requests" 
            onClick={(e) => {
              e.preventDefault();
              handleProtectedNavigation(() => navigate('/requests'));
            }}
            className="text-gray-700 dark:text-gray-300 font-medium hover:text-indigo-600 transition"
          >
            Requests
          </Link>
        </div>

        {/* ── COMMON ACTIONS (Theme, Notifications, Profile) ── */}
        <div className="flex items-center space-x-2 md:space-x-4">

          {/* Coin Balance (Desktop) */}
          {user && (
            <div className="hidden sm:flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800 transition-all hover:scale-105 shadow-sm">
              <span className="text-lg leading-none">🪙</span>
              <span className="font-black text-sm text-indigo-700 dark:text-indigo-300">
                {user.coins ?? 0}
              </span>
            </div>
          )}

          {/* Theme Toggle (Desktop & Mobile) */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {user && (
            <div className="relative">
              <button
                onClick={() => setIsNotifyOpen(!isNotifyOpen)}
                className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-all rounded-full hover:bg-indigo-50"
              >
                <span className="text-xl">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotifyOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-indigo-50/30 dark:bg-indigo-900/10">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm">Notifications</h3>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{unreadCount} New</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications?.length > 0 ? (
                      notifications.map((notif) => (
                        <div key={notif.id} onClick={() => handleNotifyClick(notif.id)} className={`p-4 border-b border-gray-50 dark:border-gray-800 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${!notif.isRead ? 'bg-indigo-50/20 dark:bg-indigo-900/10' : ''}`}>
                          <p className={`text-xs ${!notif.isRead ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>{notif.message}</p>
                        </div>
                      ))
                    ) : (
                      <EmptyState icon="🔔" title="No notifications" message="You're all caught up!" />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Profile / Auth Links (Desktop Only) */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Link to="/dashboard" className="text-indigo-800 dark:text-indigo-300 font-bold hover:text-indigo-600">Hi, {user.name}</Link>
                <button onClick={handleLogout} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-semibold text-sm transition">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => { setIsAuthModalOpen(true); setAuthModalMode('login'); }} className="text-gray-700 dark:text-gray-300 font-medium hover:text-indigo-600">Login</button>
                <button onClick={() => { setIsAuthModalOpen(true); setAuthModalMode('register'); }} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-xl font-bold transition">Register</button>
              </>
            )}
          </div>

          {/* ── HAMBURGER TOGGLE (Mobile Only) ── */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition"
          >
            <span className="text-2xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
          </button>

        </div>
      </div>

      {/* ── MOBILE SIDEBAR (Drawer) ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Sidebar Drawer */}
          <div className="fixed top-0 right-0 h-full w-3/4 max-w-sm bg-white dark:bg-gray-900 shadow-2xl p-8 animate-in slide-in-from-right duration-300 border-l border-white/20 dark:border-gray-800">
            <div className="flex flex-col h-full">

              {/* Header */}
              <div className="flex justify-between items-center mb-10">
                <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-2xl text-gray-400">✕</button>
              </div>

              {/* Mobile Coin Balance */}
              {user && (
                <div className="flex items-center gap-4 bg-indigo-50 dark:bg-indigo-900/30 px-5 py-4 rounded-3xl border border-indigo-100 dark:border-indigo-800 mb-8 animate-in fade-in slide-in-from-left duration-500">
                  <div className="text-3xl">🪙</div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-indigo-500">Your Balance</p>
                    <p className="text-xl font-black text-indigo-900 dark:text-indigo-100">{user.coins ?? 0} Coins</p>
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="flex flex-col space-y-6">
                <Link 
                  to="/home" 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    handleProtectedNavigation(() => navigate('/home'));
                  }} 
                  className="text-lg font-bold text-gray-800 dark:text-gray-200"
                >
                  Home
                </Link>
                
                <Link 
                  to="/find-skills" 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    handleProtectedNavigation(() => navigate('/find-skills'));
                  }} 
                  className="text-lg font-bold text-gray-800 dark:text-gray-200"
                >
                  Find Skills
                </Link>

                <Link 
                  to="/requests" 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    handleProtectedNavigation(() => navigate('/requests'));
                  }} 
                  className="text-lg font-bold text-gray-800 dark:text-gray-200"
                >
                  Requests
                </Link>

                <Link 
                  to="/dashboard" 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    handleProtectedNavigation(() => navigate('/dashboard'));
                  }} 
                  className="text-lg font-bold text-indigo-600 dark:text-indigo-400"
                >
                  Profile Dashboard
                </Link>
              </div>

              {/* Auth Footer */}
              <div className="mt-auto pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
                {user ? (
                  <button
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="w-full bg-red-50 text-red-600 font-bold py-3 rounded-xl transition"
                  >
                    Logout
                  </button>
                ) : (
                  <div className="flex flex-col gap-4">
                    <button onClick={() => { setIsAuthModalOpen(true); setAuthModalMode('login'); setIsMobileMenuOpen(false); }} className="text-gray-600 font-bold">Login</button>
                    <button onClick={() => { setIsAuthModalOpen(true); setAuthModalMode('register'); setIsMobileMenuOpen(false); }} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold">Register Now</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
    </>
  );
};

export default Navbar;
