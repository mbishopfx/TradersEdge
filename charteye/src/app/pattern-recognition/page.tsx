'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function PatternRecognitionPage() {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [patternData, setPatternData] = useState<any | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      toast.error('Please select a valid image file (JPG, PNG, GIF)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      return;
    }
    
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPatternData(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) return;
    
    // Check for user authentication
    if (!user) {
      toast.error('Please sign in to use pattern recognition');
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await fetch('/api/pattern-recognition', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Pattern recognition request failed');
      }
      
      const data = await response.json();
      setPatternData(data);
      toast.success('Pattern recognition complete!');
    } catch (error: any) {
      console.error('Error recognizing patterns:', error);
      toast.error('Failed to recognize patterns. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Pattern Recognition</h1>
        <p className="text-gray-300">
          Upload your trading chart to identify technical patterns and key price levels
        </p>
      </motion.div>

      <div className="glass-panel p-6 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
            {previewUrl ? (
              <div className="relative aspect-video mx-auto mb-4">
                <Image
                  src={previewUrl}
                  alt="Selected chart"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4 py-8">
                <CloudArrowUpIcon className="h-16 w-16 text-gray-400" />
                <h3 className="text-xl font-medium">Drop your chart image here</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                  PNG, JPG or GIF images up to 5MB
                </p>
              </div>
            )}
            
            <input
              type="file"
              id="chart-upload"
              onChange={handleFileSelect}
              className="hidden"
              accept="image/jpeg,image/png,image/gif"
            />
            
            <div className="mt-4 flex justify-center">
              <label
                htmlFor="chart-upload"
                className="btn-secondary cursor-pointer"
              >
                {previewUrl ? 'Change Image' : 'Select Image'}
              </label>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="btn-primary w-full max-w-xs"
            >
              {isUploading ? 'Analyzing...' : 'Identify Patterns'}
            </button>
          </div>
        </form>
      </div>

      {patternData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel p-6 rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-4">Detected Patterns</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-3">Summary</h3>
            <p className="text-gray-300">{patternData.summary}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-3">Patterns</h3>
            <div className="space-y-4">
              {patternData.patterns && patternData.patterns.map((pattern: any, index: number) => (
                <div key={index} className="bg-gray-800 bg-opacity-40 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="text-lg font-medium">{pattern.name}</h4>
                      <span className={`text-sm ${
                        pattern.tradingSignal === 'Bullish' 
                          ? 'text-green-400' 
                          : pattern.tradingSignal === 'Bearish' 
                            ? 'text-red-400' 
                            : 'text-gray-400'
                      }`}>
                        {pattern.tradingSignal}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{(Number(pattern.probability) * 100).toFixed(0)}%</div>
                      <span className="text-xs text-gray-400">confidence</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">{pattern.description}</p>
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full ${
                        pattern.tradingSignal === 'Bullish' 
                          ? 'bg-green-500' 
                          : pattern.tradingSignal === 'Bearish' 
                            ? 'bg-red-500' 
                            : 'bg-blue-500'
                      }`}
                      style={{ width: `${Number(pattern.probability) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {patternData.keyLevels && (
            <div>
              <h3 className="text-xl font-medium mb-3">Key Price Levels</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800 bg-opacity-40 p-4 rounded-lg">
                  <h4 className="text-lg font-medium mb-2 text-green-400">Support Levels</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {patternData.keyLevels.support && patternData.keyLevels.support.map((level: number, index: number) => (
                      <li key={index}>{level}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-gray-800 bg-opacity-40 p-4 rounded-lg">
                  <h4 className="text-lg font-medium mb-2 text-red-400">Resistance Levels</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {patternData.keyLevels.resistance && patternData.keyLevels.resistance.map((level: number, index: number) => (
                      <li key={index}>{level}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
} 