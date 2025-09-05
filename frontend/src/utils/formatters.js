/**
 * Utility functions for formatting numbers, currencies, and other data
 */

/**
 * Format price with appropriate decimal places and currency symbol
 */
export const formatPrice = (price) => {
    if (price === null || price === undefined || isNaN(price)) {
      return 'N/A';
    }
  
    const numPrice = Number(price);
    
    if (numPrice === 0) return '$0.00';
    
    // For very small prices, show more decimal places
    if (numPrice < 0.01) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 6,
        maximumFractionDigits: 8,
      }).format(numPrice);
    }
    
    // For small prices under $1
    if (numPrice < 1) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 4,
        maximumFractionDigits: 6,
      }).format(numPrice);
    }
    
    // For regular prices
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numPrice);
  };
  
  /**
   * Format percentage change with + or - sign
   */
  export const formatPercentage = (percentage, decimals = 2) => {
    if (percentage === null || percentage === undefined || isNaN(percentage)) {
      return 'N/A';
    }
  
    const numPercentage = Number(percentage);
    return `${numPercentage.toFixed(decimals)}%`;
  };
  
  /**
   * Format market cap or volume with K, M, B, T abbreviations
   */
  export const formatMarketCap = (value) => {
    return formatLargeNumber(value, true);
  };
  
  export const formatVolume = (value, showCurrency = true) => {
    return formatLargeNumber(value, showCurrency);
  };
  
  export const formatLargeNumber = (value, showCurrency = true) => {
    if (value === null || value === undefined || isNaN(value)) {
      return 'N/A';
    }
  
    const numValue = Number(value);
    const prefix = showCurrency ? '$' : '';
    
    if (numValue === 0) return `${prefix}0`;
    
    const absValue = Math.abs(numValue);
    
    if (absValue >= 1e12) {
      return `${prefix}${(numValue / 1e12).toFixed(2)}T`;
    } else if (absValue >= 1e9) {
      return `${prefix}${(numValue / 1e9).toFixed(2)}B`;
    } else if (absValue >= 1e6) {
      return `${prefix}${(numValue / 1e6).toFixed(2)}M`;
    } else if (absValue >= 1e3) {
      return `${prefix}${(numValue / 1e3).toFixed(2)}K`;
    } else if (absValue >= 1) {
      return `${prefix}${numValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
    } else {
      return `${prefix}${numValue.toFixed(6)}`;
    }
  };
  
  /**
   * Format supply numbers without currency symbol
   */
  export const formatSupply = (supply) => {
    return formatLargeNumber(supply, false);
  };
  
  /**
   * Format time ago from timestamp
   */
  export const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    } else {
      return time.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };
  
  /**
   * Format date for display
   */
  export const formatDate = (date, options = {}) => {
    if (!date) return 'N/A';
    
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };
    
    return new Date(date).toLocaleDateString('en-US', defaultOptions);
  };
  
  /**
   * Format date and time
   */
  export const formatDateTime = (date) => {
    if (!date) return 'N/A';
    
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  /**
   * Truncate text with ellipsis
   */
  export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  /**
   * Format number with commas
   */
  export const formatNumber = (number, decimals = 0) => {
    if (number === null || number === undefined || isNaN(number)) {
      return 'N/A';
    }
    
    return Number(number).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };
  
  /**
   * Get color class for percentage change
   */
  export const getPercentageColor = (percentage) => {
    if (percentage === null || percentage === undefined) return 'text-gray-400';
    const num = Number(percentage);
    if (num > 0) return 'text-success-500';
    if (num < 0) return 'text-danger-500';
    return 'text-gray-400';
  };
  
  /**
   * Format rank with # symbol
   */
  export const formatRank = (rank) => {
    if (!rank || isNaN(rank)) return 'N/A';
    return `#${Number(rank).toLocaleString()}`;
  };
  
  /**
   * Convert timestamp to relative time
   */
  export const getRelativeTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((time - now) / 1000);
    
    const intervals = [
      { unit: 'year', seconds: 31536000 },
      { unit: 'month', seconds: 2592000 },
      { unit: 'week', seconds: 604800 },
      { unit: 'day', seconds: 86400 },
      { unit: 'hour', seconds: 3600 },
      { unit: 'minute', seconds: 60 }
    ];
    
    for (const interval of intervals) {
      const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
      if (count >= 1) {
        return rtf.format(diffInSeconds < 0 ? -count : count, interval.unit);
      }
    }
    
    return rtf.format(diffInSeconds, 'second');
  };
  
  /**
   * Format ATH/ATL change percentage
   */
  export const formatAthChange = (current, ath) => {
    if (!current || !ath) return 'N/A';
    
    const change = ((current - ath) / ath) * 100;
    return formatPercentage(change);
  };
  
  /**
   * Format price with appropriate precision based on value
   */
  export const formatPriceChange = (change) => {
    if (change === null || change === undefined || isNaN(change)) {
      return 'N/A';
    }
    
    const numChange = Number(change);
    const formatted = formatPrice(Math.abs(numChange));
    return numChange >= 0 ? `+${formatted}` : `-${formatted}`;
  };
  
  /**
   * Clean and format coin name
   */
  export const formatCoinName = (name) => {
    if (!name) return 'Unknown';
    
    // Remove common suffixes that might clutter the display
    return name.replace(/\s+(Token|Coin|Protocol|Network|Finance|USD)$/i, '');
  };
  
  /**
   * Format circulating supply percentage
   */
  export const formatSupplyPercentage = (circulating, total) => {
    if (!circulating || !total || circulating > total) return 'N/A';
    
    const percentage = (circulating / total) * 100;
    return `${percentage.toFixed(1)}%`;
  };