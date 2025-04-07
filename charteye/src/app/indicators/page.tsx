'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CodeBracketIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function IndicatorsPage() {
  const { user } = useAuth();
  const [language, setLanguage] = useState('pine');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim() || !user) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/indicators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          description,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Code generation failed');
      }
      
      const data = await response.json();
      setGeneratedCode(data.code);
      toast.success('Indicator code generated successfully!');
    } catch (error) {
      console.error('Error generating indicator code:', error);
      toast.error('Failed to generate code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedCode) return;
    
    navigator.clipboard.writeText(generatedCode)
      .then(() => toast.success('Code copied to clipboard!'))
      .catch(() => toast.error('Failed to copy code'));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">AI Indicator Generator</h1>
        <p className="text-gray-300">
          Describe your trading indicator in plain language and get ready-to-use code
        </p>
      </motion.div>

      {!user ? (
        <div className="glass-panel p-8 text-center">
          <p className="text-xl mb-4">Please sign in to use the indicator generator</p>
          <button className="btn-primary">Sign In</button>
        </div>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="glass-panel p-6">
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Select Language</label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setLanguage('pine')}
                  className={`p-3 rounded-lg ${
                    language === 'pine' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Pine Script
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('mql4')}
                  className={`p-3 rounded-lg ${
                    language === 'mql4' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  MQL4
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('mql5')}
                  className={`p-3 rounded-lg ${
                    language === 'mql5' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  MQL5
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-300 mb-2">
                Describe Your Indicator
              </label>
              <textarea
                id="description"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Example: A moving average ribbon with 5 EMAs (10, 20, 50, 100, 200) that changes color when they cross"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isGenerating || !description.trim()}
              className="btn-primary w-full"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <CodeBracketIcon className="w-5 h-5 mr-2 animate-pulse" />
                  Generating Code...
                </span>
              ) : (
                'Generate Indicator Code'
              )}
            </button>
          </div>
        </motion.form>
      )}

      {generatedCode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4"
        >
          <div className="glass-panel overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold">Generated Code</h2>
              <button
                onClick={copyToClipboard}
                className="btn-secondary text-sm"
              >
                Copy Code
              </button>
            </div>
            <div className="p-1 max-h-96 overflow-auto">
              <SyntaxHighlighter
                language={language === 'pine' ? 'javascript' : 'cpp'}
                style={vscDarkPlus}
                customStyle={{ background: 'transparent' }}
                showLineNumbers
              >
                {generatedCode}
              </SyntaxHighlighter>
            </div>
          </div>
        </motion.div>
      )}

      <div className="text-sm text-gray-400 mt-8 p-4 border border-gray-800 rounded-lg">
        <p>
          <strong>Disclaimer:</strong> AI-generated code is provided as-is without any warranty.
          Always test indicator code thoroughly in a demo environment before using it for actual trading.
          Use at your own risk.
        </p>
      </div>
    </div>
  );
} 