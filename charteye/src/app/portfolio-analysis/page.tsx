'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

type PortfolioHolding = {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  entryPrice: number;
  currentPrice: number;
  sector: string;
};

export default function PortfolioAnalysisPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState<any | null>(null);
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([
    {
      id: '1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      shares: 10,
      entryPrice: 150.25,
      currentPrice: 170.50,
      sector: 'Technology'
    }
  ]);

  const sectors = [
    'Technology', 
    'Healthcare', 
    'Finance', 
    'Consumer Goods',
    'Energy',
    'Utilities',
    'Communication Services',
    'Real Estate',
    'Materials',
    'Industrials'
  ];

  const handleAddHolding = () => {
    const newId = Date.now().toString();
    setHoldings([
      ...holdings,
      {
        id: newId,
        symbol: '',
        name: '',
        shares: 0,
        entryPrice: 0,
        currentPrice: 0,
        sector: sectors[0]
      }
    ]);
  };

  const handleRemoveHolding = (id: string) => {
    setHoldings(holdings.filter(holding => holding.id !== id));
  };

  const handleHoldingChange = (id: string, field: keyof PortfolioHolding, value: any) => {
    setHoldings(
      holdings.map(holding => 
        holding.id === id ? { ...holding, [field]: value } : holding
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for user authentication
    if (!user) {
      toast.error('Please sign in to analyze your portfolio');
      return;
    }
    
    // Validate input
    const isValid = holdings.every(holding => 
      holding.symbol && 
      holding.name && 
      holding.shares > 0 && 
      holding.entryPrice > 0 && 
      holding.currentPrice > 0 &&
      holding.sector
    );
    
    if (!isValid) {
      toast.error('Please fill in all fields with valid values');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/portfolio-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ holdings }),
      });
      
      if (!response.ok) {
        throw new Error('Portfolio analysis request failed');
      }
      
      const data = await response.json();
      setPortfolioData(data);
      toast.success('Portfolio analysis complete!');
    } catch (error: any) {
      console.error('Error analyzing portfolio:', error);
      toast.error('Failed to analyze portfolio. Please try again.');
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
        <h1 className="text-3xl font-bold mb-2">Portfolio Analysis</h1>
        <p className="text-gray-300">
          Enter your holdings to get AI-powered insights on diversification and risk
        </p>
      </motion.div>

      <div className="glass-panel p-6 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium">Your Holdings</h3>
              <button
                type="button"
                onClick={handleAddHolding}
                className="flex items-center space-x-1 text-blue-400 hover:text-blue-300"
              >
                <PlusCircleIcon className="h-5 w-5" />
                <span>Add Holding</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 text-sm uppercase">
                    <th className="text-left pb-2">Symbol</th>
                    <th className="text-left pb-2">Name</th>
                    <th className="text-left pb-2">Shares</th>
                    <th className="text-left pb-2">Entry Price</th>
                    <th className="text-left pb-2">Current Price</th>
                    <th className="text-left pb-2">Sector</th>
                    <th className="pb-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {holdings.map((holding) => (
                    <tr key={holding.id} className="hover:bg-gray-800">
                      <td className="py-3 pr-2">
                        <input
                          type="text"
                          value={holding.symbol}
                          onChange={(e) => handleHoldingChange(holding.id, 'symbol', e.target.value)}
                          className="w-full px-2 py-1 bg-gray-800 text-white rounded"
                          placeholder="AAPL"
                          required
                        />
                      </td>
                      <td className="py-3 pr-2">
                        <input
                          type="text"
                          value={holding.name}
                          onChange={(e) => handleHoldingChange(holding.id, 'name', e.target.value)}
                          className="w-full px-2 py-1 bg-gray-800 text-white rounded"
                          placeholder="Apple Inc."
                          required
                        />
                      </td>
                      <td className="py-3 pr-2">
                        <input
                          type="number"
                          value={holding.shares}
                          onChange={(e) => handleHoldingChange(holding.id, 'shares', Number(e.target.value))}
                          className="w-full px-2 py-1 bg-gray-800 text-white rounded"
                          placeholder="10"
                          min="0"
                          step="1"
                          required
                        />
                      </td>
                      <td className="py-3 pr-2">
                        <input
                          type="number"
                          value={holding.entryPrice}
                          onChange={(e) => handleHoldingChange(holding.id, 'entryPrice', Number(e.target.value))}
                          className="w-full px-2 py-1 bg-gray-800 text-white rounded"
                          placeholder="150.25"
                          min="0"
                          step="0.01"
                          required
                        />
                      </td>
                      <td className="py-3 pr-2">
                        <input
                          type="number"
                          value={holding.currentPrice}
                          onChange={(e) => handleHoldingChange(holding.id, 'currentPrice', Number(e.target.value))}
                          className="w-full px-2 py-1 bg-gray-800 text-white rounded"
                          placeholder="170.50"
                          min="0"
                          step="0.01"
                          required
                        />
                      </td>
                      <td className="py-3 pr-2">
                        <select
                          value={holding.sector}
                          onChange={(e) => handleHoldingChange(holding.id, 'sector', e.target.value)}
                          className="w-full px-2 py-1 bg-gray-800 text-white rounded"
                          required
                        >
                          {sectors.map((sector) => (
                            <option key={sector} value={sector}>{sector}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3">
                        <button
                          type="button"
                          onClick={() => handleRemoveHolding(holding.id)}
                          className="text-red-400 hover:text-red-300"
                          disabled={holdings.length <= 1}
                        >
                          <MinusCircleIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full max-w-xs"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Portfolio'}
            </button>
          </div>
        </form>
      </div>

      {portfolioData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel p-6 rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-6">Portfolio Analysis Results</h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-3">Summary</h3>
            <p className="text-gray-300">{portfolioData.summary}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800 bg-opacity-40 p-4 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Diversification</h3>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Score</span>
                <span className="text-xl font-bold">{portfolioData.diversification?.score || 'N/A'}/10</span>
              </div>
              
              <div className="w-full bg-gray-600 rounded-full h-2 mb-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                  style={{ width: `${(portfolioData.diversification?.score / 10) * 100}%` }}
                ></div>
              </div>
              
              <h4 className="text-lg font-medium mb-2">Sector Exposure</h4>
              {portfolioData.diversification?.sectorExposure && (
                <div className="space-y-2">
                  {portfolioData.diversification.sectorExposure.map((sector: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-300">{sector.sector}</span>
                      <span className="text-blue-400">{sector.percentage}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-4">
                <span className="text-gray-300">Risk Level: </span>
                <span className={`font-medium ${
                  portfolioData.diversification?.riskLevel === 'Low' 
                    ? 'text-green-400' 
                    : portfolioData.diversification?.riskLevel === 'High' 
                      ? 'text-red-400' 
                      : 'text-yellow-400'
                }`}>
                  {portfolioData.diversification?.riskLevel || 'N/A'}
                </span>
              </div>
            </div>
            
            <div className="bg-gray-800 bg-opacity-40 p-4 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Risk Assessment</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-300">Volatility</span>
                    <span className="font-medium">{portfolioData.riskAssessment?.volatility || 'N/A'}</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full"
                      style={{ width: `${(portfolioData.riskAssessment?.volatility || 0) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-300">Sharpe Ratio</span>
                    <span className="font-medium">{portfolioData.riskAssessment?.sharpeRatio || 'N/A'}</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-500 to-green-500 h-2 rounded-full"
                      style={{ width: `${Math.min((portfolioData.riskAssessment?.sharpeRatio || 0) * 100 / 3, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-300">Beta Average</span>
                    <span className="font-medium">{portfolioData.riskAssessment?.betaAverage || 'N/A'}</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${Math.min((portfolioData.riskAssessment?.betaAverage || 0) * 100 / 2, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-3">Recommendations</h3>
            <ul className="list-disc pl-5 space-y-2">
              {portfolioData.recommendations && portfolioData.recommendations.map((recommendation: string, index: number) => (
                <li key={index} className="text-gray-300">{recommendation}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
} 