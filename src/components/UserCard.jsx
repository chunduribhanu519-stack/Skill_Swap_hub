// UserCard receives all user data as PROPS from TopUsers parent component
// We use destructuring to unpack the props directly in the function signature
const UserCard = ({ name, avatar, bio, skillsOffered, skillsWanted, rating }) => {

  // This function runs when the Connect button is clicked
  const handleConnect = () => {
    alert(`Connection request sent to ${name}!`);
  };

  // Helper function to render star ratings
  // It takes a number (e.g. 4.5) and returns filled/empty star icons
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);     // e.g. 4.5 → 4 full stars
    const hasHalf = rating % 1 >= 0.5;        // e.g. 4.5 → true (has half star)
    return (
      <span className="text-yellow-400 text-sm">
        {'★'.repeat(fullStars)}
        {hasHalf ? '½' : ''}
        {'☆'.repeat(5 - fullStars - (hasHalf ? 1 : 0))}
      </span>
    );
  };

  return (
    // group class allows child elements to react to this card's hover state
    <div className="group bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col">

      {/* === TOP SECTION: Avatar + Name + Rating === */}
      <div className="flex items-center gap-4 mb-4">

        {/* Profile Avatar */}
        <img
          src={avatar}
          alt={`${name}'s profile`}
          className="w-16 h-16 rounded-full object-cover border-4 border-indigo-200 group-hover:border-indigo-400 transition-colors duration-300 shadow-md"
        />

        <div>
          {/* Username */}
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-700 transition-colors duration-300">
            {name}
          </h3>

          {/* Star Rating + numeric score */}
          <div className="flex items-center gap-1 mt-0.5">
            {renderStars(rating)}
            <span className="text-gray-500 text-xs font-medium ml-1">({rating})</span>
          </div>
        </div>
      </div>

      {/* === BIO SECTION ===
          Conditional rendering with && operator:
          If bio exists (is truthy), render the paragraph. Otherwise, render nothing.
          This prevents crashes when bio data is missing.
      */}
      {bio && (
        <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-2">
          {bio}
        </p>
      )}

      {/* === SKILLS OFFERED ===
          Another conditional rendering example using ternary operator:
          If skillsOffered array has items, render them. Otherwise show a fallback message.
      */}
      <div className="mb-3">
        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Offers:</span>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {skillsOffered && skillsOffered.length > 0 ? (
            // map() through the skills array to create a badge for each
            skillsOffered.map((skill) => (
              <span
                key={skill}  // skill name is unique here, so fine to use as key
                className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs italic">No skills listed</span>
          )}
        </div>
      </div>

      {/* === SKILLS WANTED === */}
      <div className="mb-5">
        <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Wants to learn:</span>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {skillsWanted && skillsWanted.length > 0 ? (
            skillsWanted.map((skill) => (
              <span
                key={skill}
                className="bg-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs italic">Not specified</span>
          )}
        </div>
      </div>

      {/* Push Connect button to the bottom of the card (mt-auto) */}
      <div className="mt-auto">
        <button
          onClick={handleConnect}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          Connect
        </button>
      </div>
    </div>
  );
};

export default UserCard;