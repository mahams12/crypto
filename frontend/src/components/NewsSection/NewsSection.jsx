import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  HiOutlineNewspaper, 
  HiOutlineExternalLink,
  HiOutlineCalendar,
  HiOutlineUser
} from 'react-icons/hi';
import NewsCard from './NewsCard';
import { SkeletonNews } from '../Common/Loading';
import { newsService } from '../../services/api';

const NewsSection = ({ 
  maxItems = 6, 
  showPagination = false, 
  category = null,
  className = '' 
}) => {
  const { data: newsData, isLoading, error } = useQuery({
    queryKey: ['news', 1, maxItems, category],
    queryFn: () => newsService.getNews(1, maxItems, category),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const news = newsData?.data?.data || [];

  if (isLoading) {
    return <SkeletonNews count={maxItems} />;
  }

  if (error) {
    return (
      <div className="card text-center py-12">
        <div className="text-danger-400 mb-4">
          <HiOutlineNewspaper className="w-12 h-12 mx-auto opacity-50" />
        </div>
        <h3 className="text-lg font-medium text-gray-300 mb-2">Failed to load news</h3>
        <p className="text-gray-500">Please try again later.</p>
      </div>
    );
  }

  if (!news.length) {
    return (
      <div className="card text-center py-12">
        <div className="text-gray-400 mb-4">
          <HiOutlineNewspaper className="w-12 h-12 mx-auto opacity-50" />
        </div>
        <h3 className="text-lg font-medium text-gray-300 mb-2">No news available</h3>
        <p className="text-gray-500">Check back later for the latest crypto news.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((article, index) => (
          <motion.div
            key={article.id || article.url}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <NewsCard article={article} />
          </motion.div>
        ))}
      </div>

      {/* Show All News Link */}
      {!showPagination && news.length >= maxItems && (
        <div className="text-center">
          <Link
            to="/news"
            className="btn btn-secondary"
          >
            <HiOutlineNewspaper className="w-4 h-4 mr-2" />
            View All News
          </Link>
        </div>
      )}
    </div>
  );
};

export default NewsSection;