import { useNavigate } from 'react-router-dom';

const OfferSkill = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock successful submission
    alert('Skill offered successfully!');
    navigate('/find-skills');
  };

  return (
    <div className="flex justify-center items-center min-h-[85vh] relative overflow-hidden px-4">
      {/* Background Decor */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-300 rounded-full blur-[120px] opacity-20 -z-10"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-purple-300 rounded-full blur-[120px] opacity-20 -z-10"></div>

      <div className="bg-white/60 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/40 w-full max-w-xl">
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 mb-8">
          Offer a Skill
        </h2>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Skill Title</label>
            <input 
              type="text" 
              required
              className="w-full px-5 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
              placeholder="e.g. Advanced CSS Animations"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select className="w-full px-5 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm text-gray-700">
              <option value="web-dev">Web Development</option>
              <option value="design">Design</option>
              <option value="languages">Languages</option>
              <option value="music">Music</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea 
              rows="4"
              required
              className="w-full px-5 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm resize-none"
              placeholder="Describe what you will teach..."
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Publish Skill
          </button>
        </form>
      </div>
    </div>
  );
};

export default OfferSkill;
