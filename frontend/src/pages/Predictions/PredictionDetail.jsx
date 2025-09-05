import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  HiOutlineClock, 
  HiOutlineUser, 
  HiOutlineShare,
  HiOutlineHeart,
  HiOutlineBookmark,
  HiOutlineArrowLeft,
  HiOutlineTrendingUp,
  HiOutlineChartBar,
  HiOutlineExternalLink
} from 'react-icons/hi';
import { newsService } from '../../services/api';
import Loading from '../../components/Common/Loading';

const PredictionDetail = () => {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (articleId) {
      fetchArticleDetails();
      fetchRelatedArticles();
    }
  }, [articleId]);

  const fetchArticleDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if articleId is a fallback ID
      if (articleId.startsWith('fallback_')) {
        setArticle(getMockArticleById(articleId));
        return;
      }

      let articleData = null;

      try {
        // Get all latest articles
        const latestResponse = await newsService.getLatestNews(50);
        
        if (latestResponse && latestResponse.success && latestResponse.data && Array.isArray(latestResponse.data)) {
          // First try to find exact match by ID
          articleData = latestResponse.data.find(article => 
            article.id?.toString() === articleId
          );

          // If no exact match, use articleId as index to get different articles for different IDs
          if (!articleData) {
            const articles = latestResponse.data;
            if (articles.length > 0) {
              let index = 0;
              if (!isNaN(articleId)) {
                index = parseInt(articleId) % articles.length;
              } else {
                const hash = articleId.split('').reduce((a, b) => {
                  a = ((a << 5) - a) + b.charCodeAt(0);
                  return a & a;
                }, 0);
                index = Math.abs(hash) % articles.length;
              }
              articleData = articles[index];
            }
          }
        }

      } catch (apiError) {
        console.error('API fetch failed:', apiError);
        articleData = null;
      }

      if (articleData) {
        const formattedArticle = {
          id: articleData.id || articleId,
          title: formatPredictionTitle(articleData.title),
          symbol: extractCryptoSymbol(articleData.title, articleData.summary),
          category: "PREDICTIONS",
          timeAgo: getTimeAgo(articleData.published_at || articleData.created_at),
          publishedAt: formatPublishedDate(articleData.published_at || articleData.created_at),
          author: articleData.author || articleData.source || "Crypto Analyst",
          excerpt: articleData.summary || articleData.description || "Expert cryptocurrency price analysis and market predictions.",
          heroImage: articleData.image_url || articleData.thumbnail || "/api/placeholder/800/400",
          currentPrice: generateMockPrice(extractCryptoSymbol(articleData.title, articleData.summary)),
          priceChange: generateMockPriceChange(),
          marketCap: generateMockMarketCap(),
          volume24h: generateMockVolume(),
          summary: generatePredictionSummary(articleData),
          content: formatPredictionContent(articleData),
          tableOfContents: generateTableOfContents(articleData),
          readTime: calculateReadTime(articleData.content || articleData.summary),
          tags: extractPredictionTags(articleData),
          url: articleData.url,
          source: articleData.source || "Crypto News"
        };
        
        setArticle(formattedArticle);
      } else {
        setArticle(getMockArticleById(articleId));
      }

    } catch (error) {
      console.error('Error fetching article:', error);
      setError('Failed to load article. Please try again later.');
      setArticle(getMockArticleById(articleId));
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async () => {
    try {
      const relatedData = await newsService.getLatestNews(6);

      if (relatedData && relatedData.success && relatedData.data && Array.isArray(relatedData.data)) {
        const formatted = relatedData.data
          .filter(article => article.id?.toString() !== articleId)
          .slice(0, 3)
          .map((article) => ({
            id: article.id,
            title: formatPredictionTitle(article.title),
            symbol: extractCryptoSymbol(article.title, article.summary),
            timeAgo: getTimeAgo(article.published_at || article.created_at),
            category: "PREDICTIONS",
            url: article.url
          }));
        
        setRelatedArticles(formatted);
      } else {
        setRelatedArticles(getMockRelatedArticles());
      }
    } catch (error) {
      console.error('Error fetching related articles:', error);
      setRelatedArticles(getMockRelatedArticles());
    }
  };

  const formatPredictionTitle = (title) => {
    if (!title) return 'Cryptocurrency Price Prediction Analysis';
    
    const predictionKeywords = ['prediction', 'forecast', 'outlook', 'target', 'analysis'];
    const lowerTitle = title.toLowerCase();
    
    if (predictionKeywords.some(keyword => lowerTitle.includes(keyword))) {
      return title;
    }

    const symbol = extractCryptoSymbol(title);
    if (symbol) {
      return `${symbol} price prediction: ${title}`;
    }
    
    return `${title} - Price Analysis & Forecast`;
  };

  const extractCryptoSymbol = (title, summary = '') => {
    const text = `${title || ''} ${summary || ''}`.toUpperCase();
    const cryptoSymbols = [
      { names: ['BITCOIN', 'BTC'], symbol: 'BTC' },
      { names: ['ETHEREUM', 'ETH'], symbol: 'ETH' },
      { names: ['SOLANA', 'SOL'], symbol: 'SOL' },
      { names: ['CARDANO', 'ADA'], symbol: 'ADA' },
      { names: ['RIPPLE', 'XRP'], symbol: 'XRP' },
      { names: ['DOGECOIN', 'DOGE'], symbol: 'DOGE' }
    ];

    for (const crypto of cryptoSymbols) {
      if (crypto.names.some(name => text.includes(name))) {
        return crypto.symbol;
      }
    }
    
    return 'ETH'; // Default fallback
  };

  const generateMockPrice = (symbol) => {
    const prices = {
      'BTC': '$111,234.56',
      'ETH': '$4,311.43',
      'SOL': '$218.75',
      'ADA': '$1.23',
      'XRP': '$2.87',
      'DOGE': '$0.34'
    };
    return prices[symbol] || '$4,311.43';
  };

  const generateMockPriceChange = () => {
    const changes = ['+6.70%', '-2.34%', '+12.45%', '-0.89%', '+8.92%'];
    return changes[Math.floor(Math.random() * changes.length)];
  };

  const generateMockMarketCap = () => {
    const caps = ['$15,117,200,459', '$8,234,567,890', '$12,456,789,012', '$6,789,012,345'];
    return caps[Math.floor(Math.random() * caps.length)];
  };

  const generateMockVolume = () => {
    const volumes = ['$17,784,786,734', '$9,123,456,789', '$14,567,890,123', '$7,890,123,456'];
    return volumes[Math.floor(Math.random() * volumes.length)];
  };

  const generatePredictionSummary = (articleData) => {
    const symbol = extractCryptoSymbol(articleData.title, articleData.summary);
    return [
      {
        type: "Market Situation",
        text: `Current ${symbol} price action shows mixed signals with institutional interest remaining strong despite short-term volatility.`
      },
      {
        type: "Technical Outlook", 
        text: "Key support and resistance levels are being tested, with technical indicators suggesting potential for continued movement."
      },
      {
        type: "Risk Factors",
        text: "Market volatility and regulatory developments could impact price movements in the near term."
      },
      {
        type: "Price Target",
        text: "Technical analysis suggests potential upside targets based on current market structure and momentum indicators."
      }
    ];
  };

  const formatPredictionContent = (articleData) => {
    if (!articleData) {
      return getMockContent();
    }

    const content = articleData.content || '';
    const summary = articleData.summary || articleData.description || '';
    const symbol = extractCryptoSymbol(articleData.title, articleData.summary);

    if (content && content.length > 200) {
      return `
        <p>${summary}</p>
        
        <h2>Current ${symbol} Price Action</h2>
        <div class="chart-container mb-6">
          <div class="w-full h-64 bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg flex items-center justify-center">
            <span class="text-white/60">Price Chart Placeholder</span>
          </div>
          <p class="text-sm text-gray-400 mt-2">TradingView Chart</p>
        </div>
        
        <div class="article-body">
          ${content.replace(/\n/g, '</p><p>').substring(0, 1000)}...
        </div>
        
        <h2>${symbol} Price Catalysts</h2>
        <p>Several factors are contributing to the current market dynamics and could influence future price movements.</p>
      `;
    }

    return `
      <p>${summary}</p>
      
      <h2>Current ${symbol} Price Action</h2>
      <div class="chart-container mb-6">
        <div class="w-full h-64 bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg flex items-center justify-center">
          <span class="text-white/60">${symbol} Price Chart</span>
        </div>
        <p class="text-sm text-gray-400 mt-2">TradingView Chart</p>
      </div>
      
      <p>${symbol} is currently experiencing dynamic price action with various market forces influencing its trajectory. Technical analysis reveals key levels that traders and investors are monitoring closely.</p>
      
      <h2>${symbol} Price Catalysts</h2>
      <p>Multiple factors are supporting the current market sentiment, including technological developments, institutional adoption, and broader cryptocurrency market trends.</p>
      
      <h2>What Could Drive ${symbol} Higher?</h2>
      <p>Several bullish catalysts could propel ${symbol} to new price levels, including increased adoption, positive regulatory developments, and continued institutional investment.</p>
      
      <h2>${symbol} Price Prediction Analysis</h2>
      <div class="chart-container mb-6">
        <div class="w-full h-72 bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg flex items-center justify-center">
          <span class="text-white/60">${symbol} Technical Analysis Chart</span>
        </div>
        <p class="text-sm text-gray-400 mt-2">TradingView Chart - ${symbol} Support & Resistance Levels</p>
      </div>
      
      <p>Based on current market structure and technical indicators, ${symbol} shows potential for continued price movement. Key support and resistance levels will be crucial in determining the next major directional move.</p>
      
      <div class="bg-gray-700 p-4 rounded-lg my-6 border border-gray-600">
        <p class="text-sm text-gray-300">
          <span class="font-semibold">Disclaimer:</span> This analysis is for educational purposes only and does not constitute financial advice. Cryptocurrency markets are highly volatile and carry significant risks.
        </p>
      </div>
    `;
  };

  const getMockContent = () => {
    return `
      <p>Expert analysis on current cryptocurrency market conditions and price predictions based on technical and fundamental analysis.</p>
      
      <h2>Current Market Analysis</h2>
      <div class="chart-container mb-6">
        <div class="w-full h-64 bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg flex items-center justify-center">
          <span class="text-white/60">Price Chart Analysis</span>
        </div>
        <p class="text-sm text-gray-400 mt-2">Technical Analysis Chart</p>
      </div>
      
      <p>The cryptocurrency market continues to show dynamic behavior with various technical indicators providing insights into potential price movements.</p>
      
      <h2>Price Prediction Methodology</h2>
      <p>Our analysis combines technical indicators, market sentiment, and fundamental factors to provide comprehensive price predictions.</p>
    `;
  };

  const generateTableOfContents = (articleData) => {
    const symbol = extractCryptoSymbol(articleData.title, articleData.summary);
    return [
      { title: `Current ${symbol} price action`, id: `current-${symbol.toLowerCase()}-price-action` },
      { title: `${symbol} price catalysts`, id: `${symbol.toLowerCase()}-price-catalysts` },
      { title: `What could drive ${symbol} higher?`, id: `what-could-drive-${symbol.toLowerCase()}-higher` },
      { title: `${symbol} price prediction analysis`, id: `${symbol.toLowerCase()}-price-prediction-analysis` }
    ];
  };

  const extractPredictionTags = (articleData) => {
    if (!articleData) return ['prediction', 'crypto', 'analysis'];

    const text = `${articleData.title || ''} ${articleData.summary || ''} ${articleData.content || ''}`.toLowerCase();
    const predictionTerms = [
      'prediction', 'forecast', 'analysis', 'technical', 'support', 'resistance',
      'bullish', 'bearish', 'target', 'breakout', 'consolidation'
    ];
    
    const symbol = extractCryptoSymbol(articleData.title, articleData.summary).toLowerCase();
    const foundTags = predictionTerms.filter(term => text.includes(term));
    
    return [symbol, ...foundTags].slice(0, 4);
  };

  const calculateReadTime = (content) => {
    if (!content) return '4 min read';
    
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${Math.max(1, readTime)} min read`;
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

  const formatPublishedDate = (publishedAt) => {
    if (!publishedAt) return new Date().toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
    });

    return new Date(publishedAt).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', 
      hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
    });
  };

  const getCoinIcon = (symbol) => {
    const iconMap = {
      'BTC': 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png',
      'ETH': 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png',
      'SOL': 'https://coin-images.coingecko.com/coins/images/4128/large/solana.png',
      'ADA': 'https://coin-images.coingecko.com/coins/images/975/large/cardano.png',
      'XRP': 'https://coin-images.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
      'DOGE': 'https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png'
    };
    
    return iconMap[symbol] || iconMap['ETH'];
  };

  const getMockArticleById = (id) => {
    return {
      id: id,
      title: "Ethereum price prediction: ETH targets key resistance levels",
      symbol: "ETH",
      category: "PREDICTIONS",
      timeAgo: "2 hours ago",
      publishedAt: formatPublishedDate(new Date()),
      author: "Crypto Analyst",
      excerpt: "Technical analysis reveals potential upside targets for Ethereum amid current market conditions.",
      heroImage: "/api/placeholder/800/400",
      currentPrice: "$4,311.43",
      priceChange: "+6.70%",
      marketCap: "$15,117,200,459",
      volume24h: "$17,784,786,734",
      summary: generatePredictionSummary({ title: "Ethereum", summary: "price analysis" }),
      content: getMockContent(),
      tableOfContents: [
        { title: "Current ETH price action", id: "current-eth-price-action" },
        { title: "ETH price catalysts", id: "eth-price-catalysts" },
        { title: "ETH price prediction analysis", id: "eth-price-prediction-analysis" }
      ],
      readTime: "4 min read",
      tags: ["eth", "ethereum", "prediction", "analysis"]
    };
  };

  const getMockRelatedArticles = () => [
    {
      id: 'related_1',
      title: "Bitcoin price prediction: BTC eyes $120K psychological level",
      symbol: "BTC",
      timeAgo: "3 hours ago",
      category: "PREDICTIONS"
    },
    {
      id: 'related_2', 
      title: "Solana price prediction: SOL shows bullish momentum above $200",
      symbol: "SOL",
      timeAgo: "5 hours ago",
      category: "PREDICTIONS"
    },
    {
      id: 'related_3',
      title: "Cardano price prediction: ADA consolidates before potential breakout",
      symbol: "ADA",
      timeAgo: "1 day ago",
      category: "PREDICTIONS"
    }
  ];

  const handleExternalLink = () => {
    if (article?.url) {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Loading size="lg" text="Loading prediction analysis..." />
      </div>
    );
  }

  if (error && !article) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Error Loading Article</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Link to="/predictions" className="text-blue-400 hover:text-blue-300 underline">
            Back to Predictions
          </Link>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Article not found</h2>
          <Link to="/predictions" className="text-blue-400 hover:text-blue-300">
            Back to Predictions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.title} | crypto.news</title>
        <meta name="description" content={article.excerpt} />
      </Helmet>

      <div className="min-h-screen bg-dark-950 text-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          <div className="mb-6">
            <Link 
              to="/predictions" 
              className="inline-flex items-center text-gray-400 hover:text-blue-400 transition-colors"
            >
              <HiOutlineArrowLeft className="w-5 h-5 mr-2" />
              Back to Predictions
            </Link>
          </div>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                {article.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Author and Meta */}
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-500 rounded-full mr-2"></div>
                <span>By {article.author}</span>
              </div>
              <span>{article.publishedAt}</span>
              <span>{article.readTime}</span>
            </div>

            {/* Price Info Sidebar */}
            <div className="bg-gray-800 rounded-lg p-4 mb-6 md:float-right md:ml-6 md:w-72">
              <div className="flex items-center mb-3">
                <img 
                  src={getCoinIcon(article.symbol)} 
                  alt={article.symbol}
                  className="w-6 h-6 mr-2"
                />
                <span className="font-semibold text-gray-300">{article.symbol.toLowerCase()}</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{article.currentPrice}</div>
              <div className={`text-lg font-semibold mb-4 ${
                article.priceChange.startsWith('+') ? 'text-green-400' : 'text-red-400'
              }`}>
                {article.priceChange}
              </div>
              <div className="text-sm text-gray-400 space-y-1">
                <div>24h Volume: <span className="text-gray-300">{article.volume24h}</span></div>
                <div>Market Cap: <span className="text-gray-300">{article.marketCap}</span></div>
                <div className="flex gap-4 mt-2">
                  <span>24h 📉 -0.28%</span>
                  <span>7d 📉 -5.07%</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative mb-8 clear-both">
              <div className="aspect-[16/10] rounded-lg overflow-hidden relative">
                {article.heroImage && article.heroImage !== "/api/placeholder/800/400" ? (
                  <img 
                    src={article.heroImage} 
                    alt={article.title}
                    className="w-full h-full object-cover opacity-80"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                
                {/* Fallback gradient background */}
                <div 
                  className="fallback-bg absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center"
                  style={{display: article.heroImage && article.heroImage !== "/api/placeholder/800/400" ? 'none' : 'flex'}}
                >
                  <img 
                    src={getCoinIcon(article.symbol)} 
                    alt={article.symbol}
                    className="w-32 h-32 opacity-90"
                  />
                </div>
                
                <div className="absolute bottom-4 right-4 bg-blue-500 text-white rounded-full px-4 py-2">
                  <span className="text-sm font-bold">{article.source || 'crypto.news'}</span>
                </div>
              </div>
            </div>

            {/* Summary Section */}
            {article.summary && (
              <div className="bg-gray-800 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  Summary
                </h3>
                <div className="space-y-3">
                  {article.summary.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium text-blue-400">{item.type}:</span>
                        <span className="ml-1 text-gray-300">{item.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Table of Contents */}
            {article.tableOfContents && (
              <div className="bg-gray-800 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Table of Contents</h3>
                <ul className="space-y-2">
                  {article.tableOfContents.map((item, index) => (
                    <li key={index}>
                      <a 
                        href={`#${item.id}`}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 mb-8">
              <button className="flex items-center space-x-2 text-gray-400 hover:text-red-500 transition-colors">
                <HiOutlineHeart className="w-5 h-5" />
                <span className="text-sm">Like</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors">
                <HiOutlineBookmark className="w-5 h-5" />
                <span className="text-sm">Save</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-400 hover:text-green-500 transition-colors">
                <HiOutlineShare className="w-5 h-5" />
                <span className="text-sm">Share</span>
              </button>
              {article.url && (
                <button 
                  onClick={handleExternalLink}
                  className="flex items-center space-x-2 text-gray-400 hover:text-purple-500 transition-colors"
                >
                  <HiOutlineExternalLink className="w-5 h-5" />
                  <span className="text-sm">Read Original</span>
                </button>
              )}
            </div>
          </header>

          {/* Article Content */}
          <article className="prose prose-invert prose-lg max-w-none mb-12">
            <div 
              dangerouslySetInnerHTML={{ __html: article.content }}
              className="article-content text-gray-300 leading-relaxed [&>h2]:text-white [&>h3]:text-white [&>h4]:text-white [&>p]:mb-4"
            />
          </article>

          {/* External Link Notice */}
          {article.url && (
            <div className="mb-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-blue-400 mb-1">Read Full Analysis</h4>
                  <p className="text-sm text-gray-300">
                    Visit the original source for complete price analysis and additional insights.
                  </p>
                </div>
                <button 
                  onClick={handleExternalLink}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <span>Read More</span>
                  <HiOutlineExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Tags */}
          {article.tags && (
            <div className="mb-12">
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="border-t border-gray-800 pt-8">
              <h3 className="text-2xl font-bold mb-6">You might also like:</h3>
              <div className="space-y-4">
                {relatedArticles.map((relatedArticle) => (
                  <div
                    key={relatedArticle.id}
                    className="block p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Link
                      to={`/predictions/${relatedArticle.id}`}
                      className="block hover:text-blue-400 transition-colors"
                    >
                      <h4 className="font-semibold mb-1">{relatedArticle.title}</h4>
                      <div className="text-sm text-gray-400">
                        <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs mr-2">
                          {relatedArticle.category}
                        </span>
                        <span>{relatedArticle.timeAgo}</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default PredictionDetail;