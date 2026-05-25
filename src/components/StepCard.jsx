// StepCard receives 4 props: stepNumber, icon, title, description
// Props make this card reusable — just pass different data each time
const StepCard = ({ stepNumber, icon, title, description }) => {
  return (
    // group class lets child elements respond to this parent's hover state
    <div className="group relative flex flex-col items-center text-center p-8 bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">

      {/* Subtle gradient background that appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 rounded-3xl"></div>

      {/* Gradient top border line that appears on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-3xl"></div>

      {/* Step Number Badge — e.g. "01", "02" */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-xs font-extrabold rounded-full flex items-center justify-center shadow-md">
        {String(stepNumber).padStart(2, '0')} {/* padStart ensures "1" becomes "01" */}
      </div>

      {/* Icon — large emoji or symbol */}
      <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>

      {/* Step Title */}
      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-700 transition-colors duration-300">
        {title}
      </h3>

      {/* Short Description */}
      <p className="text-gray-500 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default StepCard;
