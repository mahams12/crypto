// src/services/cryptoAPI.js
const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
const COINCAP_BASE = 'https://api.coincap.io/v2';

export const cryptoAPI = {
  // Get trending coins
  async getTrendingCoins() {
    try {
      const response = await fetch(`${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching trending coins:', error);
      throw error;
    }
  },

  // Get coin details
  async getCoinDetails(coinId) {
    try {
      const response = await fetch(`${COINGECKO_BASE}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching coin details:', error);
      throw error;
    }
  },

  // Get market data (main function for prices page)
  async getMarketData(page = 1, limit = 50) {
    try {
      const response = await fetch(`${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  },

  // Get global market stats
  async getGlobalStats() {
    try {
      const response = await fetch(`${COINGECKO_BASE}/global`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching global stats:', error);
      throw error;
    }
  },

  // Alternative: Use CoinCap for additional data
  async getCoinCapAssets(limit = 10) {
    try {
      const response = await fetch(`${COINCAP_BASE}/assets?limit=${limit}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching CoinCap data:', error);
      throw error;
    }
  }
};

// Transform CoinGecko data to match your app's format
export const transformCoinGeckoData = (coins) => {
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