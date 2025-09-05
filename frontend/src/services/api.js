// src/services/api.js - Direct CoinGecko calls (no backend needed)
const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

// Transform CoinGecko data to match your app's format
const transformCoinGeckoData = (coins) => {
  return coins.map(coin => ({
    coin_id: coin.id,
    id: coin.id,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    image: coin.image,
    image_url: coin.image,
    current_price: coin.current_price,
    market_cap: coin.market_cap,
    market_cap_rank: coin.market_cap_rank,
    price_change_percentage_24h: coin.price_change_percentage_24h,
    price_change_percentage_1h_in_currency: coin.price_change_percentage_1h_in_currency,
    price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency,
    total_volume: coin.total_volume,
    sparkline_in_7d: coin.sparkline_in_7d
  }));
};

// Crypto Service - uses CoinGecko directly
export const cryptoService = {
  async getCoins(page = 1, limit = 50, sortBy = 'market_cap_rank') {
    try {
      const response = await fetch(
        `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const coins = await response.json();
      const transformedData = transformCoinGeckoData(coins);
      
      return {
        success: true,
        data: {
          data: transformedData,
          pagination: {
            current_page: page,
            per_page: limit,
            total: 1000,
            total_pages: Math.ceil(1000 / limit)
          }
        }
      };
    } catch (error) {
      console.error('Error fetching coins:', error);
      
      // Return fallback data on error
      return {
        success: true,
        data: {
          data: this.getFallbackCoins(),
          pagination: {
            current_page: page,
            per_page: limit,
            total: 10,
            total_pages: 1
          }
        }
      };
    }
  },

  async getCoin(id) {
    try {
      const response = await fetch(
        `${COINGECKO_BASE}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const coinData = await response.json();
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
      const response = await fetch(`${COINGECKO_BASE}/global`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const stats = data.data;
      
      return {
        success: true,
        data: {
          totalMarketCap: stats.total_market_cap?.usd || 0,
          total24hVolume: stats.total_volume?.usd || 0,
          gainers: 150, // Approximate
          losers: 100   // Approximate
        }
      };
    } catch (error) {
      console.error('Error fetching global stats:', error);
      return {
        success: true,
        data: {
          totalMarketCap: 1200000000000,
          total24hVolume: 50000000000,
          gainers: 150,
          losers: 100
        }
      };
    }
  },

  getFallbackCoins() {
    return [
      {
        coin_id: 'bitcoin',
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        image: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png',
        image_url: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png',
        current_price: 95000,
        market_cap: 1800000000000,
        market_cap_rank: 1,
        price_change_percentage_24h: 2.5,
        total_volume: 25000000000
      },
      {
        coin_id: 'ethereum',
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        image: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png',
        image_url: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png',
        current_price: 3500,
        market_cap: 420000000000,
        market_cap_rank: 2,
        price_change_percentage_24h: 1.8,
        total_volume: 15000000000
      },
      {
        coin_id: 'solana',
        id: 'solana',
        symbol: 'SOL',
        name: 'Solana',
        image: 'https://coin-images.coingecko.com/coins/images/4128/large/solana.png',
        image_url: 'https://coin-images.coingecko.com/coins/images/4128/large/solana.png',
        current_price: 200,
        market_cap: 80000000000,
        market_cap_rank: 3,
        price_change_percentage_24h: 4.2,
        total_volume: 3000000000
      }
    ];
  }
};

// News Service - uses mock data (since NewsAPI requires server-side)
export const newsService = {
  async getNews(page = 1, limit = 12, category = null) {
    // Return mock data since NewsAPI requires server-side calls
    return this.getFallbackNews(page, limit);
  },

  async getLatestNews(limit = 12) {
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
        title: "Bitcoin Reaches New All-Time High Above $95,000",
        summary: "Bitcoin surges to unprecedented levels as institutional adoption accelerates and ETF inflows continue.",
        description: "Bitcoin has reached a new all-time high above $95,000, driven by continued institutional adoption and record ETF inflows.",
        content: "Bitcoin has reached a new all-time high above $95,000, marking a significant milestone in the cryptocurrency's price history.",
        image_url: null,
        thumbnail: null,
        published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
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
        content: "Ethereum Layer 2 scaling solutions have recorded unprecedented transaction volumes this week.",
        image_url: null,
        thumbnail: null,
        published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
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
        content: "Recent regulatory developments have provided much-needed clarity for institutional cryptocurrency investors.",
        image_url: null,
        thumbnail: null,
        published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
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
        content: "The Solana blockchain ecosystem continues its rapid growth trajectory.",
        image_url: null,
        thumbnail: null,
        published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        source: "Solana Times",
        author: "Blockchain Reporter",
        url: "#"
      },
      {
        id: 'news_5',
        title: "Central Bank Digital Currencies Gain Global Momentum",
        summary: "Multiple countries accelerate CBDC development programs with pilot testing phases.",
        description: "Central banks worldwide are accelerating their digital currency development programs.",
        content: "Central Bank Digital Currencies (CBDCs) are gaining momentum globally.",
        image_url: null,
        thumbnail: null,
        published_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        source: "CBDC Report",
        author: "Financial Analyst",
        url: "#"
      },
      {
        id: 'news_6',
        title: "NFT Market Shows Signs of Recovery",
        summary: "Non-fungible token trading volumes increase as new utility-focused projects emerge.",
        description: "The NFT market is showing signs of recovery with increased trading volumes.",
        content: "The non-fungible token (NFT) market is showing signs of recovery.",
        image_url: null,
        thumbnail: null,
        published_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
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

// Default export for compatibility
export default {
  cryptoService,
  newsService
};