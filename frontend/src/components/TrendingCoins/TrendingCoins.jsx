import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiUser, FiTrendingUp, FiEye } from 'react-icons/fi';

const FeaturedArticles = ({ articles = [] }) => {
  const defaultArticles = [
    {
      id: 1,
      title: 'Bitcoin Surges Past $105K as Institutional Adoption Accelerates',
      excerpt: 'Major corporations and financial institutions continue to add Bitcoin to their balance sheets, driving unprecedented demand and price action.',
      category: 'Bitcoin',
      author: 'Sarah Johnson',
      publishedAt: new Date().toISOString(),
      readTime: '5 min',
      views: 12400,
      image: '/featured-bitcoin.jpg',
      featured: true,
      trending: true
    },
    {
      id: 2,
      title: 'Ethereum 2.0 Staking Rewards Hit New Heights',
      excerpt: 'With over 15 million ETH staked, validators are seeing improved yields as network activity surges.',
      category: 'Ethereum',
      author: 'Mike Chen',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      readTime: '4 min',
      views: 8900,
      image: '/featured-ethereum.jpg',
      featured: true
    },
    {
      id: 3,
      title: 'DeFi TVL Crosses $100B Milestone Again',
      excerpt: 'Total Value Locked in DeFi protocols reaches new heights as yield farming strategies evolve.',
      category: 'DeFi',
      author: 'Alex Rodriguez',
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      readTime: '6 min',
      views: 6700,
      image: '/featured-defi.jpg',
      featured: true
    },
    {
      id: 4,
      title: 'NFT Market Shows Signs of Recovery',
      excerpt: 'Trading volumes and floor prices for blue-chip NFT collections are showing positive momentum.',
      category: 'NFTs',
      author: 'Emily Davis',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      readTime: '3 min',
      views: 5200,
      image: '/featured-nft.jpg'
    }
  ];

  const displayArticles = articles.length > 0 ? articles : defaultArticles;

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Bitcoin': 'bg-orange-600',
      'Ethereum': 'bg-blue-600',
      'DeFi': 'bg-purple-600',
      'NFTs': 'bg-pink-600',
      'Altcoins': 'bg-green-600',
      'Regulation': 'bg-red-600',
      'Mining': 'bg-yellow-600',
      'default': 'bg-gray-600'
    };
    return colors[category] || colors.default;
  };

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Featured Stories</h2>
        <Link 
          to="/news" 
          className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Featured Article */}
        {displayArticles[0] && (
          <Link 
            to={`/news/${displayArticles[0].id}`}
            className="group block"
          >
            <article className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-all duration-300 h-full">
              {/* Image */}
              <div className="relative h-64 bg-gray-700 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-500">
                  📰
                </div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 z-20 flex space-x-2">
                  <span className={`${getCategoryColor(displayArticles[0].category)} text-white text-xs px-2 py-1 rounded-full`}>
                    {displayArticles[0].category}
                  </span>
                  {displayArticles[0].trending && (
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                      <FiTrendingUp className="w-3 h-3" />
                      <span>Trending</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                  {displayArticles[0].title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {displayArticles[0].excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <FiUser className="w-3 h-3" />
                      <span>{displayArticles[0].author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiClock className="w-3 h-3" />
                      <span>{formatTimeAgo(displayArticles[0].publishedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <FiEye className="w-3 h-3" />
                      <span>{displayArticles[0].views?.toLocaleString()}</span>
                    </div>
                    <span>{displayArticles[0].readTime}</span>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        )}

        {/* Secondary Articles */}
        <div className="space-y-6">
          {displayArticles.slice(1, 4).map((article) => (
            <Link 
              key={article.id}
              to={`/news/${article.id}`}
              className="group block"
            >
              <article className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-all duration-300">
                <div className="flex space-x-4">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center text-gray-500">
                    📄
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`${getCategoryColor(article.category)} text-white text-xs px-2 py-1 rounded-full`}>
                        {article.category}
                      </span>
                      {article.trending && (
                        <FiTrendingUp className="w-3 h-3 text-red-400" />
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2 text-sm">
                      {article.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <span>{article.author}</span>
                        <span>{formatTimeAgo(article.publishedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center space-x-1">
                          <FiEye className="w-3 h-3" />
                          <span>{article.views?.toLocaleString()}</span>
                        </span>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}

          {/* More Articles Link */}
          <div className="text-center pt-4">
            <Link
              to="/news"
              className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              <span>Read More Articles</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Tags */}
      <div className="mt-8 pt-6 border-t border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">Trending Topics</h3>
        <div className="flex flex-wrap gap-2">
          {[
            'Bitcoin ETF', 'Ethereum 2.0', 'DeFi Yields', 'NFT Markets',
            'Regulation', 'Institutional Adoption', 'Layer 2', 'Web3'
          ].map((tag, index) => (
            <Link
              key={index}
              to={`/news?tag=${tag.toLowerCase().replace(' ', '-')}`}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-1 rounded-full text-sm transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticles;