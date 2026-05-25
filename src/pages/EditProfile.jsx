import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import ErrorAlert from '../components/ErrorAlert';

// ─────────────────────────────────────────────
// EditProfile Page Component
// All form fields are CONTROLLED COMPONENTS — meaning React state
// is the "single source of truth" for every input value.
// ─────────────────────────────────────────────
const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // ── FORM STATE ──
  // One state object holds all form fields together
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    experience: 'Beginner',
  });

  // Separate state for dynamic skill arrays
  const [skillsOffered, setSkillsOffered] = useState(['React', 'JavaScript']);
  const [skillsWanted, setSkillsWanted] = useState(['Python', 'UI/UX']);

  // Temporary input state for the "Add Skill" inputs
  const [newOfferedSkill, setNewOfferedSkill] = useState('');
  const [newWantedSkill, setNewWantedSkill] = useState('');

  // Avatar preview AND the actual Base64 string to save
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Validation errors
  const [errors, setErrors] = useState({});
  const [skillError, setSkillError] = useState({ offered: '', wanted: '' });

  // ── useEffect ──
  // Pre-fills the form with the current logged-in user's data
  useEffect(() => {
    if (user) {
      console.log("Loading user data into form:", user);
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        experience: user.experience || 'Beginner',
      });
      // Load existing avatar if it exists in user object
      if (user.avatar) {
        setAvatarPreview(user.avatar);
        setAvatar(user.avatar);
      }
      // Also load existing skills if they exist in the user object
      if (user.skillsOffered) setSkillsOffered(user.skillsOffered);
      if (user.skillsWanted) setSkillsWanted(user.skillsWanted);
    }
  }, [user]);

  // ── GENERIC INPUT HANDLER ──
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // ── IMAGE RESIZING HELPER ──
  // Resizes image to 200x200 to keep Base64 string small for localStorage
  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 200;
          const MAX_HEIGHT = 200;
          let width = img.width;
          let height = img.height;

          // Maintain aspect ratio while resizing
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to small Base64 string
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
    });
  };

  // ── IMAGE UPLOAD HANDLER ──
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // 1. Show immediate local preview
      setAvatarPreview(URL.createObjectURL(file));

      // 2. Resize and convert to small Base64 for persistent storage
      try {
        const compressedBase64 = await resizeImage(file);
        setAvatar(compressedBase64);
        console.log("Image compressed and ready to save");
      } catch (err) {
        console.error("Image processing error:", err);
      }
    }
  };

  // ── ADD SKILL HANDLERS ──
  const handleAddOfferedSkill = () => {
    // 1. Clean the input (remove extra spaces)
    const trimmed = newOfferedSkill.trim();
    
    // 2. CHECK: If empty
    if (!trimmed) {
      setSkillError(prev => ({ ...prev, offered: 'Skill name cannot be empty!' }));
      return;
    }

    // 3. CHECK: Case-insensitive duplicate check
    // We use .some() to see if ANY existing skill (when lowered) matches our new one (when lowered)
    const exists = skillsOffered.some(s => s.toLowerCase() === trimmed.toLowerCase());

    if (exists) {
      setSkillError(prev => ({ ...prev, offered: 'Skill already exists!' }));
    } else {
      // SUCCESS: Add skill and clear errors
      setSkillsOffered((prev) => [...prev, trimmed]);
      setNewOfferedSkill('');
      setSkillError(prev => ({ ...prev, offered: '' }));
    }
  };

  const handleAddWantedSkill = () => {
    const trimmed = newWantedSkill.trim();
    
    if (!trimmed) {
      setSkillError(prev => ({ ...prev, wanted: 'Skill name cannot be empty!' }));
      return;
    }

    const exists = skillsWanted.some(s => s.toLowerCase() === trimmed.toLowerCase());

    if (exists) {
      setSkillError(prev => ({ ...prev, wanted: 'Skill already exists!' }));
    } else {
      setSkillsWanted((prev) => [...prev, trimmed]);
      setNewWantedSkill('');
      setSkillError(prev => ({ ...prev, wanted: '' }));
    }
  };

  // ── REMOVE SKILL HANDLERS ──
  const handleRemoveOfferedSkill = (skill) => {
    setSkillsOffered((prev) => prev.filter((s) => s !== skill));
  };

  const handleRemoveWantedSkill = (skill) => {
    setSkillsWanted((prev) => prev.filter((s) => s !== skill));
  };

  // Allow pressing Enter to add a skill
  const handleKeyDown = (e, type) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      type === 'offered' ? handleAddOfferedSkill() : handleAddWantedSkill();
    }
  };

  // ── FORM VALIDATION ──
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (formData.bio.length > 200) newErrors.bio = 'Bio must be under 200 characters.';
    return newErrors;
  };

  // ── FORM SUBMIT ──
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Save Changes button clicked!");

    // Simulated network delay
    setTimeout(() => {
      try {
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        console.warn("Validation failed:", validationErrors);
        setErrors(validationErrors);
        setIsLoading(false);
        return;
      }

      const updatedUser = {
        ...formData,
        skillsOffered,
        skillsWanted,
        avatar // ← Include the Base64 avatar data here
      };

      console.log("Attempting to save profile with data:", updatedUser);

      if (!updateProfile) {
        throw new Error("updateProfile function is missing from AuthContext!");
      }

      const result = updateProfile(updatedUser);

      if (result && result.success) {
        setIsLoading(false);
        console.log("Profile updated successfully in Context/LocalStorage");
        toast.success('Profile successfully updated! ✅');
        navigate('/profile');
      } else {
        setIsLoading(false);
        console.error("Profile update returned failure:", result);
        toast.error(result?.message || 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      setIsLoading(false);
      console.error("CRITICAL ERROR in handleSubmit:", error);
      toast.error('An unexpected error occurred. Please check the console.');
    }
  }, 1200);
};

  return (
    <>
      {isLoading && <Loader message="Saving your changes..." />}
      <div className="min-h-[85vh] py-12 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-300 rounded-full blur-[150px] opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-300 rounded-full blur-[150px] opacity-20 -z-10"></div>

      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 mb-2">
            Edit Profile
          </h1>
          <p className="text-gray-600">Keep your profile up to date to get the best matches.</p>
        </div>

        {/* ── ERROR ALERT ── */}
        <ErrorAlert 
          message={formError} 
          onRetry={() => setFormError(null)} 
          className="mb-8"
        />

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── AVATAR UPLOAD ── */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-lg">
            <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span>📷</span> Profile Photo
            </h2>
            <div className="flex items-center gap-6">
              {/* Preview: show uploaded image OR generated avatar */}
              <img
                src={avatarPreview || `https://api.dicebear.com/8.x/adventurer/svg?seed=${formData.name || 'default'}`}
                alt="Avatar Preview"
                className="w-20 h-20 rounded-full border-4 border-indigo-200 shadow-md object-cover"
              />
              <div>
                {/* Hidden file input triggered by the label button */}
                <input
                  type="file"
                  id="avatarInput"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="avatarInput"
                  className="cursor-pointer bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition inline-block"
                >
                  Choose Photo
                </label>
                <p className="text-gray-400 text-xs mt-2">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
          </div>

          {/* ── BASIC INFO ── */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-lg space-y-5">
            <h2 className="font-bold text-gray-700 flex items-center gap-2">
              <span>👤</span> Basic Information
            </h2>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"            // ← matches formData key
                value={formData.name}  // ← CONTROLLED: React controls the value
                onChange={handleChange} // ← updates state on every keystroke
                className={`w-full px-5 py-3 bg-white/70 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm ${errors.name ? 'border-red-400 focus:ring-red-400' : 'border-gray-200'
                  }`}
                placeholder="Your full name"
              />
              {/* Conditional rendering: show error only if it exists */}
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Bio Textarea */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Bio <span className="text-gray-400 font-normal">(max 200 chars)</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                className={`w-full px-5 py-3 bg-white/70 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm resize-none ${errors.bio ? 'border-red-400 focus:ring-red-400' : 'border-gray-200'
                  }`}
                placeholder="Tell the community about yourself..."
              />
              {/* Character counter */}
              <div className="flex justify-between items-center mt-1">
                {errors.bio ? (
                  <p className="text-red-500 text-xs">{errors.bio}</p>
                ) : <span />}
                <p className={`text-xs ${formData.bio.length > 180 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formData.bio.length}/200
                </p>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                placeholder="e.g. Chennai, India"
              />
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Experience Level</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm text-gray-700"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          {/* ── SKILLS OFFERED ── */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-lg">
            <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span>🎯</span> Skills I Can Offer
            </h2>

            {/* Display existing skills as removable tags */}
            <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
              {skillsOffered.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1.5 bg-indigo-100 text-indigo-800 font-semibold text-sm px-3 py-1.5 rounded-full"
                >
                  {skill}
                  {/* Remove button — calls filter() to create new array without this skill */}
                  <button
                    type="button" // ← IMPORTANT: prevents form submit!
                    onClick={() => handleRemoveOfferedSkill(skill)}
                    className="text-indigo-400 hover:text-red-500 transition font-bold leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
              {skillsOffered.length === 0 && (
                <p className="text-gray-400 text-sm italic">No skills added yet.</p>
              )}
            </div>

            {/* Add new skill input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newOfferedSkill}
                onChange={(e) => setNewOfferedSkill(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'offered')}
                className={`flex-1 px-4 py-2.5 bg-white/70 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm text-sm ${
                  skillError.offered ? 'border-red-400 focus:ring-red-400' : 'border-gray-200'
                }`}
                placeholder="Type a skill and press Add or Enter"
              />
              <button
                type="button"
                onClick={handleAddOfferedSkill}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition"
              >
                + Add
              </button>
            </div>
            {skillError.offered && (
              <p className="text-red-500 text-xs mt-2 font-medium">⚠️ {skillError.offered}</p>
            )}
          </div>

          {/* ── SKILLS WANTED ── */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-lg">
            <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span>📚</span> Skills I Want to Learn
            </h2>

            <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
              {skillsWanted.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1.5 bg-purple-100 text-purple-800 font-semibold text-sm px-3 py-1.5 rounded-full"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveWantedSkill(skill)}
                    className="text-purple-400 hover:text-red-500 transition font-bold leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
              {skillsWanted.length === 0 && (
                <p className="text-gray-400 text-sm italic">No skills added yet.</p>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newWantedSkill}
                onChange={(e) => setNewWantedSkill(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'wanted')}
                className={`flex-1 px-4 py-2.5 bg-white/70 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all shadow-sm text-sm ${
                  skillError.wanted ? 'border-red-400 focus:ring-red-400' : 'border-gray-200'
                }`}
                placeholder="Type a skill and press Add or Enter"
              />
              <button
                type="button"
                onClick={handleAddWantedSkill}
                className="bg-purple-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-purple-700 transition"
              >
                + Add
              </button>
            </div>
            {skillError.wanted && (
              <p className="text-red-500 text-xs mt-2 font-medium">⚠️ {skillError.wanted}</p>
            )}
          </div>

          {/* ── SUBMIT / CANCEL BUTTONS ── */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold text-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default EditProfile;
