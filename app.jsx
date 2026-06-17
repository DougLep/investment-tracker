import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function InvestmentTracker() {
  // Load from localStorage or use defaults
  const [portfolios, setPortfolios] = useState(() => {
    const saved = localStorage.getItem('portfolios');
    return saved ? JSON.parse(saved) : {
      stonebridge: { tsla: 0, spcx: 0 },
      sofi: { tsla: 0, spcx: 0 },
      jade: { tsla: 0, spcx: 0 }
    };
  });

  const [prices, setPrices] = useState({ tsla: null, spcx: null });
  const [tslaPriceHistory, setTslaPriceHistory] = useState([]);
  const [spcxPriceHistory, setSpcxPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('portfolio');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Save portfolios to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('portfolios', JSON.stringify(portfolios));
  }, [portfolios]);

  // Fetch current stock prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('/api/prices');
        const data = await response.json();
        setPrices(data);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Fetch historical data
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const [tslaRes, spcxRes] = await Promise.all([
          fetch('/api/history/tsla?period=1y'),
          fetch('/api/history/spcx?days=14')
        ]);
        
        const tslaData = await tslaRes.json();
        const spcxData = await spcxRes.json();
        
        setTslaPriceHistory(tslaData);
        setSpcxPriceHistory(spcxData);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handlePortfolioChange = (account, stock, value) => {
    setPortfolios(prev => ({
      ...prev,
      [account]: {
        ...prev[account],
        [stock]: parseFloat(value) || 0
      }
    }));
  };

  // Calculate totals
  const calculateTotals = () => {
    let totalShares = { tsla: 0, spcx: 0 };
    let totalValue = { tsla: 0, spcx: 0 };

    Object.values(portfolios).forEach(account => {
      totalShares.tsla += account.tsla;
      totalShares.spcx += account.spcx;
    });

    if (prices.tsla) totalValue.tsla = totalShares.tsla * prices.tsla;
    if (prices.spcx) totalValue.spcx = totalShares.spcx * prices.spcx;

    return { totalShares, totalValue };
  };

  const { totalShares, totalValue } = calculateTotals();
  const grandTotal = totalValue.tsla + totalValue.spcx;

  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <DollarSign className="w-10 h-10 text-emerald-500" />
            Portfolio Tracker
          </h1>
          <p className="text-slate-400 text-sm">
            Last updated: {lastUpdate.toLocaleTimeString()} | Live pricing
          </p>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* TSLA Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-emerald-500/50 transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-slate-300 text-sm font-semibold uppercase tracking-wider">TSLA</h3>
                <p className="text-3xl font-bold text-white mt-1">
                  {prices.tsla ? `$${formatNumber(prices.tsla)}` : 'Loading...'}
                </p>
              </div>
              <TrendingUp className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="border-t border-slate-700 pt-4">
              <p className="text-slate-400 text-xs mb-1">Total Shares</p>
              <p className="text-lg font-semibold text-white">{totalShares.tsla.toFixed(4)}</p>
              <p className="text-slate-400 text-xs mt-2">Portfolio Value</p>
              <p className="text-2xl font-bold text-emerald-400">
                ${formatNumber(totalValue.tsla)}
              </p>
            </div>
          </div>

          {/* SPCX Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-slate-300 text-sm font-semibold uppercase tracking-wider">SPCX</h3>
                <p className="text-3xl font-bold text-white mt-1">
                  {prices.spcx ? `$${formatNumber(prices.spcx)}` : 'Loading...'}
                </p>
              </div>
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>
            <div className="border-t border-slate-700 pt-4">
              <p className="text-slate-400 text-xs mb-1">Total Shares</p>
              <p className="text-lg font-semibold text-white">{totalShares.spcx.toFixed(4)}</p>
              <p className="text-slate-400 text-xs mt-2">Portfolio Value</p>
              <p className="text-2xl font-bold text-blue-400">
                ${formatNumber(totalValue.spcx)}
              </p>
            </div>
          </div>

          {/* Total Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 border border-emerald-600 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-emerald-200 text-sm font-semibold uppercase tracking-wider">Total Value</h3>
                <p className="text-4xl font-bold text-emerald-50 mt-1">
                  ${formatNumber(grandTotal)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-300" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-3 font-medium text-sm transition ${
              activeTab === 'portfolio'
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Portfolio Management
          </button>
          <button
            onClick={() => setActiveTab('tsla')}
            className={`px-4 py-3 font-medium text-sm transition ${
              activeTab === 'tsla'
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            TSLA (1 Year)
          </button>
          <button
            onClick={() => setActiveTab('spcx')}
            className={`px-4 py-3 font-medium text-sm transition ${
              activeTab === 'spcx'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            SPCX (Since Launch)
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          {/* Portfolio Management Tab */}
          {activeTab === 'portfolio' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Input Your Holdings</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stonebridge */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-400">Stonebridge</h3>
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">TSLA Shares</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={portfolios.stonebridge.tsla}
                      onChange={(e) => handlePortfolioChange('stonebridge', 'tsla', e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">SPCX Shares</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={portfolios.stonebridge.spcx}
                      onChange={(e) => handlePortfolioChange('stonebridge', 'spcx', e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* SOFI */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400">SOFI</h3>
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">TSLA Shares</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={portfolios.sofi.tsla}
                      onChange={(e) => handlePortfolioChange('sofi', 'tsla', e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">SPCX Shares</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={portfolios.sofi.spcx}
                      onChange={(e) => handlePortfolioChange('sofi', 'spcx', e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Jade */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-400">Held by Jade</h3>
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">TSLA Shares</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={portfolios.jade.tsla}
                      onChange={(e) => handlePortfolioChange('jade', 'tsla', e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">SPCX Shares</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={portfolios.jade.spcx}
                      onChange={(e) => handlePortfolioChange('jade', 'spcx', e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Account Breakdown */}
              <div className="mt-8 pt-8 border-t border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Breakdown by Account</h3>
                <div className="space-y-3">
                  {Object.entries(portfolios).map(([account, holdings]) => {
                    const value = (holdings.tsla * (prices.tsla || 0)) + (holdings.spcx * (prices.spcx || 0));
                    const accountName = account === 'stonebridge' ? 'Stonebridge' : account === 'sofi' ? 'SOFI' : 'Held by Jade';
                    return (
                      <div key={account} className="flex justify-between items-center bg-slate-700/50 p-3 rounded">
                        <span className="text-slate-300">{accountName}</span>
                        <span className="text-white font-semibold">${formatNumber(value)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TSLA Chart Tab */}
          {activeTab === 'tsla' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Tesla (TSLA) - 1 Year Price History</h2>
              {loading ? (
                <div className="flex justify-center items-center h-96">
                  <p className="text-slate-400">Loading chart data...</p>
                </div>
              ) : tslaPriceHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={tslaPriceHistory} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      style={{ fontSize: '12px' }}
                      domain={['dataMin * 0.95', 'dataMax * 1.05']}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #475569' }}
                      labelStyle={{ color: '#E5E7EB' }}
                      formatter={(value) => `$${value.toFixed(2)}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="close" 
                      stroke="#10B981" 
                      dot={false}
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-96">
                  <p className="text-slate-400">No data available</p>
                </div>
              )}
            </div>
          )}

          {/* SPCX Chart Tab */}
          {activeTab === 'spcx' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Supernova (SPCX) - Price Since Launch (June 12, 2024)</h2>
              {loading ? (
                <div className="flex justify-center items-center h-96">
                  <p className="text-slate-400">Loading chart data...</p>
                </div>
              ) : spcxPriceHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={spcxPriceHistory} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      style={{ fontSize: '12px' }}
                      domain={['dataMin * 0.95', 'dataMax * 1.05']}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #475569' }}
                      labelStyle={{ color: '#E5E7EB' }}
                      formatter={(value) => `$${value.toFixed(2)}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="close" 
                      stroke="#3B82F6" 
                      dot={false}
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-96">
                  <p className="text-slate-400">No data available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
