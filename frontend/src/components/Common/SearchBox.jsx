import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineSearch, HiOutlineX, HiOutlineTrendingUp } from 'react-icons/hi';
import { useDebounce } from '../../hooks/useDebounce';

const SearchBox = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);
  
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
    
    // Load recent searches from localStorage (with fallback for server-side rendering)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cryptotracker_recent_searches');
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved).slice(0, 5));
        } catch (error) {
          console.error('Error parsing recent searches:', error);
        }
      }
    }
  }, []);

  // Search functionality
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [debouncedQuery]);

  const performSearch = async (searchQuery) => {
    setIsLoading(true);
    try {
      // Use your API service - adjust the URL to match your backend
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/v1/search/${encodeURIComponent(searchQuery)}`);
      
      if (response.ok) {
        const data = await response.json();
        setResults(data.data?.results || []);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!results.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          selectCoin(results[selectedIndex]);
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  const selectCoin = (coin) => {
    // Add to recent searches (with localStorage check)
    if (typeof window !== 'undefined') {
      const newRecentSearches = [
        coin,
        ...recentSearches.filter(item => item.coin_id !== coin.coin_id)
      ].slice(0, 5);
      
      setRecentSearches(newRecentSearches);
      try {
        localStorage.setItem('cryptotracker_recent_searches', JSON.stringify(newRecentSearches));
      } catch (error) {
        console.error('Error saving recent searches:', error);
      }
    }

    // Navigate to coin page
    navigate(`/coin/${coin.coin_id}`);
    onClose();
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('cryptotracker_recent_searches');
      } catch (error) {
        console.error('Error clearing recent searches:', error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-dark-900 rounded-2xl shadow-2xl border border-dark-700 overflow-hidden max-w-2xl mx-auto"
    >
      {/* Search Input */}
      <div className="flex items-center px-6 py-4 border-b border-dark-800">
        <HiOutlineSearch className="w-5 h-5 text-gray-400 mr-3" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search cryptocurrencies..."
          className="flex-1 bg-transparent text-gray-100 placeholder-gray-400 focus:outline-none text-lg"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="ml-3 p-1 text-gray-400 hover:text-gray-300 transition-colors"
          >
            <HiOutlineX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results */}
      <div ref={resultsRef} className="max-h-96 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
            <span className="ml-2 text-gray-400">Searching...</span>
          </div>
        )}

        {/* Results List */}
        <AnimatePresence>
          {results.length > 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-2"
            >
              {results.map((coin, index) => (
                <motion.button
                  key={coin.coin_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => selectCoin(coin)}
                  className={`w-full flex items-center px-6 py-3 hover:bg-dark-800 transition-colors ${
                    selectedIndex === index ? 'bg-dark-800' : ''
                  }`}
                >
                  <div className="flex-shrink-0">
                    {coin.image_url ? (
                      <img
                        src={coin.image_url}
                        alt={coin.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {coin.symbol?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1 text-left">
                    <div className="font-medium text-gray-100">{coin.name}</div>
                    <div className="text-sm text-gray-400">{coin.symbol?.toUpperCase()}</div>
                  </div>
                  {coin.market_cap_rank && (
                    <div className="text-sm text-gray-500">
                      #{coin.market_cap_rank}
                    </div>
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results */}
        {query && !isLoading && results.length === 0 && debouncedQuery.length >= 2 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">No cryptocurrencies found</div>
            <div className="text-sm text-gray-500">
              Try searching for "Bitcoin", "Ethereum", or other crypto names
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {!query && recentSearches.length > 0 && (
          <div className="py-2">
            <div className="flex items-center justify-between px-6 py-2">
              <div className="flex items-center text-sm text-gray-400">
                <HiOutlineTrendingUp className="w-4 h-4 mr-2" />
                Recent Searches
              </div>
              <button
                onClick={clearRecentSearches}
                className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
              >
                Clear
              </button>
            </div>
            {recentSearches.map((coin) => (
              <button
                key={`recent-${coin.coin_id}`}
                onClick={() => selectCoin(coin)}
                className="w-full flex items-center px-6 py-3 hover:bg-dark-800 transition-colors"
              >
                <div className="flex-shrink-0">
                  {coin.image_url ? (
                    <img
                      src={coin.image_url}
                      alt={coin.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {coin.symbol?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-1 text-left">
                  <div className="font-medium text-gray-100">{coin.name}</div>
                  <div className="text-sm text-gray-400">{coin.symbol?.toUpperCase()}</div>
                </div>
                {coin.market_cap_rank && (
                  <div className="text-sm text-gray-500">
                    #{coin.market_cap_rank}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Quick Tips */}
        {!query && recentSearches.length === 0 && (
          <div className="px-6 py-8 text-center">
            <div className="text-gray-400 mb-4">
              <HiOutlineSearch className="w-12 h-12 mx-auto mb-3 opacity-50" />
              Search for any cryptocurrency
            </div>
            <div className="text-sm text-gray-500 space-y-1">
              <div>Try: "Bitcoin", "Ethereum", "BTC", "ETH"</div>
              <div>Use ↑↓ arrows to navigate, Enter to select</div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SearchBox;