import React, { useState } from 'react';
import { FiBookOpen, FiClock, FiUser, FiStar, FiDownload, FiShare2, FiCheckCircle } from 'react-icons/fi';

const Guides = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock guides data - replace with actual API call
  const guides = [
    {
      title: 'Understanding Blockchain Technology',
      description: 'A comprehensive introduction to blockchain fundamentals and how it works.',
      author: 'Tech Team',
      readTime: '15 min',
      difficulty: 'Beginner',
      rating: 4.8,
      downloads: '89K',
      category: 'Getting Started',
      chapters: 5,
      lastUpdated: '2024-01-20'
    },
    {
      title: 'Advanced Trading Strategies',
      description: 'Learn sophisticated trading techniques used by professional traders.',
      author: 'Trading Experts',
      readTime: '30 min',
      difficulty: 'Advanced',
      rating: 4.6,
      downloads: '56K',
      category: 'Trading',
      chapters: 10,
      lastUpdated: '2024-01-18'
    },
    {
      title: 'Wallet Security Best Practices',
      description: 'Essential security measures to protect your cryptocurrency investments.',
      author: 'Security Team',
      readTime: '12 min',
      difficulty: 'Intermediate',
      rating: 4.9,
      downloads: '134K',
      category: 'Wallets',
      chapters: 4,
      lastUpdated: '2024-01-22'
    },
    {
      title: 'DeFi Liquidity Pools Explained',
      description: 'Understanding how liquidity pools work in decentralized finance.',
      author: 'DeFi Specialist',
      readTime: '18 min',
      difficulty: 'Intermediate',
      rating: 4.7,
      downloads: '67K',
      category: 'DeFi',
      chapters: 6,
      lastUpdated: '2024-01-19'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Guides' },
    { value: 'getting-started', label: 'Getting Started' },
    { value: 'wallets', label: 'Wallets & Security' },
    { value: 'trading', label: 'Trading' },
    { value: 'defi', label: 'DeFi' },
    { value: 'nfts', label: 'NFTs' },
    { value: 'mining', label: 'Mining' },
    { value: 'taxes', label: 'Taxes & Legal' },
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const featuredGuides = [
    {
      title: 'Complete Beginner\'s Guide to Cryptocurrency',
      description: 'Everything you need to know to start your crypto journey safely and confidently.',
      author: 'CryptoNews Team',
      readTime: '25 min',
      difficulty: 'Beginner',
      rating: 4.9,
      downloads: '124K',
      category: 'Getting Started',
      chapters: 8,
      lastUpdated: '2024-01-15',
      featured: true
    },
    {
      title: 'DeFi Yield Farming: Advanced Strategies',
      description: 'Master advanced DeFi strategies to maximize your yields while managing risks.',
      author: 'Sarah Chen',
      readTime: '35 min',
      difficulty: 'Advanced',
      rating: 4.7,
      downloads: '45K',
      category: 'DeFi',
      chapters: 12,
      lastUpdated: '2024-01-10',
      featured: true
    },
    {
      title: 'NFT Trading: From Basics to Pro',
      description: 'Learn how to evaluate, buy, and sell NFTs like a professional trader.',
      author: 'Mike Rodriguez',
      readTime: '20 min',
      difficulty: 'Intermediate',
      rating: 4.8,
      downloads: '78K',
      category: 'NFTs',
      chapters: 6,
      lastUpdated: '2024-01-12',
      featured: true
    }
  ];

  const quickGuides = [
    { title: 'How to Buy Your First Bitcoin', time: '5 min', category: 'Getting Started' },
    { title: 'Setting Up MetaMask Wallet', time: '8 min', category: 'Wallets' },
    { title: 'Understanding Gas Fees', time: '6 min', category: 'Ethereum' },
    { title: 'How to Stake Ethereum', time: '10 min', category: 'Staking' },
    { title: 'Reading Crypto Charts', time: '12 min', category: 'Trading' },
    { title: 'Avoiding Crypto Scams', time: '7 min', category: 'Security' },
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-600 text-white';
      case 'intermediate':
        return 'bg-yellow-600 text-white';
      case 'advanced':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  // Filter guides based on selected filters
  const filteredGuides = guides.filter(guide => {
    const categoryMatch = selectedCategory === 'all' || guide.category.toLowerCase().includes(selectedCategory);
    const difficultyMatch = selectedDifficulty === 'all' || guide.difficulty.toLowerCase() === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Cryptocurrency Guides</h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Step-by-step guides and tutorials to help you navigate the world of cryptocurrency 
            with confidence and expertise.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Difficulty Level
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Featured Guides */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Guides</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredGuides.map((guide, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(guide.difficulty)}`}>
                      {guide.difficulty}
                    </span>
                    <div className="flex items-center text-yellow-400">
                      <FiStar className="w-4 h-4 mr-1 fill-current" />
                      <span className="text-sm">{guide.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-3">{guide.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{guide.description}</p>
                  
                  <div className="space-y-2 mb-4 text-sm text-gray-300">
                    <div className="flex items-center">
                      <FiUser className="w-4 h-4 mr-2" />
                      {guide.author}
                    </div>
                    <div className="flex items-center">
                      <FiClock className="w-4 h-4 mr-2" />
                      {guide.readTime} • {guide.chapters} chapters
                    </div>
                    <div className="flex items-center">
                      <FiDownload className="w-4 h-4 mr-2" />
                      {guide.downloads} downloads
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                      Read Guide
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors">
                      <FiShare2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Guides */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Quick Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickGuides.map((guide, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium mb-1">{guide.title}</h3>
                    <div className="flex items-center text-sm text-gray-400">
                      <FiClock className="w-4 h-4 mr-1" />
                      {guide.time}
                      <span className="mx-2">•</span>
                      {guide.category}
                    </div>
                  </div>
                  <FiCheckCircle className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All Guides */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">All Guides</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>{filteredGuides.length} guides</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredGuides.map((guide, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(guide.difficulty)}`}>
                        {guide.difficulty}
                      </span>
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                        {guide.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{guide.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{guide.description}</p>
                  </div>
                  <FiBookOpen className="w-6 h-6 text-gray-400 ml-4" />
                </div>

                <div className="flex items-center justify-between text-sm text-gray-300">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <FiUser className="w-4 h-4 mr-1" />
                      {guide.author}
                    </div>
                    <div className="flex items-center">
                      <FiClock className="w-4 h-4 mr-1" />
                      {guide.readTime}
                    </div>
                  </div>
                  <div className="flex items-center text-yellow-400">
                    <FiStar className="w-4 h-4 mr-1 fill-current" />
                    <span>{guide.rating}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Updated {new Date(guide.lastUpdated).toLocaleDateString()}
                    </span>
                    <button className="text-blue-400 hover:text-blue-300 font-medium text-sm">
                      Read Guide →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {filteredGuides.length >= 10 && (
            <div className="text-center mt-8">
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Load More Guides
              </button>
            </div>
          )}

          {/* No Results */}
          {filteredGuides.length === 0 && (
            <div className="text-center py-12">
              <FiBookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-400 mb-2">
                No guides found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters to see more results.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Guides;