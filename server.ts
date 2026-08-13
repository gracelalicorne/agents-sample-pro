import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // AI Market Analysis Endpoint
  app.post('/api/market-analysis', async (req, res) => {
    try {
      const { symbol, name, price, changePercent, currency } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({
          summary: `${name} (${symbol}) is currently trading at ${currency} ${price} (${changePercent >= 0 ? '+' : ''}${changePercent}%). Market sentiment remains attentive to macroeconomic indicators and rate policy decisions.`,
          keyDrivers: [
            'Global central bank rate policy trends',
            'Corporate earnings momentum and valuation multiples',
            'Macro liquidity and investor risk appetite'
          ],
          outlook: changePercent >= 0 ? 'Bullish' : 'Neutral',
          supportLevel: `${(price * 0.98).toFixed(2)}`,
          resistanceLevel: `${(price * 1.02).toFixed(2)}`
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Provide a concise 3-bullet technical and market outlook analysis for the following financial asset/index:
Asset: ${name} (${symbol})
Current Price: ${currency} ${price}
Daily Change: ${changePercent}%

Format your response strictly as valid JSON with the following keys:
{
  "summary": "2 short sentences summarizing current sentiment and price action.",
  "keyDrivers": ["Driver 1", "Driver 2", "Driver 3"],
  "outlook": "Bullish" | "Bearish" | "Neutral",
  "supportLevel": "estimated key support price level",
  "resistanceLevel": "estimated key resistance price level"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '';
      try {
        const parsed = JSON.parse(responseText);
        return res.json(parsed);
      } catch (e) {
        return res.json({
          summary: responseText || `${name} displays current active momentum in the ${changePercent >= 0 ? 'bullish' : 'bearish'} direction.`,
          keyDrivers: ['Sector rotation', 'Inflation data expectations', 'Technical support bounce'],
          outlook: changePercent >= 0 ? 'Bullish' : 'Bearish',
          supportLevel: `${(price * 0.98).toFixed(2)}`,
          resistanceLevel: `${(price * 1.02).toFixed(2)}`
        });
      }
    } catch (err: any) {
      console.error('Gemini API analysis error:', err);
      res.status(500).json({
        error: 'Failed to generate market analysis',
        details: err?.message || 'Server error'
      });
    }
  });

  // AI Custom Question Endpoint
  app.post('/api/market-chat', async (req, res) => {
    try {
      const { symbol, name, price, changePercent, question } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({
          answer: `For ${symbol} (${name}), currently trading at $${price} (${changePercent >= 0 ? '+' : ''}${changePercent}%), current technical sentiment indicates key support near $${(price * 0.98).toFixed(2)} and immediate resistance around $${(price * 1.02).toFixed(2)}. Macro policy decisions and volume liquidity continue to dictate momentum.`
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a senior Wall Street quantitative analyst and market expert providing insights on TradingView Pro.
Asset: ${name} (${symbol})
Price: $${price}
Daily Change: ${changePercent}%
User Question: "${question}"

Provide a crisp, direct, and authoritative financial answer (2-3 short paragraphs). Focus on actionable technical levels, volume dynamics, or macro catalysts.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return res.json({ answer: response.text || 'Analysis currently unavailable.' });
    } catch (err: any) {
      console.error('Gemini Chat error:', err);
      res.status(500).json({
        error: 'Failed to process question',
        details: err?.message || 'Server error'
      });
    }
  });

  // Vite Middleware for Development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
