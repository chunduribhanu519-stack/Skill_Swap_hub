// Import the reusable StepCard child component
import StepCard from './StepCard';

// Steps data array — each object has the same shape (same keys)
// This makes it easy to add/remove/edit steps without touching JSX
const stepsData = [
  {
    id: 1,
    icon: '📝',
    title: 'Create Account',
    description:
      'Sign up in seconds. Create your free profile and join a growing community of skill-sharing learners.',
  },
  {
    id: 2,
    icon: '🎯',
    title: 'Add Your Skills',
    description:
      'Tell us what you know and what you want to learn. List the skills you can teach and the ones you want to pick up.',
  },
  {
    id: 3,
    icon: '🔍',
    title: 'Find Skill Partners',
    description:
      'Browse profiles of talented people. Find someone whose skills match your needs and connect with them instantly.',
  },
  {
    id: 4,
    icon: '🤝',
    title: 'Exchange Knowledge',
    description:
      'Start swapping! Learn from each other through live sessions, chats, or shared resources. Grow together.',
  },
];

const HowItWorks = () => {
  return (
    <section className="w-full max-w-6xl mx-auto mt-16 px-4 pb-16">

      {/* Section Header */}
      <div className="text-center mb-14">
        <span className="inline-block bg-indigo-100 text-indigo-700 text-sm font-bold px-4 py-1 rounded-full mb-4">
          Simple Process
        </span>
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 mb-3">
          How It Works
        </h2>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Get started in just 4 simple steps and begin your skill exchange journey today.
        </p>
      </div>

      {/* Connector line visible only on large screens — purely decorative */}
      <div className="relative">
        {/* Dashed gradient line connecting the steps */}
        <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300 opacity-50 z-0"></div>

        {/* Responsive grid: 1 col → 2 col → 4 col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {/*
            map() loops through stepsData array.
            For each 'step' object it renders one <StepCard />.
            key={step.id} is the unique identifier React needs for tracking.
            stepNumber={step.id} is passed separately as a prop to display on the badge.
          */}
          {stepsData.map((step) => (
            <StepCard
              key={step.id}
              stepNumber={step.id}
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
