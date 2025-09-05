import api from './api';

/**
 * News-specific service functions
 * Handles all news-related API calls and data transformations
 */
class NewsServiceClass {

  /**
   * Get paginated cryptocurrency news
   */
  async getNews(page = 1, limit = 20, category = null) {
    try {
      const response = await api.get('/api/v1/news', {
        params: { page, limit, category }
      });
      return this.transformNewsResponse(response.data);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch news');
    }
  }

  /**
   * Get latest cryptocurrency news
   */
  async getLatestNews(limit = 10) {
    try {
      const response = await api.get('/api/v1/news/latest', {
        params: { limit }
      });
      return this.transformLatestNewsResponse(response.data);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch latest news');
    }
  }

  /**
   * Get news by specific category
   */
  async getNewsByCategory(category, page = 1, limit = 20) {
    try {
      const response = await api.get(`/api/v1/news/category/${category}`, {
        params: { page, limit }
      });
      return this.transformNewsResponse(response.data);
    } catch (error) {
      throw this.handleError(error, `Failed to fetch news for category ${category}`);
    }
  }

  /**
   * Get available news categories
   */
  async getNewsCategories() {
    try {
      const response = await api.get('/api/v1/news/categories');
      return this.transformCategoriesResponse(response.data);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch news categories');
    }
  }

