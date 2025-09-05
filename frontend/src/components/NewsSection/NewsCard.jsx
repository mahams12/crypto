import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiOutlineExternalLink, 
  HiOutlineCalendar, 
  HiOutlineUser,
  HiOutlineTag,
  HiOutlinePhotograph,
  HiOutlineNewspaper
} from 'react-icons/hi';
import { formatTimeAgo, truncateText } from '../../utils/formatters';

const NewsCard = ({ article }) => {
  const [imageError, setImageError] = useState(false);
  
  const categoryColors = {
    bitcoin: 'bg-orange-500/20 text-orange-400 border-orange-500/20',
    ethereum: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
    defi: 'bg-purple-500/20 text-purple-400 border-purple-500/20',
    solana: 'bg-green-500/20 text-green-400 border-green-500/20',
    altcoins: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
    blockchain: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20',
    nft: 'bg-pink-500/20 text-pink-400 border-pink-500/20',
    trading: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
    regulation: 'bg-red-500/20 text-red-400 border-red-500/20',
    general: 'bg-gray-500/20 text-gray-400 border-gray-500/20'
  };

  const getCategoryStyle = (category) => {
    return categoryColors[category?.toLowerCase()] || categoryColors.general;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleExternalLink = (e) => {
    // Only open external link if user clicks the external link icon
    if (e.target.closest('.external-link-btn')) {
      e.preventDefault();
      e.stopPropagation();
      if (article.url && article.url !== '#') {
        window.open(article.url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  // Create placeholder gradient based on category
  const getPlaceholderGradient = (category) => {
    const gradients = {
      bitcoin: 'from-orange-600 to-yellow-600',
      ethereum: 'from-blue-600 to-indigo-600',
      defi: 'from-purple-600 to-pink-600',
      solana: 'from-green-600 to-teal-600',
      altcoins: 'from-yellow-600 to-orange-600',
      blockchain: 'from-indigo-600 to-purple-600',
      regulation: 'from-red-600 to-pink-600',
      general: 'from-gray-600 to-slate-600'
    };
    return gradients[category?.toLowerCase()] || gradients.general;
  };

  // Check if article has valid data
  if (!article || !article.title) {
    return null;
  }

  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-slate-900 border border-slate-800 rounded-xl p-0 shadow-lg hover:shadow-xl hover:border-blue-600/50 group h-full flex flex-col transition-all duration-200"
      onClick={handleExternalLink}
    >
      {/* Link wrapper for internal navigation */}
      <Link 
        to={`/news/${article.id}`} 
        className="block h-full flex flex-col no-underline text-inherit"
      >
        {/* Image */}
        <div className="relative overflow-hidden rounded-t-xl mb-4 bg-slate-800">
          {article.image_url && article.image_url.trim() && !imageError ? (
            <div className="aspect-video">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={handleImageError}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ) : (
            <div className={`aspect-video flex items-center justify-center bg-gradient-to-br ${getPlaceholderGradient(article.category)} relative`}>
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10 flex flex-col items-center justify-center text-white">
                <HiOutlineNewspaper className="w-12 h-12 mb-2 opacity-80" />
                <span className="text-sm font-medium opacity-90">
                  {article.category ? article.category.toUpperCase() : 'CRYPTO'} NEWS
                </span>
              </div>
            </div>
          )}
          
          {/* Category Badge */}
          {article.category && (
            <div className="absolute top-3 left-3">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getCategoryStyle(article.category)}`}>
                <HiOutlineTag className="w-3 h-3 mr-1" />
                {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
              </span>
            </div>
          )}

          {/* External Link Icon */}
          {article.url && article.url !== '#' && (
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                className="external-link-btn w-8 h-8 bg-slate-900/80 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-slate-800/90 transition-colors"
                onClick={handleExternalLink}
                title="Open original article"
              >
                <HiOutlineExternalLink className="w-4 h-4 text-gray-300" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col px-6 pb-6">
          {/* Title */}
          <h3 className="font-semibold text-gray-100 mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors leading-tight text-lg">
            {article.title}
          </h3>

          {/* Description */}
          {article.description && (
            <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
              {typeof truncateText === 'function' ? truncateText(article.description, 150) : article.description}
            </p>
          )}

          {/* Meta Information */}
          <div className="mt-auto">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              {/* Source */}
              {article.source && (
                <div className="flex items-center space-x-1">
                  <HiOutlineUser className="w-3 h-3" />
                  <span className="font-medium text-gray-400">{article.source}</span>
                </div>
              )}

              {/* Published Date */}
              {article.published_at && (
                <div className="flex items-center space-x-1">
                  <HiOutlineCalendar className="w-3 h-3" />
                  <time dateTime={article.published_at} className="text-gray-400">
                    {typeof formatTimeAgo === 'function' ? formatTimeAgo(article.published_at) : new Date(article.published_at).toLocaleDateString()}
                  </time>
                </div>
              )}
            </div>

            {/* Author */}
            {article.author && (
              <div className="text-xs text-gray-500 italic">
                By {article.author}
              </div>
            )}
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-blue-500/30 transition-colors pointer-events-none" />
      </Link>
    </motion.article>
  );
};

export default NewsCard;