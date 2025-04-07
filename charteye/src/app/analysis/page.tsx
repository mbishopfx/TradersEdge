'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function AnalysisPage() {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any | null>(null);

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
    setAnalysis(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) return;
    
    // Check for user authentication
    if (!user) {
      toast.error('Please sign in to analyze charts');
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await fetch('/api/analysis', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Analysis request failed');
      }
      
      const data = await response.json();
      setAnalysis(data);
      toast.success('Chart analysis complete!');
    } catch (error: any) {
      console.error('Error analyzing chart:', error);
      
      // Special handling for offline mode or API not enabled
      if (error.message?.includes('offline') || 
          error.message?.includes('failed to fetch') || 
          error.message?.includes('network')) {
        
        toast.error('Unable to connect to the server. Using mock data for testing.');
        
        // Use mock data for offline testing
        setTimeout(() => {
          setAnalysis({
            id: 'mock-offline-analysis',
            imageUrl: previewUrl,
            analysis: 'This appears to be a bullish chart pattern with strong momentum indicators. The price is forming an ascending triangle pattern with higher lows, suggesting accumulation. Volume is increasing on up days, confirming the bullish bias. Key resistance is visible at the upper boundary of the triangle, and a breakout could lead to significant upside.',
            grading: {
              patternClarity: 8.2,
              trendAlignment: 7.9,
              riskReward: 8.5,
              volumeConfirmation: 7.8,
              keyLevelProximity: 8.7,
              overallGrade: 8.2
            },
            createdAt: new Date().toISOString()
          });
          toast.success('Mock analysis generated for testing');
        }, 1500);
        
        return;
      }
      
      toast.error('Failed to analyze chart. Please try again.');
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
        <h1 className="text-3xl font-bold mb-2">AI Chart Analysis</h1>
        <p className="text-gray-300">
          Upload your trading chart to receive detailed AI-powered technical analysis and trade grading
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
              {isUploading ? 'Analyzing...' : 'Analyze Chart'}
            </button>
          </div>
        </form>
      </div>

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel p-6 rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
          
          <div className="mb-6 border-b border-gray-700 pb-6">
            <h3 className="text-xl font-medium mb-3">Technical Analysis</h3>
            <p className="text-gray-300 whitespace-pre-line">{analysis.analysis}</p>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-3">Chart Grading</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysis.grading && Object.entries(analysis.grading).map(([key, value]: [string, any]) => (
                key !== 'overallGrade' && (
                  <div key={key} className="bg-gray-800 bg-opacity-40 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-300">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </h4>
                      <span className="text-lg font-bold">{value.toFixed(1)}</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${(value / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )
              ))}
            </div>
            
            {analysis.grading?.overallGrade && (
              <div className="mt-6 bg-gray-800 bg-opacity-40 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-medium">Overall Grade</h4>
                  <span className="text-2xl font-bold">{analysis.grading.overallGrade.toFixed(1)}</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                    style={{ width: `${(analysis.grading.overallGrade / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
} 