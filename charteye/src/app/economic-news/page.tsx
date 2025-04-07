'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircleIcon, MinusCircleIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

// Interface for market data
interface MarketData {
  indices: {
    name: string;
    value: number;
    change: number;
    percentChange: number;
  }[];
  currencies: {
    pair: string;
    rate: number;
    change: number;
    percentChange: number;
  }[];
  commodities: {
    name: string;
    price: number;
    change: number;
    percentChange: number;
  }[];
  rates: {
    name: string;
    value: number;
    change: number;
  }[];
  volatility: {
    name: string;
    value: number;
    change: number;
  }[];
  timestamp: string;
}

export default function EconomicNewsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [newsData, setNewsData] = useState<any | null>(null);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [newsItems, setNewsItems] = useState<string[]>([
    'Federal Reserve hikes interest rates by 25 basis points'
  ]);

  const handleAddNewsItem = () => {
    setNewsItems([...newsItems, '']);
  };

  const handleRemoveNewsItem = (index: number) => {
    setNewsItems(newsItems.filter((_, i) => i !== index));
  };

  const handleNewsItemChange = (index: number, value: string) => {
    const newItems = [...newsItems];
    newItems[index] = value;
    setNewsItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for user authentication
    if (!user) {
      toast.error('Please sign in to analyze economic news');
      return;
    }
    
    // Validate input
    const isValid = newsItems.every(item => item.trim() !== '');
    
    if (!isValid) {
      toast.error('Please fill in all news items');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/economic-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newsItems }),
      });
      
      if (!response.ok) {
        throw new Error('Economic news analysis request failed');
      }
      
      const data = await response.json();
      setNewsData(data);
      
      // Store market data separately if available
      if (data.marketData) {
        setMarketData(data.marketData);
      }
      
      toast.success('Economic news analysis complete!');
    } catch (error: any) {
      console.error('Error analyzing economic news:', error);
      toast.error('Failed to analyze economic news. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to render positive/negative values with appropriate colors
  const renderValueWithColor = (value: number, prefix: string = '', suffix: string = '', isPercent: boolean = false) => {
    const formattedValue = isPercent 
      ? Math.abs(value).toFixed(2) + '%' 
      : prefix + Math.abs(value).toFixed(2) + suffix;
    
    return (
      <span className={`flex items-center ${value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {value >= 0 ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
        {value >= 0 ? '+' : '-'}{formattedValue}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Economic News Analysis</h1>
        <p className="text-gray-300">
          Enter economic news headlines to get AI-powered market impact analysis
        </p>
      </motion.div>

      <div className="glass-panel p-6 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium">News Headlines</h3>
              <button
                type="button"
                onClick={handleAddNewsItem}
                className="flex items-center space-x-1 text-blue-400 hover:text-blue-300"
              >
                <PlusCircleIcon className="h-5 w-5" />
                <span>Add News Item</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {newsItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleNewsItemChange(index, e.target.value)}
                    className="flex-grow px-3 py-2 bg-gray-800 text-white rounded"
                    placeholder="Enter economic news headline or summary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewsItem(index)}
                    className="text-red-400 hover:text-red-300"
                    disabled={newsItems.length <= 1}
                  >
                    <MinusCircleIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full max-w-xs"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Market Impact'}
            </button>
          </div>
        </form>
      </div>

      {marketData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-6 rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-6">Current Market Data</h2>
          <p className="text-sm text-gray-400 mb-6">
            As of {new Date(marketData.timestamp).toLocaleString()}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Major Indices */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b border-gray-700 pb-2">Major Indices</h3>
              {marketData.indices.map((index, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-gray-300">{index.name}</span>
                  <div className="text-right">
                    <div className="font-medium">{index.value.toFixed(0)}</div>
                    <div className="text-xs">
                      {renderValueWithColor(index.percentChange, '', '', true)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Currencies */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b border-gray-700 pb-2">Currencies</h3>
              {marketData.currencies.map((currency, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-gray-300">{currency.pair}</span>
                  <div className="text-right">
                    <div className="font-medium">{currency.rate.toFixed(4)}</div>
                    <div className="text-xs">
                      {renderValueWithColor(currency.percentChange, '', '', true)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Commodities & Volatility */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b border-gray-700 pb-2">Commodities & Metrics</h3>
              {marketData.commodities.map((commodity, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-gray-300">{commodity.name}</span>
                  <div className="text-right">
                    <div className="font-medium">${commodity.price.toFixed(2)}</div>
                    <div className="text-xs">
                      {renderValueWithColor(commodity.percentChange, '', '', true)}
                    </div>
                  </div>
                </div>
              ))}
              {marketData.volatility.map((vol, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-gray-300">{vol.name}</span>
                  <div className="text-right">
                    <div className="font-medium">{vol.value.toFixed(2)}</div>
                    <div className="text-xs">
                      {renderValueWithColor(vol.change)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {newsData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel p-6 rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-6">Economic Analysis Results</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-3">Summary</h3>
            <p className="text-gray-300">{newsData.summary}</p>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <h3 className="text-xl font-medium">Market Sentiment</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                newsData.marketSentiment === 'Positive' 
                  ? 'bg-green-900 text-green-300' 
                  : newsData.marketSentiment === 'Negative' 
                    ? 'bg-red-900 text-red-300' 
                    : newsData.marketSentiment === 'Mixed'
                      ? 'bg-yellow-900 text-yellow-300'
                      : 'bg-blue-900 text-blue-300'
              }`}>
                {newsData.marketSentiment}
              </span>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-3">Key Events</h3>
            <div className="space-y-4">
              {newsData.keyEvents && newsData.keyEvents.map((event: any, index: number) => (
                <div key={index} className="bg-gray-800 bg-opacity-40 p-4 rounded-lg">
                  <div className="flex items-start justify-between">
                    <h4 className="text-lg font-medium">{event.event}</h4>
                    <span className={`px-2 py-0.5 rounded text-sm ${
                      event.impact === 'Positive' 
                        ? 'bg-green-900 text-green-300' 
                        : event.impact === 'Negative' 
                          ? 'bg-red-900 text-red-300' 
                          : event.impact === 'Mixed'
                            ? 'bg-yellow-900 text-yellow-300'
                            : 'bg-blue-900 text-blue-300'
                    }`}>
                      {event.impact}
                    </span>
                  </div>
                  <p className="text-gray-300 mt-2">{event.analysis}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-3">Sector Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {newsData.sectorImpact && newsData.sectorImpact.map((sector: any, index: number) => (
                <div key={index} className="bg-gray-800 bg-opacity-40 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{sector.sector}</h4>
                    <span className={`px-2 py-0.5 rounded text-sm ${
                      sector.impact === 'Positive' 
                        ? 'bg-green-900 text-green-300' 
                        : sector.impact === 'Negative' 
                          ? 'bg-red-900 text-red-300' 
                          : sector.impact === 'Mixed'
                            ? 'bg-yellow-900 text-yellow-300'
                            : 'bg-blue-900 text-blue-300'
                    }`}>
                      {sector.impact}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{sector.details}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-3">Trading Opportunities</h3>
            <ul className="list-disc pl-5 space-y-2">
              {newsData.tradingOpportunities && newsData.tradingOpportunities.map((opportunity: string, index: number) => (
                <li key={index} className="text-gray-300">{opportunity}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
} 