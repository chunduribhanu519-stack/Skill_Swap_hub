import { Link } from 'react-router-dom';
import SearchSection from '../components/SearchSection';
import PopularSkills from '../components/PopularSkills';
import TopUsers from '../components/TopUsers';
import HowItWorks from '../components/HowItWorks';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, setIsAuthModalOpen, setAuthModalMode, handleProtectedNavigation } = useAuth();

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
      
      {/* ── HERO SECTION ── */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-[120px] animate-pulse delay-700"></div>

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="text-xs font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">🚀 Join 5,000+ Skill Swappers</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-8 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Master Any Skill by <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Teaching Yours.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
            The world's first decentralized knowledge exchange platform. 
            Connect with experts, swap skills, and grow your career without spending a dime.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {user ? (
              <Link 
                to="/find-skills" 
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all"
              >
                Start Swapping Now
              </Link>
            ) : (
              <button 
                onClick={() => { setAuthModalMode('login'); setIsAuthModalOpen(true); }}
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all cursor-pointer"
              >
                Get Started Free
              </button>
            )}
            <button 
              onClick={() => handleProtectedNavigation(scrollToHowItWorks)}
              className="w-full sm:w-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-10 py-5 rounded-2xl font-bold text-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
            >
              How it Works
            </button>
          </div>
        </div>
      </section>

      {/* ── FEATURES & CONTENT ── */}
      <div className="container mx-auto px-6 space-y-32 pb-32">
        <SearchSection />
        <PopularSkills />
        <TopUsers />
        <div id="how-it-works-section">
          <HowItWorks />
        </div>
      </div>
    </div>
  );
};

export default Home;

