'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function RiskAnalysisPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [riskData, setRiskData] = useState<any | null>(null);
  const [tradeSetup, setTradeSetup] = useState({
    symbol: 'AAPL',
    direction: 'Long',
    entryPrice: 150.25,
    accountSize: 10000,
    accountRisk: 1,
    volatility: 'Medium',
    market: 'Bull',
    stopLoss: 148.50,
    targetPrice: 155.00,
    strategy: 'Breakout'
  });

  const handleChange = (field: string, value: any) => {
    setTradeSetup({
      ...tradeSetup,
      [field]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for user authentication
    if (!user) {
      toast.error('Please sign in to use risk analysis');
      return;
    }
    
    // Validate input
    if (
      !tradeSetup.symbol || 
      !tradeSetup.entryPrice || 
      !tradeSetup.accountSize || 
      !tradeSetup.accountRisk ||
      !tradeSetup.stopLoss ||
      !tradeSetup.targetPrice
    ) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/risk-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tradeSetup }),
      });
      
      if (!response.ok) {
        throw new Error('Risk analysis request failed');
      }
      
      const data = await response.json();
      setRiskData(data);
      toast.success('Risk analysis complete!');
    } catch (error: any) {
      console.error('Error analyzing risk:', error);
      toast.error('Failed to analyze risk. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Risk Analysis</h1>
        <p className="text-gray-300">
          Calculate optimal position size and analyze risk/reward for your trade setups
        </p>
      </motion.div>

      <div className="glass-panel p-6 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Symbol</label>
              <input
                type="text"
                value={tradeSetup.symbol}
                onChange={(e) => handleChange('symbol', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
                placeholder="AAPL"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Direction</label>
              <select
                value={tradeSetup.direction}
                onChange={(e) => handleChange('direction', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
                required
              >
                <option value="Long">Long</option>
                <option value="Short">Short</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Entry Price</label>
              <input
                type="number"
                value={tradeSetup.entryPrice}
                onChange={(e) => handleChange('entryPrice', Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
                placeholder="150.25"
                min="0.01"
                step="0.01"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Stop Loss</label>
              <input
                type="number"
                value={tradeSetup.stopLoss}
                onChange={(e) => handleChange('stopLoss', Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
                placeholder="148.50"
                min="0.01"
                step="0.01"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Target Price</label>
              <input
                type="number"
                value={tradeSetup.targetPrice}
                onChange={(e) => handleChange('targetPrice', Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
                placeholder="155.00"
                min="0.01"
                step="0.01"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Account Size ($)</label>
              <input
                type="number"
                value={tradeSetup.accountSize}
                onChange={(e) => handleChange('accountSize', Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
                placeholder="10000"
                min="1"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Risk Per Trade (%)</label>
              <input
                type="number"
                value={tradeSetup.accountRisk}
                onChange={(e) => handleChange('accountRisk', Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
                placeholder="1"
                min="0.1"
                max="100"
                step="0.1"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Market Condition</label>
              <select
                value={tradeSetup.market}
                onChange={(e) => handleChange('market', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
                required
              >
                <option value="Bull">Bullish</option>
                <option value="Bear">Bearish</option>
                <option value="Sideways">Sideways</option>
                <option value="Volatile">Volatile</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Market Volatility</label>
              <select
                value={tradeSetup.volatility}
                onChange={(e) => handleChange('volatility', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Strategy</label>
              <select
                value={tradeSetup.strategy}
                onChange={(e) => handleChange('strategy', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
                required
              >
                <option value="Breakout">Breakout</option>
                <option value="Trend Following">Trend Following</option>
                <option value="Reversal">Reversal</option>
                <option value="Support/Resistance">Support/Resistance</option>
                <option value="Momentum">Momentum</option>
                <option value="Range Trading">Range Trading</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full max-w-xs"
            >
              {isLoading ? 'Calculating...' : 'Calculate Risk'}
            </button>
          </div>
        </form>
      </div>

      {riskData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel p-6 rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-6">Risk Analysis Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800 bg-opacity-40 p-4 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Position Size</h3>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Recommended</span>
                <span className="text-xl font-bold">{riskData.positionSize?.recommended || '0%'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Units/Shares</span>
                <span className="text-lg">{riskData.positionSize?.units || '0'}</span>
              </div>
            </div>
            
            <div className="bg-gray-800 bg-opacity-40 p-4 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Risk/Reward</h3>
              
              <div className="flex items-center mb-3">
                <div className="w-full bg-gray-600 rounded-full h-4 mr-3">
                  <div
                    className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-4 rounded-full"
                    style={{ width: `${Math.min((riskData.riskRewardRatio || 0) * 100 / 5, 100)}%` }}
                  ></div>
                </div>
                <span className="text-xl font-bold whitespace-nowrap">{riskData.riskRewardRatio || '0'}:1</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Win Probability</span>
                <span className="text-lg">{riskData.winProbability || '0%'}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800 bg-opacity-40 p-4 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Stop Loss</h3>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Price</span>
                <span className="text-lg">${riskData.stopLoss?.price || '0'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Distance</span>
                <span className="text-lg">{riskData.stopLoss?.distance || '0%'}</span>
              </div>
            </div>
            
            <div className="bg-gray-800 bg-opacity-40 p-4 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Target</h3>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Price</span>
                <span className="text-lg">${riskData.targetPrice?.price || '0'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Distance</span>
                <span className="text-lg">{riskData.targetPrice?.distance || '0%'}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="bg-gray-800 bg-opacity-40 p-4 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Trade Expectancy</h3>
              
              <div className="flex items-center mb-4">
                <div className="w-full bg-gray-600 rounded-full h-4 mr-3">
                  <div
                    className={`h-4 rounded-full ${Number(riskData.expectancy) > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(Math.abs(Number(riskData.expectancy) * 100), 100)}%` }}
                  ></div>
                </div>
                <span className="text-xl font-bold">{riskData.expectancy || '0'}</span>
              </div>
              
              <p className="text-gray-300 text-sm">
                Expectancy measures the average amount you can expect to win (or lose) per dollar risked.
                A positive value indicates a profitable strategy over time.
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-3">Recommendations</h3>
            <div className="bg-gray-800 bg-opacity-40 p-4 rounded-lg">
              <ul className="list-disc pl-5 space-y-2">
                {riskData.recommendations && riskData.recommendations.map((recommendation: string, index: number) => (
                  <li key={index} className="text-gray-300">{recommendation}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 