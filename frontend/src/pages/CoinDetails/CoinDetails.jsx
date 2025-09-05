import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  HiOutlineArrowLeft, 
  HiOutlineExternalLink,
  HiOutlineStar,
  HiStar,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
  HiOutlineCalendar,
  HiOutlineChartBar
} from 'react-icons/hi';
import { useCoinData, useCoinHistory } from '../../hooks/useCryptoData';
import PriceChart from '../../components/Charts/PriceChart';
import { 
  formatPrice, 
  formatMarketCap, 
  formatVolume, 
  formatPercentage, 
  formatTimeAgo,
  formatSupply,
  getPercentageColor
} from '../../utils/formatters';
import Loading, { SkeletonChart } from '../../components/Common/Loading';

const CoinDetails = () => {
  const { coinId } = useParams();
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState(7);

  // Fetch coin data
  const { data: coinData, isLoading, error } = useCoinData(coinId);
  const { data: historyData, isLoading: historyLoading } = useCoinHistory(coinId, selectedTimeframe);

  const coin = coinData?.data;
  const priceHistory = historyData || [];

  const timeframes = [
    { days: 1, label: '1D' },
    { days: 7, label: '7D' },
    { days: 30, label: '1M' },
    { days: 90, label: '3M' },
    { days: 365, label: '1Y' }
  ];

  const toggleWatchlist = () => {
    setIsWatchlisted(!isWatchlisted);
    // In a real app, you'd save this to localStorage or user preferences
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 pt-6">
        <div className="container">
          <div className="animate-pulse space-y-8">
            {/* Header skeleton */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-dark-800 rounded-full" />
              <div className="space-y-2">
                <div className="w-32 h-6 bg-dark-800 rounded" />
                <div className="w-16 h-4 bg-dark-800 rounded" />
              </div>
            </div>
            
            {/* Price skeleton */}
            <div className="space-y-4">
              <div className="w-48 h-12 bg-dark-800 rounded" />
              <div className="w-32 h-6 bg-dark-800 rounded" />
            </div>
            
            {/* Chart skeleton */}
            <SkeletonChart />
          </div>
        </div>
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-danger-500 mb-4">
            <HiOutlineChartBar className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Coin not found</h2>
          <p className="text-gray-400 mb-4">The cryptocurrency you're looking for doesn't exist.</p>
          <Link to="/markets" className="btn btn-primary">
            <HiOutlineArrowLeft className="w-4 h-4 mr-2" />
            Back to Markets
          </Link>
        </div>
      </div>
    );
  }

  const priceChange24h = coin.price_change_percentage_24h || 0;
  const isPositive = priceChange24h >= 0;

  return (
    <>
      <Helmet>
        <title>{coin.name} ({coin.symbol?.toUpperCase()}) Price, Chart & Market Cap | CryptoTracker</title>
        <meta name="description" content={`Live ${coin.name} (${coin.symbol?.toUpperCase()}) price, chart, market cap, and trading data. Track ${coin.name} performance and market trends.`} />
        <meta name="keywords" content={`${coin.name}, ${coin.symbol}, crypto price, cryptocurrency, ${coin.name} chart, ${coin.name} market cap`} />
      </Helmet>

      <div className="min-h-screen bg-dark-950 pt-6">
        <div className="container">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              to="/markets"
              className="inline-flex items-center text-gray-400 hover:text-primary-400 transition-colors"
            >
              <HiOutlineArrowLeft className="w-4 h-4 mr-2" />
              Back to Markets
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8"
          >
            <div className="flex items-center space-x-4 mb-6 lg:mb-0">
              <div className="flex-shrink-0">
                {coin.image_url ? (
                  <img
                    src={coin.image_url}
                    alt={coin.name}
                    className="w-16 h-16 rounded-full"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-white">
                      {coin.symbol?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-bold text-gray-100">{coin.name}</h1>
                  <span className="text-lg text-gray-400 uppercase font-mono">
                    {coin.symbol}
                  </span>
                  {coin.market_cap_rank && (
                    <span className="bg-primary-500/20 text-primary-400 px-2 py-1 rounded-lg text-sm font-medium">
                      Rank #{coin.market_cap_rank}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 mt-2">
                  <div className="text-4xl font-bold font-mono text-gray-100">
                    {formatPrice(coin.current_price)}
                  </div>
                  
                  <div className={`flex items-center space-x-1 ${getPercentageColor(priceChange24h)}`}>
                    {isPositive ? (
                      <HiOutlineTrendingUp className="w-5 h-5" />
                    ) : (
                      <HiOutlineTrendingDown className="w-5 h-5" />
                    )}
                    <span className="text-lg font-semibold">
                      {isPositive ? '+' : ''}{formatPercentage(priceChange24h)}
                    </span>
                    <span className="text-sm text-gray-400">(24h)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleWatchlist}
                className={`btn ${isWatchlisted ? 'btn-primary' : 'btn-secondary'}`}
              >
                {isWatchlisted ? (
                  <HiStar className="w-4 h-4 mr-2" />
                ) : (
                  <HiOutlineStar className="w-4 h-4 mr-2" />
                )}
                {isWatchlisted ? 'Watchlisted' : 'Add to Watchlist'}
              </button>
              
              <button className="btn btn-secondary">
                <HiOutlineExternalLink className="w-4 h-4 mr-2" />
                Trade
              </button>
            </div>
          </motion.div>

          {/* Price Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Price Chart</h2>
              
              <div className="flex space-x-2">
                {timeframes.map((timeframe) => (
                  <button
                    key={timeframe.days}
                    onClick={() => setSelectedTimeframe(timeframe.days)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      selectedTimeframe === timeframe.days
                        ? 'bg-primary-600 text-white'
                        : 'bg-dark-800 text-gray-400 hover:bg-dark-700 hover:text-gray-300'
                    }`}
                  >
                    {timeframe.label}
                  </button>
                ))}
              </div>
            </div>

            {historyLoading ? (
              <SkeletonChart />
            ) : (
              <PriceChart 
                data={priceHistory} 
                height={400}
                color={isPositive ? '#22c55e' : '#ef4444'}
              />
            )}
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {/* Price Statistics */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Price Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Market Cap:</span>
                  <span className="font-mono text-gray-200">
                    {formatMarketCap(coin.market_cap)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">24h Volume:</span>
                  <span className="font-mono text-gray-200">
                    {formatVolume(coin.volume_24h)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">All-Time High:</span>
                  <div className="text-right">
                    <div className="font-mono text-gray-200">
                      {formatPrice(coin.ath)}
                    </div>
                    {coin.ath_date && (
                      <div className="text-xs text-gray-500">
                        {formatTimeAgo(coin.ath_date)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">All-Time Low:</span>
                  <div className="text-right">
                    <div className="font-mono text-gray-200">
                      {formatPrice(coin.atl)}
                    </div>
                    {coin.atl_date && (
                      <div className="text-xs text-gray-500">
                        {formatTimeAgo(coin.atl_date)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Supply Information */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Supply Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Circulating Supply:</span>
                  <span className="font-mono text-gray-200">
                    {coin.circulating_supply ? formatSupply(coin.circulating_supply) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Supply:</span>
                  <span className="font-mono text-gray-200">
                    {coin.total_supply ? formatSupply(coin.total_supply) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Max Supply:</span>
                  <span className="font-mono text-gray-200">
                    {coin.max_supply ? formatSupply(coin.max_supply) : '∞'}
                  </span>
                </div>
                {coin.circulating_supply && coin.max_supply && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Supply Progress:</span>
                      <span className="text-gray-300">
                        {((coin.circulating_supply / coin.max_supply) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-dark-800 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${(coin.circulating_supply / coin.max_supply) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Performance */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">1 Hour:</span>
                  <span className={`font-mono ${getPercentageColor(coin.price_change_percentage_1h)}`}>
                    {coin.price_change_percentage_1h ? 
                      `${coin.price_change_percentage_1h >= 0 ? '+' : ''}${formatPercentage(coin.price_change_percentage_1h)}` 
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">24 Hours:</span>
                  <span className={`font-mono ${getPercentageColor(coin.price_change_percentage_24h)}`}>
                    {coin.price_change_percentage_24h ? 
                      `${coin.price_change_percentage_24h >= 0 ? '+' : ''}${formatPercentage(coin.price_change_percentage_24h)}` 
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">7 Days:</span>
                  <span className={`font-mono ${getPercentageColor(coin.price_change_percentage_7d)}`}>
                    {coin.price_change_percentage_7d ? 
                      `${coin.price_change_percentage_7d >= 0 ? '+' : ''}${formatPercentage(coin.price_change_percentage_7d)}` 
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Updated:</span>
                  <div className="text-right">
                    <div className="flex items-center text-gray-300">
                      <HiOutlineCalendar className="w-4 h-4 mr-1" />
                      {formatTimeAgo(coin.last_updated)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          >
            {/* Market Data */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-6">Market Data</h3>
              <div className="space-y-4">
                <div className="p-4 bg-dark-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400">Market Cap Rank</div>
                      <div className="text-2xl font-bold text-primary-400">
                        #{coin.market_cap_rank || 'N/A'}
                      </div>
                    </div>
                    <HiOutlineChartBar className="w-8 h-8 text-primary-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-dark-800 rounded-lg text-center">
                    <div className="text-sm text-gray-400 mb-1">Volume/Market Cap</div>
                    <div className="text-lg font-semibold text-gray-200">
                      {coin.volume_24h && coin.market_cap ? 
                        `${((coin.volume_24h / coin.market_cap) * 100).toFixed(2)}%` 
                        : 'N/A'
                      }
                    </div>
                  </div>
                  <div className="p-4 bg-dark-800 rounded-lg text-center">
                    <div className="text-sm text-gray-400 mb-1">Price vs ATH</div>
                    <div className="text-lg font-semibold text-danger-400">
                      {coin.current_price && coin.ath ? 
                        `${(((coin.current_price - coin.ath) / coin.ath) * 100).toFixed(1)}%`
                        : 'N/A'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-6">About {coin.name}</h3>
              <div className="space-y-4">
                <div className="p-4 bg-dark-800 rounded-lg">
                  <h4 className="font-medium text-gray-200 mb-2">Quick Facts</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-400">Symbol:</span>
                      <span className="text-gray-200 uppercase font-mono">{coin.symbol}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Launch Date:</span>
                      <span className="text-gray-200">
                        {coin.ath_date ? new Date(coin.ath_date).getFullYear() : 'Unknown'}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Category:</span>
                      <span className="text-gray-200">Cryptocurrency</span>
                    </li>
                  </ul>
                </div>

                <div className="text-sm text-gray-400">
                  <p className="mb-3">
                    {coin.name} ({coin.symbol?.toUpperCase()}) is currently ranked #{coin.market_cap_rank || 'N/A'} 
                    by market capitalization. Track its real-time price, market data, and performance metrics.
                  </p>
                  <p>
                    Market data is updated in real-time to provide the most accurate information for your investment decisions.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CoinDetails;