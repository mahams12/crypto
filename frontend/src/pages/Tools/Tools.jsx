import React, { useState } from 'react';
import { FiGrid, FiDollarSign, FiTrendingUp, FiPieChart, FiBarChart, FiTarget, FiClock, FiShield } from 'react-icons/fi';

const Tools = () => {
  const [activeCalculator, setActiveCalculator] = useState('profit-loss');

  // Calculator States
  const [profitLossData, setProfitLossData] = useState({
    buyPrice: '',
    sellPrice: '',
    quantity: '',
    fees: '0.1'
  });

  const [dcaData, setDCAData] = useState({
    totalInvestment: '',
    frequency: 'weekly',
    duration: '12',
    currentPrice: ''
  });

  const [stakingData, setStakingData] = useState({
    amount: '',
    apy: '',
    period: '12',
    compounding: 'monthly'
  });

  const [portfolioData, setPortfolioData] = useState([
    { coin: 'Bitcoin', symbol: 'BTC', amount: '', price: '' },
    { coin: 'Ethereum', symbol: 'ETH', amount: '', price: '' },
  ]);

  const calculatorTypes = [
    { 
      id: 'profit-loss', 
      name: 'Profit/Loss Calculator', 
      icon: <FiDollarSign />,
      description: 'Calculate trading profits and losses'
    },
    { 
      id: 'dca', 
      name: 'DCA Calculator', 
      icon: <FiTrendingUp />,
      description: 'Dollar Cost Averaging calculator'
    },
    { 
      id: 'staking', 
      name: 'Staking Rewards', 
      icon: <FiTarget />,
      description: 'Calculate staking rewards and APY'
    },
    { 
      id: 'portfolio', 
      name: 'Portfolio Tracker', 
      icon: <FiPieChart />,
      description: 'Track portfolio performance'
    },
    { 
      id: 'tax', 
      name: 'Tax Calculator', 
      icon: <FiBarChart />,
      description: 'Estimate crypto tax obligations'
    },
    { 
      id: 'mining', 
      name: 'Mining Profitability', 
      icon: <FiShield />,
      description: 'Calculate mining profits'
    }
  ];

  const tradingTools = [
    {
      name: 'Fear & Greed Index',
      description: 'Market sentiment indicator',
      value: '68',
      status: 'Greed',
      color: 'text-yellow-400'
    },
    {
      name: 'Rainbow Chart',
      description: 'Bitcoin price prediction tool',
      value: 'Hold',
      status: 'Accumulate',
      color: 'text-blue-400'
    },
    {
      name: 'Stock-to-Flow',
      description: 'Bitcoin scarcity model',
      value: '$125K',
      status: 'Bullish',
      color: 'text-green-400'
    },
    {
      name: 'Network Value',
      description: 'Fundamental analysis tool',
      value: 'Undervalued',
      status: 'Buy Signal',
      color: 'text-green-400'
    }
  ];

  const calculateProfitLoss = () => {
    const buy = parseFloat(profitLossData.buyPrice);
    const sell = parseFloat(profitLossData.sellPrice);
    const qty = parseFloat(profitLossData.quantity);
    const feeRate = parseFloat(profitLossData.fees) / 100;

    if (!buy || !sell || !qty) return null;

    const grossProfit = (sell - buy) * qty;
    const buyFees = buy * qty * feeRate;
    const sellFees = sell * qty * feeRate;
    const totalFees = buyFees + sellFees;
    const netProfit = grossProfit - totalFees;
    const profitPercentage = (netProfit / (buy * qty)) * 100;

    return {
      grossProfit,
      totalFees,
      netProfit,
      profitPercentage
    };
  };

  const calculateDCA = () => {
    const total = parseFloat(dcaData.totalInvestment);
    const duration = parseInt(dcaData.duration);
    const currentPrice = parseFloat(dcaData.currentPrice);

    if (!total || !duration) return null;

    const frequency = dcaData.frequency;
    let periods;
    
    switch (frequency) {
      case 'daily': periods = duration * 30; break;
      case 'weekly': periods = duration * 4; break;
      case 'monthly': periods = duration; break;
      default: periods = duration * 4;
    }

    const amountPerPeriod = total / periods;
    
    return {
      amountPerPeriod,
      totalPeriods: periods,
      frequency
    };
  };

  const calculateStaking = () => {
    const amount = parseFloat(stakingData.amount);
    const apy = parseFloat(stakingData.apy) / 100;
    const period = parseInt(stakingData.period);

    if (!amount || !apy || !period) return null;

    const compoundingFrequency = stakingData.compounding === 'daily' ? 365 : 
                                 stakingData.compounding === 'monthly' ? 12 : 1;

    const finalAmount = amount * Math.pow(1 + apy / compoundingFrequency, compoundingFrequency * (period / 12));
    const totalRewards = finalAmount - amount;

    return {
      finalAmount,
      totalRewards,
      monthlyRewards: totalRewards / period
    };
  };

  const renderCalculator = () => {
    switch (activeCalculator) {
      case 'profit-loss':
        const plResult = calculateProfitLoss();
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Buy Price ($)</label>
                  <input
                    type="number"
                    value={profitLossData.buyPrice}
                    onChange={(e) => setProfitLossData({...profitLossData, buyPrice: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter buy price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sell Price ($)</label>
                  <input
                    type="number"
                    value={profitLossData.sellPrice}
                    onChange={(e) => setProfitLossData({...profitLossData, sellPrice: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter sell price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={profitLossData.quantity}
                    onChange={(e) => setProfitLossData({...profitLossData, quantity: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter quantity"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Trading Fees (%)</label>
                  <input
                    type="number"
                    value={profitLossData.fees}
                    onChange={(e) => setProfitLossData({...profitLossData, fees: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter fee percentage"
                  />
                </div>
              </div>
              
              {plResult && (
                <div className="bg-gray-700 rounded-lg p-6 space-y-4">
                  <h3 className="font-bold text-lg">Results</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Gross Profit/Loss:</span>
                      <span className={`font-medium ${plResult.grossProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${plResult.grossProfit.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total Fees:</span>
                      <span className="text-red-400">-${plResult.totalFees.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-600 pt-2">
                      <span className="text-gray-300 font-medium">Net Profit/Loss:</span>
                      <span className={`font-bold ${plResult.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${plResult.netProfit.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300 font-medium">Return:</span>
                      <span className={`font-bold ${plResult.profitPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {plResult.profitPercentage.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'dca':
        const dcaResult = calculateDCA();
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total Investment ($)</label>
                  <input
                    type="number"
                    value={dcaData.totalInvestment}
                    onChange={(e) => setDCAData({...dcaData, totalInvestment: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter total amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Investment Frequency</label>
                  <select
                    value={dcaData.frequency}
                    onChange={(e) => setDCAData({...dcaData, frequency: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration (Months)</label>
                  <input
                    type="number"
                    value={dcaData.duration}
                    onChange={(e) => setDCAData({...dcaData, duration: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter duration in months"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Current Price ($)</label>
                  <input
                    type="number"
                    value={dcaData.currentPrice}
                    onChange={(e) => setDCAData({...dcaData, currentPrice: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Current asset price"
                  />
                </div>
              </div>

              {dcaResult && (
                <div className="bg-gray-700 rounded-lg p-6 space-y-4">
                  <h3 className="font-bold text-lg">DCA Strategy</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Investment per {dcaResult.frequency}:</span>
                      <span className="font-medium text-blue-400">
                        ${dcaResult.amountPerPeriod.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total Periods:</span>
                      <span className="font-medium text-white">
                        {dcaResult.totalPeriods}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Strategy:</span>
                      <span className="font-medium text-green-400">
                        {dcaResult.frequency.charAt(0).toUpperCase() + dcaResult.frequency.slice(1)} DCA
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'staking':
        const stakingResult = calculateStaking();
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Staking Amount</label>
                  <input
                    type="number"
                    value={stakingData.amount}
                    onChange={(e) => setStakingData({...stakingData, amount: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount to stake"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">APY (%)</label>
                  <input
                    type="number"
                    value={stakingData.apy}
                    onChange={(e) => setStakingData({...stakingData, apy: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Annual percentage yield"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Staking Period (Months)</label>
                  <input
                    type="number"
                    value={stakingData.period}
                    onChange={(e) => setStakingData({...stakingData, period: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Staking duration"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Compounding</label>
                  <select
                    value={stakingData.compounding}
                    onChange={(e) => setStakingData({...stakingData, compounding: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              {stakingResult && (
                <div className="bg-gray-700 rounded-lg p-6 space-y-4">
                  <h3 className="font-bold text-lg">Staking Rewards</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Initial Amount:</span>
                      <span className="font-medium text-white">
                        ${parseFloat(stakingData.amount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Final Amount:</span>
                      <span className="font-medium text-green-400">
                        ${stakingResult.finalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total Rewards:</span>
                      <span className="font-medium text-green-400">
                        ${stakingResult.totalRewards.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Monthly Rewards:</span>
                      <span className="font-medium text-blue-400">
                        ${stakingResult.monthlyRewards.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'portfolio':
        const totalValue = portfolioData.reduce((sum, item) => {
          const amount = parseFloat(item.amount) || 0;
          const price = parseFloat(item.price) || 0;
          return sum + (amount * price);
        }, 0);

        return (
          <div className="space-y-6">
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4">Portfolio Overview</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  ${totalValue.toFixed(2)}
                </div>
                <div className="text-gray-400">Total Portfolio Value</div>
              </div>
            </div>

            <div className="space-y-4">
              {portfolioData.map((item, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <div className="font-medium">{item.coin}</div>
                      <div className="text-sm text-gray-400">{item.symbol}</div>
                    </div>
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) => {
                        const newData = [...portfolioData];
                        newData[index].amount = e.target.value;
                        setPortfolioData(newData);
                      }}
                      className="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                      placeholder="Amount"
                    />
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => {
                        const newData = [...portfolioData];
                        newData[index].price = e.target.value;
                        setPortfolioData(newData);
                      }}
                      className="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                      placeholder="Price ($)"
                    />
                    <div className="text-right">
                      <div className="font-medium text-green-400">
                        ${((parseFloat(item.amount) || 0) * (parseFloat(item.price) || 0)).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">Value</div>
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                onClick={() => setPortfolioData([...portfolioData, { coin: '', symbol: '', amount: '', price: '' }])}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg border-2 border-dashed border-gray-500 transition-colors"
              >
                + Add Asset
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <FiGrid className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-400">
              Select a calculator from the sidebar to get started
            </h3>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Crypto Tools & Calculators</h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Professional-grade tools to help you make informed decisions in the cryptocurrency market.
          </p>
        </div>

        {/* Calculator Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {calculatorTypes.map((calc) => (
            <button
              key={calc.id}
              onClick={() => setActiveCalculator(calc.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                activeCalculator === calc.id
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="text-2xl mb-2 flex justify-center">{calc.icon}</div>
              <div className="text-sm font-medium text-center">{calc.name}</div>
            </button>
          ))}
        </div>

        {/* Calculator Content */}
        <div className="bg-gray-800 rounded-lg p-6 mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">
              {calculatorTypes.find(c => c.id === activeCalculator)?.name}
            </h2>
            <p className="text-gray-400">
              {calculatorTypes.find(c => c.id === activeCalculator)?.description}
            </p>
          </div>
          
          {renderCalculator()}
        </div>

        {/* Trading Tools */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Market Analysis Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tradingTools.map((tool, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
                <h3 className="font-bold text-lg mb-2">{tool.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{tool.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Value:</span>
                    <span className={`font-bold ${tool.color}`}>{tool.value}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Signal:</span>
                    <span className={`font-medium ${tool.color}`}>{tool.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Tools;