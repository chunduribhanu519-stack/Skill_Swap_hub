// ─────────────────────────────────────────────
// REUSABLE LOADER COMPONENT
// Built with Tailwind CSS for high performance
// ─────────────────────────────────────────────
const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/40 backdrop-blur-md">
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-16 h-16 rounded-full border-4 border-indigo-100"></div>
        
        {/* Spinning Ring */}
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        
        {/* Pulsing Inner Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
      </div>
      
      {/* Loading Text */}
      <p className="mt-4 text-indigo-800 font-bold tracking-widest text-sm uppercase animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default Loader;
