import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// In-memory cache for prices
let priceCache = { tsla: null, spcx: null, timestamp: 0 };
const CACHE_DURATION = 60000; // 1 minute

// Free stock API - using Alpha Vantage
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';

async function fetchStockPrice(symbol) {
  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    console.log(`Fetching ${symbol} from Alpha Vantage... (using API key: ${ALPHA_VANTAGE_API_KEY !== 'demo' ? 'YES' : 'NO - DEMO MODE'})`);
    const response = await fetch(url);
    const data = await response.json();

    console.log(`${symbol} API Response:`, JSON.stringify(data).substring(0, 200));

    if (data['Global Quote'] && data['Global Quote']['05. price']) {
      const price = parseFloat(data['Global Quote']['05. price']);
      console.log(`✅ ${symbol} Real Price: $${price}`);
      return price;
    }

    console.log(`⚠️ ${symbol} API did not return valid price data`);
    return null;
  } catch (error) {
    console.error(`❌ Error fetching ${symbol} price:`, error);
    return null;
  }
}

// Endpoint to get current prices
app.get('/api/prices', async (req, res) => {
  try {
    // Check cache
    const now = Date.now();
    if (now - priceCache.timestamp < CACHE_DURATION && priceCache.tsla && priceCache.spcx) {
      console.log('Using cached prices');
      return res.json({ tsla: priceCache.tsla, spcx: priceCache.spcx });
    }

    console.log('Cache expired - fetching fresh prices...');

    // For demo purposes - if no API key, use realistic simulated prices
    let tslaPrice = priceCache.tsla || 404.50;
    let spcxPrice = priceCache.spcx || 135.00;

    // Try to fetch real prices
    const [tslaPriceResult, spcxPriceResult] = await Promise.all([
      fetchStockPrice('TSLA'),
      fetchStockPrice('SPCX')
    ]);

    if (tslaPriceResult) tslaPrice = tslaPriceResult;
    if (spcxPriceResult) spcxPrice = spcxPriceResult;

    // Update cache
    priceCache = { tsla: tslaPrice, spcx: spcxPrice, timestamp: now };

    console.log(`Returning prices: TSLA=$${tslaPrice}, SPCX=$${spcxPrice}`);
    res.json({ tsla: tslaPrice, spcx: spcxPrice });
  } catch (error) {
    console.error('Error getting prices:', error);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

// Generate TSLA historical data (1 year)
app.get('/api/history/tsla', async (req, res) => {
  try {
    const data = generateTSLAHistory();
    res.json(data);
  } catch (error) {
    console.error('Error getting TSLA history:', error);
    res.status(500).json({ error: 'Failed to fetch TSLA history' });
  }
});

// Generate SPCX historical data (since June 12, 2026)
app.get('/api/history/spcx', async (req, res) => {
  try {
    const data = generateSPCXHistory();
    res.json(data);
  } catch (error) {
    console.error('Error getting SPCX history:', error);
    res.status(500).json({ error: 'Failed to fetch SPCX history' });
  }
});

// Generate realistic TSLA price history for the past year
function generateTSLAHistory() {
  const data = [];
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  let currentPrice = 404.50; // Approximate current price
  const volatility = 0.02;

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    // Skip weekends
    if (d.getDay() === 0 || d.getDay() === 6) continue;

    // Random walk for price
    const change = (Math.random() - 0.5) * volatility * currentPrice;
    currentPrice = Math.max(100, currentPrice + change);

    data.push({
      date: d.toISOString().split('T')[0],
      close: parseFloat(currentPrice.toFixed(2))
    });
  }

  return data;
}

// Generate realistic SPCX price history (since June 12, 2026)
function generateSPCXHistory() {
  const data = [];
  const endDate = new Date();
  const startDate = new Date('2026-06-12');

  let currentPrice = 135.00; // Launch price
  const targetEndPrice = 135.00; // What we want it to end at today
  const volatility = 0.15; // Much higher volatility for dramatic swings

  // Generate all dates first to know how many days
  const dates = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      dates.push(new Date(d));
    }
  }

  // Generate prices with random walk
  for (let i = 0; i < dates.length; i++) {
    const change = (Math.random() - 0.50) * volatility * currentPrice;
    currentPrice = Math.max(50, currentPrice + change);
    
    // Force last price to be exact target
    if (i === dates.length - 1) {
      currentPrice = targetEndPrice;
    }

    data.push({
      date: dates[i].toISOString().split('T')[0],
      close: parseFloat(currentPrice.toFixed(2))
    });
  }

  return data;
}

// Serve the React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API Key set: ${process.env.ALPHA_VANTAGE_API_KEY && process.env.ALPHA_VANTAGE_API_KEY !== 'demo' ? 'Yes ✅' : 'No ⚠️ (using demo mode)'}`);
});
