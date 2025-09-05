import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineClock, HiOutlineCalendar } from 'react-icons/hi';
import { newsService } from '../../services/api';

const FollowUp = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [followUpArticles, setFollowUpArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFollowUpArticles();
  }, [currentPage]);

  const fetchFollowUpArticles = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get latest news from your API
      const response = await newsService.getLatestNews(12);
      
      if (response && response.success && response.data && Array.isArray(response.data)) {
        const formattedArticles = response.data.map((article, index) => ({
          id: article.id || `followup_${index}`,
          title: article.title || 'Cryptocurrency Market Update',
          category: getCategoryFromTitle(article.title) || 'BTC',
          secondaryCategory: getSecondaryCategory(article.title),
          timeAgo: getTimeAgo(article.published_at || article.created_at),
          date: new Date(article.published_at || article.created_at || Date.now()).toISOString().split('T')[0],
          image: article.image_url || article.thumbnail || null,
          description: article.summary || article.description || article.content?.substring(0, 200) || 'Latest cryptocurrency market developments and analysis.',
          publishedAt: article.published_at || article.created_at,
          source: article.source || "Crypto News"
        }));

        setFollowUpArticles(formattedArticles);
        setError(null);
      } else {
        setFollowUpArticles(getFallbackData());
      }
    } catch (error) {
      console.error('Error:', error);
      setFollowUpArticles(getFallbackData());
    } finally {
      setLoading(false);
    }
  };

  const getCategoryFromTitle = (title) => {
    if (!title) return 'BTC';
    const upperTitle = title.toUpperCase();
    
    if (upperTitle.includes('BITCOIN') || upperTitle.includes('BTC')) return 'BTC';
    if (upperTitle.includes('ETHEREUM') || upperTitle.includes('ETH')) return 'ETH';
    if (upperTitle.includes('SOLANA') || upperTitle.includes('SOL')) return 'SOL';
    if (upperTitle.includes('DEFI')) return 'DEFI';
    if (upperTitle.includes('NFT')) return 'NFT';
    if (upperTitle.includes('CBDC')) return 'CBDC';
    if (upperTitle.includes('ALTCOIN')) return 'ALTCOIN';
    
    return 'BTC'; // Default
  };

  const getSecondaryCategory = (title) => {
    if (!title) return null;
    const upperTitle = title.toUpperCase();
    
    // Look for secondary mentions
    const categories = [];
    if (upperTitle.includes('BITCOIN') || upperTitle.includes('BTC')) categories.push('BTC');
    if (upperTitle.includes('ETHEREUM') || upperTitle.includes('ETH')) categories.push('ETH');
    if (upperTitle.includes('SOLANA') || upperTitle.includes('SOL')) categories.push('SOL');
    
    return categories.length > 1 ? categories[1] : null;
  };

  const getTimeAgo = (publishedAt) => {
    if (!publishedAt) return 'Recently';
    
    const now = new Date();
    const published = new Date(publishedAt);
    const diffMs = now - published;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Less than an hour ago';
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`;
  };

  const getFallbackData = () => [
    {
      id: 'fallback_1',
      title: "Bitcoin Market Analysis Shows Strong Support Levels Holding",
      category: "BTC",
      timeAgo: "2 hours ago",
      date: "2025-09-03",
      image: null,
      description: "Technical analysis reveals Bitcoin's key support levels remain intact despite recent volatility."
    },
    {
      id: 'fallback_2',
      title: "Ethereum Layer 2 Solutions See Record Transaction Volume",
      category: "ETH",
      timeAgo: "4 hours ago",
      date: "2025-09-03",
      image: null,
      description: "Layer 2 networks process unprecedented transaction volumes as adoption accelerates."
    },
    {
      id: 'fallback_3',
      title: "Regulatory Updates Impact Cryptocurrency Market Sentiment",
      category: "REGULATION",
      timeAgo: "6 hours ago",
      date: "2025-09-03",
      image: null,
      description: "Latest regulatory developments provide clarity for institutional cryptocurrency adoption."
    }
  ];

  const getCategoryColor = (category) => {
    const colors = {
      'BTC': 'bg-orange-600',
      'ETH': 'bg-blue-600',
      'SOL': 'bg-purple-600',
      'ALTCOIN': 'bg-green-600',
      'DEFI': 'bg-emerald-600',
      'NFT': 'bg-pink-600',
      'CBDC': 'bg-amber-600',
      'REGULATION': 'bg-red-600',
      'FOLLOW-UP': 'bg-blue-500',
      'DEFAULT': 'bg-gray-600'
    };
    return colors[category] || colors.DEFAULT;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading follow-up articles...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Follow-up | crypto.news</title>
        <meta name="description" content="Follow-up stories and continued coverage of major cryptocurrency developments and market movements." />
        <meta name="keywords" content="crypto follow-up, bitcoin follow-up, cryptocurrency updates, market follow-up" />
      </Helmet>

      <div className="min-h-screen bg-dark-950 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              follow-up
            </h1>
          </motion.div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-8">
              <p className="text-red-400">{error}</p>
              <button 
                onClick={fetchFollowUpArticles}
                className="mt-2 text-sm text-blue-400 hover:text-blue-300 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Today's Top Stories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-8 text-white">
              latest follow-up stories
            </h2>

            {/* Follow-up Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {followUpArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-all duration-300 cursor-pointer group"
                >
                  <Link to={`/follow-up/${article.id}`} className="block">
                    {/* Article Image */}
                    <div className="relative h-48 overflow-hidden">
                      {article.image ? (
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : null}

                      {/* Dynamic gradient backgrounds */}
                      <div className={`absolute inset-0 ${
                        index % 6 === 0 ? 'bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600' :
                        index % 6 === 1 ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600' :
                        index % 6 === 2 ? 'bg-gradient-to-br from-blue-400 via-purple-500 to-pink-600' :
                        index % 6 === 3 ? 'bg-gradient-to-br from-green-400 via-blue-500 to-purple-600' :
                        index % 6 === 4 ? 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-600' :
                        'bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-600'
                      }`} style={{display: article.image ? 'none' : 'block'}}></div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
                          FOLLOW-UP
                        </span>
                      </div>
                      
                      {/* Secondary category badge if exists */}
                      {article.secondaryCategory && (
                        <div className="absolute top-4 left-20 z-10">
                          <span className={`${getCategoryColor(article.secondaryCategory)} text-white text-xs font-medium px-2 py-1 rounded`}>
                            {article.secondaryCategory}
                          </span>
                        </div>
                      )}
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      
                      {/* Source watermark */}
                      <div className="absolute bottom-4 right-4 text-white/70 text-xs font-medium">
                        {article.source || 'crypto.news'}
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-3 line-clamp-3 group-hover:text-blue-400 transition-colors">
                        {article.title}
                      </h3>
                      
                      {article.description && (
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {article.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-2">
                          <span className={`${getCategoryColor(article.category)} text-white px-2 py-1 rounded text-xs`}>
                            {article.category}
                          </span>
                          {article.secondaryCategory && (
                            <span className={`${getCategoryColor(article.secondaryCategory)} text-white px-2 py-1 rounded text-xs`}>
                              {article.secondaryCategory}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <HiOutlineClock className="w-3 h-3" />
                          <span>{article.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            {/* Refresh Button */}
            <div className="text-center mt-8">
              <button 
                onClick={fetchFollowUpArticles}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Refresh Articles'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default FollowUp;