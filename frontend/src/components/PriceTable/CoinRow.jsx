import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiOutlineArrowUp, 
  HiOutlineArrowDown, 
  HiOutlineStar, 
  HiStar,
  HiOutlineChartBar 
} from 'react-icons/hi';
import { formatPrice, formatMarketCap, formatVolume, formatPercentage } from '../../utils/formatters';

const CoinRow = ({ coin, index, isWatchlisted, onToggleWatchlist }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const priceChange24h = coin.price_change_percentage_24h || 0;
  const priceChange1h = coin.price_change_percentage_1h || 0;
  const priceChange7d = coin.price_change_percentage_7d || 0;

  const PriceChangeCell = ({ percentage, className = '' }) => {
    if (percentage === null || percentage === undefined) {
      return <span className="text-gray-500 text-sm">N/A</span>;
    }

    const isPositive = percentage >= 0;
    const isZero = percentage === 0;

    return (
      <div className={`flex items-center justify-end space-x-1 ${
        isZero ? 'text-gray-400' : isPositive ? 'text-success-500' : 'text-danger-500'
      } ${className}`}>
        {!isZero && (
          <>
            {isPositive ? (
              <HiOutlineArrowUp className="w-3 h-3" />
            ) : (
              <HiOutlineArrowDown className="w-3 h-3" />
            )}
          </>
        )}
        <span className="font-mono text-sm font-medium">
          {isPositive && !isZero ? '+' : ''}{formatPercentage(percentage)}
        </span>
      </div>
    );
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
      className={`
        border-b border-dark-800/50 transition-all duration-200
        hover:bg-dark-800/50 hover:border-dark-700
        ${isHovered ? 'transform scale-[1.002]' : ''}
      `}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Rank */}
      <td className="px-4 py-4 text-center">
        <span className="text-gray-400 font-mono text-sm">
          {coin.market_cap_rank || index + 1}
        </span>
      </td>

      {/* Name & Symbol */}
      <td className="px-4 py-4">
        <Link
          to={`/coin/${coin.coin_id || coin.id}`}
          className="flex items-center space-x-3 group"
        >
          <div className="flex-shrink-0 relative">
            {coin.image_url || coin.image ? (
              <img
                src={coin.image_url || coin.image}
                alt={coin.name}
                className="w-10 h-10 rounded-full ring-2 ring-transparent group-hover:ring-primary-500/20 transition-all"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center ring-2 ring-transparent group-hover:ring-primary-500/20 transition-all"
              style={{ display: coin.image_url || coin.image ? 'none' : 'flex' }}
            >
              <span className="text-sm font-bold text-white">
                {coin.symbol?.charAt(0) || '?'}
              </span>
            </div>
            
            {/* Hover effect */}
            <div className="absolute inset-0 bg-primary-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-100 group-hover:text-primary-400 transition-colors">
              {coin.name}
            </div>
            <div className="text-sm text-gray-500 uppercase tracking-wide">
              {coin.symbol}
            </div>
          </div>
          
          {/* Chart icon on hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <HiOutlineChartBar className="w-4 h-4 text-primary-400" />
          </div>
        </Link>
      </td>

      {/* Price */}
      <td className="px-4 py-4 text-right">
        <div className="font-mono font-semibold text-gray-100 text-lg">
          {formatPrice(coin.current_price)}
        </div>
        {coin.ath && (
          <div className="text-xs text-gray-500">
            ATH: {formatPrice(coin.ath)}
          </div>
        )}
      </td>

      {/* 1h Change (Hidden on mobile) */}
      <td className="px-4 py-4 text-right hidden md:table-cell">
        <PriceChangeCell percentage={priceChange1h} />
      </td>

      {/* 24h Change */}
      <td className="px-4 py-4 text-right">
        <PriceChangeCell percentage={priceChange24h} />
      </td>

      {/* 7d Change (Hidden on mobile) */}
      <td className="px-4 py-4 text-right hidden lg:table-cell">
        <PriceChangeCell percentage={priceChange7d} />
      </td>

      {/* Market Cap (Hidden on mobile) */}
      <td className="px-4 py-4 text-right hidden md:table-cell">
        <div className="font-mono text-gray-300">
          {formatMarketCap(coin.market_cap)}
        </div>
        {coin.market_cap_rank && (
          <div className="text-xs text-gray-500">
            Rank #{coin.market_cap_rank}
          </div>
        )}
      </td>

      {/* Volume (Hidden on mobile) */}
      <td className="px-4 py-4 text-right hidden lg:table-cell">
        <div className="font-mono text-gray-300">
          {formatVolume(coin.volume_24h || coin.total_volume)}
        </div>
        {coin.volume_24h && coin.market_cap && (
          <div className="text-xs text-gray-500">
            {((coin.volume_24h / coin.market_cap) * 100).toFixed(1)}% of cap
          </div>
        )}
      </td>

      {/* Circulating Supply (Hidden on mobile) */}
      <td className="px-4 py-4 text-right hidden xl:table-cell">
        {coin.circulating_supply ? (
          <div className="font-mono text-gray-400 text-sm">
            <div>{formatVolume(coin.circulating_supply, false)}</div>
            <div className="text-xs text-gray-500 uppercase">
              {coin.symbol}
            </div>
            {coin.max_supply && (
              <div className="text-xs text-gray-600 mt-1">
                Max: {formatVolume(coin.max_supply, false)}
              </div>
            )}
          </div>
        ) : (
          <span className="text-gray-500 text-sm">N/A</span>
        )}
      </td>

      {/* Watchlist Action */}
      <td className="px-4 py-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWatchlist?.(coin.coin_id || coin.id);
          }}
          className={`
            p-2 rounded-lg transition-all duration-200
            ${isWatchlisted 
              ? 'text-warning-400 bg-warning-400/10 hover:bg-warning-400/20' 
              : 'text-gray-400 hover:text-warning-400 hover:bg-warning-400/10'
            }
            ${isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
          `}
          title={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          {isWatchlisted ? (
            <HiStar className="w-4 h-4" />
          ) : (
            <HiOutlineStar className="w-4 h-4" />
          )}
        </motion.button>
      </td>
    </motion.tr>
  );
};

export default CoinRow;