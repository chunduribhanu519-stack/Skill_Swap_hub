export const initialCommunityTutorials = [
  {
    id: 'tut-1',
    skill: 'react',
    title: 'React Context API Explained',
    description: 'A deep dive into state management without Redux.',
    youtubeUrl: 'https://www.youtube.com/watch?v=35lXWvCuM8o',
    thumbnail: 'https://img.youtube.com/vi/35lXWvCuM8o/maxresdefault.jpg',
    uploadedBy: 'Jane Doe',
    uploaderId: 'jane@example.com',
    likes: 12,
    dislikes: 0,
    rating: 4.5,
    reviewCount: 4,
    comments: [],
    helpfulCount: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: 'tut-2',
    skill: 'python',
    title: 'Python Pandas Tutorial',
    description: 'Data analysis made easy with Pandas in 2024.',
    youtubeUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg',
    thumbnail: 'https://img.youtube.com/vi/vmEHCJofslg/maxresdefault.jpg',
    uploadedBy: 'Alex Smith',
    uploaderId: 'alex@example.com',
    likes: 8,
    dislikes: 1,
    rating: 5,
    reviewCount: 2,
    comments: [],
    helpfulCount: 3,
    createdAt: new Date().toISOString()
  }
];
