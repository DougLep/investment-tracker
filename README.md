# Investment Portfolio Tracker

A full-stack web application for tracking TSLA and SPCX investment holdings across multiple accounts (Stonebridge, SOFI, and Jade). Features real-time stock prices and historical price charts.

## Features

- **Portfolio Management**: Input and track stock holdings across three accounts
- **Real-time Pricing**: Live TSLA and SPCX prices with automatic updates every minute
- **Portfolio Summary**: View total shares and portfolio value by stock
- **Account Breakdown**: See how much value is in each account
- **Historical Charts**: 
  - TSLA: 1-year price history
  - SPCX: Price history since launch (June 12, 2024)
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, Recharts for charts
- **Backend**: Node.js/Express
- **Build Tool**: Vite
- **Hosting**: Railway
- **Stock Data**: Alpha Vantage API (with demo fallback)

## Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Set up environment variables (optional):**
```bash
# Create a .env file for Alpha Vantage API key
ALPHA_VANTAGE_API_KEY=your_api_key_here
NODE_ENV=development
```

3. **Run development server:**
```bash
# Terminal 1: Run Vite dev server (frontend)
npm run dev

# Terminal 2: Run Express server (backend)
npm run server
```

The app will be available at `http://localhost:5173` (Vite) with API proxied to the backend.

### Building

```bash
npm run build
```

This creates optimized production files in the `dist/` folder.

### Production Preview

```bash
npm run start
```

This builds the app and starts the Express server on port 3000.

## Deployment to Railway

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/investment-tracker.git
git push -u origin main
```

### Step 2: Deploy via Railway

1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `investment-tracker` repository
4. Railway will automatically detect the `railway.toml` configuration
5. Configure environment variables:
   - `NODE_ENV`: `production`
   - `ALPHA_VANTAGE_API_KEY`: (optional, set if you want real stock data)

### Step 3: Monitor Deployment

Railway will automatically:
- Install dependencies
- Build the application
- Start the server on a public URL

Your app will be live at the URL provided by Railway (e.g., `https://your-app.railway.app`)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 3000) |
| `NODE_ENV` | No | `development` or `production` |
| `ALPHA_VANTAGE_API_KEY` | No | For real stock data (demo mode used if not set) |

### Getting an Alpha Vantage API Key

1. Go to [Alpha Vantage](https://www.alphavantage.co)
2. Sign up for a free API key
3. Add it to your Railway environment variables
4. Note: Free tier has 5 requests/minute limit

## API Endpoints

### Get Current Prices
```
GET /api/prices
```

Returns:
```json
{
  "tsla": 245.50,
  "spcx": 0.95
}
```

### Get TSLA Historical Data (1 Year)
```
GET /api/history/tsla
```

Returns array of daily prices:
```json
[
  { "date": "2024-06-16", "close": 245.50 },
  ...
]
```

### Get SPCX Historical Data
```
GET /api/history/spcx?days=14
```

Returns array of daily prices since June 12, 2024.

## File Structure

```
.
├── index.html              # HTML template
├── main.jsx                # React entry point
├── app.jsx                 # Main app component
├── server.js               # Express backend
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
├── postcss.config.js       # PostCSS configuration
├── railway.toml            # Railway deployment config
└── index.css               # Global styles
```

## Usage

1. **Enter Your Holdings**: Navigate to the "Portfolio Management" tab and input the number of shares you hold in each account
2. **View Portfolio Value**: The summary cards at the top update in real-time showing your portfolio value
3. **View History**: Click the TSLA or SPCX tabs to see historical price charts
4. **Account Breakdown**: See how much value is stored in each account

## Demo Mode

The app includes realistic demo data generation:
- If no API key is configured, it generates simulated but realistic price movements
- TSLA prices fluctuate around historical ranges
- SPCX prices show growth from its June 12, 2024 launch

## Troubleshooting

### API Not Responding
- Check that the backend server is running (`npm run server`)
- Verify the proxy is configured in `vite.config.js`
- Check browser console for CORS errors

### High API Call Costs
- Alpha Vantage free tier: 5 requests/min
- Consider upgrading to their paid plan for production
- Alternative: Switch to Yahoo Finance data (requires different API)

### Build Errors
- Clear `node_modules/` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf dist && npm run build`

## License

MIT

## Author

Built with React, Express, and Tailwind CSS

## Future Enhancements

- [ ] Portfolio allocation pie charts
- [ ] Buy/sell price tracking and gain/loss calculations
- [ ] Daily email reports
- [ ] Mobile app version
- [ ] Integration with Robinhood/Fidelity APIs
- [ ] Portfolio comparison against S&P 500
