import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  HiOutlineClock, 
  HiOutlineUser, 
  HiOutlineShare,
  HiOutlineHeart,
  HiOutlineBookmark,
  HiOutlineArrowLeft,
  HiOutlineExternalLink
} from 'react-icons/hi';
import { newsService } from '../../services/api';

const OpinionDetail = () => {
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
              // Convert articleId to a number to use as index, with fallback logic
              let index = 0;
              if (!isNaN(articleId)) {
                index = parseInt(articleId) % articles.length;
              } else {
                // For non-numeric IDs, create a pseudo-random index based on the ID
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
          category: "OPINION",
          timeAgo: getTimeAgo(articleData.published_at || articleData.created_at),
          publishedAt: formatPublishedDate(articleData.published_at || articleData.created_at),
          author: articleData.author || articleData.source || "Crypto Expert",
          excerpt: articleData.summary || articleData.description || "Expert analysis on cryptocurrency market trends and developments.",
          content: formatArticleContent(articleData),
          tags: extractTags(articleData),
          readTime: calculateReadTime(articleData.content || articleData.summary),
          image: articleData.image_url || articleData.thumbnail,
          url: articleData.url,
          source: articleData.source || "Crypto News"
        };
        
        setArticle(formattedArticle);
      } else {
        // Create unique mock article based on ID if no API data
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
            category: "OPINION",
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

  const formatArticleContent = (articleData) => {
    if (!articleData) {
      return getMockContent();
    }

    const content = articleData.content || '';
    const summary = articleData.summary || articleData.description || '';

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

    return `
      <div class="article-intro">
        <p class="lead text-lg font-medium mb-6">${summary}</p>
      </div>
      
      <h2 class="text-2xl font-bold mb-4 text-white">Market Analysis</h2>
      <p class="mb-6">The cryptocurrency market continues to evolve with new developments in blockchain technology, regulatory frameworks, and institutional adoption affecting investor sentiment and market dynamics.</p>
      
      <h2 class="text-2xl font-bold mb-4 text-white">Key Insights</h2>
      <p class="mb-6">Industry experts are closely monitoring various factors that could influence cryptocurrency prices and market trends in the coming months.</p>
      
      <h2 class="text-2xl font-bold mb-4 text-white">Investment Implications</h2>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li>Market volatility requires careful risk management strategies</li>
        <li>Regulatory developments continue to shape institutional adoption</li>
        <li>Technological innovations drive new investment opportunities</li>
        <li>Global economic factors influence cryptocurrency market sentiment</li>
      </ul>
      
      <div class="disclaimer bg-gray-800/50 p-4 rounded-lg border-l-4 border-yellow-500 mt-8">
        <p class="text-sm"><strong>Disclaimer:</strong> This analysis is for educational purposes only and should not be considered financial advice. Cryptocurrency investments carry significant risks. Always conduct thorough research and consider consulting with financial professionals before making investment decisions.</p>
      </div>
    `;
  };

  const getMockContent = () => {
    return `
      <div class="article-intro">
        <p class="lead text-lg font-medium mb-6">Expert analysis on current cryptocurrency market trends and future outlook for digital assets.</p>
      </div>
      
      <h2 class="text-2xl font-bold mb-4 text-white">Current Market Landscape</h2>
      <p class="mb-6">The cryptocurrency market has shown remarkable resilience and growth over recent months, with institutional adoption continuing to drive mainstream acceptance of digital assets.</p>
      
      <h2 class="text-2xl font-bold mb-4 text-white">Key Market Drivers</h2>
      <p class="mb-6">Several factors are contributing to the current market dynamics, including regulatory clarity, technological innovations, and changing investor sentiment toward digital assets.</p>
      
      <h2 class="text-2xl font-bold mb-4 text-white">Future Outlook</h2>
      <p class="mb-6">As the cryptocurrency ecosystem matures, we can expect continued evolution in both technology and regulation, creating new opportunities and challenges for investors.</p>
    `;
  };

  const extractTags = (articleData) => {
    if (!articleData) return ['CRYPTO', 'ANALYSIS', 'OPINION'];

    const text = `${articleData.title || ''} ${articleData.summary || ''} ${articleData.content || ''}`.toUpperCase();
    const commonCryptoTerms = [
      'BTC', 'BITCOIN', 'ETH', 'ETHEREUM', 'DEFI', 'NFT', 'BLOCKCHAIN', 
      'CRYPTO', 'ANALYSIS', 'OPINION', 'MARKET', 'TRADING'
    ];
    
    const foundTags = commonCryptoTerms.filter(term => text.includes(term));
    return foundTags.length > 0 ? foundTags.slice(0, 4) : ['CRYPTO', 'ANALYSIS', 'OPINION'];
  };

  const calculateReadTime = (content) => {
    if (!content) return '5 min read';
    
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

    if (diffHours < 1) return 'Less than an hour ago';
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
      title: "Cryptocurrency Market Analysis: Key Trends to Watch in 2025",
      category: "OPINION",
      timeAgo: "3 hours ago",
      publishedAt: formatPublishedDate(new Date()),
      author: "Crypto Expert",
      excerpt: "Expert analysis on current cryptocurrency market trends and future outlook for digital assets in the evolving financial landscape.",
      content: getMockContent(),
      tags: ['CRYPTO', 'ANALYSIS', 'MARKET', 'OPINION'],
      readTime: "6 min read"
    };
  };

  const getMockRelatedArticles = () => [
    {
      id: 'related_1',
      title: "DeFi Protocols Show Strong Growth Despite Market Volatility",
      timeAgo: "5 hours ago",
      category: "OPINION"
    },
    {
      id: 'related_2',
      title: "Institutional Bitcoin Adoption Reaches New Milestones",
      timeAgo: "1 day ago",
      category: "OPINION"
    },
    {
      id: 'related_3',
      title: "Ethereum Network Upgrades Drive Developer Activity",
      timeAgo: "2 days ago",
      category: "OPINION"
    }
  ];

  const handleExternalLink = () => {
    if (article?.url) {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 text-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading article...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-dark-950 text-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Article not found</h2>
              <p className="text-gray-400 mb-4">
                {error || 'The article you are looking for could not be found.'}
              </p>
              <Link to="/opinion" className="text-blue-400 hover:text-blue-300">
                Back to Opinion
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/opinion" 
            className="inline-flex items-center text-gray-400 hover:text-blue-400 transition-colors"
          >
            <HiOutlineArrowLeft className="w-5 h-5 mr-2" />
            Back to Opinion
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <span className="bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {article.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Author and Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-pink-600 rounded-full mr-2"></div>
              <span>By {article.author}</span>
            </div>
            <span>{article.publishedAt}</span>
            <span>{article.readTime}</span>
          </div>

          {/* Featured Image */}
          <div className="relative mb-8">
            <div className="aspect-[16/10] rounded-lg overflow-hidden relative">
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
                className="absolute inset-0 bg-gradient-to-br from-pink-600 via-purple-600 to-blue-600" 
                style={{display: article.image ? 'none' : 'block'}}
              >
                <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>
              </div>
              
              <div className="absolute bottom-4 right-4 bg-blue-500 text-white rounded-full px-4 py-2">
                <span className="text-sm font-bold">{article.source || 'crypto.news'}</span>
              </div>
            </div>
          </div>

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

        {/* Article Excerpt */}
        {article.excerpt && (
          <div className="mb-8 p-6 bg-gray-800/50 rounded-lg border-l-4 border-pink-600">
            <p className="text-lg text-gray-300 italic">{article.excerpt}</p>
          </div>
        )}

        {/* Article Content */}
        <article className="prose prose-invert prose-lg max-w-none mb-12">
          <div 
            dangerouslySetInnerHTML={{ __html: article.content }}
            className="article-content text-gray-300 leading-relaxed [&>h2]:text-white [&>h3]:text-white [&>h4]:text-white [&>p]:mb-4 [&>ul]:mb-6 [&>li]:mb-2"
          />
        </article>

        {/* External Link Notice */}
        {article.url && (
          <div className="mb-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-blue-400 mb-1">Read the Full Article</h4>
                <p className="text-sm text-gray-300">
                  Visit the original source for the complete article and additional details.
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
        {article.tags && article.tags.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-pink-600 text-white px-3 py-1 rounded text-sm"
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
            <h3 className="text-2xl font-bold mb-6">Related Opinions</h3>
            <div className="space-y-4">
              {relatedArticles.map((relatedArticle) => (
                <div
                  key={relatedArticle.id}
                  className="block p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Link
                    to={`/opinion/${relatedArticle.id}`}
                    className="block hover:text-blue-400 transition-colors"
                  >
                    <h4 className="font-semibold mb-1">{relatedArticle.title}</h4>
                    <div className="text-sm text-gray-400">
                      <span className="bg-pink-600 text-white px-2 py-1 rounded text-xs mr-2">
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
  );
};

export default OpinionDetail;