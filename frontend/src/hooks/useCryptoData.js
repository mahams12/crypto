import { useQuery } from '@tanstack/react-query';
import { cryptoService } from '../services/api';

/**
 * Hook to fetch cryptocurrency data with pagination
 */
export const useCryptoData = (page = 1, limit = 20, sortBy = 'market_cap_rank') => {
  return useQuery({
    queryKey: ['coins', page, limit, sortBy],
    queryFn: () => cryptoService.getCoins(page, limit, sortBy),
    staleTime: 30 * 1000, // 30 seconds
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time data
    refetchIntervalInBackground: false,
    select: (data) => data?.data?.data || [],
    onError: (error) => {
      console.error('Error fetching crypto data:', error);
    }
  });
};

/**
 * Hook to fetch specific coin data
 */
export const useCoinData = (coinId) => {
  return useQuery({
    queryKey: ['coin', coinId],
    queryFn: () => cryptoService.getCoin(coinId),
    staleTime: 30 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000,
    enabled: !!coinId,
    select: (data) => data?.data,
    onError: (error) => {
      console.error('Error fetching coin data:', error);
    }
  });
};

/**
 * Hook to fetch coin price history
 */
export const useCoinHistory = (coinId, days = 7) => {
  return useQuery({
    queryKey: ['coin-history', coinId, days],
    queryFn: () => cryptoService.getCoinHistory(coinId, days),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!coinId,
    select: (data) => data?.data || [],
    onError: (error) => {
      console.error('Error fetching coin history:', error);
    }
  });
};

/**
 * Hook to fetch trending coins
 */
export const useTrendingCoins = (limit = 10) => {
  return useQuery({
    queryKey: ['trending-coins', limit],
    queryFn: () => cryptoService.getTrendingCoins(limit),
    staleTime: 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000, // Refetch every minute
    select: (data) => data?.data || [],
    onError: (error) => {
      console.error('Error fetching trending coins:', error);
    }
  });
};

/**
 * Hook to fetch top gainers/losers
 */
export const useTopMovers = (type = 'gainers', limit = 10) => {
  return useQuery({
    queryKey: ['top-movers', type, limit],
    queryFn: () => cryptoService.getCoins(1, limit, type === 'gainers' ? '24h_change' : '24h_change'),
    staleTime: 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchInterval: 60 * 1000,
    select: (data) => {
      const coins = data?.data?.data || [];
      if (type === 'losers') {
        // Filter and sort by negative changes for losers
        return coins
          .filter(coin => coin.price_change_percentage_24h < 0)
          .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
      }
      // For gainers, filter positive changes
      return coins
        .filter(coin => coin.price_change_percentage_24h > 0)
        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    },
    onError: (error) => {
      console.error('Error fetching top movers:', error);
    }
  });
};

/**
 * Hook for market overview stats
 */
export const useMarketStats = () => {
  return useQuery({
    queryKey: ['market-stats'],
    queryFn: () => cryptoService.getCoins(1, 100), // Get top 100 for calculations
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 2 * 60 * 1000,
    select: (data) => {
      const coins = data?.data?.data || [];
      if (!coins.length) return null;

      // Calculate market stats
      const totalMarketCap = coins.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
      const total24hVolume = coins.reduce((sum, coin) => sum + (coin.volume_24h || coin.total_volume || 0), 0);
      const gainers = coins.filter(coin => (coin.price_change_percentage_24h || 0) > 0).length;
      const losers = coins.filter(coin => (coin.price_change_percentage_24h || 0) < 0).length;
      const btcDominance = coins.find(coin => coin.symbol?.toLowerCase() === 'btc');

      return {
        totalMarketCap,
        total24hVolume,
        gainers,
        losers,
        btcDominance: btcDominance ? (btcDominance.market_cap / totalMarketCap) * 100 : 0,
        totalCoins: coins.length
      };
    },
    onError: (error) => {
      console.error('Error fetching market stats:', error);
    }
  });
};