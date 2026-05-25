// Import the reusable UserCard child component
import UserCard from './UserCard';

// Sample users data array — each object follows the same "shape"
// avatar uses DiceBear API to generate unique avatars for free (no image files needed!)
const usersData = [
  {
    id: 1,
    name: 'Priya Sharma',
    avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Priya',
    bio: 'Full-stack developer passionate about teaching React and learning design.',
    skillsOffered: ['React', 'JavaScript', 'Node.js'],
    skillsWanted: ['UI/UX Design', 'Figma'],
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Arjun Mehta',
    avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Arjun',
    bio: 'Data scientist who loves Python and machine learning. Happy to share knowledge!',
    skillsOffered: ['Python', 'Machine Learning', 'SQL'],
    skillsWanted: ['React', 'Web Development'],
    rating: 4.6,
  },
  {
    id: 3,
    name: 'Sara Ali',
    avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Sara',
    bio: 'Creative UI/UX designer with 3+ years of experience building great user experiences.',
    skillsOffered: ['UI/UX Design', 'Figma', 'Graphic Design'],
    skillsWanted: ['Python', 'Data Analysis'],
    rating: 4.9,
  },
  {
    id: 4,
    name: 'Rahul Verma',
    avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Rahul',
    bio: 'Java backend engineer. Can teach OOP, Spring Boot, and system design concepts.',
    skillsOffered: ['Java', 'Spring Boot'],
    skillsWanted: ['Video Editing', 'Content Creation'],
    rating: 4.5,
    // Note: no bio field here to demonstrate conditional rendering in UserCard
  },
];

const TopUsers = () => {
  return (
    <section className="w-full max-w-6xl mx-auto mt-16 px-4 pb-16">

      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="inline-block bg-purple-100 text-purple-700 text-sm font-bold px-4 py-1 rounded-full mb-4">
          Community
        </span>
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 mb-3">
          Top Skill Swappers
        </h2>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Connect with our most active community members and start swapping skills today.
        </p>
      </div>

      {/* Responsive grid: 1 col mobile → 2 col tablet → 4 col desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/*
          map() iterates over usersData array.
          For each 'user' object, we render one <UserCard />.
          key={user.id} — unique number from the data, used by React internally.
          Each property of the user object is passed as an individual prop.
        */}
        {usersData.map((user) => (
          <UserCard
            key={user.id}
            name={user.name}
            avatar={user.avatar}
            bio={user.bio}
            skillsOffered={user.skillsOffered}
            skillsWanted={user.skillsWanted}
            rating={user.rating}
          />
        ))}
      </div>
    </section>
  );
};

export default TopUsers;