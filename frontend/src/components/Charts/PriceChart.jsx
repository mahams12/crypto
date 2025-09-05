import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';
import { formatPrice, formatDateTime } from '../../utils/formatters';

const PriceChart = ({ 
  data = [], 
  height = 300, 
  color = '#3b82f6',
  showArea = true,
  showGrid = true,
  className = ''
}) => {
  // Transform data for recharts
  const chartData = useMemo(() => {
    if (!data || !data.length) return [];
    
    return data.map(item => ({
      timestamp: item.timestamp,
      price: item.price || item.current_price || 0,
      volume: item.volume || 0,
      market_cap: item.market_cap || 0,
      date: new Date(item.timestamp).getTime()
    })).sort((a, b) => a.date - b.date);
  }, [data]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-3 shadow-lg">
          <div className="text-sm text-gray-400 mb-1">
            {formatDateTime(data.timestamp)}
          </div>
          <div className="text-lg font-bold text-gray-100">
            {formatPrice(data.price)}
          </div>
          {data.volume > 0 && (
            <div className="text-sm text-gray-400">
              Volume: {formatPrice(data.volume)}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Format X-axis labels
  const formatXAxisLabel = (tickItem) => {
    const date = new Date(tickItem);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  // Calculate price change for color
  const priceChange = useMemo(() => {
    if (chartData.length < 2) return 0;
    const first = chartData[0]?.price || 0;
    const last = chartData[chartData.length - 1]?.price || 0;
    return last - first;
  }, [chartData]);

  const isPositive = priceChange >= 0;
  const chartColor = isPositive ? '#22c55e' : '#ef4444';
  const gradientId = `gradient-${color.replace('#', '')}`;

  if (!chartData.length) {
    return (
      <div className={`flex items-center justify-center bg-dark-800 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center">
          <div className="text-gray-400 mb-2">No chart data available</div>
          <div className="text-sm text-gray-500">Price history will appear here</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        {showArea ? (
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            
            {showGrid && (
              <>
                <XAxis 
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatXAxisLabel}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  domain={['dataMin', 'dataMax']}
                  type="number"
                  scale="time"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => formatPrice(value)}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  domain={['dataMin - dataMin * 0.01', 'dataMax + dataMax * 0.01']}
                />
              </>
            )}
            
            <Tooltip content={<CustomTooltip />} />
            
            <Area
              type="monotone"
              dataKey="price"
              stroke={chartColor}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ 
                r: 4, 
                fill: chartColor,
                stroke: '#1f2937',
                strokeWidth: 2
              }}
            />
          </AreaChart>
        ) : (
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            {showGrid && (
              <>
                <XAxis 
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatXAxisLabel}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  domain={['dataMin', 'dataMax']}
                  type="number"
                  scale="time"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => formatPrice(value)}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  domain={['dataMin - dataMin * 0.01', 'dataMax + dataMax * 0.01']}
                />
              </>
            )}
            
            <Tooltip content={<CustomTooltip />} />
            
            <Line
              type="monotone"
              dataKey="price"
              stroke={chartColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ 
                r: 4, 
                fill: chartColor,
                stroke: '#1f2937',
                strokeWidth: 2
              }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
      
      {/* Price change indicator */}
      <div className="flex items-center justify-center mt-4 text-sm">
        <span className="text-gray-400 mr-2">Price change:</span>
        <span className={`font-semibold ${isPositive ? 'text-success-500' : 'text-danger-500'}`}>
          {isPositive ? '+' : ''}{formatPrice(priceChange)}
        </span>
      </div>
    </div>
  );
};

// Simple sparkline component for compact displays
export const Sparkline = ({ data, width = 100, height = 30, color = '#3b82f6' }) => {
  const chartData = useMemo(() => {
    if (!data || !data.length) return [];
    
    return data.slice(-20).map((item, index) => ({
      index,
      price: item.price || item.current_price || 0
    }));
  }, [data]);

  if (!chartData.length) return null;

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={1}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceChart;