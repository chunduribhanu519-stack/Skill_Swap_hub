import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {

  const { user } = useAuth();

  return (
    <div className="min-h-[85vh] py-12 px-4 relative overflow-hidden">

      {/* Background Blur */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-300 rounded-full blur-[150px] opacity-20 -z-10"></div>

      <div className="max-w-3xl mx-auto">

        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-10 shadow-xl">

          {/* ───────────────────────── */}
          {/* PROFILE HEADER */}
          {/* ───────────────────────── */}
          <div className="flex flex-col items-center mb-10">

            <img
              src={user?.avatar || `https://api.dicebear.com/8.x/adventurer/svg?seed=${user?.name}`}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-indigo-300 shadow-lg mb-4 object-cover"
            />

            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600">
              {user?.name}
            </h1>

            <p className="text-gray-500 mt-1">
              {user?.email}
            </p>

          </div>

          {/* ───────────────────────── */}
          {/* PROFILE DETAILS */}
          {/* ───────────────────────── */}
          <div className="space-y-4">

            {/* Name */}
            <div className="bg-white/70 rounded-2xl px-5 py-4 border border-gray-100">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                Full Name
              </p>

              <p className="text-gray-800 font-semibold">
                {user?.name || 'Not Added'}
              </p>
            </div>

            {/* Email */}
            <div className="bg-white/70 rounded-2xl px-5 py-4 border border-gray-100">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                Email Address
              </p>

              <p className="text-gray-800 font-semibold">
                {user?.email || 'Not Added'}
              </p>
            </div>

            {/* Bio */}
            <div className="bg-white/70 rounded-2xl px-5 py-4 border border-gray-100">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                Bio
              </p>

              <p className="text-gray-800 font-semibold">
                {user?.bio || 'No bio added yet'}
              </p>
            </div>

            {/* Location */}
            <div className="bg-white/70 rounded-2xl px-5 py-4 border border-gray-100">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                Location
              </p>

              <p className="text-gray-800 font-semibold">
                {user?.location || 'No location added'}
              </p>
            </div>

            {/* Experience */}
            <div className="bg-white/70 rounded-2xl px-5 py-4 border border-gray-100">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                Experience Level
              </p>

              <p className="text-gray-800 font-semibold">
                {user?.experience || 'Beginner'}
              </p>
            </div>

            {/* Skills Offered */}
            <div className="bg-white/70 rounded-2xl px-5 py-4 border border-gray-100">

              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3">
                Skills Offered
              </p>

              <div className="flex flex-wrap gap-2">

                {user?.skillsOffered?.length > 0 ? (
                  user.skillsOffered.map((skill) => (
                    <span
                      key={skill}
                      className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No skills added
                  </p>
                )}

              </div>
            </div>

            {/* Skills Wanted */}
            <div className="bg-white/70 rounded-2xl px-5 py-4 border border-gray-100">

              <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-3">
                Skills Wanted
              </p>

              <div className="flex flex-wrap gap-2">

                {user?.skillsWanted?.length > 0 ? (
                  user.skillsWanted.map((skill) => (
                    <span
                      key={skill}
                      className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No skills added
                  </p>
                )}

              </div>
            </div>

          </div>

          {/* ───────────────────────── */}
          {/* EDIT PROFILE BUTTON */}
          {/* ───────────────────────── */}
          <Link
            to="/edit-profile"
            className="mt-8 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-2xl font-bold text-center block hover:opacity-90 hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
          >
            ✏️ Edit Profile
          </Link>

        </div>
      </div>
    </div>
  );
};

export default Profile;