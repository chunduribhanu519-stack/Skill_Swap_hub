import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import ErrorAlert from '../components/ErrorAlert';
import Loader from '../components/Loader';


const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  // ── FORM HANDLER ──
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear previous errors

    // Simulate network delay for better UX
    setTimeout(() => {
      try {
        const result = register(name, email, password);
        setIsLoading(false);
        
        if (result.success) {
          // 🚀 SUCCESS TOAST
          toast.success('Account created successfully! Welcome to the hub. 🎉');
          navigate('/login');
        } else {
          // ❌ ERROR TOAST & INLINE ALERT
          setError(result.message);
          toast.error(result.message || 'Registration failed');
        }
      } catch (err) {
        setIsLoading(false);
        setError('An unexpected error occurred. Please try again later.');
        toast.error('System error occurred');
      }
    }, 1500);
  };

  return (
    <>
    {/* Show loader while processing */}
    {isLoading && <Loader message="Creating your account..." />}

    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 transition-colors duration-300">
      
      {/* Background Decor (Matching Home/Dashboard) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl p-10 border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-500">
        
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-8 hover:scale-105 transition-transform">
            <span className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600">
              Skill Swap Hub
            </span>
          </Link>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600">
            Join the Hub
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Start swapping your skills today</p>
        </div>

        {/* ── ERROR ALERT ── */}
        <ErrorAlert 
          message={error} 
          onRetry={() => setError(null)} 
          className="mb-8"
        />
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => { setName(e.target.value); setError(null); }}
              className={`w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 outline-none transition-all dark:text-white ${
                error && !name ? 'border-red-500 bg-red-50/20' : 'border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900'
              }`}
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              className={`w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 outline-none transition-all dark:text-white ${
                error?.includes('email') || error?.includes('Email') ? 'border-red-500 bg-red-50/20' : 'border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900'
              }`}
              placeholder="name@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Password</label>
            <input 
              type="password" 
              required
              minLength={6}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all dark:text-white"
              placeholder="••••••••"
            />
            <p className="text-[10px] text-gray-400 mt-2 ml-1">Minimum 6 characters required</p>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Get Started Free'}
          </button>
          
          <p className="text-center text-gray-500 dark:text-gray-400 mt-8 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
    </>
  );
};

export default Register;
