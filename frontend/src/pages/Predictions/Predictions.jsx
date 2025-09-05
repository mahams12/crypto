import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  HiOutlineTrendingUp, 
  HiOutlineTrendingDown, 
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineLocationMarker,
  HiOutlineClock
} from 'react-icons/hi';
import { newsService, cryptoService } from '../../services/api';

const Predictions = () => {
  const [predictionArticles, setPredictionArticles] = useState([]);
  const [topCoins, setTopCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPredictionData();
    fetchTopCoins();
  }, []);

  const fetchPredictionData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get latest news from your API
      const response = await newsService.getLatestNews(12);
      
      if (response && response.success && response.data && Array.isArray(response.data)) {
        const formattedArticles = response.data.map((article, index) => ({
          id: article.id || `prediction_${index}`,
          title: formatPredictionTitle(article.title),
          symbol: extractCryptoSymbol(article.title, article.summary),
          image: article.image_url || article.thumbnail || "/api/placeholder/400/200",
          category: "PREDICTIONS",
          timeAgo: getTimeAgo(article.published_at || article.created_at),
          coinIcon: getCoinIcon(extractCryptoSymbol(article.title, article.summary)),
          excerpt: article.summary || article.description || article.content?.substring(0, 120) || "Expert cryptocurrency price analysis and market predictions.",
          featured: index < 3,
          url: article.url,
          source: article.source || "Crypto News",
          publishedAt: article.published_at || article.created_at
        }));

        setPredictionArticles(formattedArticles);
        setError(null);
      } else {
        setPredictionArticles(getFallbackData());
      }
    } catch (error) {
      console.error('Error fetching prediction articles:', error);
      setError('Failed to load predictions. Showing sample data.');
      setPredictionArticles(getFallbackData());
    } finally {
      setLoading(false);
    }
  };

  const fetchTopCoins = async () => {
    try {
      const response = await cryptoService.getCoins(1, 10, 'market_cap_rank');
      if (response && response.success && response.data?.data) {
        setTopCoins(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching top coins:', error);
    }
  };

  const formatPredictionTitle = (title) => {
    if (!title) return 'Cryptocurrency Price Prediction Analysis';
    
    // If title already sounds like a prediction, keep it
    const predictionKeywords = ['prediction', 'forecast', 'outlook', 'target', 'analysis'];
    const lowerTitle = title.toLowerCase();
    
    if (predictionKeywords.some(keyword => lowerTitle.includes(keyword))) {
      return title;
    }

    // Convert news title to prediction format
    const symbol = extractCryptoSymbol(title);
    if (symbol) {
      return `${symbol} price prediction: ${title}`;
    }
    
    return `${title} - Market Analysis & Prediction`;
  };

  const extractCryptoSymbol = (title, summary = '') => {
    const text = `${title || ''} ${summary || ''}`.toUpperCase();
    const cryptoSymbols = [
      { names: ['BITCOIN', 'BTC'], symbol: 'BTC' },
      { names: ['ETHEREUM', 'ETH'], symbol: 'ETH' },
      { names: ['SOLANA', 'SOL'], symbol: 'SOL' },
      { names: ['CARDANO', 'ADA'], symbol: 'ADA' },
      { names: ['RIPPLE', 'XRP'], symbol: 'XRP' },
      { names: ['DOGECOIN', 'DOGE'], symbol: 'DOGE' },
      { names: ['POLYGON', 'MATIC'], symbol: 'MATIC' },
      { names: ['CHAINLINK', 'LINK'], symbol: 'LINK' },
      { names: ['AVALANCHE', 'AVAX'], symbol: 'AVAX' },
      { names: ['POLKADOT', 'DOT'], symbol: 'DOT' }
    ];

    for (const crypto of cryptoSymbols) {
      if (crypto.names.some(name => text.includes(name))) {
        return crypto.symbol;
      }
    }
    
    return 'BTC'; // Default fallback
  };

  const getCoinIcon = (symbol) => {
    const iconMap = {
      'BTC': 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png',
      'ETH': 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png',
      'SOL': 'https://coin-images.coingecko.com/coins/images/4128/large/solana.png',
      'ADA': 'https://coin-images.coingecko.com/coins/images/975/large/cardano.png',
      'XRP': 'https://coin-images.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
      'DOGE': 'https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png',
      'MATIC': 'https://coin-images.coingecko.com/coins/images/4713/large/matic-token-icon.png',
      'LINK': 'https://coin-images.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
      'AVAX': 'https://coin-images.coingecko.com/coins/images/12559/large/coin-round-red.png',
      'DOT': 'https://coin-images.coingecko.com/coins/images/12171/large/polkadot.png'
    };
    
    return iconMap[symbol] || iconMap['BTC'];
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

  const getFallbackData = () => [
    {
      id: 'fallback_1',
      title: "Bitcoin price prediction: BTC targets $120K amid institutional adoption",
      symbol: "BTC",
      image: "/api/placeholder/400/200",
      category: "PREDICTIONS",
      timeAgo: "2 hours ago",
      coinIcon: "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png",
      excerpt: "Technical analysis and institutional inflows suggest Bitcoin could reach new all-time highs this cycle.",
      featured: true
    },
    {
      id: 'fallback_2',
      title: "Ethereum price prediction: ETH eyes $5,000 breakout level",
      symbol: "ETH",
      image: "/api/placeholder/400/200",
      category: "PREDICTIONS",
      timeAgo: "4 hours ago",
      coinIcon: "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png",
      excerpt: "Network upgrades and DeFi growth continue to support bullish Ethereum price outlook for 2025.",
      featured: true
    },
    {
      id: 'fallback_3',
      title: "Solana price prediction: SOL shows resilience above $200 support",
      symbol: "SOL",
      image: "/api/placeholder/400/200",
      category: "PREDICTIONS",
      timeAgo: "6 hours ago",
      coinIcon: "https://coin-images.coingecko.com/coins/images/4128/large/solana.png",
      excerpt: "Ecosystem growth and technical indicators suggest continued upward momentum for Solana.",
      featured: true
    },
    {
      id: 'fallback_4',
      title: "Cardano price prediction: ADA prepares for major breakout",
      symbol: "ADA",
      image: "/api/placeholder/400/200",
      category: "PREDICTIONS",
      timeAgo: "8 hours ago",
      coinIcon: "https://coin-images.coingecko.com/coins/images/975/large/cardano.png",
      excerpt: "Smart contract developments and network upgrades position ADA for potential gains.",
      featured: false
    },
    {
      id: 'fallback_5',
      title: "XRP price prediction: Ripple shows bullish momentum",
      symbol: "XRP",
      image: "/api/placeholder/400/200",
      category: "PREDICTIONS",
      timeAgo: "10 hours ago",
      coinIcon: "https://coin-images.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
      excerpt: "Legal clarity and institutional adoption drive positive sentiment for XRP price action.",
      featured: false
    },
    {
      id: 'fallback_6',
      title: "Dogecoin price prediction: DOGE targets new highs",
      symbol: "DOGE",
      image: "/api/placeholder/400/200",
      category: "PREDICTIONS",
      timeAgo: "12 hours ago",
      coinIcon: "https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png",
      excerpt: "Community support and social media buzz continue to fuel Dogecoin's price potential.",
      featured: false
    }
  ];

  const formatPrice = (price) => {
    if (price >= 1) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatPercentage = (percent) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  // Truncate text to ensure consistent card heights
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="min-h-screen bg-dark-950">
      <Helmet>
        <title>Predictions - CryptoTracker | Crypto Price Forecasts</title>
        <meta name="description" content="Cryptocurrency predictions involve forecasting the future performance of digital assets based on various analytical methods and market trends." />
      </Helmet>

      {/* Price Ticker */}
      <div className="bg-dark-900 border-b border-dark-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
            {topCoins.slice(0, 8).map((coin) => (
              <div key={coin.coin_id || coin.id} className="flex items-center space-x-2 whitespace-nowrap">
                <img src={coin.image_url || coin.image} alt={coin.name} className="w-5 h-5" />
                <span className="text-gray-300 text-sm font-medium">{(coin.symbol || '').toUpperCase()}</span>
                <span className="text-white font-semibold">
                  {formatPrice(coin.current_price || 0)}
                </span>
                <span className={`text-sm ${
                  (coin.price_change_percentage_24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {formatPercentage(coin.price_change_percentage_24h || 0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">predictions</h1>
          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            <Link to="/" className="text-primary-400 hover:text-primary-300 transition-colors">Cryptocurrency</Link> predictions 
            are the topic of interest and speculation. They involve forecasting the future performance of digital assets based 
            on various analytical methods and market trends.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="container mx-auto px-4 mb-8">
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-400">{error}</p>
          </div>
        </div>
      )}

      {/* Today's Top Stories */}
      <div className="container mx-auto px-4 pb-12">
        <h2 className="text-3xl font-bold mb-8 text-white">latest price predictions</h2>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-dark-800 rounded-lg animate-pulse">
                <div className="bg-dark-700 h-48 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="bg-dark-700 h-4 rounded"></div>
                  <div className="bg-dark-700 h-4 rounded w-3/4"></div>
                  <div className="bg-dark-700 h-3 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {predictionArticles.map((article, index) => (
              <Link key={article.id} to={`/predictions/${article.id}`}>
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-dark-900 rounded-lg overflow-hidden hover:bg-dark-800 transition-all duration-300 border border-dark-800 hover:border-primary-500/50 group cursor-pointer h-full flex flex-col"
                >
                  {/* Image Container - Fixed Height */}
                  <div className="relative h-48 overflow-hidden">
                    {article.image && article.image !== "/api/placeholder/400/200" ? (
                      <img 
                        src={article.image} 
                        alt={article.title}
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
                      className="fallback-bg absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center"
                      style={{display: article.image && article.image !== "/api/placeholder/400/200" ? 'none' : 'flex'}}
                    >
                      <div className="text-center">
                        <img 
                          src={article.coinIcon} 
                          alt={article.symbol}
                          className="w-12 h-12 mx-auto mb-2 opacity-80"
                        />
                        <div className="text-white/60 text-sm font-medium">{article.symbol}</div>
                      </div>
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {article.category}
                      </span>
                    </div>

                    {/* Source */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-black/50 backdrop-blur-sm text-white/80 px-2 py-1 rounded text-xs">
                        {article.source || 'crypto.news'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content Container - Flexible */}
                  <div className="p-4 flex-1 flex flex-col">
                    {/* Title - Fixed Height */}
                    <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary-400 transition-colors text-white leading-tight min-h-[3.5rem]">
                      {truncateText(article.title, 80)}
                    </h3>
                    
                    {/* Meta Info */}
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center text-sm text-gray-400">
                        <img src={article.coinIcon} alt={article.symbol} className="w-4 h-4 mr-2" />
                        <span>{article.symbol}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <HiOutlineClock className="w-4 h-4 mr-1" />
                        <span>{article.timeAgo}</span>
                      </div>
                    </div>
                    
                    {/* Excerpt - Fixed Height */}
                    {article.excerpt && (
                      <p className="text-gray-400 text-sm line-clamp-3 flex-1 min-h-[4rem]">
                        {truncateText(article.excerpt, 120)}
                      </p>
                    )}
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        <div className="text-center mt-12">
          <button 
            onClick={fetchPredictionData}
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg transition-all duration-300 font-semibold hover:transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Loading...</span>
              </div>
            ) : (
              'Refresh Predictions'
            )}
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-500/10 border-t border-yellow-500/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-start space-x-4">
            <div className="text-yellow-400 text-2xl flex-shrink-0">⚠️</div>
            <div>
              <h4 className="font-bold text-yellow-300 mb-2">Investment Disclaimer</h4>
              <p className="text-yellow-200 text-sm leading-relaxed">
                These predictions are for informational purposes only and should not be considered as financial advice. 
                Cryptocurrency investments are highly volatile and carry significant risk. Always do your own research 
                before making investment decisions. Past performance does not indicate future results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predictions;