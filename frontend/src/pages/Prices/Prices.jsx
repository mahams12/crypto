import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  HiOutlineSearch, 
  HiOutlineAdjustments, 
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
  HiOutlineChartBar
} from 'react-icons/hi';
import PriceTable from '../../components/PriceTable/PriceTable';
import { useCryptoData, useMarketStats } from '../../hooks/useCryptoData';
import { formatMarketCap, formatVolume, formatPercentage } from '../../utils/formatters';
import Loading from '../../components/Common/Loading';

const Prices = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('market_cap_rank');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const itemsPerPage = 50;

  // Fetch crypto data
  const { 
    data: cryptoData = [], 
    isLoading, 
    error 
  } = useCryptoData(currentPage, itemsPerPage, sortBy);

  // Fetch market stats
  const { data: marketStats, isLoading: statsLoading } = useMarketStats();

  // Filter data based on search and category
  const filteredData = useMemo(() => {
    let filtered = cryptoData;

    if (searchQuery) {
      filtered = filtered.filter(coin => 
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [cryptoData, searchQuery, selectedCategory]);

  const categories = [
    { id: 'all', name: 'All', icon: HiOutlineChartBar },
    { id: 'gainers', name: 'Top Gainers', icon: HiOutlineTrendingUp },
    { id: 'losers', name: 'Top Losers', icon: HiOutlineTrendingDown },
  ];

  const sortOptions = [
    { value: 'market_cap_rank', label: 'Market Cap' },
    { value: 'price', label: 'Price' },
    { value: '24h_change', label: '24h Change' },
    { value: 'volume', label: 'Volume' },
    { value: 'name', label: 'Name' },
  ];

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-danger-500 mb-4">
            <HiOutlineChartBar className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Unable to load price data</h2>
          <p className="text-gray-400 mb-4">Please try again later</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Cryptocurrency Prices Today | Live Crypto Market Data</title>
        <meta name="description" content="Live cryptocurrency prices today with real-time market data. Track Bitcoin, Ethereum and top crypto prices with 24h changes and market cap." />
        <meta name="keywords" content="cryptocurrency prices today, crypto prices, bitcoin price, ethereum price, live crypto market" />
      </Helmet>

      <div className="min-h-screen bg-dark-950 pt-6">
        <div className="container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Crypto <span className="gradient-text">Prices Today</span>
                </h1>
                <p className="text-gray-400 text-lg">
                  Live cryptocurrency prices and market data
                </p>
              </div>

              {/* Market Stats */}
              {!statsLoading && marketStats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 lg:mt-0">
                  <div className="text-center lg:text-right">
                    <div className="text-2xl font-bold gradient-text">
                      {formatMarketCap(marketStats.totalMarketCap)}
                    </div>
                    <div className="text-sm text-gray-400">Market Cap</div>
                  </div>
                  <div className="text-center lg:text-right">
                    <div className="text-2xl font-bold text-primary-400">
                      {formatVolume(marketStats.total24hVolume)}
                    </div>
                    <div className="text-sm text-gray-400">24h Volume</div>
                  </div>
                  <div className="text-center lg:text-right">
                    <div className="text-2xl font-bold text-success-500">
                      {marketStats.gainers}
                    </div>
                    <div className="text-sm text-gray-400">Gainers</div>
                  </div>
                  <div className="text-center lg:text-right">
                    <div className="text-2xl font-bold text-danger-500">
                      {marketStats.losers}
                    </div>
                    <div className="text-sm text-gray-400">Losers</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Filters and Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search cryptocurrencies..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="input pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`btn btn-sm ${
                      selectedCategory === category.id
                        ? 'btn-primary'
                        : 'btn-secondary'
                    }`}
                  >
                    <category.icon className="w-4 h-4 mr-2" />
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-2">
                <HiOutlineAdjustments className="w-5 h-5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="input min-w-0 w-auto"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Price Data Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card overflow-hidden"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loading size="lg" text="Loading price data..." />
              </div>
            ) : (
              <PriceTable
                data={filteredData}
                isLoading={isLoading}
                showPagination={true}
                currentPage={currentPage}
                totalPages={Math.ceil(1000 / itemsPerPage)} // Approximate
                onPageChange={handlePageChange}
              />
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Prices;