  /**
   * Search news articles
   */
  async searchNews(query, page = 1, limit = 20) {
    try {
      // Since the backend doesn't have a dedicated search endpoint for news,
      // we'll get all news and filter on the client side
      const response = await this.getNews(page, limit);
      
      if (!query || query.length < 2) {
        return response;
      }

      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
      const filteredNews = response.data.filter(article => {
        const searchContent = `${article.title} ${article.description || ''}`.toLowerCase();
        return searchTerms.some(term => searchContent.includes(term));
      });

      return {
        ...response,
        data: filteredNews,
        total_count: filteredNews.length,
        total_pages: Math.ceil(filteredNews.length / limit)
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to search news');
    }
  }

  /**
   * Get trending news based on engagement metrics
   */
  async getTrendingNews(limit = 5) {
    try {
      // Get recent news and simulate trending based on keywords
      const response = await this.getLatestNews(50);
      const articles = response.data || [];

      // Score articles based on trending keywords
      const trendingKeywords = [
        'bitcoin', 'ethereum', 'crypto', 'defi', 'nft', 'blockchain',
        'price', 'surge', 'rally', 'bull', 'market', 'trading'
      ];

      const scoredArticles = articles.map(article => {
        const content = `${article.title} ${article.description || ''}`.toLowerCase();
        const score = trendingKeywords.reduce((acc, keyword) => {
          return acc + (content.includes(keyword) ? 1 : 0);
        }, 0);
        
        // Boost score for recent articles
        const hoursOld = (Date.now() - new Date(article.published_at)) / (1000 * 60 * 60);
        const recencyBoost = Math.max(0, 24 - hoursOld) / 24;
        
        return {
          ...article,
          trendingScore: score + recencyBoost
        };
      });

      const trending = scoredArticles
        .sort((a, b) => b.trendingScore - a.trendingScore)
        .slice(0, limit)
        .map(({ trendingScore, ...article }) => article); // Remove score from final result

      return {
        success: true,
        data: trending,
        total_count: trending.length
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch trending news');
    }
  }

  /**
   * Get news analytics and statistics
   */
  async getNewsAnalytics() {
    try {
      const [categoriesResponse, latestResponse] = await Promise.all([
        this.getNewsCategories(),
        this.getLatestNews(100)
      ]);

      const categories = categoriesResponse.data?.categories || [];
      const recentNews = latestResponse.data || [];

      // Calculate analytics
      const totalArticles = categories.reduce((sum, cat) => sum + (cat.count || 0), 0);
      
      // Articles from last 24 hours
      const last24h = recentNews.filter(article => {
        const articleDate = new Date(article.published_at);
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return articleDate >= yesterday;
      });

      // Most active sources
      const sourceCount = recentNews.reduce((acc, article) => {
        const source = article.source || 'Unknown';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {});

      const topSources = Object.entries(sourceCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([source, count]) => ({ source, count }));

      // Category distribution
      const categoryDistribution = categories.map(cat => ({
        name: cat.name,
        count: cat.count,
        percentage: totalArticles > 0 ? ((cat.count / totalArticles) * 100).toFixed(1) : 0
      }));

      return {
        success: true,
        data: {
          totalArticles,
          last24hCount: last24h.length,
          totalCategories: categories.length,
          topSources,
          categoryDistribution,
          lastUpdated: new Date().toISOString()
        }
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch news analytics');
    }
  }

  /**
   * Get news feed for specific coins
   */
  async getCoinNews(coinSymbol, limit = 10) {
    try {
      const allNews = await this.getLatestNews(50);
      const articles = allNews.data || [];

      // Filter news related to the specific coin
      const coinKeywords = [
        coinSymbol.toLowerCase(),
        this.getCoinKeywords(coinSymbol)
      ].flat().filter(Boolean);

      const coinNews = articles.filter(article => {
        const content = `${article.title} ${article.description || ''}`.toLowerCase();
        return coinKeywords.some(keyword => content.includes(keyword));
      }).slice(0, limit);

      return {
        success: true,
        data: coinNews,
        total_count: coinNews.length
      };
    } catch (error) {
      throw this.handleError(error, `Failed to fetch news for ${coinSymbol}`);
    }
  }

  /**
   * Get related news for a specific article
   */
  async getRelatedNews(articleId, limit = 5) {
    try {
      // Since we don't have article IDs, we'll simulate related news
      // In a real implementation, this would use article similarity algorithms
      const response = await this.getLatestNews(20);
      const articles = response.data || [];
      
      // Return random articles as "related" (placeholder implementation)
      const related = articles
        .sort(() => 0.5 - Math.random())
        .slice(0, limit);

      return {
        success: true,
        data: related,
        total_count: related.length
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch related news');
    }
  }

  /**
   * Bookmark/save article (client-side storage)
   */
  async bookmarkArticle(article, userId = 'default') {
    try {
      const bookmarks = this.getBookmarks(userId);
      const isAlreadyBookmarked = bookmarks.some(b => b.url === article.url);
      
      if (!isAlreadyBookmarked) {
        const updatedBookmarks = [
          {
            ...article,
            bookmarkedAt: new Date().toISOString()
          },
          ...bookmarks
        ].slice(0, 100); // Limit to 100 bookmarks
        
        localStorage.setItem(`news_bookmarks_${userId}`, JSON.stringify(updatedBookmarks));
      }
      
      return { success: true, bookmarked: !isAlreadyBookmarked };
    } catch (error) {
      throw this.handleError(error, 'Failed to bookmark article');
    }
  }

  /**
   * Get user's bookmarked articles
   */
  getBookmarks(userId = 'default') {
    try {
      const bookmarks = localStorage.getItem(`news_bookmarks_${userId}`);
      return bookmarks ? JSON.parse(bookmarks) : [];
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      return [];
    }
  }

  /**
   * Remove bookmark
   */
  async removeBookmark(articleUrl, userId = 'default') {
    try {
      const bookmarks = this.getBookmarks(userId);
      const updatedBookmarks = bookmarks.filter(b => b.url !== articleUrl);
      localStorage.setItem(`news_bookmarks_${userId}`, JSON.stringify(updatedBookmarks));
      return { success: true };
    } catch (error) {
      throw this.handleError(error, 'Failed to remove bookmark');
    }
  }

  // Data transformation methods
  transformNewsResponse(response) {
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Invalid news response format');
    }
    return response.data;
  }

  transformLatestNewsResponse(response) {
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Invalid latest news response format');
    }
    return { data: response.data };
  }

  transformCategoriesResponse(response) {
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Invalid categories response format');
    }
    return response.data;
  }

  // Utility methods
  getCoinKeywords(symbol) {
    const keywords = {
      'btc': ['bitcoin'],
      'eth': ['ethereum'],
      'ada': ['cardano'],
      'dot': ['polkadot'],
      'link': ['chainlink'],
      'uni': ['uniswap'],
      'ltc': ['litecoin'],
      'bch': ['bitcoin cash'],
      'xlm': ['stellar'],
      'xrp': ['ripple'],
      'bnb': ['binance'],
      'sol': ['solana'],
      'matic': ['polygon'],
      'avax': ['avalanche'],
      'atom': ['cosmos']
    };
    
    return keywords[symbol.toLowerCase()] || [];
  }

  formatNewsArticle(article) {
    return {
      ...article,
      title: article.title?.trim() || 'Untitled',
      description: article.description?.trim() || null,
      published_at: article.published_at || new Date().toISOString(),
      source: article.source || 'Unknown Source',
      category: article.category || 'general',
      image_url: article.image_url || article.urlToImage || null,
      url: article.url || '#'
    };
  }

  // Error handling
  handleError(error, defaultMessage) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.detail || defaultMessage;
      
      switch (status) {
        case 400:
          return new Error(`Bad Request: ${message}`);
        case 404:
          return new Error(`Not Found: ${message}`);
        case 429:
          return new Error('Rate limit exceeded. Please wait before making more requests.');
        case 500:
          return new Error('Server error. Please try again later.');
        default:
          return new Error(`${status}: ${message}`);
      }
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error(error.message || defaultMessage);
    }
  }

  // Cache management
  getCacheKey(endpoint, params = {}) {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `news_${endpoint}_${paramString}`;
  }

  async getCachedData(cacheKey, maxAge = 5 * 60 * 1000) { // 5 minutes default
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      if (now - timestamp > maxAge) {
        localStorage.removeItem(cacheKey);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  }

  setCachedData(cacheKey, data) {
    try {
      const cached = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(cacheKey, JSON.stringify(cached));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }
}

// Export singleton instance
const newsService = new NewsServiceClass();
export default newsService;