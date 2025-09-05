/**
 * Helper utility functions used throughout the application
 */

import { MOBILE_BREAKPOINT, STORAGE_KEYS, COIN_COLORS } from './constants';

/**
 * Check if the current device is mobile
 */
export const isMobile = () => {
  return window.innerWidth < MOBILE_BREAKPOINT;
};

/**
 * Check if the app is running in development mode
 */
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Generate a unique ID
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Debounce function execution
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Throttle function execution
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Deep clone an object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

/**
 * Check if two objects are equal (shallow comparison)
 */
export const isEqual = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) {
    return false;
  }
  
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  
  return true;
};

/**
 * Get color for a cryptocurrency symbol
 */
export const getCoinColor = (symbol) => {
  if (!symbol) return COIN_COLORS.DEFAULT;
  const upperSymbol = symbol.toUpperCase();
  return COIN_COLORS[upperSymbol] || COIN_COLORS.DEFAULT;
};

/**
 * Local Storage helpers with error handling
 */
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage:`, error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage:`, error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage:`, error);
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error(`Error clearing localStorage:`, error);
      return false;
    }
  }
};

/**
 * Session Storage helpers
 */
export const session = {
  get: (key, defaultValue = null) => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from sessionStorage:`, error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to sessionStorage:`, error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from sessionStorage:`, error);
      return false;
    }
  }
};

/**
 * URL helpers
 */
export const url = {
  getParams: () => {
    return new URLSearchParams(window.location.search);
  },
  
  getParam: (name) => {
    return new URLSearchParams(window.location.search).get(name);
  },
  
  setParam: (name, value) => {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    window.history.replaceState({}, '', url);
  },
  
  removeParam: (name) => {
    const url = new URL(window.location);
    url.searchParams.delete(name);
    window.history.replaceState({}, '', url);
  },
  
  isValidUrl: (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }
};

/**
 * Array helpers
 */
export const array = {
  chunk: (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },
  
  shuffle: (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },
  
  unique: (array, key) => {
    if (!key) return [...new Set(array)];
    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  },
  
  groupBy: (array, key) => {
    return array.reduce((groups, item) => {
      const group = item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  },
  
  sortBy: (array, key, direction = 'asc') => {
    return [...array].sort((a, b) => {
      const aVal = typeof a[key] === 'string' ? a[key].toLowerCase() : a[key];
      const bVal = typeof b[key] === 'string' ? b[key].toLowerCase() : b[key];
      
      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }
};

/**
 * Number helpers
 */
export const number = {
  isNumeric: (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },
  
  random: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  round: (value, decimals = 2) => {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
  },
  
  clamp: (value, min, max) => {
    return Math.min(Math.max(value, min), max);
  },
  
  percentage: (value, total) => {
    if (total === 0) return 0;
    return (value / total) * 100;
  }
};

/**
 * String helpers
 */
export const string = {
  capitalize: (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  
  camelCase: (str) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  },
  
  kebabCase: (str) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  },
  
  truncate: (str, length, suffix = '...') => {
    if (str.length <= length) return str;
    return str.slice(0, length) + suffix;
  },
  
  slugify: (str) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },
  
  extractDomain: (url) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return '';
    }
  }
};

/**
 * Date helpers
 */
export const date = {
  isToday: (date) => {
    const today = new Date();
    const compareDate = new Date(date);
    return today.toDateString() === compareDate.toDateString();
  },
  
  isYesterday: (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const compareDate = new Date(date);
    return yesterday.toDateString() === compareDate.toDateString();
  },
  
  formatRelative: (date) => {
    const now = new Date();
    const compareDate = new Date(date);
    const diffInSeconds = Math.floor((now - compareDate) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return compareDate.toLocaleDateString();
  },
  
  addDays: (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },
  
  getDaysDiff: (date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    return Math.round(Math.abs((firstDate - secondDate) / oneDay));
  }
};

/**
 * Color helpers
 */
export const color = {
  hexToRgb: (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },
  
  rgbToHex: (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },
  
  lighten: (hex, amount) => {
    const rgb = color.hexToRgb(hex);
    if (!rgb) return hex;
    
    const { r, g, b } = rgb;
    return color.rgbToHex(
      Math.min(255, r + amount),
      Math.min(255, g + amount),
      Math.min(255, b + amount)
    );
  },
  
  darken: (hex, amount) => {
    const rgb = color.hexToRgb(hex);
    if (!rgb) return hex;
    
    const { r, g, b } = rgb;
    return color.rgbToHex(
      Math.max(0, r - amount),
      Math.max(0, g - amount),
      Math.max(0, b - amount)
    );
  }
};

/**
 * Copy to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      console.error('Failed to copy text: ', err);
      return false;
    }
  }
};

/**
 * Download data as file
 */
export const downloadAsFile = (data, filename, type = 'application/json') => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Share data using Web Share API
 */
export const shareData = async (data) => {
  if (navigator.share) {
    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      console.error('Error sharing:', error);
      return false;
    }
  } else {
    // Fallback: copy URL to clipboard
    if (data.url) {
      return copyToClipboard(data.url);
    }
    return false;
  }
};

