import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import ErrorAlert from './ErrorAlert';
import Loader from './Loader';

const AuthModal = () => {
  const { 
    login, 
    register, 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode 
  } = useAuth();
  
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal closes or mode changes
  useEffect(() => {
    if (!isAuthModalOpen) {
      setError(null);
      setName('');
      setEmail('');
      setPassword('');
      setIsLoading(false);
    }
  }, [isAuthModalOpen, authModalMode]);

  const handleClose = () => {
    setIsAuthModalOpen(false);
  };

  const toggleMode = (e) => {
    e.preventDefault();
    setAuthModalMode(authModalMode === 'login' ? 'register' : 'login');
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulate network delay
    setTimeout(() => {
      try {
        let result;
        if (authModalMode === 'login') {
          result = login(email, password);
        } else {
          result = register(name, email, password);
        }

        setIsLoading(false);

        if (result.success) {
          if (authModalMode === 'login') {
            toast.success('Welcome back! Login successful. 👋');
            setIsAuthModalOpen(false);
            if (window.location.pathname === '/' || window.location.pathname === '/home') {
              navigate('/dashboard');
            }
          } else {
            toast.success('Account created successfully! Please login. 🎉');
            setAuthModalMode('login');
          }
        } else {
          setError(result.message || `${authModalMode === 'login' ? 'Login' : 'Registration'} failed`);
          toast.error(`${authModalMode === 'login' ? 'Login' : 'Registration'} failed`);
        }
      } catch (err) {
        setIsLoading(false);
        setError('A critical error occurred. Please try again.');
        console.error(err);
      }
    }, 1500);
  };

  return (
    <>
      {isLoading && <Loader message={authModalMode === 'login' ? "Authenticating..." : "Creating Account..."} />}
      
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300 ${
          isAuthModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={handleClose}
      >
        {/* Modal Container - Dark Theme similar to cult.fit */}
        <div 
          className={`relative max-w-sm w-full mx-4 bg-black rounded-[2rem] shadow-2xl p-8 md:p-10 border border-white/10 transition-all duration-300 transform ${
            isAuthModalOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Close Button */}
          <button 
            onClick={handleClose}
            className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors text-xl font-bold"
          >
            ✕
          </button>

          {/* Header (Logo) */}
          <div className="text-center mb-10 mt-2">
            {/* Minimalist Logo mimicking cult.fit */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                <span className="text-white text-3xl font-black">S</span>
              </div>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white mb-1">
              skill<span className="text-indigo-400">.</span>swap
            </h2>
            <p className="text-gray-400 text-sm font-medium">
              {authModalMode === 'login' ? 'Welcome Back' : 'Join the Hub'}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name field (Register only) */}
            <div className={`overflow-hidden transition-all duration-300 ${authModalMode === 'register' ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="relative">
                <input
                  type="text"
                  required={authModalMode === 'register'}
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(null); }}
                  className="w-full bg-transparent border-b border-gray-700 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Full name"
                  disabled={!isAuthModalOpen}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                className="w-full bg-transparent border-b border-gray-700 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Email address"
                disabled={!isAuthModalOpen}
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                type="password"
                required
                minLength={authModalMode === 'register' ? 6 : undefined}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                className="w-full bg-transparent border-b border-gray-700 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Password"
                disabled={!isAuthModalOpen}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isAuthModalOpen}
              className="w-full bg-white text-black py-3 rounded-lg font-bold text-sm tracking-widest uppercase hover:bg-gray-200 transition-colors disabled:opacity-50 mt-4"
            >
              CONTINUE
            </button>
            


            {/* Toggle Mode */}
            <p className="text-center text-gray-500 mt-6 text-sm">
              {authModalMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={toggleMode}
                className="text-white font-bold hover:underline"
              >
                {authModalMode === 'login' ? 'Register' : 'Login'}
              </button>
            </p>


          </form>

        </div>
      </div>
    </>
  );
};

export default AuthModal;
