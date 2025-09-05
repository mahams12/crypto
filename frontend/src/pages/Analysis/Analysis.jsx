import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiTrendingUp, FiTrendingDown, FiBarChart2, FiPieChart, FiTarget, FiCalendar } from 'react-icons/fi';
import PriceChart from '../../components/Charts/PriceChart';
import Loading from '../../components/Common/Loading';
import cryptoService from '../../services/cryptoService';
import { formatPrice, formatPercentage, formatMarketCap } from '../../utils/formatters';

const Analysis = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [selectedAnalysisType, setSelectedAnalysisType] = useState('technical');
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');

  const { data: analysisData, isLoading, error } = useQuery(
    ['analysis', selectedCoin, selectedTimeframe, selectedAnalysisType],
    () => cryptoService.getAnalysis ? cryptoService.getAnalysis(selectedCoin, selectedTimeframe, selectedAnalysisType) : Promise.resolve(null),
    {
      refetchInterval: 5 * 60 * 1000, // 5 minutes
    }
  );

  const { data: marketData } = useQuery(
    ['market-analysis'],
    () => cryptoService.getMarketAnalysis ? cryptoService.getMarketAnalysis() : cryptoService.getMarketStats(),
    {
      refetchInterval: 10 * 60 * 1000, // 10 minutes
    }
  );

  const timeframes = [
    { value: '24h', label: '24H' },
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' },
    { value: '90d', label: '3M' },
    { value: '1y', label: '1Y' },
  ];

  const analysisTypes = [
    { value: 'technical', label: 'Technical Analysis', icon: <FiBarChart2 /> },
    { value: 'fundamental', label: 'Fundamental', icon: <FiPieChart /> },
    { value: 'sentiment', label: 'Sentiment', icon: <FiTarget /> },
    { value: 'onchain', label: 'On-Chain', icon: <FiCalendar /> },
  ];

  const popularCoins = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
    { id: 'solana', name: 'Solana', symbol: 'SOL' },
    { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
  ];

  const marketMetrics = [
    { 
      title: 'Market Fear & Greed',
      value: '68',
      status: 'Greed',
      change: '+5',
      color: 'text-yellow-400',
      description: 'Market sentiment showing greed levels'
    },
    {
      title: 'Bitcoin Dominance',
      value: '52.3%',
      status: 'Stable',
      change: '-0.2%',
      color: 'text-blue-400',
      description: 'BTC market cap vs total crypto market'
    },
    {
      title: 'Total Market Cap',
      value: '$2.1T',
      status: 'Growing',
      change: '+3.4%',
      color: 'text-green-400',
      description: 'Total cryptocurrency market capitalization'
    },
    {
      title: 'Active Addresses',
      value: '1.2M',
      status: 'Active',
      change: '+8.1%',
      color: 'text-purple-400',
      description: 'Daily active wallet addresses'
    }
  ];

  const technicalIndicators = [
    { name: 'RSI (14)', value: 65.4, signal: 'Neutral', color: 'text-yellow-400' },
    { name: 'MACD', value: 'Bullish', signal: 'Buy', color: 'text-green-400' },
    { name: 'Moving Average (20)', value: 'Above', signal: 'Bullish', color: 'text-green-400' },
    { name: 'Bollinger Bands', value: 'Upper', signal: 'Overbought', color: 'text-red-400' },
    { name: 'Volume', value: 'High', signal: 'Confirming', color: 'text-blue-400' },
    { name: 'Support Level', value: formatPrice ? formatPrice(98500) : '$98,500', signal: 'Strong', color: 'text-green-400' },
  ];

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Market Analysis</h1>
          <p className="text-gray-400 text-lg">
            In-depth technical, fundamental, and sentiment analysis of cryptocurrency markets
          </p>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Coin Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Cryptocurrency
              </label>
              <select
                value={selectedCoin}
                onChange={(e) => setSelectedCoin(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {popularCoins.map(coin => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Timeframe Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Timeframe
              </label>
              <div className="flex space-x-2">
                {timeframes.map(timeframe => (
                  <button
                    key={timeframe.value}
                    onClick={() => setSelectedTimeframe(timeframe.value)}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      selectedTimeframe === timeframe.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {timeframe.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Analysis Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Analysis Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {analysisTypes.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedAnalysisType(type.value)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                      selectedAnalysisType === type.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {type.icon}
                    <span className="text-xs">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Market Overview Metrics */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Market Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketMetrics.map((metric, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-400 text-sm font-medium">{metric.title}</h3>
                  <span className={`text-sm ${metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.change}
                  </span>
                </div>
                <div className="mb-2">
                  <span className={`text-2xl font-bold ${metric.color}`}>{metric.value}</span>
                  <span className="text-gray-400 text-sm ml-2">{metric.status}</span>
                </div>
                <p className="text-gray-500 text-xs">{metric.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Analysis Panel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Price Chart */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Price Chart & Analysis</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>Last updated:</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
              <div className="h-96">
                <PriceChart coinId={selectedCoin} timeframe={selectedTimeframe} />
              </div>
            </div>

            {/* Analysis Summary */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Analysis Summary</h3>
              {analysisData ? (
                <div className="space-y-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Overall Signal</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        analysisData.overallSignal === 'Bullish' ? 'bg-green-600 text-white' :
                        analysisData.overallSignal === 'Bearish' ? 'bg-red-600 text-white' :
                        'bg-yellow-600 text-white'
                      }`}>
                        {analysisData.overallSignal || 'Neutral'}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {analysisData.summary || `Based on current ${selectedAnalysisType} analysis, the market shows ${analysisData.overallSignal?.toLowerCase() || 'neutral'} signals with moderate volatility expected.`}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h5 className="font-medium text-green-400 mb-2">Bullish Factors</h5>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {analysisData.bullishFactors?.map((factor, index) => (
                          <li key={index}>• {factor}</li>
                        )) || [
                          "• Strong support levels holding",
                          "• Increasing trading volume",
                          "• Positive market sentiment"
                        ].map((factor, index) => <li key={index}>{factor}</li>)}
                      </ul>
                    </div>

                    <div className="bg-gray-700 rounded-lg p-4">
                      <h5 className="font-medium text-red-400 mb-2">Bearish Factors</h5>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {analysisData.bearishFactors?.map((factor, index) => (
                          <li key={index}>• {factor}</li>
                        )) || [
                          "• Resistance at key levels",
                          "• Market uncertainty",
                          "• Regulatory concerns"
                        ].map((factor, index) => <li key={index}>{factor}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-4">
                    <h5 className="font-medium text-blue-400 mb-2">Key Levels</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Support:</span>
                        <span className="text-white ml-2">{formatPrice ? formatPrice(analysisData.supportLevel || 98500) : '$98,500'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Resistance:</span>
                        <span className="text-white ml-2">{formatPrice ? formatPrice(analysisData.resistanceLevel || 105000) : '$105,000'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Target:</span>
                        <span className="text-white ml-2">{formatPrice ? formatPrice(analysisData.targetLevel || 108000) : '$108,000'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">Loading analysis data...</div>
              )}
            </div>

            {/* Market Insights */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Market Insights</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-blue-400">Trend Analysis</h4>
                  <p className="text-gray-300 text-sm mt-1">
                    The current trend shows consolidation around key resistance levels with potential for upward momentum 
                    if volume increases. Watch for breakout above $105,000.
                  </p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-semibold text-yellow-400">Volume Analysis</h4>
                  <p className="text-gray-300 text-sm mt-1">
                    Trading volume has increased by 15% in the last 24 hours, indicating growing interest. 
                    This could support price movement in either direction.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-400">Momentum Indicators</h4>
                  <p className="text-gray-300 text-sm mt-1">
                    RSI shows neutral territory while MACD suggests potential bullish crossover. 
                    Moving averages provide strong support structure.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Technical Indicators */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Technical Indicators</h3>
              <div className="space-y-3">
                {technicalIndicators.map((indicator, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                    <div>
                      <div className="font-medium text-sm">{indicator.name}</div>
                      <div className={`text-xs ${indicator.color}`}>{indicator.signal}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">{indicator.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Sentiment */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Market Sentiment</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Fear & Greed Index</span>
                    <span>68/100</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Greed</div>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Social Sentiment</span>
                    <span>Positive</span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1 bg-green-600 h-2 rounded"></div>
                    <div className="flex-1 bg-gray-700 h-2 rounded"></div>
                    <div className="flex-1 bg-gray-700 h-2 rounded"></div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Based on social media analysis</div>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>News Sentiment</span>
                    <span>Neutral</span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1 bg-gray-700 h-2 rounded"></div>
                    <div className="flex-1 bg-yellow-500 h-2 rounded"></div>
                    <div className="flex-1 bg-gray-700 h-2 rounded"></div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Recent news analysis</div>
                </div>
              </div>
            </div>

            {/* Price Targets */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Price Targets</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Short-term (7d)</span>
                  <span className="text-green-400 font-medium">$108,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Medium-term (30d)</span>
                  <span className="text-blue-400 font-medium">$115,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Long-term (90d)</span>
                  <span className="text-purple-400 font-medium">$125,000</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">Confidence Level</span>
                    <span className="text-sm">72%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Risk Assessment</h3>
              <div className="space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-yellow-400">⚠️</span>
                    <span className="font-medium text-yellow-300">Moderate Risk</span>
                  </div>
                  <p className="text-yellow-200 text-sm">
                    Current market conditions show moderate volatility with potential for both upside and downside movements.
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volatility</span>
                    <span className="text-yellow-400">Medium</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Liquidity</span>
                    <span className="text-green-400">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Market Risk</span>
                    <span className="text-yellow-400">Moderate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-red-900/20 border border-red-700 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="text-red-400 mt-1">⚠️</div>
            <div>
              <h4 className="font-semibold text-red-300 mb-1">Analysis Disclaimer</h4>
              <p className="text-red-200 text-sm">
                This analysis is for informational and educational purposes only and should not be considered as financial advice. 
                Cryptocurrency markets are highly volatile and unpredictable. Always conduct your own research and consider your 
                risk tolerance before making investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;