# Railway Deployment Quick Start

## 5-Minute Deployment

### Prerequisites
- GitHub account with the project repo
- Railway account (free signup at railway.app)

### Steps

1. **Push code to GitHub**
```bash
git push origin main
```

2. **Connect Railway to GitHub**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize GitHub if needed
   - Select your `investment-tracker` repo

3. **Railway Auto-Configuration**
   - Railway detects `railway.toml`
   - Automatically configures Node.js 18 environment
   - Sets up build & start commands

4. **Add Environment Variables (Optional)**
   - In Railway dashboard, go to your project
   - Click "Variables"
   - Add `ALPHA_VANTAGE_API_KEY` if you have one
   - Add `NODE_ENV` = `production`

5. **Deploy**
   - Railway automatically builds from `main` branch
   - Watch deployment logs
   - Once complete, get your public URL

6. **Access Your App**
   - Railway provides a live URL (e.g., `https://investment-tracker-prod.railway.app`)
   - Share this URL to access your portfolio tracker anywhere

## What Happens During Deployment

1. **Build Phase**
   - `npm install` - Installs all dependencies
   - `npm run build` - Vite builds React app to `dist/`
   - Takes ~2-3 minutes

2. **Start Phase**
   - `node server.js` - Starts Express server
   - Server runs on port 3000
   - Railway routes public traffic to this port

## Monitoring & Logs

In Railway dashboard:
- **Logs**: See real-time server output
- **Monitoring**: Check CPU, memory usage
- **Status**: View deployment status and errors

## Environment Variables Explained

| Variable | Example | Purpose |
|----------|---------|---------|
| `NODE_ENV` | `production` | Optimizes Node.js performance |
| `ALPHA_VANTAGE_API_KEY` | `your_key_123` | Real stock price API (optional) |
| `PORT` | `3000` | Railway auto-sets this |

## Common Issues

### Build Fails
- Check logs in Railway dashboard
- Verify `package.json` is in root directory
- Clear cache: Delete Railway deployment and redeploy

### 502 Bad Gateway
- Wait 5 minutes for startup
- Check server logs for errors
- Verify API endpoints are responding

### Stock Prices Always the Same
- Using demo mode (no API key set)
- Add `ALPHA_VANTAGE_API_KEY` to see real prices
- Free tier updates every 5 minutes

## Connecting Your Domain

1. In Railway project settings, go to "Domains"
2. Add custom domain or use Railway's subdomain
3. Update DNS records if using custom domain
4. Takes ~5 minutes to propagate

## Updating Code

Push updates to GitHub and Railway automatically redeploys:
```bash
git add .
git commit -m "Update portfolio feature"
git push origin main
```

Railway detects changes and rebuilds within minutes.

## Scaling

For higher traffic, Railway offers:
- **Memory upgrade**: Project settings → Resources
- **Advanced**: Multiple instances with load balancing
- **Database**: Add PostgreSQL if needed later

## Cost

As of 2024:
- **Free tier**: 500 hours/month (plenty for personal use)
- **Pro**: $5/month for unlimited hours
- **Usage**: Includes 1GB RAM, shared CPU

Your app easily fits in free tier!

## Support

- Railway docs: [docs.railway.app](https://docs.railway.app)
- Community: Discord on Railway website
- Issues: Check Railway status page

---

**You're live!** Your investment tracker is now accessible from anywhere at your Railway URL.
