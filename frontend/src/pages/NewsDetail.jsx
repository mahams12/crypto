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
  HiOutlineExternalLink,
  HiOutlineNewspaper
} from 'react-icons/hi';
import { newsService } from '../services/api';

const NewsDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchArticleDetails();
      fetchRelatedArticles();
    }
  }, [id]);

  const fetchArticleDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if id is a fallback ID
      if (id.startsWith('fallback_') || id.startsWith('news_')) {
        setArticle(getMockArticleById(id));
        return;
      }

      let articleData = null;

      try {
        // Get all latest articles
        const latestResponse = await newsService.getLatestNews(50);
        
        if (latestResponse && latestResponse.success && latestResponse.data && Array.isArray(latestResponse.data)) {
          // First try to find exact match by ID
          articleData = latestResponse.data.find(article => 
            article.id?.toString() === id
          );

          // If no exact match, use id as index to get different articles for different IDs
          if (!articleData) {
            const articles = latestResponse.data;
            if (articles.length > 0) {
              let index = 0;
              if (!isNaN(id)) {
                index = parseInt(id) % articles.length;
              } else {
                const hash = id.split('').reduce((a, b) => {
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
          id: articleData.id || id,
          title: articleData.title || 'Cryptocurrency News Update',
          category: "NEWS",
          timeAgo: getTimeAgo(articleData.published_at || articleData.created_at),
          publishedAt: formatPublishedDate(articleData.published_at || articleData.created_at),
          author: articleData.author || articleData.source || "Crypto Reporter",
          excerpt: articleData.summary || articleData.description || "Latest cryptocurrency news and market developments.",
          content: formatNewsContent(articleData),
          tags: extractNewsTags(articleData),
          readTime: calculateReadTime(articleData.content || articleData.summary),
          image: articleData.image_url || articleData.thumbnail,
          url: articleData.url,
          source: articleData.source || "Crypto News"
        };
        
        setArticle(formattedArticle);
      } else {
        setArticle(getMockArticleById(id));
      }

    } catch (error) {
      console.error('Error fetching article:', error);
      setError('Failed to load article. Please try again later.');
      setArticle(getMockArticleById(id));
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async () => {
    try {
      const relatedData = await newsService.getLatestNews(6);

      if (relatedData && relatedData.success && relatedData.data && Array.isArray(relatedData.data)) {
        const formatted = relatedData.data
          .filter(article => article.id?.toString() !== id)
          .slice(0, 3)
          .map((article) => ({
            id: article.id,
            title: article.title,
            timeAgo: getTimeAgo(article.published_at || article.created_at),
            category: "NEWS",
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

  const formatNewsContent = (articleData) => {
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
          ${content.replace(/\n/g, '</p><p>').substring(0, 2000)}...
        </div>
        
        <h2 class="text-2xl font-bold mb-4 text-white">Market Impact</h2>
        <p class="mb-6">This development may have broader implications for the cryptocurrency market and investor sentiment.</p>
      `;
    }

    // Generate news-focused content based on title analysis
    const isBullish = title.toUpperCase().includes('HIGH') || title.toUpperCase().includes('SURGE') || title.toUpperCase().includes('ADOPTION');
    const isRegulatory = title.toUpperCase().includes('REGULATION') || title.toUpperCase().includes('SEC') || title.toUpperCase().includes('GOVERNMENT');
    
    return `
      <div class="article-intro">
        <p class="lead text-lg font-medium mb-6">${summary}</p>
      </div>
      
      <h2 class="text-2xl font-bold mb-4 text-white">Key Developments</h2>
      <p class="mb-6">${summary || 'Recent developments in the cryptocurrency space continue to shape market dynamics and investor sentiment.'}</p>
      
      <h2 class="text-2xl font-bold mb-4 text-white">Market Response</h2>
      <p class="mb-6">The cryptocurrency market has ${isBullish ? 'responded positively to these developments' : 'shown measured reaction to the news'}, with traders and investors closely monitoring the situation for potential impacts on digital asset prices.</p>
      
      ${isRegulatory ? `
        <h2 class="text-2xl font-bold mb-4 text-white">Regulatory Implications</h2>
        <p class="mb-6">These regulatory developments could have significant implications for the cryptocurrency industry, potentially affecting how digital assets are traded, stored, and regulated in the future.</p>
      ` : `
        <h2 class="text-2xl font-bold mb-4 text-white">Industry Impact</h2>
        <p class="mb-6">This news highlights the continued evolution of the cryptocurrency ecosystem and its growing integration with traditional financial markets.</p>
      `}
      
      <h2 class="text-2xl font-bold mb-4 text-white">What's Next?</h2>
      <p class="mb-6">Market participants will be watching closely for further developments and their potential impact on cryptocurrency adoption and market dynamics.</p>
      
      <div class="disclaimer bg-gray-800/50 p-4 rounded-lg border-l-4 border-green-500 mt-8">
        <p class="text-sm"><strong>News Disclaimer:</strong> This article is for informational purposes only and should not be considered financial advice. Cryptocurrency markets are highly volatile. Always conduct your own research before making investment decisions.</p>
      </div>
    `;
  };

  const getMockContent = () => {
    return `
      <div class="article-intro">
        <p class="lead text-lg font-medium mb-6">Breaking news in the cryptocurrency space with potential implications for digital asset markets and blockchain adoption.</p>
      </div>
      
      <h2 class="text-2xl font-bold mb-4 text-white">Breaking News</h2>
      <p class="mb-6">The cryptocurrency industry continues to evolve with new developments that could shape the future of digital assets and blockchain technology.</p>
      
      <h2 class="text-2xl font-bold mb-4 text-white">Key Details</h2>
      <p class="mb-6">Industry sources report significant developments that may influence market sentiment and trading activity across major cryptocurrency exchanges.</p>
      
      <h2 class="text-2xl font-bold mb-4 text-white">Market Implications</h2>
      <p class="mb-6">These developments could have broader implications for cryptocurrency adoption, regulatory frameworks, and institutional investment in digital assets.</p>
    `;
  };

  const extractNewsTags = (articleData) => {
    if (!articleData) return ['NEWS', 'CRYPTO', 'BREAKING'];

    const text = `${articleData.title || ''} ${articleData.summary || ''} ${articleData.content || ''}`.toUpperCase();
    const newsTerms = [
      'BTC', 'BITCOIN', 'ETH', 'ETHEREUM', 'XRP', 'SOL', 'SOLANA',
      'NEWS', 'BREAKING', 'CRYPTO', 'BLOCKCHAIN', 'ADOPTION',
      'REGULATION', 'SEC', 'GOVERNMENT', 'INSTITUTIONAL', 'ETF',
      'DEFI', 'NFT', 'METAVERSE', 'WEB3', 'MINING'
    ];
    
    const foundTags = newsTerms.filter(term => text.includes(term));
    return foundTags.length > 0 ? foundTags.slice(0, 4) : ['NEWS', 'CRYPTO', 'BREAKING'];
  };

  const calculateReadTime = (content) => {
    if (!content) return '3 min read';
    
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
      title: "Bitcoin Reaches New All-Time High Above $95,000",
      category: "NEWS",
      timeAgo: "1 hour ago",
      publishedAt: formatPublishedDate(new Date()),
      author: "Crypto Reporter",
      excerpt: "Bitcoin surges to unprecedented levels as institutional adoption accelerates and ETF inflows continue to drive market momentum.",
      content: getMockContent(),
      tags: ['NEWS', 'BITCOIN', 'ATH', 'BREAKING'],
      readTime: "3 min read"
    };
  };

  const getMockRelatedArticles = () => [
    {
      id: 'related_1',
      title: "Ethereum Layer 2 Solutions See Record Transaction Volume",
      timeAgo: "2 hours ago",
      category: "NEWS"
    },
    {
      id: 'related_2',
      title: "Major Bank Announces Cryptocurrency Trading Services",
      timeAgo: "4 hours ago",
      category: "NEWS"
    },
    {
      id: 'related_3',
      title: "Regulatory Clarity Boosts Institutional Crypto Adoption",
      timeAgo: "6 hours ago",
      category: "NEWS"
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-300">Loading news article...</div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Article not found</h2>
          <p className="text-gray-400 mb-4">
            {error || 'The news article you are looking for could not be found.'}
          </p>
          <Link to="/news" className="text-blue-400 hover:text-blue-300 underline">
            Back to News
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

      <div className="min-h-screen bg-dark-950 text-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link 
              to="/news" 
              className="inline-flex items-center text-gray-400 hover:text-blue-400 transition-colors duration-200"
            >
              <HiOutlineArrowLeft className="w-5 h-5 mr-2" />
              Back to News
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
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                {article.category}
              </span>
              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                LIVE
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-gray-100">
              {article.title}
            </h1>

            {/* Author and Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-3 flex items-center justify-center">
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
                  className="absolute inset-0 bg-gradient-to-br from-green-600 via-blue-600 to-purple-600" 
                  style={{display: article.image ? 'none' : 'block'}}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-20 rounded-xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-xl"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <HiOutlineNewspaper className="w-16 h-16 text-white/30" />
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
              className="mb-8 p-6 bg-gray-800/50 rounded-lg border-l-4 border-green-500"
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
                  <h4 className="font-semibold text-blue-400 mb-1">Read the Full Story</h4>
                  <p className="text-sm text-gray-300">
                    Visit the original source for complete news coverage and additional details.
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
              <h3 className="text-lg font-semibold mb-3 text-gray-200">News Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200 cursor-pointer"
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
                <HiOutlineNewspaper className="w-6 h-6 mr-2 text-green-500" />
                Related News
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
                      to={`/news/${relatedArticle.id}`}
                      className="block p-4 bg-gray-900/50 hover:bg-gray-800/50 rounded-lg transition-all duration-200 border border-gray-800 hover:border-green-600/50 group"
                    >
                      <h4 className="font-semibold mb-2 text-gray-100 group-hover:text-green-400 transition-colors">
                        {relatedArticle.title}
                      </h4>
                      <div className="text-sm text-gray-400 flex items-center gap-3">
                        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
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

export default NewsDetail;