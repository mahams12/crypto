import { useQuery } from '@tanstack/react-query';
import { newsService } from '../services/api';

/**
 * Hook to fetch cryptocurrency news with pagination and filtering
 */
export const useNews = (page = 1, limit = 20, category = null) => {
  return useQuery({
    queryKey: ['news', page, limit, category],
    queryFn: () => newsService.getNews(page, limit, category),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    keepPreviousData: true, // Keep previous data while fetching new data
    select: (data) => data?.data || { data: [], total_count: 0 },
    onError: (error) => {
      console.error('Error fetching news:', error);
    }
  });
};

/**
 * Hook to fetch latest cryptocurrency news
 */
export const useLatestNews = (limit = 10) => {
  return useQuery({
    queryKey: ['latest-news', limit],
    queryFn: () => newsService.getLatestNews(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes for latest news
    select: (data) => data?.data || [],
    onError: (error) => {
      console.error('Error fetching latest news:', error);
    }
  });
};

/**
 * Hook to fetch news by specific category
 */
export const useNewsByCategory = (category, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['news-by-category', category, page, limit],
    queryFn: () => newsService.getNewsByCategory(category, page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!category && category !== 'all', // Only fetch if category is provided
    select: (data) => data?.data || { data: [], total_count: 0 },
    onError: (error) => {
      console.error(`Error fetching news for category ${category}:`, error);
    }
  });
};

/**
 * Hook to fetch news categories
 */
export const useNewsCategories = () => {
  return useQuery({
    queryKey: ['news-categories'],
    queryFn: () => newsService.getNewsCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
    select: (data) => data?.data?.categories || [],
    onError: (error) => {
      console.error('Error fetching news categories:', error);
    }
  });
};

/**
 * Hook to fetch trending news (most read/shared)
 */
export const useTrendingNews = (limit = 5) => {
  return useQuery({
    queryKey: ['trending-news', limit],
    queryFn: () => newsService.getLatestNews(limit), // Using latest as trending for now
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    select: (data) => {
      const news = data?.data || [];
      // Sort by recency and filter for trending topics
      return news
        .filter(article => 
          article.title?.toLowerCase().includes('bitcoin') ||
          article.title?.toLowerCase().includes('ethereum') ||
          article.title?.toLowerCase().includes('crypto')
        )
        .slice(0, limit);
    },
    onError: (error) => {
      console.error('Error fetching trending news:', error);
    }
  });
};

/**
 * Hook for news search functionality
 */
export const useNewsSearch = (query, enabled = true) => {
  return useQuery({
    queryKey: ['news-search', query],
    queryFn: () => newsService.getNews(1, 20), // Basic search, filter on client side
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: enabled && query && query.length >= 2,
    select: (data) => {
      const news = data?.data?.data || [];
      if (!query) return news;
      
      // Client-side filtering by title and description
      const searchTerms = query.toLowerCase().split(' ');
      return news.filter(article => {
        const searchContent = `${article.title} ${article.description}`.toLowerCase();
        return searchTerms.some(term => searchContent.includes(term));
      });
    },
    onError: (error) => {
      console.error('Error searching news:', error);
    }
  });
};

/**
 * Hook to get news statistics
 */
export const useNewsStats = () => {
  return useQuery({
    queryKey: ['news-stats'],
    queryFn: async () => {
      // Fetch categories and latest news to calculate stats
      const [categoriesResponse, latestResponse] = await Promise.all([
        newsService.getNewsCategories(),
        newsService.getLatestNews(100)
      ]);
      
      const categories = categoriesResponse?.data?.categories || [];
      const latestNews = latestResponse?.data || [];
      
      // Calculate stats
      const totalArticles = categories.reduce((sum, cat) => sum + cat.count, 0);
      const last24hArticles = latestNews.filter(article => {
        const articleDate = new Date(article.published_at);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return articleDate >= yesterday;
      }).length;
      
      return {
        totalArticles,
        totalCategories: categories.length,
        last24hArticles,
        topCategory: categories[0]?.name || 'general'
      };
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    onError: (error) => {
      console.error('Error fetching news stats:', error);
    }
  });
};