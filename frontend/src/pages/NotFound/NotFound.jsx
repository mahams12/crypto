import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft, FiSearch } from 'react-icons/fi';

const NotFound = () => {
  const popularPages = [
    { name: 'Latest News', path: '/news', icon: '📰' },
    { name: 'Bitcoin Price', path: '/prices?coin=bitcoin', icon: '₿' },
    { name: 'Ethereum News', path: '/news/ethereum', icon: '🔷' },
    { name: 'Market Analysis', path: '/analysis', icon: '📊' },
    { name: 'Trading Tools', path: '/tools', icon: '🛠️' },
    { name: 'Learning Center', path: '/learn', icon: '📚' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-gray-600 mb-4">404</div>
          <div className="text-6xl mb-4">🔍</div>
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-xl text-gray-400 mb-6">
            Sorry, we couldn't find the page you're looking for. The page might have been moved, 
            deleted, or the URL might be incorrect.
          </p>
          
          {/* Search Suggestion */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8 max-w-md mx-auto">
            <div className="flex items-center space-x-3 mb-3">
              <FiSearch className="w-5 h-5 text-blue-400" />
              <span className="font-medium">Try searching instead</span>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for news, coins, or topics..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                <FiSearch className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/"
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <FiHome className="w-5 h-5" />
            <span>Go Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Popular Pages */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Popular Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularPages.map((page, index) => (
              <Link
                key={index}
                to={page.path}
                className="bg-gray-800 hover:bg-gray-750 rounded-lg p-4 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{page.icon}</span>
                  <span className="font-medium">{page.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gray-800 rounded-lg p-8">
          <h3 className="text-xl font-bold mb-4">Still Need Help?</h3>
          <p className="text-gray-400 mb-6">
            If you believe this is an error or need assistance finding what you're looking for, 
            don't hesitate to reach out to our support team.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/contact"
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
            >
              Contact Support
            </Link>
            
            <a
              href="mailto:support@cryptonews.com"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
            >
              Email Us
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            Error Code: 404 | Page Not Found | 
            <span className="ml-1">
              Time: {new Date().toLocaleString()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;