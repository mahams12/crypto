/**
 * Application constants and configuration values
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  WS_URL: process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Image Configuration
export const IMAGE_CONFIG = {
  CRYPTO_ICONS_BASE_URL: 'https://assets.coingecko.com/coins/images',
  FALLBACK_ICON: '/assets/images/default-coin.png',
  SUPPORTED_FORMATS: ['png', 'jpg', 'jpeg', 'webp', 'svg'],
};

// Cache Configuration
export const CACHE_CONFIG = {
  COINS_TTL: 30 * 1000, // 30 seconds
  NEWS_TTL: 5 * 60 * 1000, // 5 minutes
  SEARCH_TTL: 2 * 60 * 1000, // 2 minutes
  MARKET_STATS_TTL: 1 * 60 * 1000, // 1 minute
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MOBILE_PAGE_SIZE: 10,
};

// Cryptocurrency Categories
export const CRYPTO_CATEGORIES = {
  ALL: 'all',
  GAINERS: 'gainers',
  LOSERS: 'losers',
  TRENDING: 'trending',
  NEW: 'new',
  DEFI: 'defi',
  NFT: 'nft',
};

// News Categories
export const NEWS_CATEGORIES = {
  ALL: 'all',
  BITCOIN: 'bitcoin',
  ETHEREUM: 'ethereum',
  DEFI: 'defi',
  NFT: 'nft',
  TRADING: 'trading',
  REGULATION: 'regulation',
  GENERAL: 'general',
};

// Sort Options
export const SORT_OPTIONS = {
  MARKET_CAP_RANK: 'market_cap_rank',
  PRICE: 'price',
  MARKET_CAP: 'market_cap',
  VOLUME: 'volume',
  PRICE_CHANGE_1H: '1h_change',
  PRICE_CHANGE_24H: '24h_change',
  PRICE_CHANGE_7D: '7d_change',
  NAME: 'name',
  SYMBOL: 'symbol',
};

// API Endpoints
export const API_ENDPOINTS = {
  COINS: '/coins',
  NEWS: '/news',
  SEARCH: '/search',
  MARKET_STATS: '/market-stats',
  PRICE_HISTORY: '/price-history',
  TRENDING: '/trending',
};

// Price Chart Timeframes
export const CHART_TIMEFRAMES = [
  { days: 1, label: '1D', shortLabel: '1D' },
  { days: 7, label: '7D', shortLabel: '7D' },
  { days: 30, label: '1M', shortLabel: '1M' },
  { days: 90, label: '3M', shortLabel: '3M' },
  { days: 365, label: '1Y', shortLabel: '1Y' },
  { days: 'max', label: 'All', shortLabel: 'All' },
];

// Theme Configuration
export const THEME = {
  COLORS: {
    PRIMARY: '#3b82f6',
    SUCCESS: '#22c55e',
    DANGER: '#ef4444',
    WARNING: '#f59e0b',
    INFO: '#06b6d4',
    DARK: '#0f172a',
    LIGHT: '#f8fafc',
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
  },
};

// Animation Durations (in milliseconds)
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 1000,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'cryptotracker_theme',
  LANGUAGE: 'cryptotracker_language',
  WATCHLIST: 'cryptotracker_watchlist',
  PORTFOLIO: 'cryptotracker_portfolio',
  NEWS_BOOKMARKS: 'cryptotracker_news_bookmarks',
  RECENT_SEARCHES: 'cryptotracker_recent_searches',
  USER_PREFERENCES: 'cryptotracker_preferences',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  RATE_LIMIT: 'Too many requests. Please wait a moment before trying again.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  TIMEOUT: 'Request timeout. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
  IMAGE_LOAD_ERROR: 'Failed to load image.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  DATA_LOADED: 'Data loaded successfully',
  WATCHLIST_ADDED: 'Added to watchlist',
  WATCHLIST_REMOVED: 'Removed from watchlist',
  BOOKMARK_ADDED: 'Article bookmarked',
  BOOKMARK_REMOVED: 'Bookmark removed',
  SETTINGS_SAVED: 'Settings saved successfully',
};

// Cryptocurrency Icons/Colors with fallback images
export const COIN_COLORS = {
  BTC: '#f7931a',
  ETH: '#627eea',
  BNB: '#f3ba2f',
  ADA: '#0033ad',
  SOL: '#9945ff',
  XRP: '#23292f',
  DOT: '#e6007a',
  DOGE: '#c2a633',
  AVAX: '#e84142',
  MATIC: '#8247e5',
  LINK: '#375bd2',
  UNI: '#ff007a',
  LTC: '#bfbbbb',
  BCH: '#8dc351',
  XLM: '#14b6e7',
  ATOM: '#2e3148',
  CRONOS: '#002d74',
  DEFAULT: '#6b7280',
};

// Cryptocurrency Icon mappings for fallback
export const COIN_ICONS = {
  BTC: 'bitcoin',
  ETH: 'ethereum', 
  BNB: 'binancecoin',
  ADA: 'cardano',
  SOL: 'solana',
  XRP: 'ripple',
  DOT: 'polkadot',
  DOGE: 'dogecoin',
  AVAX: 'avalanche-2',
  MATIC: 'matic-network',
  LINK: 'chainlink',
  UNI: 'uniswap',
  LTC: 'litecoin',
  BCH: 'bitcoin-cash',
  XLM: 'stellar',
  ATOM: 'cosmos',
  CRONOS: 'crypto-com-chain',
};

// Regular Expressions
export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  CRYPTO_ADDRESS: /^[a-km-zA-HJ-NP-Z1-9]{25,34}$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
};

// Feature Flags
export const FEATURES = {
  ENABLE_WEBSOCKET: process.env.REACT_APP_ENABLE_WEBSOCKET === 'true',
  ENABLE_PORTFOLIO: process.env.REACT_APP_ENABLE_PORTFOLIO === 'true',
  ENABLE_ALERTS: process.env.REACT_APP_ENABLE_ALERTS === 'true',
  ENABLE_SOCIAL: process.env.REACT_APP_ENABLE_SOCIAL === 'true',
  ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  ENABLE_PWA: process.env.REACT_APP_ENABLE_PWA === 'true',
};

// Social Media Links
export const SOCIAL_LINKS = {
  TWITTER: 'https://twitter.com/cryptotracker',
  DISCORD: 'https://discord.gg/cryptotracker',
  TELEGRAM: 'https://t.me/cryptotracker',
  REDDIT: 'https://reddit.com/r/cryptotracker',
  GITHUB: 'https://github.com/cryptotracker/app',
};

// External Links
export const EXTERNAL_LINKS = {
  COINGECKO: 'https://coingecko.com',
  COINMARKETCAP: 'https://coinmarketcap.com',
  BLOCKCHAIN_EXPLORER: 'https://blockchair.com',
  DEFI_PULSE: 'https://defipulse.com',
  NEWS_SOURCES: {
    COINDESK: 'https://coindesk.com',
    COINTELEGRAPH: 'https://cointelegraph.com',
    DECRYPT: 'https://decrypt.co',
    THE_BLOCK: 'https://theblock.co',
  },
};

// Supported Languages
export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

// Market Status
export const MARKET_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  WEEKEND: 'weekend',
  HOLIDAY: 'holiday',
};

// Data Update Intervals
export const UPDATE_INTERVALS = {
  PRICE_TICKER: 5000, // 5 seconds
  MARKET_DATA: 30000, // 30 seconds
  NEWS: 300000, // 5 minutes
  PORTFOLIO: 60000, // 1 minute
  WATCHLIST: 30000, // 30 seconds
};

// Mobile Detection
export const MOBILE_BREAKPOINT = 768;

// Maximum Values
export const MAX_VALUES = {
  WATCHLIST_ITEMS: 100,
  PORTFOLIO_ITEMS: 50,
  SEARCH_RESULTS: 50,
  NEWS_BOOKMARKS: 100,
  RECENT_SEARCHES: 20,
};

// Default Values
export const DEFAULTS = {
  CURRENCY: 'USD',
  LANGUAGE: 'en',
  THEME: 'dark',
  PAGE_SIZE: 20,
  CHART_TIMEFRAME: 7, // days
  NEWS_CATEGORY: 'all',
  SORT_BY: 'market_cap_rank',
};

export default {
  API_CONFIG,
  IMAGE_CONFIG,
  CACHE_CONFIG,
  PAGINATION,
  CRYPTO_CATEGORIES,
  NEWS_CATEGORIES,
  SORT_OPTIONS,
  API_ENDPOINTS,
  CHART_TIMEFRAMES,
  THEME,
  ANIMATION,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  COIN_COLORS,
  COIN_ICONS,
  REGEX,
  FEATURES,
  SOCIAL_LINKS,
  EXTERNAL_LINKS,
  LANGUAGES,
  MARKET_STATUS,
  UPDATE_INTERVALS,
  MOBILE_BREAKPOINT,
  MAX_VALUES,
  DEFAULTS,
};