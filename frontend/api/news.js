// api/news.js - Vercel serverless function for news
export default async function handler(req, res) {
    const NEWS_API_KEY = 'dc8fbde393bb4cb6bb5da32a3945bb69';
    const { page = 1, limit = 12 } = req.query;
    
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=cryptocurrency OR bitcoin OR ethereum&sortBy=publishedAt&pageSize=${limit}&page=${page}&apiKey=${NEWS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`NewsAPI error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform data to match your frontend expectations
      const transformedArticles = data.articles.map(article => ({
        id: article.url,
        title: article.title,
        description: article.description,
        summary: article.description,
        content: article.content,
        url: article.url,
        image_url: article.urlToImage,
        thumbnail: article.urlToImage,
        published_at: article.publishedAt,
        created_at: article.publishedAt,
        source: article.source.name,
        author: article.author
      }));
      
      res.status(200).json({
        articles: transformedArticles,
        totalResults: data.totalResults
      });
    } catch (error) {
      console.error('News API error:', error);
      res.status(500).json({ error: 'Failed to fetch news' });
    }
  }