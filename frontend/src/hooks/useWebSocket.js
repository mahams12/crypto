import { useState, useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Custom hook for WebSocket connections
 * Handles real-time price updates and market data
 */
export const useWebSocket = (url, options = {}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  
  const queryClient = useQueryClient();
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  
  const {
    onOpen = () => {},
    onMessage = () => {},
    onError = () => {},
    onClose = () => {},
    shouldReconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    protocols = []
  } = options;

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url, protocols);
      
      ws.onopen = (event) => {
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;
        onOpen(event);
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
          onMessage(data, event);
          
          // Update React Query cache with real-time data
          if (data.type === 'price_update') {
            queryClient.setQueryData(['coins'], (oldData) => {
              if (!oldData?.data?.data) return oldData;
              
              return {
                ...oldData,
                data: {
                  ...oldData.data,
                  data: oldData.data.data.map(coin => 
                    coin.coin_id === data.coin_id 
                      ? { ...coin, ...data.updates }
                      : coin
                  )
                }
              };
            });
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          setLastMessage(event.data);
          onMessage(event.data, event);
        }
      };
      
      ws.onerror = (event) => {
        setConnectionError(event);
        onError(event);
      };
      
      ws.onclose = (event) => {
        setIsConnected(false);
        onClose(event);
        
        // Attempt to reconnect if enabled
        if (shouldReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };
      
      setSocket(ws);
    } catch (error) {
      setConnectionError(error);
      console.error('WebSocket connection error:', error);
    }
  }, [url, protocols, onOpen, onMessage, onError, onClose, shouldReconnect, reconnectInterval, maxReconnectAttempts, queryClient]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
  }, [socket]);

  const sendMessage = useCallback((message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const messageString = typeof message === 'string' ? message : JSON.stringify(message);
      socket.send(messageString);
      return true;
    }
    return false;
  }, [socket]);

  const reconnect = useCallback(() => {
    disconnect();
    reconnectAttemptsRef.current = 0;
    setTimeout(connect, 100);
  }, [connect, disconnect]);

  // Connect on mount
  useEffect(() => {
    connect();
    
    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.close();
      }
    };
  }, []);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isConnected && shouldReconnect) {
        reconnect();
      } else if (document.visibilityState === 'hidden' && isConnected) {
        // Optionally disconnect when page is hidden to save resources
        // disconnect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isConnected, shouldReconnect, reconnect]);

  return {
    socket,
    isConnected,
    connectionError,
    lastMessage,
    sendMessage,
    disconnect,
    reconnect,
    reconnectAttempts: reconnectAttemptsRef.current
  };
};

/**
 * Hook specifically for cryptocurrency price updates
 */
export const useCryptoPriceSocket = () => {
  const [priceUpdates, setPriceUpdates] = useState({});
  
  const { isConnected, sendMessage, connectionError } = useWebSocket(
    process.env.REACT_APP_WS_URL || 'wss://localhost:8000/ws',
    {
      onMessage: (data) => {
        if (data.type === 'price_update') {
          setPriceUpdates(prev => ({
            ...prev,
            [data.coin_id]: {
              ...data.updates,
              timestamp: Date.now()
            }
          }));
        }
      },
      onOpen: () => {
        // Subscribe to price updates
        sendMessage({
          type: 'subscribe',
          channels: ['price_updates']
        });
      }
    }
  );

  const subscribeToCoin = useCallback((coinId) => {
    sendMessage({
      type: 'subscribe_coin',
      coin_id: coinId
    });
  }, [sendMessage]);

  const unsubscribeFromCoin = useCallback((coinId) => {
    sendMessage({
      type: 'unsubscribe_coin',
      coin_id: coinId
    });
  }, [sendMessage]);

  return {
    priceUpdates,
    isConnected,
    connectionError,
    subscribeToCoin,
    unsubscribeFromCoin
  };
};

/**
 * Hook for market overview real-time updates
 */
export const useMarketSocket = () => {
  const [marketData, setMarketData] = useState(null);
  
  const { isConnected, connectionError } = useWebSocket(
    process.env.REACT_APP_WS_URL || 'wss://localhost:8000/ws',
    {
      onMessage: (data) => {
        if (data.type === 'market_update') {
          setMarketData({
            ...data.market_data,
            timestamp: Date.now()
          });
        }
      },
      onOpen: (_, sendMessage) => {
        // Subscribe to market overview updates
        sendMessage({
          type: 'subscribe',
          channels: ['market_overview']
        });
      }
    }
  );

  return {
    marketData,
    isConnected,
    connectionError
  };
};

/**
 * Hook for news real-time updates
 */
export const useNewsSocket = () => {
  const [latestNews, setLatestNews] = useState([]);
  const queryClient = useQueryClient();
  
  const { isConnected, connectionError } = useWebSocket(
    process.env.REACT_APP_WS_URL || 'wss://localhost:8000/ws',
    {
      onMessage: (data) => {
        if (data.type === 'news_update') {
          setLatestNews(prev => [data.news_item, ...prev].slice(0, 10));
          
          // Invalidate news queries to refetch
          queryClient.invalidateQueries(['news']);
          queryClient.invalidateQueries(['latest-news']);
        }
      },
      onOpen: (_, sendMessage) => {
        // Subscribe to news updates
        sendMessage({
          type: 'subscribe',
          channels: ['news_updates']
        });
      }
    }
  );

  return {
    latestNews,
    isConnected,
    connectionError
  };
};