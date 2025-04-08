'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  BookOpenIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

export default function TradingJournalLandingPage() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <BookOpenIcon className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
              Trading Journal
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Log your trades and receive AI-powered insights to improve performance
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            {user ? (
              <Link href="/trading-journal" className="btn-primary px-8 py-3 text-lg">
                Open Journal
              </Link>
            ) : (
              <Link href="/login" className="btn-primary px-8 py-3 text-lg">
                Sign In to Use
              </Link>
            )}
          </motion.div>
        </div>
        
        {/* Background Animation Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Feature Details */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-6">How Trading Journal Works</h2>
            
            <div className="glass-panel p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Track Your Trades</h3>
              <p className="text-gray-300 mb-4">
                Log every trade with details including entry and exit points, position size, strategy used,
                and notes about market conditions. Attach screenshots of your charts for visual reference.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">AI Performance Analysis</h3>
              <p className="text-gray-300 mb-4">
                Our AI analyzes your trading history to identify patterns, strengths, and weaknesses in your
                approach. Get personalized insights on how to improve your win rate and risk management.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Performance Metrics</h3>
              <p className="text-gray-300 mb-4">
                View detailed statistics on your trading performance including win rate, average profit/loss,
                risk-reward ratio, and more. Track your progress over time with visual charts.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-6">Benefits</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <SparklesIcon className="w-6 h-6 text-yellow-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Learn From Past Trades</h3>
                </div>
                <p className="text-gray-300">
                  Identify what works and what doesn't through systematic tracking and analysis of your trading history.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <SparklesIcon className="w-6 h-6 text-yellow-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Improve Trading Psychology</h3>
                </div>
                <p className="text-gray-300">
                  Develop better emotional discipline by documenting your mental state during trades and identifying triggers.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <SparklesIcon className="w-6 h-6 text-yellow-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Refine Your Strategy</h3>
                </div>
                <p className="text-gray-300">
                  Use insights from your journal to continuously adjust and improve your trading strategies.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <SparklesIcon className="w-6 h-6 text-yellow-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Track Long-Term Progress</h3>
                </div>
                <p className="text-gray-300">
                  See your growth as a trader over time with historical performance data and trend analysis.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pricing Plans</h2>
            <p className="text-xl text-gray-300">
              Choose the plan that fits your trading needs
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-panel p-8 rounded-lg"
            >
              <div className="text-center mb-6">
                <span className="text-gray-400 text-sm uppercase tracking-wide">Free</span>
                <div className="flex items-center justify-center mt-2">
                  <h3 className="text-3xl font-bold">$0</h3>
                  <span className="text-gray-300 ml-2">forever</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-yellow-400 mr-3" />
                  <span className="text-gray-300">Log up to 20 trades</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-yellow-400 mr-3" />
                  <span className="text-gray-300">Basic performance metrics</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-yellow-400 mr-3" />
                  <span className="text-gray-300">Limited AI analysis</span>
                </div>
              </div>
              
              <div className="text-center">
                <Link href={user ? "/trading-journal" : "/login"} className="btn-secondary w-full py-3">
                  {user ? "Continue with Free" : "Sign Up Free"}
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-panel p-8 rounded-lg border-2 border-yellow-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0">
                <div className="bg-yellow-500 text-xs uppercase font-bold tracking-wider text-white py-1 px-4 transform rotate-45 translate-x-2 translate-y-3">
                  Popular
                </div>
              </div>
              
              <div className="text-center mb-6">
                <span className="text-yellow-400 text-sm uppercase tracking-wide">Premium</span>
                <div className="flex items-center justify-center mt-2">
                  <h3 className="text-3xl font-bold">$20</h3>
                  <span className="text-gray-300 ml-2">lifetime access</span>
                </div>
                <p className="text-gray-400 mt-1">One-time payment</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-yellow-400 mr-3" />
                  <span className="text-white font-medium">Unlimited trade logs</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-yellow-400 mr-3" />
                  <span className="text-white font-medium">Advanced performance metrics</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-yellow-400 mr-3" />
                  <span className="text-white font-medium">Comprehensive AI analysis</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-yellow-400 mr-3" />
                  <span className="text-white font-medium">Strategy optimization suggestions</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-yellow-400 mr-3" />
                  <span className="text-white font-medium">Export and backup features</span>
                </div>
              </div>
              
              <div className="text-center">
                <Link href="/upgrade" className="btn-primary w-full py-3">
                  {user ? "Upgrade Now" : "Sign Up & Upgrade"}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
} 