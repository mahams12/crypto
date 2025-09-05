import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation, Link } from 'react-router-dom';
import { 
  HiOutlineNewspaper, 
  HiOutlineFilter, 
  HiOutlineSearch,
  HiOutlineTag
} from 'react-icons/hi';
import NewsCard from '../../components/NewsSection/NewsCard';
import { SkeletonNews } from '../../components/Common/Loading';
import { newsService } from '../../services/api';

const News = () => {
  const { category } = useParams();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Get category from URL params or default to 'all'
  const selectedCategory = category || 'all';
  
  const itemsPerPage = 12;

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Fetch news data based on selected category
  const { data: newsData, isLoading, error } = useQuery({
    queryKey: ['news', currentPage, itemsPerPage, selectedCategory],
    queryFn: () => newsService.getNews(currentPage, itemsPerPage, selectedCategory === 'all' ? null : selectedCategory),
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true,
  });

  const news = newsData?.data?.data || [];
  const totalPages = newsData?.data?.total_pages || 1;

  // Define categories that match crypto.news structure
  const categories = [
    { name: 'all', label: 'ALL', href: '/news' },
    { name: 'bitcoin', label: 'BITCOIN', href: '/news/category/bitcoin' },
    { name: 'blockchain', label: 'BLOCKCHAIN', href: '/news/category/blockchain' },
    { name: 'ethereum', label: 'ETHEREUM', href: '/news/category/ethereum' },
    { name: 'defi', label: 'DEFI', href: '/news/category/defi' },
    { name: 'altcoins', label: 'ALTCOIN', href: '/news/category/altcoins' },
    { name: 'regulation', label: 'REGULATION', href: '/news/category/regulation' },
    { name: 'solana', label: 'SOLANA', href: '/news/category/solana' },
    { name: 'shiba-inu', label: 'SHIBA INU', href: '/news/category/shiba-inu' }
  ];

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryTitle = () => {
    if (selectedCategory === 'all') return 'Latest Crypto News';
    const categoryData = categories.find(cat => cat.name === selectedCategory);
    return categoryData ? `${categoryData.label} News` : 'Crypto News';
  };

  const getCategoryDescription = () => {
    if (selectedCategory === 'all') return 'Stay updated with the latest cryptocurrency news and market insights';
    const categoryData = categories.find(cat => cat.name === selectedCategory);
    return categoryData ? `Latest news and updates about ${categoryData.label.toLowerCase()}` : 'Cryptocurrency news and analysis';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-danger-500 mb-4">
            <HiOutlineNewspaper className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Unable to load news</h2>
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
        <title>{getCategoryTitle()} | crypto.news</title>
        <meta name="description" content={getCategoryDescription()} />
        <meta name="keywords" content="cryptocurrency news, bitcoin news, ethereum news, crypto analysis, blockchain news" />
      </Helmet>

      <div className="min-h-screen bg-dark-950">
        {/* Secondary Navigation Bar - like crypto.news */}
        <div className="bg-blue-600 border-b border-blue-500">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-6 py-3 overflow-x-auto">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to={cat.href}
                  className={`text-sm font-medium whitespace-nowrap px-3 py-2 rounded transition-colors ${
                    selectedCategory === cat.name
                      ? 'text-white bg-blue-700'
                      : 'text-blue-100 hover:text-white hover:bg-blue-700'
                  }`}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                  {getCategoryTitle()}
                </h1>
                <p className="text-gray-400 text-lg">
                  {getCategoryDescription()}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card mb-8"
          >
            <div className="flex items-center">
              <div className="flex-1">
                <div className="relative">
                  <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${selectedCategory === 'all' ? 'all' : selectedCategory} news...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pl-10 bg-dark-800 border-dark-700 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* News Grid */}
          {isLoading ? (
            <SkeletonNews count={itemsPerPage} />
          ) : news.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {news
                .filter(article => {
                  if (!searchQuery) return true;
                  return article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (article.description && article.description.toLowerCase().includes(searchQuery.toLowerCase()));
                })
                .map((article, index) => (
                  <motion.div
                    key={article.id || article.url}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <NewsCard article={article} />
                  </motion.div>
                ))}
            </motion.div>
          ) : (
            <div className="card text-center py-16">
              <div className="text-gray-400 mb-4">
                <HiOutlineNewspaper className="w-16 h-16 mx-auto opacity-50" />
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                No news found
              </h3>
              <p className="text-gray-500">
                {selectedCategory !== 'all' 
                  ? `No articles found in the ${selectedCategory} category.`
                  : 'Check back later for the latest crypto news.'
                }
              </p>
              <Link
                to="/news"
                className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                View All News
              </Link>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center space-x-4 mb-8"
            >
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-2">
                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                  const pageNumber = Math.max(1, currentPage - 2) + index;
                  if (pageNumber > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`w-10 h-10 rounded-lg transition-colors ${
                        currentPage === pageNumber
                          ? 'bg-blue-600 text-white'
                          : 'bg-dark-800 text-gray-400 hover:bg-dark-700 hover:text-gray-300'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </motion.div>
          )}

          {/* Back to All News */}
          {selectedCategory !== 'all' && (
            <div className="text-center mt-8">
              <Link
                to="/news"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                ← Back to All News
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default News;