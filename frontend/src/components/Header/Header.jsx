import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineMenu, 
  HiOutlineX, 
  HiOutlineSearch,
  HiOutlineGlobeAlt,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineChevronDown
} from 'react-icons/hi';
import SearchBox from '../Common/SearchBox';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const navigation = [
    { 
      name: 'news', 
      href: '/news', 
      current: location.pathname.startsWith('/news'),
      hasDropdown: true,
      dropdownItems: [
        { name: 'All News', href: '/news' },
        { name: 'Bitcoin', href: '/news/category/bitcoin' },
        { name: 'Ethereum', href: '/news/category/ethereum' },
        { name: 'Altcoins', href: '/news/category/altcoins' },
        { name: 'DeFi', href: '/news/category/defi' },
        { name: 'NFTs', href: '/news/category/nfts' },
        { name: 'Regulation', href: '/news/category/regulation' },
      ]
    },
    { 
      name: 'opinion', 
      href: '/opinion', 
      current: location.pathname === '/opinion' 
    },
    { 
      name: 'follow-up', 
      href: '/follow-up', 
      current: location.pathname === '/follow-up' 
    },
    { 
      name: 'markets', 
      href: '/markets', 
      current: location.pathname.startsWith('/markets'),
      hasDropdown: false // Removed dropdown as per crypto.news
    },
    { 
      name: 'predictions', 
      href: '/predictions', 
      current: location.pathname === '/predictions' 
    },
    { 
      name: 'prices', 
      href: '/prices', 
      current: location.pathname === '/prices' 
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, you'd update the theme context/localStorage here
  };

  const handleDropdownToggle = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-dark-950/95 backdrop-blur-lg border-b border-dark-800' 
            : 'bg-dark-950/90 backdrop-blur-lg'
        }`}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-shadow"
              >
                <span className="text-white font-bold text-lg">C</span>
              </motion.div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-white">Crypto Tracker</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navigation.map((item, index) => (
                <div key={item.name} className="relative group">
                  <Link
                    to={item.href}
                    className={`relative flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                      item.current
                        ? 'text-blue-400'
                        : 'text-gray-300 hover:text-blue-400'
                    }`}
                    onMouseEnter={() => item.hasDropdown && setActiveDropdown(index)}
                  >
                    {item.name}
                    {item.hasDropdown && (
                      <HiOutlineChevronDown className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" />
                    )}
                  </Link>
                  
                  {/* Dropdown Menu */}
                  {item.hasDropdown && (
                    <AnimatePresence>
                      {activeDropdown === index && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl py-2 z-50"
                          onMouseLeave={() => setActiveDropdown(null)}
                        >
                          {item.dropdownItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className="block px-4 py-2 text-sm text-gray-300 hover:text-blue-400 hover:bg-gray-800 transition-colors"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleSearch}
                className="p-2 text-gray-400 hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                aria-label="Search"
              >
                <HiOutlineSearch className="w-5 h-5" />
              </motion.button>

              {/* Mobile menu button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-gray-400 hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <HiOutlineX className="w-6 h-6" />
                ) : (
                  <HiOutlineMenu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-800 bg-gray-900"
            >
              <div className="px-4 py-6 space-y-4">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link
                      to={item.href}
                      className={`block px-3 py-2 text-base font-medium transition-colors capitalize ${
                        item.current
                          ? 'text-blue-400 bg-blue-500/10 rounded-lg'
                          : 'text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-lg'
                      }`}
                    >
                      {item.name}
                    </Link>
                    
                    {/* Mobile Dropdown Items */}
                    {item.hasDropdown && (
                      <div className="ml-4 mt-2 space-y-1">
                        {item.dropdownItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className="block px-3 py-1 text-sm text-gray-400 hover:text-blue-400 transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={toggleSearch}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -50 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="absolute top-20 left-4 right-4 max-w-2xl mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <SearchBox onClose={toggleSearch} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
};

export default Header;