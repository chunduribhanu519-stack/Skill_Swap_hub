// SkillCard is a reusable component that accepts data via PROPS
// Props are like "arguments" you pass to a component, just like a function
// Here we destructure: { icon, name, users, description } directly from props
const SkillCard = ({ icon, name, users, description }) => {
  return (
    // The card container with hover animation
    // hover:-translate-y-2 moves the card UP 8px when hovered
    // group class allows child elements to react to the parent's hover state
    <div className="group relative bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden">
      
      {/* Gradient glow effect in background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl -z-10"></div>
      
      {/* Gradient top border accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Icon Area */}
      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>

      {/* Skill Name */}
      <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-indigo-700 transition-colors duration-300">
        {name}
      </h3>

      {/* Short Description */}
      <p className="text-gray-500 text-sm mb-4 leading-relaxed">
        {description}
      </p>

      {/* Users Count Badge */}
      <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full">
        {/* User icon SVG */}
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
        {users} learning
      </div>
    </div>
  );
};

export default SkillCard;
