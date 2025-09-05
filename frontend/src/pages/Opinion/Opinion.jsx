import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineClock, HiOutlineUser } from 'react-icons/hi';
import { newsService } from '../../services/api';

const Opinion = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [opinionArticles, setOpinionArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOpinionArticles();
  }, [currentPage]);

  const fetchOpinionArticles = async () => {
    setLoading(true);
    setError(null);

    try {
      // Only use /latest endpoint - it works and returns data
      const response = await newsService.getLatestNews(12);
      
      if (response && response.success && response.data && Array.isArray(response.data)) {
        const formattedArticles = response.data.map((article, index) => ({
          id: article.id || `article_${index}`,
          title: article.title || 'Cryptocurrency Market Update',
          timeAgo: getTimeAgo(article.published_at || article.created_at),
          author: article.author || article.source || "Crypto Expert",
          date: new Date(article.published_at || article.created_at || Date.now()).toISOString().split('T')[0],
          image: article.image_url || article.thumbnail || null,
          category: "OPINION",
          url: article.url,
          description: article.summary || article.description || article.content?.substring(0, 200) || 'Latest cryptocurrency market analysis and insights.',
          publishedAt: article.published_at || article.created_at,
          source: article.source || "Crypto News"
        }));

        setOpinionArticles(formattedArticles);
        setTotalPages(1);
        setError(null);
      } else {
        // Use fallback data if API doesn't return expected format
        setOpinionArticles(getFallbackData());
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error:', error);
      setOpinionArticles(getFallbackData());
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
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
      title: "Bitcoin Market Analysis: Key Technical Indicators Point to Bullish Momentum",
      timeAgo: "2 hours ago",
      author: "Michael Chen",
      date: "2025-09-03",
      image: null,
      category: "OPINION",
      description: "Technical analysis reveals strong support levels and increasing institutional interest in Bitcoin."
    },
    {
      id: 'fallback_2',
      title: "Ethereum's Layer 2 Solutions Drive DeFi Innovation and Lower Gas Fees",
      timeAgo: "4 hours ago",
      author: "Sarah Johnson",
      date: "2025-09-03",
      image: null,
      category: "OPINION",
      description: "Layer 2 scaling solutions are transforming the Ethereum ecosystem with improved efficiency."
    },
    {
      id: 'fallback_3',
      title: "Regulatory Clarity Boosts Institutional Cryptocurrency Adoption Worldwide",
      timeAgo: "6 hours ago",
      author: "David Williams",
      date: "2025-09-03",
      image: null,
      category: "OPINION",
      description: "Clear regulatory frameworks are encouraging more institutions to enter the crypto space."
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading opinion articles...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Opinion | crypto.news</title>
        <meta name="description" content="Expert cryptocurrency opinions, market analysis, and insights from industry professionals." />
        <meta name="keywords" content="cryptocurrency opinion, crypto analysis, blockchain opinion, bitcoin opinion, ethereum opinion" />
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
              opinion
            </h1>
            <p className="text-gray-400 text-lg max-w-4xl leading-relaxed">
              Want to break free from data charts and dive down the rabbit hole of subjectivity? Crypto opinions are like NFTs: unique, sometimes 
              controversial, but always part of the blockchain narrative. This is where diverse voices are heard, unfiltered insights are shared, and 
              unconventional views are held.
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-8">
              <p className="text-red-400">{error}</p>
              <button 
                onClick={fetchOpinionArticles}
                className="mt-2 text-sm text-blue-400 hover:text-blue-300 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Opinion Articles Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-8 text-white">
              latest analysis & opinions
            </h2>

            {/* Opinion Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opinionArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-all duration-300 cursor-pointer group"
                >
                  <Link to={`/opinion/${article.id}`} className="block">
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
                      
                      {/* Fallback gradient background */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-br from-pink-600 via-purple-600 to-blue-600" 
                        style={{display: article.image ? 'none' : 'block'}}
                      ></div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-pink-600 text-white text-xs font-medium px-2 py-1 rounded">
                          {article.category}
                        </span>
                      </div>
                      
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
                        <div className="flex items-center space-x-1">
                          <HiOutlineClock className="w-3 h-3" />
                          <span>{article.timeAgo}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <HiOutlineUser className="w-3 h-3" />
                          <span>{article.author}</span>
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
                onClick={fetchOpinionArticles}
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

export default Opinion;