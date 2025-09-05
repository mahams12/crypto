import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiOutlineNewspaper,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
  HiOutlineEye,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineGlobe,
  HiOutlineTag
} from 'react-icons/hi';
import { newsService } from '../../services/api';
import Loading from '../../components/Common/Loading';

const Markets = () => {
  const [marketStories, setMarketStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMarketStories();
  }, []);

  const fetchMarketStories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get latest news from your API
      const response = await newsService.getLatestNews(12);
      
      if (response && response.success && response.data && Array.isArray(response.data)) {
        const formattedStories = response.data.map((article, index) => ({
          id: article.id || `market_${index}`,
          title: article.title || 'Cryptocurrency Market Update',
          excerpt: article.summary || article.description || article.content?.substring(0, 120) || 'Latest cryptocurrency market analysis and insights.',
          image: article.image_url || article.thumbnail || `/api/placeholder/400/250`,
          tags: extractMarketTags(article.title, article.summary),
          timeAgo: getTimeAgo(article.published_at || article.created_at),
          category: "MARKETS",
          readTime: calculateReadTime(article.content || article.summary),
          url: article.url,
          source: article.source || "Crypto News",
          publishedAt: article.published_at || article.created_at
        }));

        setMarketStories(formattedStories);
        setError(null);
      } else {
        setMarketStories(getFallbackData());
      }
    } catch (error) {
      console.error('Error fetching market stories:', error);
      setError('Failed to load market stories. Showing sample data.');
      setMarketStories(getFallbackData());
    } finally {
      setIsLoading(false);
    }
  };

  const extractMarketTags = (title, summary) => {
    const text = `${title || ''} ${summary || ''}`.toUpperCase();
    const marketTerms = [
      { term: 'BITCOIN', tag: 'BTC' },
      { term: 'BTC', tag: 'BTC' },
      { term: 'ETHEREUM', tag: 'ETH' },
      { term: 'ETH', tag: 'ETH' },
      { term: 'XRP', tag: 'XRP' },
      { term: 'SOLANA', tag: 'SOL' },
      { term: 'SOL', tag: 'SOL' },
      { term: 'CARDANO', tag: 'ADA' },
      { term: 'ADA', tag: 'ADA' },
      { term: 'AAVE', tag: 'AAVE' },
      { term: 'UNI', tag: 'UNI' },
      { term: 'DEFI', tag: 'DEFI' },
      { term: 'NFT', tag: 'NFT' },
      { term: 'RALLY', tag: 'PUMP' },
      { term: 'SURGE', tag: 'PUMP' },
      { term: 'PUMP', tag: 'PUMP' },
      { term: 'DUMP', tag: 'DUMP' },
      { term: 'BULL', tag: 'BULLISH' },
      { term: 'BEAR', tag: 'BEARISH' },
      { term: 'ANALYSIS', tag: 'ANALYSIS' },
      { term: 'PREDICTION', tag: 'PREDICTION' },
      { term: 'TECHNICAL', tag: 'TA' },
      { term: 'SUPPORT', tag: 'SUPPORT' },
      { term: 'RESISTANCE', tag: 'RESISTANCE' }
    ];

    const foundTags = [];
    marketTerms.forEach(({ term, tag }) => {
      if (text.includes(term) && !foundTags.includes(tag)) {
        foundTags.push(tag);
      }
    });

    return foundTags.length > 0 ? foundTags.slice(0, 3) : ['BTC', 'MARKETS'];
  };

  const getTimeAgo = (publishedAt) => {
    if (!publishedAt) return 'Recently';
    
    const now = new Date();
    const published = new Date(publishedAt);
    const diffMs = now - published;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return `${Math.max(1, Math.floor(diffMs / (1000 * 60)))} minutes ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`;
  };

  const calculateReadTime = (content) => {
    if (!content) return '3 min read';
    
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${Math.max(1, readTime)} min read`;
  };

  const getFallbackData = () => [
    {
      id: 'fallback_1',
      title: "Bitcoin Price Shows Strong Support Above $110,000 Level",
      excerpt: "Bitcoin maintains bullish momentum as it holds key support levels, with analysts eyeing potential breakout scenarios for the next quarter.",
      image: "/api/placeholder/400/250",
      tags: ['BTC', 'SUPPORT', 'BULLISH'],
      timeAgo: "1 hour ago",
      category: "MARKETS",
      readTime: "3 min read"
    },
    {
      id: 'fallback_2',
      title: "Ethereum Network Activity Surges as DeFi Protocols Expand",
      excerpt: "Ethereum sees increased transaction volume as decentralized finance applications continue growing adoption across multiple sectors.",
      image: "/api/placeholder/400/250",
      tags: ['ETH', 'DEFI', 'VOLUME'],
      timeAgo: "3 hours ago",
      category: "MARKETS",
      readTime: "4 min read"
    },
    {
      id: 'fallback_3',
      title: "Altcoin Season Indicators Flash Mixed Signals",
      excerpt: "Market analysts examine various metrics to determine if altcoin season is approaching or if Bitcoin dominance will continue its reign.",
      image: "/api/placeholder/400/250",
      tags: ['ALTCOIN', 'ANALYSIS', 'BTC'],
      timeAgo: "5 hours ago",
      category: "MARKETS",
      readTime: "5 min read"
    },
    {
      id: 'fallback_4',
      title: "Institutional Bitcoin Adoption Reaches New Milestone",
      excerpt: "Major corporations continue to add Bitcoin to their treasury reserves, signaling growing institutional confidence in digital assets.",
      image: "/api/placeholder/400/250",
      tags: ['BTC', 'INSTITUTIONAL', 'ADOPTION'],
      timeAgo: "7 hours ago",
      category: "MARKETS",
      readTime: "4 min read"
    },
    {
      id: 'fallback_5',
      title: "Solana Ecosystem Shows Remarkable Growth Metrics",
      excerpt: "Solana's total value locked continues to climb as new projects launch and existing protocols expand their offerings.",
      image: "/api/placeholder/400/250",
      tags: ['SOL', 'TVL', 'GROWTH'],
      timeAgo: "9 hours ago",
      category: "MARKETS",
      readTime: "3 min read"
    },
    {
      id: 'fallback_6',
      title: "Central Bank Digital Currencies Gain Global Momentum",
      excerpt: "Multiple countries accelerate their CBDC development programs, potentially reshaping the future of digital payments and monetary policy.",
      image: "/api/placeholder/400/250",
      tags: ['CBDC', 'REGULATION', 'GLOBAL'],
      timeAgo: "11 hours ago",
      category: "MARKETS",
      readTime: "6 min read"
    }
  ];

  // Truncate text to ensure consistent card heights
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const MarketCard = ({ story }) => (
    <Link to={`/markets/${story.id}`} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="bg-dark-900 rounded-lg overflow-hidden hover:bg-dark-800 transition-all duration-300 border border-dark-800 hover:border-primary-500/50 group cursor-pointer h-full flex flex-col"
      >
        {/* Image Container - Fixed Height */}
        <div className="relative h-48 overflow-hidden">
          {story.image && story.image !== "/api/placeholder/400/250" ? (
            <img 
              src={story.image} 
              alt={story.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = e.target.closest('.relative')?.querySelector('.fallback-bg');
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          
          {/* Fallback gradient background */}
          <div 
            className="fallback-bg absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center"
            style={{display: story.image && story.image !== "/api/placeholder/400/250" ? 'none' : 'flex'}}
          >
            <div className="text-center">
              <HiOutlineChartBar className="w-16 h-16 mx-auto mb-4 text-white/80" />
              <div className="text-white/60 text-sm font-medium">MARKETS</div>
            </div>
          </div>
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {story.category}
            </span>
          </div>

          {/* Source */}
          <div className="absolute top-3 right-3">
            <span className="bg-black/50 backdrop-blur-sm text-white/80 px-2 py-1 rounded text-xs">
              {story.source || 'crypto.news'}
            </span>
          </div>
        </div>
        
        {/* Content Container - Flexible */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3 min-h-[2rem]">
            {story.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="bg-dark-700 text-gray-300 px-2 py-1 rounded text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title - Fixed Height */}
          <h3 className="text-lg font-semibold text-gray-100 mb-3 group-hover:text-primary-400 transition-colors line-clamp-2 leading-tight min-h-[3.5rem]">
            {truncateText(story.title, 80)}
          </h3>

          {/* Excerpt - Fixed Height */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1 min-h-[4rem]">
            {truncateText(story.excerpt, 120)}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <HiOutlineClock className="w-4 h-4 mr-1" />
                {story.timeAgo}
              </span>
              <span className="flex items-center">
                <HiOutlineEye className="w-4 h-4 mr-1" />
                {story.readTime}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Loading size="lg" text="Loading market analysis..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Cryptocurrency Markets | Latest Crypto Market Analysis & News</title>
        <meta name="description" content="Stay updated with the latest cryptocurrency market analysis, news, and insights. Get expert opinions on Bitcoin, Ethereum, and altcoin market trends." />
        <meta name="keywords" content="cryptocurrency markets, crypto market analysis, bitcoin news, ethereum analysis, crypto market trends" />
      </Helmet>

      <div className="min-h-screen bg-dark-950 pt-6">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">markets</h1>
              <p className="text-xl text-gray-400 leading-relaxed">
                <Link to="/" className="text-primary-400 hover:text-primary-300 transition-colors">Cryptocurrencies</Link> continue to capture the attention of investors and financial analysts, driven by rapid innovations and significant market volatility. In our comprehensive crypto market analysis, we examine recent market movements, regulatory developments, and technological advancements that are helping shape the digital currency landscape.
              </p>
            </div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-8">
              <p className="text-yellow-400">{error}</p>
              <button 
                onClick={fetchMarketStories}
                className="mt-2 text-sm text-blue-400 hover:text-blue-300 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Market Stories Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold flex items-center text-white">
                <HiOutlineNewspaper className="w-8 h-8 mr-3 text-primary-500" />
                Latest Market Analysis
              </h2>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-dark-800 rounded-lg animate-pulse">
                    <div className="bg-dark-700 h-48 rounded-t-lg"></div>
                    <div className="p-4 space-y-3">
                      <div className="flex gap-2">
                        <div className="bg-dark-700 h-6 w-12 rounded"></div>
                        <div className="bg-dark-700 h-6 w-16 rounded"></div>
                      </div>
                      <div className="bg-dark-700 h-4 rounded"></div>
                      <div className="bg-dark-700 h-4 rounded w-3/4"></div>
                      <div className="bg-dark-700 h-3 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {marketStories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="h-full"
                  >
                    <MarketCard story={story} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Refresh Button */}
            <div className="text-center mt-12">
              <button 
                onClick={fetchMarketStories}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg transition-all duration-300 font-semibold hover:transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  'Refresh Market Stories'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Markets;