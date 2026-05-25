// Import the SkillCard component we created
import SkillCard from './SkillCard';

// This is our data array — an array of skill objects
// Each object has the exact same shape: id, icon, name, users, description
// In the future, this data will come from a real backend API!
const skillsData = [
  {
    id: 1,  // ← UNIQUE key — React needs this for efficient re-rendering
    icon: '⚛️',
    name: 'ReactJS',
    users: '2,340',
    description: 'Build powerful modern web UIs with component-based architecture.',
  },
  {
    id: 2,
    icon: '🐍',
    name: 'Python',
    users: '3,120',
    description: 'From automation to AI — Python is the most versatile language.',
  },
  {
    id: 3,
    icon: '🎨',
    name: 'UI/UX Design',
    users: '1,850',
    description: 'Design beautiful, user-friendly digital experiences that convert.',
  },
  {
    id: 4,
    icon: '🎬',
    name: 'Video Editing',
    users: '1,200',
    description: 'Create compelling video content with professional editing skills.',
  },
  {
    id: 5,
    icon: '🖌️',
    name: 'Graphic Design',
    users: '2,010',
    description: 'Master visual communication with logos, branding, and illustrations.',
  },
  {
    id: 6,
    icon: '☕',
    name: 'Java',
    users: '1,680',
    description: 'The backbone of enterprise apps — write once, run anywhere.',
  },
];

// PopularSkills is the section component that renders the grid of SkillCards
const PopularSkills = () => {
  return (
    <section className="w-full max-w-6xl mx-auto mt-16 px-4 pb-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="inline-block bg-indigo-100 text-indigo-700 text-sm font-bold px-4 py-1 rounded-full mb-4">
          Trending Now
        </span>
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 mb-3">
          Popular Skills
        </h2>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Join thousands of learners already swapping these in-demand skills.
        </p>
      </div>

      {/* Responsive Grid */}
      {/* grid-cols-1: 1 column on mobile */}
      {/* sm:grid-cols-2: 2 columns on small screens (tablets) */}
      {/* lg:grid-cols-3: 3 columns on large screens (desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/*
          .map() loops through the skillsData array.
          For each 'skill' object, it renders one <SkillCard />.
          
          KEY RULE: key={skill.id} must be unique — React uses it internally
          to track which card is which. Without it, React shows a warning
          and performance degrades when the list updates.
          
          PROPS: We spread each property of the skill object as a prop to SkillCard.
          This is equivalent to writing:
            icon={skill.icon} name={skill.name} users={skill.users} description={skill.description}
        */}
        {skillsData.map((skill) => (
          <SkillCard
            key={skill.id}
            icon={skill.icon}
            name={skill.name}
            users={skill.users}
            description={skill.description}
          />
        ))}
      </div>
    </section>
  );
};

export default PopularSkills;
