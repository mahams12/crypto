import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Header from './components/Header/Header';
import PriceTicker from './components/PriceTicker/PriceTicker';
import ErrorBoundary from './components/Common/ErrorBoundary';

// Pages
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Home from './pages/Home/Home';
import Markets from './pages/Markets/Markets';
import MarketDetail from './pages/Markets/MarketDetail';
import News from './pages/News/News';
import NewsDetail from './pages/NewsDetail'; // Add NewsDetail import
import CoinDetails from './pages/CoinDetails/CoinDetails';
import Opinion from './pages/Opinion/Opinion';
import OpinionDetail from './pages/Opinion/OpinionDetail';
import FollowUp from './pages/FollowUp/FollowUp';
import FollowUpDetail from './pages/FollowUp/FollowUpDetail';
import Predictions from './pages/Predictions/Predictions';
import PredictionDetail from './pages/Predictions/PredictionDetail';
import Prices from './pages/Prices/Prices';
import Learn from './pages/Learn/Learn';
import Guides from './pages/Guides/Guides';
import Analysis from './pages/Analysis/Analysis';
import Tools from './pages/Tools/Tools';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import NotFound from './pages/NotFound/NotFound';

// Styles
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 30 * 1000, // 30 seconds
      cacheTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  useEffect(() => {
    // Remove loading spinner
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
      spinner.style.display = 'none';
    }
  }, []);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    duration: 0.3
  };

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <div className="min-h-screen bg-dark-950 text-gray-100">
              {/* Header */}
              <Header />
              
              {/* Price Ticker */}
              <PriceTicker />
              
              {/* Main Content */}
              <main className="relative">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route 
                      path="/" 
                      element={
                        <motion.div
                          key="home"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <Home />
                        </motion.div>
                      } 
                    />
                    
                    {/* News Routes - Fixed Order */}
                    <Route 
                      path="/news" 
                      element={
                        <motion.div
                          key="news"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <News />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/news/category/:category" 
                      element={
                        <motion.div
                          key="news-category"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <News />
                        </motion.div>
                      } 
                    />
                    {/* News Detail Route - FIXED */}
                    <Route 
                      path="/news/:id" 
                      element={
                        <motion.div
                          key="news-detail"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <NewsDetail />
                        </motion.div>
                      } 
                    />
                    
                    {/* Opinion Routes */}
                    <Route 
                      path="/opinion" 
                      element={
                        <motion.div
                          key="opinion"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <Opinion />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/opinion/:articleId" 
                      element={
                        <motion.div
                          key="opinion-detail"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <OpinionDetail />
                        </motion.div>
                      } 
                    />
                    
                    {/* Follow-up Routes */}
                    <Route 
                      path="/follow-up" 
                      element={
                        <motion.div
                          key="follow-up"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <FollowUp />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/follow-up/:articleId" 
                      element={
                        <motion.div
                          key="follow-up-detail"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <FollowUpDetail />
                        </motion.div>
                      } 
                    />
                    
                    {/* Markets Routes */}
                    <Route 
                      path="/markets" 
                      element={
                        <motion.div
                          key="markets"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <Markets />
                        </motion.div>
                      } 
                    />
                    {/* Market Detail Route */}
                    <Route 
                      path="/markets/:articleId" 
                      element={
                        <motion.div
                          key="market-detail"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <MarketDetail />
                        </motion.div>
                      } 
                    />
                    
                    {/* Predictions Routes */}
                    <Route 
                      path="/predictions" 
                      element={
                        <motion.div
                          key="predictions"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <Predictions />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/predictions/:articleId" 
                      element={
                        <motion.div
                          key="prediction-detail"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <PredictionDetail />
                        </motion.div>
                      } 
                    />
                    
                    {/* Trading & Analysis Pages */}
                    <Route 
                      path="/prices" 
                      element={
                        <motion.div
                          key="prices"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <Prices />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/analysis" 
                      element={
                        <motion.div
                          key="analysis"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <Analysis />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/tools" 
                      element={
                        <motion.div
                          key="tools"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <Tools />
                        </motion.div>
                      } 
                    />
                    
                    {/* Educational Pages */}
                    <Route 
                      path="/learn" 
                      element={
                        <motion.div
                          key="learn"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <Learn />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/guides" 
                      element={
                        <motion.div
                          key="guides"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <Guides />
                        </motion.div>
                      } 
                    />
                    
                    {/* Company Pages */}
                    <Route
                      path="/terms"
                      element={
                        <motion.div
                          key="terms"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <Terms />
                        </motion.div>
                      }
                    />

                    <Route 
                      path="/privacy-policy" 
                      element={
                        <motion.div
                          key="privacy-policy"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <PrivacyPolicy />
                        </motion.div>
                      } 
                    />

                    <Route 
                      path="/about" 
                      element={
                        <motion.div
                          key="about"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <About />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/contact" 
                      element={
                        <motion.div
                          key="contact"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <Contact />
                        </motion.div>
                      } 
                    />
                    
                    {/* Coin Details */}
                    <Route 
                      path="/coin/:coinId" 
                      element={
                        <motion.div
                          key="coin-details"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <CoinDetails />
                        </motion.div>
                      } 
                    />
                    
                    {/* Legacy/Alternative Routes */}
                    <Route path="/category/:category" element={<News />} />
                    <Route path="/tag/:tag" element={<News />} />
                    
                    {/* 404 Route */}
                    <Route 
                      path="*" 
                      element={
                        <motion.div
                          key="not-found"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <NotFound />
                        </motion.div>
                      } 
                    />
                  </Routes>
                </AnimatePresence>
              </main>
              
              {/* Footer */}
              <footer className="mt-20 py-12 bg-dark-900 border-t border-dark-800">
                <div className="container mx-auto px-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">C</span>
                        </div>
                        <span className="text-xl font-bold">Crypto Tracker</span>
                      </div>
                      <p className="text-gray-400 mb-4 max-w-md">
                        Your trusted source for cryptocurrency news, market analysis, price predictions, 
                        and educational content. Stay ahead of the crypto market.
                      </p>
                      <p className="text-sm text-gray-500">
                        © 2025 Crypto Tracker. All rights reserved.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-4 text-white">News & Analysis</h3>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="/news" className="hover:text-blue-400 transition-colors">Latest News</a></li>
                        <li><a href="/opinion" className="hover:text-blue-400 transition-colors">Opinion</a></li>
                        <li><a href="/analysis" className="hover:text-blue-400 transition-colors">Market Analysis</a></li>
                        <li><a href="/predictions" className="hover:text-blue-400 transition-colors">Predictions</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4 text-white">Company</h3>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="/about" className="hover:text-blue-400 transition-colors">About</a></li>
                        <li><a href="/contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
                        <li><a href="/privacy-policy" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                        <li><a href="/terms" className="hover:text-blue-400 transition-colors">Terms</a></li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-dark-800">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                      
                      
                    </div>
                  </div>
                </div>
              </footer>
            </div>
            
            {/* Toast notifications */}
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1e293b',
                  color: '#e2e8f0',
                  border: '1px solid #334155',
                },
                success: {
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </Router>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;