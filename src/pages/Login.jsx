import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import ErrorAlert from '../components/ErrorAlert';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear previous errors

    // Simulate a network delay (e.g. 1.5 seconds) to show the loader
    setTimeout(() => {
      try {
        const result = login(email, password);
        setIsLoading(false);

        if (result.success) {
          toast.success('Welcome back! Login successful. 👋');
          navigate('/dashboard');
        } else {
          setError(result.message || 'Invalid email or password');
          toast.error('Login failed');
        }
      } catch (err) {
        setIsLoading(false);
        setError('A critical connection error occurred. Please check your internet.');
        console.error(err);
      }
    }, 1500);
  };

  return (
    <>
    {isLoading && <Loader message="Authenticating..." />}
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 border border-gray-100 dark:border-gray-800">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-8 hover:scale-105 transition-transform">
            <span className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600">
              Skill Swap Hub
            </span>
          </Link>
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600">
            Welcome Back
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Login to your Skill Swap account</p>
        </div>

        {/* ── ERROR ALERT ── */}
        <ErrorAlert 
          message={error} 
          onRetry={() => setError(null)} 
          className="mb-6"
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              className={`w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 outline-none transition-all dark:text-white ${
                error ? 'border-red-500 bg-red-50/30' : 'border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900'
              }`}
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              className={`w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 outline-none transition-all dark:text-white ${
                error ? 'border-red-500 bg-red-50/30' : 'border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900'
              }`}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Login
          </button>

          <div className="text-center mt-4">
            <Link to="/forgot-password" size="sm" className="text-gray-500 hover:text-indigo-600 text-sm font-medium transition">
              Forgot Password?
            </Link>
          </div>

          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-bold hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
    </>
  );
};

export default Login;
