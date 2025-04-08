'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  NewspaperIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

export default function EconomicNewsLandingPage() {
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
            <NewspaperIcon className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
              Economic News
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Analyze how economic news will impact markets, sectors and trading opportunities
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            {user ? (
              <Link href="/economic-news" className="btn-primary px-8 py-3 text-lg">
                View Economic News
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
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
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
            <h2 className="text-3xl font-bold mb-6">How Economic News Works</h2>
            
            <div className="glass-panel p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Real-Time News Aggregation</h3>
              <p className="text-gray-300 mb-4">
                Stay informed with a continuous stream of financial news from global markets, central banks,
                and economic indicators. Our system aggregates news from reliable sources in real-time.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">AI-Powered Impact Analysis</h3>
              <p className="text-gray-300 mb-4">
                Our AI evaluates news articles to determine their potential impact on various markets and asset classes,
                helping you understand which news events matter for your trading strategy.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Interactive News Insights</h3>
              <p className="text-gray-300 mb-4">
                Chat with our AI to ask questions about specific news events, get detailed explanations about economic concepts,
                and understand how different pieces of news may interact to affect markets.
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
                  <SparklesIcon className="w-6 h-6 text-green-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Stay Ahead of Market Moves</h3>
                </div>
                <p className="text-gray-300">
                  React quickly to breaking news with immediate alerts and analysis of potential market impact.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <SparklesIcon className="w-6 h-6 text-green-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Cut Through the Noise</h3>
                </div>
                <p className="text-gray-300">
                  Focus on news that matters with AI-curated insights tailored to your specific trading interests.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <SparklesIcon className="w-6 h-6 text-green-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Deepen Economic Understanding</h3>
                </div>
                <p className="text-gray-300">
                  Enhance your knowledge of economic principles and their market effects through interactive AI explanations.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <SparklesIcon className="w-6 h-6 text-green-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Identify Trading Opportunities</h3>
                </div>
                <p className="text-gray-300">
                  Discover potential trades based on news events with AI-generated ideas and risk assessments.
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
                  <SparklesIcon className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Daily news summary</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Basic market impact analysis</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">10 AI chat questions per day</span>
                </div>
              </div>
              
              <div className="text-center">
                <Link href={user ? "/economic-news" : "/login"} className="btn-secondary w-full py-3">
                  {user ? "Continue with Free" : "Sign Up Free"}
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-panel p-8 rounded-lg border-2 border-green-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0">
                <div className="bg-green-500 text-xs uppercase font-bold tracking-wider text-white py-1 px-4 transform rotate-45 translate-x-2 translate-y-3">
                  Popular
                </div>
              </div>
              
              <div className="text-center mb-6">
                <span className="text-green-400 text-sm uppercase tracking-wide">Premium</span>
                <div className="flex items-center justify-center mt-2">
                  <h3 className="text-3xl font-bold">$20</h3>
                  <span className="text-gray-300 ml-2">lifetime access</span>
                </div>
                <p className="text-gray-400 mt-1">One-time payment</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-white font-medium">Real-time news alerts</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-white font-medium">Advanced impact analysis</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-white font-medium">Unlimited AI chat questions</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-white font-medium">Custom news filters</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-white font-medium">Trading opportunity alerts</span>
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