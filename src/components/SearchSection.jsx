import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (searchQuery.trim() !== '') {
      // Redirect to FindSkills page with the search query as a URL parameter
      navigate(`/find-skills?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      alert('Please enter a skill to search.');
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto mt-16 px-4">
      <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/60">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 mb-2">
            What do you want to learn?
          </h2>
          <p className="text-gray-600">Discover hundreds of skills offered by our community.</p>
        </div>

        {/* The search form */}
        <form onSubmit={handleSearch} className="relative flex flex-col md:flex-row items-center gap-4">
          
          {/* Input wrapper to hold the icon and the input field */}
          <div className="relative w-full">
            {/* SVG Search Icon positioned absolutely inside the relative wrapper */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            
            {/* The actual input field */}
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/70 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all shadow-sm text-lg text-gray-800 placeholder-gray-400"
              placeholder="Search skills like React, Python, UI/UX..."
            />
          </div>

          {/* Search Button */}
          <button 
            type="submit"
            className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 whitespace-nowrap"
          >
            Search Skills
          </button>
        </form>
      </div>
    </section>
  );
};

export default SearchSection;
