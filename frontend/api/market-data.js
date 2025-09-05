export default async function handler(req, res) {
    const ALPHA_VANTAGE_KEY = 'RP0QJ8YELQTV56P1';
    const { symbol = 'BTC' } = req.query;
    
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${symbol}&market=USD&apikey=${ALPHA_VANTAGE_KEY}`
      );
      
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Alpha Vantage API error:', error);
      res.status(500).json({ error: 'Failed to fetch market data' });
    }
  }