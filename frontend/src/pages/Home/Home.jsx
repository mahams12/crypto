import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  HiOutlineTrendingUp, 
  HiOutlineNewspaper, 
  HiOutlineChartBar,
  HiOutlineGlobeAlt,
  HiOutlineArrowRight
} from 'react-icons/hi';

import PriceTable from '../../components/PriceTable/PriceTable';
import NewsSection from '../../components/NewsSection/NewsSection';
import { useCryptoData } from '../../hooks/useCryptoData';

const Home = () => {
  const { data: topCoins = [], isLoading } = useCryptoData(1, 10);

  const features = [
    {
      icon: HiOutlineTrendingUp,
      title: 'Real-time Prices',
      description: 'Live cryptocurrency prices updated every 30 seconds',
      color: 'text-success-500'
    },
    {
      icon: HiOutlineChartBar,
      title: 'Market Analysis',
      description: 'Comprehensive market cap and volume data',
      color: 'text-primary-500'
    },
    {
      icon: HiOutlineNewspaper,
      title: 'Latest News',
      description: 'Stay updated with breaking crypto news',
      color: 'text-warning-500'
    },
    {
      icon: HiOutlineGlobeAlt,
      title: 'Global Markets',
      description: 'Track cryptocurrencies from around the world',
      color: 'text-purple-500'
    }
  ];

  const stats = [
    { label: 'Cryptocurrencies', value: '2,000+' },
    { label: 'Market Cap', value: '$1.2T+' },
    { label: 'Daily Volume', value: '$50B+' },
    { label: 'Active Users', value: '10K+' }
  ];

  return (
    <>
      <Helmet>
        <title>CryptoTracker - Real-time Cryptocurrency Market Data</title>
        <meta name="description" content="Track Bitcoin, Ethereum and thousands of cryptocurrencies with real-time prices, charts and market analysis. Your ultimate crypto market companion." />
        <meta name="keywords" content="cryptocurrency, bitcoin, ethereum, crypto prices, market cap, trading, blockchain" />
      </Helmet>

      <div className="min-h-screen bg-dark-950">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-dark-950 to-purple-900/20" />
          
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="gradient-text">Track Crypto</span>
                <br />
                <span className="text-gray-100">Like a Pro</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Real-time cryptocurrency market data, prices, charts, and news. 
                Stay ahead of the market with CryptoTracker.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link to="/prices" className="btn btn-primary btn-lg">
                  <HiOutlineChartBar className="w-5 h-5 mr-2" />
                  View Markets
                </Link>
                <Link to="/news" className="btn btn-secondary btn-lg">
                  <HiOutlineNewspaper className="w-5 h-5 mr-2" />
                  Latest News
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold gradient-text mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Floating elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary-500/10 rounded-full blur-xl animate-float" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose <span className="gradient-text">CryptoTracker</span>?
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Everything you need to stay informed about the cryptocurrency market
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="card card-hover text-center"
                >
                  <div className={`w-12 h-12 ${feature.color} mx-auto mb-4`}>
                    <feature.icon className="w-full h-full" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-100">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Cryptocurrencies Section */}
        <section className="py-20 bg-dark-900/50">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-12"
            >
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Top <span className="gradient-text">Cryptocurrencies</span>
                </h2>
                <p className="text-gray-400">
                  Market leaders by market capitalization
                </p>
              </div>
              <Link
                to="/prices"
                className="btn btn-ghost group"
              >
                View All Prices
                <HiOutlineArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <PriceTable 
                data={topCoins} 
                isLoading={isLoading} 
                showPagination={false}
                maxRows={10}
              />
            </motion.div>
          </div>
        </section>

        {/* News Section */}
        <section className="py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-12"
            >
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Latest <span className="gradient-text">Crypto News</span>
                </h2>
                <p className="text-gray-400">
                  Stay updated with the latest market developments
                </p>
              </div>
              <Link
                to="/news"
                className="btn btn-ghost group"
              >
                All News
                <HiOutlineArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <NewsSection maxItems={6} showPagination={false} />
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary-900/20 to-purple-900/20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-4xl font-bold mb-6">
                Ready to start tracking crypto?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of traders and investors who trust CryptoTracker 
                for real-time market data and insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/prices" className="btn btn-primary btn-lg">
                  Explore Prices
                </Link>
                <Link to="/news" className="btn btn-secondary btn-lg">
                  Read News
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;