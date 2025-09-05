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

const MarketDetail = () => {
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
          title: articleData.title || 'Cryptocurrency Market Analysis',
          category: "MARKETS",
          timeAgo: getTimeAgo(articleData.published_at || articleData.created_at),
          publishedAt: formatPublishedDate(articleData.published_at || articleData.created_at),
          author: articleData.author || articleData.source || "Market Analyst",
          excerpt: articleData.summary || articleData.description || "Latest cryptocurrency market analysis and insights.",
          content: formatMarketContent(articleData),
          tags: extractMarketTags(articleData),
          readTime: calculateReadTime(articleData.content || articleData.summary),
          image: articleData.image_url || articleData.thumbnail,
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
            title: article.title,
            timeAgo: getTimeAgo(article.published_at || article.created_at),
            category: "MARKETS",
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

  const formatMarketContent = (articleData) => {
    if (!articleData) {
      return getMockContent();
    }

    const content = articleData.content || '';
    const summary = articleData.summary || articleData.description || '';
    const title = articleData.title || '';

    if (content && content.length > 200) {
      return `
        <div class="article-intro">
          <p class="lead text-lg font-medium mb-6">${summary}</p>
        </div>
        
        <div class="article-body">
          ${content.replace(/\n/g, '</p><p>')}
        </div>
      `;
    }

    // Generate market-focused content based on title analysis
    const isRally = title.toUpperCase().includes('RALLY') || title.toUpperCase().includes('SURGE') || title.toUpperCase().includes('PUMP');
    const isBearish = title.toUpperCase().includes('DUMP') || title.toUpperCase().includes('FALL') || title.toUpperCase().includes('DROP');
    
    return `
      <div class="article-intro">
        <p class="lead text-lg font-medium mb-6">${summary}</p>
      </div>
      
      <h2 class="text-2xl font-bold mb-4 text-white">Market Overview</h2>
      <p class="mb-6">Current market conditions show ${isRally ? 'strong bullish momentum with significant buying pressure' : isBearish ? 'bearish sentiment with selling pressure evident' : 'mixed signals as traders evaluate market conditions'}. Trading volumes have been ${isRally ? 'elevated' : 'moderate'} across major exchanges.</p>
      
      <h2 class="text-2xl font-bold mb-4 text-white">Technical Analysis</h2>
      <p class="mb-6">Key technical indicators suggest:</p>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li>${isRally ? 'RSI levels indicating strong momentum but approaching overbought territory' : 'Support levels being tested with potential for consolidation'}</li>
        <li>${isRally ? 'Moving averages providing strong support for continued upward movement' : 'Resistance levels acting as barriers to significant price advancement'}</li>
        <li>Volume patterns ${isRally ? 'confirming the bullish breakout' : 'suggesting cautious market sentiment'}</li>
        <li>Market structure remains ${isRally ? 'favorable for continued gains' : 'uncertain with mixed signals'}</li>
      </ul>
      
      <h2 class="text-2xl font-bold mb-4 text-white">Market Implications</h2>
      <p class="mb-6">These developments have broader implications for cryptocurrency markets, potentially influencing investor sentiment and trading strategies across the digital asset ecosystem.</p>
      
      <div class="disclaimer bg-gray-800/50 p-4 rounded-lg border-l-4 border-blue-500 mt-8">
        <p class="text-sm"><strong>Market Disclaimer:</strong> This analysis is for informational purposes only and should not be considered financial advice. Cryptocurrency markets are highly volatile and carry significant risks. Always conduct your own research and consider consulting with financial professionals before making investment decisions.</p>
      </div>
    `;
  };

  const getMockContent = () => {
    return `
      <div class="article-intro">
        <p class="lead text-lg font-medium mb-6">Comprehensive analysis of current cryptocurrency market conditions and their implications for investors and traders.</p>
      </div>
      
      <h2 class="text-2xl font-bold mb-4 text-white">Current Market Sentiment</h2>
      <p class="mb-6">The cryptocurrency market continues to show dynamic behavior with various factors influencing price movements and trading patterns across major digital assets.</p>
      
      <h2 class="text-2xl font-bold mb-4 text-white">Key Market Indicators</h2>
      <p class="mb-6">Several technical and fundamental indicators are providing insights into potential future market direction and investment opportunities.</p>
      
      <h2 class="text-2xl font-bold mb-4 text-white">Trading Outlook</h2>
      <p class="mb-6">Market participants are monitoring various metrics to gauge potential trading opportunities and risk management strategies.</p>
    `;
  };

  const extractMarketTags = (articleData) => {
    if (!articleData) return ['MARKETS', 'CRYPTO', 'ANALYSIS'];

    const text = `${articleData.title || ''} ${articleData.summary || ''} ${articleData.content || ''}`.toUpperCase();
    const marketTerms = [
      'BTC', 'BITCOIN', 'ETH', 'ETHEREUM', 'XRP', 'SOL', 'SOLANA',
      'AAVE', 'UNI', 'DEFI', 'NFT', 'RALLY', 'PUMP', 'SURGE',
      'DUMP', 'BEARISH', 'BULLISH', 'ANALYSIS', 'TECHNICAL',
      'SUPPORT', 'RESISTANCE', 'BREAKOUT', 'REVERSAL'
    ];
    
    const foundTags = marketTerms.filter(term => text.includes(term));
    return foundTags.length > 0 ? foundTags.slice(0, 4) : ['MARKETS', 'CRYPTO', 'ANALYSIS'];
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

  const getMockArticleById = (id) => {
    return {
      id: id,
      title: "Cryptocurrency Market Analysis: Current Trends and Outlook",
      category: "MARKETS",
      timeAgo: "2 hours ago",
      publishedAt: formatPublishedDate(new Date()),
      author: "Market Analyst",
      excerpt: "Comprehensive analysis of current cryptocurrency market conditions and their implications for investors.",
      content: getMockContent(),
      tags: ['MARKETS', 'CRYPTO', 'ANALYSIS', 'TRADING'],
      readTime: "4 min read"
    };
  };

  const getMockRelatedArticles = () => [
    {
      id: 'related_1',
      title: "Bitcoin Technical Analysis Shows Key Support Holding",
      timeAgo: "3 hours ago",
      category: "MARKETS"
    },
    {
      id: 'related_2',
      title: "Altcoin Market Sentiment Improves Amid Trading Volume Surge",
      timeAgo: "5 hours ago",
      category: "MARKETS"
    },
    {
      id: 'related_3',
      title: "DeFi Protocols Report Strong Weekly Performance",
      timeAgo: "1 day ago",
      category: "MARKETS"
    }
  ];

  const handleExternalLink = () => {
    if (article?.url) {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-300">Loading market analysis...</div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Article not found</h2>
          <p className="text-gray-400 mb-4">
            {error || 'The market analysis you are looking for could not be found.'}
          </p>
          <Link to="/markets" className="text-blue-400 hover:text-blue-300 underline">
            Back to Markets
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
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="min-h-screen bg-slate-950 text-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link 
              to="/markets" 
              className="inline-flex items-center text-gray-400 hover:text-blue-400 transition-colors duration-200"
            >
              <HiOutlineArrowLeft className="w-5 h-5 mr-2" />
              Back to Markets
            </Link>
          </motion.div>

          {/* Article Header */}
          <motion.header 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                {article.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-gray-100">
              {article.title}
            </h1>

            {/* Author and Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 flex items-center justify-center">
                  <HiOutlineUser className="w-4 h-4 text-white" />
                </div>
                <span>By {article.author}</span>
              </div>
              <div className="flex items-center">
                <HiOutlineClock className="w-4 h-4 mr-1" />
                <span>{article.publishedAt}</span>
              </div>
              <span>{article.readTime}</span>
            </div>

            {/* Featured Image */}
            <motion.div 
              className="relative mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="aspect-[16/10] rounded-xl overflow-hidden relative shadow-2xl">
                {article.image ? (
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                
                {/* Fallback gradient background */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600" 
                  style={{display: article.image ? 'none' : 'block'}}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-20 rounded-xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-xl"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <HiOutlineChartBar className="w-16 h-16 text-white/30" />
                  </div>
                </div>
                
                <div className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-md text-white rounded-full px-4 py-2 border border-white/20">
                  <span className="text-sm font-bold">{article.source || 'crypto.news'}</span>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex items-center space-x-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <button className="flex items-center space-x-2 text-gray-400 hover:text-red-500 transition-colors duration-200 group">
                <HiOutlineHeart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Like</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors duration-200 group">
                <HiOutlineBookmark className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Save</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-400 hover:text-green-500 transition-colors duration-200 group">
                <HiOutlineShare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Share</span>
              </button>
              {article.url && (
                <button 
                  onClick={handleExternalLink}
                  className="flex items-center space-x-2 text-gray-400 hover:text-purple-500 transition-colors duration-200 group"
                >
                  <HiOutlineExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Read Original</span>
                </button>
              )}
            </motion.div>
          </motion.header>

          {/* Article Excerpt */}
          {article.excerpt && (
            <motion.div 
              className="mb-8 p-6 bg-gray-800/50 rounded-lg border-l-4 border-blue-500"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p className="text-lg text-gray-300 italic">{article.excerpt}</p>
            </motion.div>
          )}

          {/* Article Content */}
          <motion.article 
            className="prose prose-invert prose-lg max-w-none mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div 
              dangerouslySetInnerHTML={{ __html: article.content }}
              className="article-content text-gray-300 leading-relaxed [&>h2]:text-white [&>h3]:text-white [&>h4]:text-white [&>p]:mb-4 [&>ul]:mb-6 [&>li]:mb-2"
            />
          </motion.article>

          {/* External Link Notice */}
          {article.url && (
            <motion.div 
              className="mb-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-blue-400 mb-1">Read the Full Analysis</h4>
                  <p className="text-sm text-gray-300">
                    Visit the original source for complete market analysis and additional insights.
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
            </motion.div>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <h3 className="text-lg font-semibold mb-3 text-gray-200">Market Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 cursor-pointer"
                  >
                    #{tag.toLowerCase().replace(' ', '')}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <motion.section 
              className="border-t border-gray-800 pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-100 flex items-center">
                <HiOutlineTrendingUp className="w-6 h-6 mr-2 text-blue-500" />
                Related Market Analysis
              </h3>
              <div className="grid gap-4 md:gap-6">
                {relatedArticles.map((relatedArticle, index) => (
                  <motion.div
                    key={relatedArticle.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <Link
                      to={`/markets/${relatedArticle.id}`}
                      className="block p-4 bg-gray-900/50 hover:bg-gray-800/50 rounded-lg transition-all duration-200 border border-gray-800 hover:border-blue-600/50 group"
                    >
                      <h4 className="font-semibold mb-2 text-gray-100 group-hover:text-blue-400 transition-colors">
                        {relatedArticle.title}
                      </h4>
                      <div className="text-sm text-gray-400 flex items-center gap-3">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                          {relatedArticle.category}
                        </span>
                        <span className="flex items-center">
                          <HiOutlineClock className="w-3 h-3 mr-1" />
                          {relatedArticle.timeAgo}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </>
  );
};

export default MarketDetail;