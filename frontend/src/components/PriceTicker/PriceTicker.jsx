import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCryptoData } from '../../hooks/useCryptoData';
import { formatPrice, formatPercentage } from '../../utils/formatters';

const PriceTicker = () => {
  const { data: coins = [], isLoading } = useCryptoData(1, 10);
  const [isVisible, setIsVisible] = useState(true);
  const tickerRef = useRef(null);

  // Auto-hide ticker on scroll down, show on scroll up
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-dark-900 border-b border-dark-800 py-3 overflow-hidden">
        <div className="flex animate-pulse space-x-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 min-w-0">
              <div className="w-6 h-6 bg-dark-700 rounded-full" />
              <div className="space-y-1">
                <div className="w-16 h-3 bg-dark-700 rounded" />
                <div className="w-12 h-2 bg-dark-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!coins.length) return null;

  const tickerItems = [...coins, ...coins]; // Duplicate for seamless loop

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className="fixed top-16 left-0 right-0 z-40 bg-dark-900/95 backdrop-blur-lg border-b border-dark-800 py-3 overflow-hidden"
      ref={tickerRef}
    >
      <div className="relative">
        <motion.div
          animate={{ x: '-50%' }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex space-x-12 min-w-max"
        >
          {tickerItems.map((coin, index) => (
            <TickerItem key={`${coin.coin_id}-${index}`} coin={coin} />
          ))}
        </motion.div>
        
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-dark-900 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-dark-900 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
};

const TickerItem = ({ coin }) => {
  const priceChange = coin.price_change_percentage_24h || 0;
  const isPositive = priceChange >= 0;

  return (
    <Link
      to={`/coin/${coin.coin_id}`}
      className="flex items-center space-x-3 min-w-0 hover:bg-dark-800/50 px-3 py-2 rounded-lg transition-colors group"
    >
      {/* Coin Icon */}
      <div className="flex-shrink-0">
        {coin.image_url ? (
          <img
            src={coin.image_url}
            alt={coin.name}
            className="w-6 h-6 rounded-full"
            loading="lazy"
          />
        ) : (
          <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {coin.symbol?.charAt(0) || '?'}
            </span>
          </div>
        )}
      </div>

      {/* Coin Info */}
      <div className="min-w-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-200 group-hover:text-primary-400 transition-colors">
            {coin.symbol?.toUpperCase()}
          </span>
          <span className="text-sm font-mono text-gray-300">
            {formatPrice(coin.current_price)}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span
            className={`text-xs font-medium ${
              isPositive ? 'text-success-500' : 'text-danger-500'
            }`}
          >
            {isPositive ? '+' : ''}{formatPercentage(priceChange)}
          </span>
          
          {/* Price change indicator */}
          <div className="flex items-center">
            {isPositive ? (
              <svg className="w-3 h-3 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-3 h-3 text-danger-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PriceTicker;