'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

type JournalEntry = {
  id: string;
  date: string;
  symbol: string;
  direction: 'Long' | 'Short';
  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  takeProfit: number;
  outcome: 'Win' | 'Loss' | 'Breakeven';
  notes: string;
};

export default function TradingJournalPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [journalData, setJournalData] = useState<any | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: new Date().toISOString().split('T')[0],
      symbol: 'AAPL',
      direction: 'Long',
      entryPrice: 150.25,
      exitPrice: 155.75,
      stopLoss: 148.00,
      takeProfit: 160.00,
      outcome: 'Win',
      notes: 'Entered after breakout from consolidation pattern with increased volume.'
    }
  ]);

  const handleAddEntry = () => {
    const newId = Date.now().toString();
    setEntries([
      ...entries,
      {
        id: newId,
        date: new Date().toISOString().split('T')[0],
        symbol: '',
        direction: 'Long',
        entryPrice: 0,
        exitPrice: 0,
        stopLoss: 0,
        takeProfit: 0,
        outcome: 'Win',
        notes: ''
      }
    ]);
  };

  const handleRemoveEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const handleEntryChange = (id: string, field: keyof JournalEntry, value: any) => {
    setEntries(
      entries.map(entry => 
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for user authentication
    if (!user) {
      toast.error('Please sign in to analyze your trading journal');
      return;
    }
    
    // Validate input
    const isValid = entries.every(entry => 
      entry.symbol && 
      entry.date && 
      entry.entryPrice > 0 && 
      entry.exitPrice > 0 &&
      entry.stopLoss > 0 &&
      entry.takeProfit > 0
    );
    
    if (!isValid) {
      toast.error('Please fill in all required fields with valid values');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/trading-journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entries }),
      });
      
      if (!response.ok) {
        throw new Error('Trading journal analysis request failed');
      }
      
      const data = await response.json();
      setJournalData(data);
      toast.success('Trading journal analysis complete!');
    } catch (error: any) {
      console.error('Error analyzing trading journal:', error);
      toast.error('Failed to analyze trading journal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Trading Journal</h1>
        <p className="text-gray-300">
          Log your trades and get AI-powered insights to improve your trading performance
        </p>
      </motion.div>

      <div className="glass-panel p-6 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium">Your Trades</h3>
              <button
                type="button"
                onClick={handleAddEntry}
                className="flex items-center space-x-1 text-blue-400 hover:text-blue-300"
              >
                <PlusCircleIcon className="h-5 w-5" />
                <span>Add Trade</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              {entries.map((entry, index) => (
                <div key={entry.id} className="mb-6 p-4 bg-gray-800 bg-opacity-40 rounded-lg">
                  <div className="flex justify-between mb-4">
                    <h4 className="text-lg font-medium">Trade #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveEntry(entry.id)}
                      className="text-red-400 hover:text-red-300"
                      disabled={entries.length <= 1}
                    >
                      <MinusCircleIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                      <input
                        type="date"
                        value={entry.date}
                        onChange={(e) => handleEntryChange(entry.id, 'date', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Symbol</label>
                      <input
                        type="text"
                        value={entry.symbol}
                        onChange={(e) => handleEntryChange(entry.id, 'symbol', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                        placeholder="AAPL"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Direction</label>
                      <select
                        value={entry.direction}
                        onChange={(e) => handleEntryChange(entry.id, 'direction', e.target.value as 'Long' | 'Short')}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded"
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
                        value={entry.entryPrice}
                        onChange={(e) => handleEntryChange(entry.id, 'entryPrice', Number(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                        placeholder="150.25"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Exit Price</label>
                      <input
                        type="number"
                        value={entry.exitPrice}
                        onChange={(e) => handleEntryChange(entry.id, 'exitPrice', Number(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                        placeholder="155.75"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Stop Loss</label>
                      <input
                        type="number"
                        value={entry.stopLoss}
                        onChange={(e) => handleEntryChange(entry.id, 'stopLoss', Number(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                        placeholder="148.00"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Take Profit</label>
                      <input
                        type="number"
                        value={entry.takeProfit}
                        onChange={(e) => handleEntryChange(entry.id, 'takeProfit', Number(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                        placeholder="160.00"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Outcome</label>
                      <select
                        value={entry.outcome}
                        onChange={(e) => handleEntryChange(entry.id, 'outcome', e.target.value as 'Win' | 'Loss' | 'Breakeven')}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                        required
                      >
                        <option value="Win">Win</option>
                        <option value="Loss">Loss</option>
                        <option value="Breakeven">Breakeven</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-sm font-medium text-gray-400 mb-1">Notes</label>
                      <textarea
                        value={entry.notes}
                        onChange={(e) => handleEntryChange(entry.id, 'notes', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                        placeholder="Enter your trade notes, strategy, market conditions, etc."
                        rows={3}
                      />
                    </div>
                  </div>
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
              {isLoading ? 'Analyzing...' : 'Analyze Trading Performance'}
            </button>
          </div>
        </form>
      </div>

      {journalData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel p-6 rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-6">Trading Analysis Results</h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-3">Summary</h3>
            <p className="text-gray-300">{journalData.summary}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800 bg-opacity-40 p-4 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Strengths</h3>
              <ul className="list-disc pl-5 space-y-2">
                {journalData.strengths && journalData.strengths.map((strength: string, index: number) => (
                  <li key={index} className="text-gray-300">{strength}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-800 bg-opacity-40 p-4 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Weaknesses</h3>
              <ul className="list-disc pl-5 space-y-2">
                {journalData.weaknesses && journalData.weaknesses.map((weakness: string, index: number) => (
                  <li key={index} className="text-gray-300">{weakness}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4">Trading Patterns</h3>
            <div className="bg-gray-800 bg-opacity-40 p-4 rounded-lg">
              <ul className="list-disc pl-5 space-y-2">
                {journalData.patterns && journalData.patterns.map((pattern: string, index: number) => (
                  <li key={index} className="text-gray-300">{pattern}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-3">Recommendations</h3>
            <div className="bg-gray-800 bg-opacity-40 p-4 rounded-lg">
              <ul className="list-disc pl-5 space-y-2">
                {journalData.recommendations && journalData.recommendations.map((recommendation: string, index: number) => (
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