/**
 * Scroll to element
 */
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const top = element.offsetTop - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};

/**
 * Get viewport dimensions
 */
export const getViewport = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
};

/**
 * Check if element is in viewport
 */
export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Format file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Generate random hex color
 */
export const randomHexColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

/**
 * Validate various data types
 */
export const validate = {
  email: (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  },
  
  url: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  
  phoneNumber: (phone) => {
    const re = /^\+?[1-9]\d{1,14}$/;
    return re.test(phone.replace(/\s/g, ''));
  },
  
  strongPassword: (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  }
};

/**
 * Watchlist management
 */
export const watchlist = {
  get: () => {
    return storage.get(STORAGE_KEYS.WATCHLIST, []);
  },
  
  add: (coinId) => {
    const currentWatchlist = watchlist.get();
    if (!currentWatchlist.includes(coinId)) {
      const updatedWatchlist = [...currentWatchlist, coinId];
      storage.set(STORAGE_KEYS.WATCHLIST, updatedWatchlist);
      return true;
    }
    return false;
  },
  
  remove: (coinId) => {
    const currentWatchlist = watchlist.get();
    const updatedWatchlist = currentWatchlist.filter(id => id !== coinId);
    storage.set(STORAGE_KEYS.WATCHLIST, updatedWatchlist);
    return true;
  },
  
  toggle: (coinId) => {
    const currentWatchlist = watchlist.get();
    if (currentWatchlist.includes(coinId)) {
      return watchlist.remove(coinId);
    } else {
      return watchlist.add(coinId);
    }
  },
  
  isInWatchlist: (coinId) => {
    const currentWatchlist = watchlist.get();
    return currentWatchlist.includes(coinId);
  },
  
  clear: () => {
    storage.set(STORAGE_KEYS.WATCHLIST, []);
  }
};

/**
 * Theme helpers
 */
export const theme = {
  get: () => {
    return storage.get(STORAGE_KEYS.THEME, 'dark');
  },
  
  set: (themeName) => {
    storage.set(STORAGE_KEYS.THEME, themeName);
    document.documentElement.setAttribute('data-theme', themeName);
  },
  
  toggle: () => {
    const currentTheme = theme.get();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    theme.set(newTheme);
    return newTheme;
  },
  
  isDark: () => {
    return theme.get() === 'dark';
  }
};

/**
 * Performance helpers
 */
export const performance = {
  measure: (name, fn) => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  },
  
  measureAsync: async (name, fn) => {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  }
};

/**
 * Error handling helpers
 */
export const errorHandler = {
  log: (error, context = '') => {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context,
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    console.error('Error logged:', errorInfo);
    
    // In production, you might want to send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // sendToErrorTrackingService(errorInfo);
    }
  },
  
  notify: (error, userMessage = 'An unexpected error occurred') => {
    errorHandler.log(error);
    // Show user-friendly error message
    // This could integrate with your notification system
    alert(userMessage);
  }
};

export default {
  isMobile,
  isDevelopment,
  generateId,
  debounce,
  throttle,
  deepClone,
  isEqual,
  getCoinColor,
  storage,
  session,
  url,
  array,
  number,
  string,
  date,
  color,
  copyToClipboard,
  downloadAsFile,
  shareData,
  scrollToElement,
  getViewport,
  isInViewport,
  formatFileSize,
  randomHexColor,
  validate,
  watchlist,
  theme,
  performance,
  errorHandler
};