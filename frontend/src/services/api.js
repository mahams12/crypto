import axios from 'axios';

// API base URL - adjust based on your backend deployment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 429) {
      console.warn('Rate limit exceeded. Please wait before making more requests.');
    } else if (error.response?.status >= 500) {
      console.error('Server error occurred. Please try again later.');
    } else if (error.code === 'NETWORK_ERROR') {
      console.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// Crypto Service
export const cryptoService = {
  // Get cryptocurrencies with pagination
  getCoins: async (page = 1, limit = 20, sortBy = 'market_cap_rank') => {
    try {
      const response = await api.get('/api/v1/coins', {
        params: { page, limit, sort_by: sortBy }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch coins: ${error.message}`);
    }
  },

  // Get specific coin data
  getCoin: async (coinId) => {
    try {
      const response = await api.get(`/api/v1/coins/${coinId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch coin ${coinId}: ${error.message}`);
    }
  },

  // Get coin price history
  getCoinHistory: async (coinId, days = 7) => {
    try {
      const response = await api.get(`/api/v1/coins/${coinId}/history`, {
        params: { days }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch coin history: ${error.message}`);
    }
  },

  // Get coin details with history
  getCoinDetails: async (coinId, historyDays = 7) => {
    try {
      const response = await api.get(`/api/v1/coins/${coinId}/details`, {
        params: { history_days: historyDays }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch coin details: ${error.message}`);
    }
  },

  // Get trending coins
  getTrendingCoins: async (limit = 10) => {
    try {
      const response = await api.get('/api/v1/coins/trending/top', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch trending coins: ${error.message}`);
    }
  }
};

// News Service
export const newsService = {
  // Get cryptocurrency news
  getNews: async (page = 1, limit = 20, category = null) => {
    try {
      const response = await api.get('/api/v1/news', {
        params: { page, limit, category }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch news: ${error.message}`);
    }
  },

  // Get latest news
  getLatestNews: async (limit = 10) => {
    try {
      const response = await api.get('/api/v1/news/latest', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch latest news: ${error.message}`);
    }
  },

  // Get news by category
  getNewsByCategory: async (category, page = 1, limit = 20) => {
    try {
      const response = await api.get(`/api/v1/news/category/${category}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch news for category ${category}: ${error.message}`);
    }
  },

  // Get news categories
  getNewsCategories: async () => {
    try {
      const response = await api.get('/api/v1/news/categories');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch news categories: ${error.message}`);
    }
  }
};

// Search Service
export const searchService = {
  // Search cryptocurrencies
  searchCoins: async (query, limit = 10) => {
    try {
      const response = await api.get('/api/v1/search', {
        params: { query, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to search coins: ${error.message}`);
    }
  },

  // Get search suggestions
  getSearchSuggestions: async (query, limit = 5) => {
    try {
      const response = await api.get('/api/v1/search/suggestions', {
        params: { query, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get search suggestions: ${error.message}`);
    }
  },

  // Get similar coins
  getSimilarCoins: async (coinId, limit = 5) => {
    try {
      const response = await api.get(`/api/v1/search/${coinId}/similar`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get similar coins: ${error.message}`);
    }
  }
};

// Health Service
export const healthService = {
  // Check API health
  checkHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  },

  // Get API info
  getApiInfo: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get API info: ${error.message}`);
    }
  }
};

// Utility function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    return {
      status,
      message: data?.message || data?.detail || 'An error occurred',
      error: data?.error || 'Unknown error'
    };
  } else if (error.request) {
    // Request made but no response
    return {
      status: 0,
      message: 'No response from server. Please check your connection.',
      error: 'Network Error'
    };
  } else {
    // Something else happened
    return {
      status: 0,
      message: error.message || 'An unexpected error occurred',
      error: 'Client Error'
    };
  }
};

// Export the axios instance for custom requests
export default api;