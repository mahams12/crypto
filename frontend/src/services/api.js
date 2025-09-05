// src/services/api.js - Updated to use real APIs
import { cryptoAPI, transformCoinGeckoData } from './cryptoAPI';

// Crypto Service - now uses real CoinGecko API
export const cryptoService = {
  async getCoins(page = 1, limit = 50, sortBy = 'market_cap_rank') {
    try {
      const coins = await cryptoAPI.getMarketData(page, limit);
      const transformedData = transformCoinGeckoData(coins);
      
      return {
        success: true,
        data: {
          data: transformedData,
          pagination: {
            current_page: page,
            per_page: limit,
            total: 1000, // Approximate
            total_pages: Math.ceil(1000 / limit)
          }
        }
      };
    } catch (error) {
      console.error('Error fetching coins:', error);
      throw error;
    }
  },

  async getCoin(id) {
    try {
      const coinData = await cryptoAPI.getCoinDetails(id);
      return {
        success: true,
        data: coinData
      };
    } catch (error) {
      console.error('Error fetching coin:', error);
      throw error;
    }
  },

  async getGlobalStats() {
    try {
      const stats = await cryptoAPI.getGlobalStats();
      return {
        success: true,
        data: {
          totalMarketCap: stats.total_market_cap.usd,
          total24hVolume: stats.total_volume.usd,
          gainers: Object.values(stats.market_cap_change_percentage_24h_usd || {}).filter(p => p > 0).length,
          losers: Object.values(stats.market_cap_change_percentage_24h_usd || {}).filter(p => p < 0).length
        }
      };
    } catch (error) {
      console.error('Error fetching global stats:', error);
      throw error;
    }
  }
};

// News Service - uses both real API and fallback
export const newsService = {
  async getNews(page = 1, limit = 12, category = null) {
    try {
      // Try to get real news from your API endpoint
      const response = await fetch(`/api/news?page=${page}&limit=${limit}`);
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data: {
            data: data.articles,
            total_pages: Math.ceil(data.totalResults / limit)
          }
        };
      }
    } catch (error) {
      console.log('API news endpoint not available, using fallback');
    }
    
    // Fallback to mock data
    return this.getFallbackNews(page, limit);
  },

  async getLatestNews(limit = 12) {
    try {
      // Try to get real news from your API endpoint
      const response = await fetch(`/api/news?limit=${limit}`);
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data: data.articles
        };
      }
    } catch (error) {
      console.log('API news endpoint not available, using fallback');
    }
    
    // Fallback to mock data
    const fallbackData = this.getFallbackNews(1, limit);
    return {
      success: true,
      data: fallbackData.data.data
    };
  },

  getFallbackNews(page = 1, limit = 12) {
    const mockNews = [
      {
        id: 'news_1',
        title: "Bitcoin Reaches New All-Time High Above $115,000",
        summary: "Bitcoin surges to unprecedented levels as institutional adoption accelerates and ETF inflows continue.",
        description: "Bitcoin has reached a new all-time high above $115,000, driven by continued institutional adoption and record ETF inflows.",
        content: "Bitcoin has reached a new all-time high above $115,000, marking a significant milestone in the cryptocurrency's price history. The surge comes amid continued institutional adoption and record inflows into Bitcoin exchange-traded funds.",
        image_url: null,
        thumbnail: null,
        published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        source: "Crypto News",
        author: "Market Analyst",
        url: "#"
      },
      {
        id: 'news_2',
        title: "Ethereum Layer 2 Solutions See Record Transaction Volume",
        summary: "Layer 2 scaling solutions process unprecedented transaction volumes as DeFi activity surges.",
        description: "Ethereum Layer 2 solutions are experiencing record transaction volumes as decentralized finance activity continues to grow.",
        content: "Ethereum Layer 2 scaling solutions have recorded unprecedented transaction volumes this week, with Arbitrum and Optimism leading the charge. The surge in activity is attributed to growing decentralized finance (DeFi) adoption and lower transaction costs.",
        image_url: null,
        thumbnail: null,
        published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        source: "DeFi Daily",
        author: "Tech Reporter",
        url: "#"
      },
      {
        id: 'news_3',
        title: "Regulatory Clarity Boosts Cryptocurrency Market Sentiment",
        summary: "Clear regulatory frameworks in major markets provide confidence for institutional investors.",
        description: "New regulatory clarity in key markets is boosting confidence among institutional cryptocurrency investors.",
        content: "Recent regulatory developments in the United States and European Union have provided much-needed clarity for institutional cryptocurrency investors. The clear frameworks are expected to accelerate mainstream adoption and institutional investment flows.",
        image_url: null,
        thumbnail: null,
        published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        source: "Regulatory Watch",
        author: "Policy Expert",
        url: "#"
      },
      {
        id: 'news_4',
        title: "Solana Ecosystem Continues Rapid Growth Trajectory",
        summary: "Solana's total value locked increases significantly as new projects launch on the network.",
        description: "The Solana ecosystem is experiencing rapid growth with increasing total value locked and new project launches.",
        content: "The Solana blockchain ecosystem continues its rapid growth trajectory, with total value locked (TVL) increasing significantly over the past month. New decentralized applications and DeFi protocols are choosing Solana for its high throughput and low transaction costs.",
        image_url: null,
        thumbnail: null,
        published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
        created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        source: "Solana Times",
        author: "Blockchain Reporter",
        url: "#"
      },
      {
        id: 'news_5',
        title: "Central Bank Digital Currencies Gain Global Momentum",
        summary: "Multiple countries accelerate CBDC development programs with pilot testing phases.",
        description: "Central banks worldwide are accelerating their digital currency development programs with expanded pilot testing.",
        content: "Central Bank Digital Currencies (CBDCs) are gaining momentum globally, with multiple countries accelerating their development programs. Pilot testing phases are expanding as central banks explore the potential benefits and challenges of digital national currencies.",
        image_url: null,
        thumbnail: null,
        published_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
        created_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        source: "CBDC Report",
        author: "Financial Analyst",
        url: "#"
      },
      {
        id: 'news_6',
        title: "NFT Market Shows Signs of Recovery",
        summary: "Non-fungible token trading volumes increase as new utility-focused projects emerge.",
        description: "The NFT market is showing signs of recovery with increased trading volumes and utility-focused projects.",
        content: "The non-fungible token (NFT) market is showing signs of recovery after a prolonged downturn. Trading volumes have increased significantly, driven by new utility-focused projects and renewed interest from collectors and investors.",
        image_url: null,
        thumbnail: null,
        published_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        source: "NFT Weekly",
        author: "Digital Art Reporter",
        url: "#"
      }
    ];

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNews = mockNews.slice(startIndex, endIndex);

    return {
      success: true,
      data: {
        data: paginatedNews,
        total_pages: Math.ceil(mockNews.length / limit)
      }
    };
  }
};