import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiBook, FiVideo, FiFileText, FiAward, FiClock, FiUsers, FiTrendingUp } from 'react-icons/fi';
import Loading from '../../components/Common/Loading';
import newsService from '../../services/newsService';

const Learn = () => {
  const [selectedCategory, setSelectedCategory] = useState('beginner');
  const [selectedType, setSelectedType] = useState('all');

  // Mock learning content data since the service method doesn't exist
  const mockLearningContent = [
    {
      title: 'Bitcoin Fundamentals',
      excerpt: 'Learn the basics of Bitcoin and how it revolutionized digital currency',
      type: 'article',
      difficulty: 'Beginner',
      readTime: '10 min read',
      publishedAt: new Date().toISOString(),
      views: '12.5K'
    },
    {
      title: 'Ethereum Smart Contracts',
      excerpt: 'Understanding smart contracts and their role in the Ethereum ecosystem',
      type: 'video',
      difficulty: 'Intermediate',
      readTime: '15 min watch',
      publishedAt: new Date().toISOString(),
      views: '8.9K'
    },
    {
      title: 'DeFi Protocols Deep Dive',
      excerpt: 'Comprehensive guide to decentralized finance protocols and yield farming',
      type: 'article',
      difficulty: 'Advanced',
      readTime: '20 min read',
      publishedAt: new Date().toISOString(),
      views: '6.2K'
    },
    {
      title: 'NFT Creation Guide',
      excerpt: 'Step-by-step guide to creating and minting your first NFT',
      type: 'video',
      difficulty: 'Beginner',
      readTime: '12 min watch',
      publishedAt: new Date().toISOString(),
      views: '15.1K'
    },
    {
      title: 'Crypto Trading Strategies',
      excerpt: 'Professional trading strategies for cryptocurrency markets',
      type: 'article',
      difficulty: 'Advanced',
      readTime: '25 min read',
      publishedAt: new Date().toISOString(),
      views: '9.7K'
    },
    {
      title: 'Wallet Security Best Practices',
      excerpt: 'Essential security practices to protect your cryptocurrency assets',
      type: 'article',
      difficulty: 'Beginner',
      readTime: '8 min read',
      publishedAt: new Date().toISOString(),
      views: '11.3K'
    }
  ];

  // Filter content based on selected category and type
  const getFilteredContent = () => {
    let filtered = mockLearningContent;
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(content => content.type === selectedType);
    }
    
    // Filter by difficulty based on category
    if (selectedCategory !== 'all') {
      const difficultyMap = {
        'beginner': 'Beginner',
        'intermediate': 'Intermediate', 
        'advanced': 'Advanced',
        'trading': ['Intermediate', 'Advanced']
      };
      
      const targetDifficulty = difficultyMap[selectedCategory];
      if (Array.isArray(targetDifficulty)) {
        filtered = filtered.filter(content => targetDifficulty.includes(content.difficulty));
      } else {
        filtered = filtered.filter(content => content.difficulty === targetDifficulty);
      }
    }
    
    return filtered;
  };

  const { data: learningContent, isLoading, error } = useQuery({
    queryKey: ['learn-content', selectedCategory, selectedType],
    queryFn: () => Promise.resolve(getFilteredContent()),
    refetchOnWindowFocus: false,
  });

  const categories = [
    { value: 'beginner', label: 'Beginner', description: 'Start your crypto journey' },
    { value: 'intermediate', label: 'Intermediate', description: 'Expand your knowledge' },
    { value: 'advanced', label: 'Advanced', description: 'Master crypto concepts' },
    { value: 'trading', label: 'Trading', description: 'Learn to trade crypto' },
  ];

  const contentTypes = [
    { value: 'all', label: 'All Content', icon: <FiBook /> },
    { value: 'article', label: 'Articles', icon: <FiFileText /> },
    { value: 'video', label: 'Videos', icon: <FiVideo /> },
    { value: 'course', label: 'Courses', icon: <FiAward /> },
  ];

  const featuredTopics = [
    {
      title: 'What is Bitcoin?',
      description: 'Learn the fundamentals of Bitcoin and how it works',
      duration: '10 min read',
      difficulty: 'Beginner',
      image: '/bitcoin-learn.jpg',
      category: 'Bitcoin Basics'
    },
    {
      title: 'Understanding Ethereum',
      description: 'Discover Ethereum and smart contracts',
      duration: '15 min read',
      difficulty: 'Beginner',
      image: '/ethereum-learn.jpg',
      category: 'Ethereum Basics'
    },
    {
      title: 'DeFi Explained',
      description: 'Decentralized Finance concepts and protocols',
      duration: '20 min read',
      difficulty: 'Intermediate',
      image: '/defi-learn.jpg',
      category: 'DeFi'
    },
    {
      title: 'NFT Guide',
      description: 'Non-Fungible Tokens and digital ownership',
      duration: '12 min read',
      difficulty: 'Beginner',
      image: '/nft-learn.jpg',
      category: 'NFTs'
    }
  ];

  const learningPaths = [
    {
      title: 'Crypto Fundamentals',
      description: 'Complete beginner course covering all basics',
      lessons: 12,
      duration: '4 hours',
      students: '15.2K',
      rating: 4.8,
      progress: 0
    },
    {
      title: 'Trading Masterclass',
      description: 'Advanced trading strategies and analysis',
      lessons: 20,
      duration: '8 hours',
      students: '8.1K',
      rating: 4.9,
      progress: 0
    },
    {
      title: 'DeFi Deep Dive',
      description: 'Comprehensive guide to decentralized finance',
      lessons: 15,
      duration: '6 hours',
      students: '5.8K',
      rating: 4.7,
      progress: 0
    }
  ];

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Learn Cryptocurrency</h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Master cryptocurrency and blockchain technology with our comprehensive learning resources, 
            courses, and expert guides designed for all skill levels.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === category.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <div className="text-center">
                <div className="font-semibold">{category.label}</div>
                <div className="text-xs opacity-75">{category.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Content Type Filter */}
        <div className="flex justify-center gap-4 mb-8">
          {contentTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedType === type.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {type.icon}
              <span>{type.label}</span>
            </button>
          ))}
        </div>

        {/* Featured Topics */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTopics.map((topic, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors cursor-pointer">
                <div className="h-48 bg-gray-700 flex items-center justify-center">
                  <FiBook className="w-16 h-16 text-gray-400" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                      {topic.category}
                    </span>
                    <span className="text-xs text-gray-400">{topic.difficulty}</span>
                  </div>
                  <h3 className="font-semibold mb-2">{topic.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{topic.description}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <FiClock className="w-4 h-4 mr-1" />
                    {topic.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Learning Paths */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Learning Paths</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPaths.map((path, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{path.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{path.description}</p>
                  </div>
                  <FiAward className="w-6 h-6 text-yellow-400 ml-4" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center text-gray-300">
                    <FiBook className="w-4 h-4 mr-2" />
                    {path.lessons} lessons
                  </div>
                  <div className="flex items-center text-gray-300">
                    <FiClock className="w-4 h-4 mr-2" />
                    {path.duration}
                  </div>
                  <div className="flex items-center text-gray-300">
                    <FiUsers className="w-4 h-4 mr-2" />
                    {path.students} students
                  </div>
                  <div className="flex items-center text-yellow-400">
                    ⭐ {path.rating}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-300 mb-1">
                    <span>Progress</span>
                    <span>{path.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${path.progress}%` }}
                    ></div>
                  </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
                  {path.progress > 0 ? 'Continue Learning' : 'Start Course'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Latest Articles */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Latest Educational Content</h2>
            <button className="text-blue-400 hover:text-blue-300 font-medium">
              View All →
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningContent?.slice(0, 6).map((content, index) => (
              <article key={index} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors cursor-pointer">
                <div className="h-48 bg-gray-700 flex items-center justify-center">
                  {content.type === 'video' ? (
                    <FiVideo className="w-16 h-16 text-gray-400" />
                  ) : (
                    <FiFileText className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      content.difficulty === 'Beginner' ? 'bg-green-600 text-white' :
                      content.difficulty === 'Intermediate' ? 'bg-yellow-600 text-white' :
                      'bg-red-600 text-white'
                    }`}>
                      {content.difficulty}
                    </span>
                    <span className="text-xs text-gray-400">{content.readTime}</span>
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-2">{content.title}</h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-3">{content.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(content.publishedAt).toLocaleDateString()}</span>
                    <div className="flex items-center">
                      <FiTrendingUp className="w-4 h-4 mr-1" />
                      {content.views} views
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Knowledge Base Categories */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Knowledge Base</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Blockchain Technology', articles: 45, icon: '🔗' },
              { title: 'Cryptocurrency Basics', articles: 32, icon: '₿' },
              { title: 'Trading & Investing', articles: 28, icon: '📊' },
              { title: 'DeFi Protocols', articles: 24, icon: '🏦' },
              { title: 'NFT & Digital Art', articles: 18, icon: '🎨' },
              { title: 'Security & Wallets', articles: 21, icon: '🔐' },
            ].map((category, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="font-semibold">{category.title}</h3>
                </div>
                <p className="text-gray-400 text-sm">{category.articles} articles available</p>
                <div className="mt-4">
                  <span className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                    Explore →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Learn;