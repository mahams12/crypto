import api from './api';

/**
 * Cryptocurrency-specific service functions
 * Extends the main api.js with crypto-focused methods
 */
class CryptoServiceClass {
  
  /**
   * Get paginated list of cryptocurrencies
   */
  async getCoins(page = 1, limit = 20, sortBy = 'market_cap_rank') {
    try {
      const response = await api.get('/api/v1/coins', {
        params: { page, limit, sort_by: sortBy }
      });
      return this.transformCoinsResponse(response.data);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch cryptocurrencies');
    }
  }

  /**
   * Get specific cryptocurrency by ID
   */
  async getCoinById(coinId) {
    try {
      const response = await api.get(`/api/v1/coins/${coinId}`);
      return this.transformCoinResponse(response.data);
    } catch (error) {
      throw this.handleError(error, `Failed to fetch ${coinId}`);
    }
  }

  /**
   * Get cryptocurrency price history
   */
  async getCoinHistory(coinId, days = 7) {
    try {
      const response = await api.get(`/api/v1/coins/${coinId}/history`, {
        params: { days }
      });
      return this.transformHistoryResponse(response.data);
    } catch (error) {
      throw this.handleError(error, `Failed to fetch price history for ${coinId}`);
    }
  }

  /**
   * Get comprehensive coin details with history
   */
  async getCoinDetails(coinId, historyDays = 7) {
    try {
      const response = await api.get(`/api/v1/coins/${coinId}/details`, {
        params: { history_days: historyDays }
      });
      return this.transformCoinDetailsResponse(response.data);
    } catch (error) {
      throw this.handleError(error, `Failed to fetch details for ${coinId}`);
    }
  }

  /**
   * Get trending cryptocurrencies
   */
  async getTrendingCoins(limit = 10) {
    try {
      const response = await api.get('/api/v1/coins/trending/top', {
        params: { limit }
      });
      return this.transformCoinsResponse(response.data);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch trending coins');
    }
  }

  /**
   * Get top gainers
   */
  async getTopGainers(limit = 10) {
    try {
      const response = await this.getCoins(1, limit, '24h_change');
      const coins = response.data || [];
      return coins
        .filter(coin => (coin.price_change_percentage_24h || 0) > 0)
        .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
        .slice(0, limit);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch top gainers');
    }
  }

  /**
   * Get top losers
   */
  async getTopLosers(limit = 10) {
    try {
      const response = await this.getCoins(1, limit, '24h_change');
      const coins = response.data || [];
      return coins
        .filter(coin => (coin.price_change_percentage_24h || 0) < 0)
        .sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0))
        .slice(0, limit);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch top losers');
    }
  }

  /**
   * Search cryptocurrencies
   */
  async searchCoins(query, limit = 10) {
    try {
      const response = await api.get('/api/v1/search', {
        params: { query, limit }
      });
      return this.transformSearchResponse(response.data);
    } catch (error) {
      throw this.handleError(error, 'Failed to search cryptocurrencies');
    }
  }

  /**
   * Get search suggestions
   */
  async getSearchSuggestions(query, limit = 5) {
    try {
      const response = await api.get('/api/v1/search/suggestions', {
        params: { query, limit }
      });
      return response.data.data || [];
    } catch (error) {
      throw this.handleError(error, 'Failed to get search suggestions');
    }
  }

  /**
   * Get similar coins
   */
  async getSimilarCoins(coinId, limit = 5) {
    try {
      const response = await api.get(`/api/v1/search/${coinId}/similar`, {
        params: { limit }
      });
      return this.transformSearchResponse(response.data);
    } catch (error) {
      throw this.handleError(error, 'Failed to get similar coins');
    }
  }

  /**
   * Get market statistics
   */
  async getMarketStats() {
    try {
      // Get top 100 coins to calculate market stats
      const response = await this.getCoins(1, 100);
      const coins = response.data || [];

      if (!coins.length) return null;

      // Calculate comprehensive market statistics
      const totalMarketCap = coins.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
      const total24hVolume = coins.reduce((sum, coin) => sum + (coin.volume_24h || coin.total_volume || 0), 0);
      
      const gainers = coins.filter(coin => (coin.price_change_percentage_24h || 0) > 0);
      const losers = coins.filter(coin => (coin.price_change_percentage_24h || 0) < 0);
      
      const btc = coins.find(coin => coin.symbol?.toLowerCase() === 'btc');
      const btcDominance = btc ? (btc.market_cap / totalMarketCap) * 100 : 0;

      return {
        totalMarketCap,
        total24hVolume,
        btcDominance,
        totalCoins: coins.length,
        gainers: gainers.length,
        losers: losers.length,
        topGainer: gainers.sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))[0],
        topLoser: losers.sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0))[0],
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch market statistics');
    }
  }

  /**
   * Get portfolio data (placeholder for future implementation)
   */
  async getPortfolio(userId) {
    // Placeholder for portfolio functionality
    // In a real app, this would fetch user's portfolio from backend
    try {
      const portfolio = JSON.parse(localStorage.getItem(`portfolio_${userId}`) || '[]');
      return portfolio;
    } catch (error) {
      console.error('Error loading portfolio:', error);
      return [];
    }
  }

  /**
   * Save portfolio data (placeholder for future implementation)
   */
  async savePortfolio(userId, portfolio) {
    try {
      localStorage.setItem(`portfolio_${userId}`, JSON.stringify(portfolio));
      return true;
    } catch (error) {
      console.error('Error saving portfolio:', error);
      return false;
    }
  }

  // Data transformation methods
  transformCoinsResponse(response) {
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Invalid response format');
    }
    return response.data;
  }

  transformCoinResponse(response) {
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Invalid response format');
    }
    return response.data;
  }

  transformHistoryResponse(response) {
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Invalid response format');
    }
    return response.data;
  }

  transformCoinDetailsResponse(response) {
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Invalid response format');
    }
    return response.data;
  }

  transformSearchResponse(response) {
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Invalid response format');
    }
    return response.data.results || [];
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

  // Utility methods
  formatCoinData(coin) {
    return {
      ...coin,
      price_change_percentage_1h: parseFloat(coin.price_change_percentage_1h || 0),
      price_change_percentage_24h: parseFloat(coin.price_change_percentage_24h || 0),
      price_change_percentage_7d: parseFloat(coin.price_change_percentage_7d || 0),
      current_price: parseFloat(coin.current_price || 0),
      market_cap: parseFloat(coin.market_cap || 0),
      volume_24h: parseFloat(coin.volume_24h || coin.total_volume || 0),
      circulating_supply: parseFloat(coin.circulating_supply || 0),
      total_supply: parseFloat(coin.total_supply || 0),
      max_supply: parseFloat(coin.max_supply || 0)
    };
  }
}

// Export singleton instance
const cryptoService = new CryptoServiceClass();
export default cryptoService;