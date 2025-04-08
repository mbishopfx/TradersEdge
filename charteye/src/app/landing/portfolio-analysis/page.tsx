'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ScaleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

export default function PortfolioAnalysisLandingPage() {
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
            <ScaleIcon className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
              Portfolio Analysis
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get insights on your portfolio diversity, risk exposure, and optimization
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            {user ? (
              <Link href="/portfolio-analysis" className="btn-primary px-8 py-3 text-lg">
                Analyze Portfolio
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
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
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
            <h2 className="text-3xl font-bold mb-6">How Portfolio Analysis Works</h2>
            
            <div className="glass-panel p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Comprehensive Portfolio View</h3>
              <p className="text-gray-300 mb-4">
                Import your trading positions or manually enter them to get a complete overview of your portfolio.
                See asset allocation, sector exposure, geographic distribution, and more in intuitive visualizations.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Risk Assessment</h3>
              <p className="text-gray-300 mb-4">
                Our AI evaluates your portfolio for risk factors including volatility, concentration, correlation,
                and drawdown potential. Get a clear picture of where your risks lie and how to mitigate them.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Optimization Suggestions</h3>
              <p className="text-gray-300 mb-4">
                Receive AI-powered recommendations to improve your portfolio's risk-adjusted returns.
                Get specific suggestions for rebalancing, diversification, and potential new positions.
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
                  <SparklesIcon className="w-6 h-6 text-purple-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Clear Visualization</h3>
                </div>
                <p className="text-gray-300">
                  See your entire portfolio at a glance with intuitive charts showing allocation, performance, and risk.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <SparklesIcon className="w-6 h-6 text-purple-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Hidden Risk Detection</h3>
                </div>
                <p className="text-gray-300">
                  Identify non-obvious risks like correlated assets, sector concentration, and vulnerability to specific market events.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <SparklesIcon className="w-6 h-6 text-purple-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Performance Improvement</h3>
                </div>
                <p className="text-gray-300">
                  Get actionable suggestions to enhance returns while managing risk through better diversification and allocation.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <SparklesIcon className="w-6 h-6 text-purple-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">What-If Scenarios</h3>
                </div>
                <p className="text-gray-300">
                  Test how your portfolio might perform under different market conditions and evaluate potential changes before making them.
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
                  <SparklesIcon className="h-5 w-5 text-purple-400 mr-3" />
                  <span className="text-gray-300">Analyze up to 5 assets</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-purple-400 mr-3" />
                  <span className="text-gray-300">Basic risk metrics</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-purple-400 mr-3" />
                  <span className="text-gray-300">Limited optimization suggestions</span>
                </div>
              </div>
              
              <div className="text-center">
                <Link href={user ? "/portfolio-analysis" : "/login"} className="btn-secondary w-full py-3">
                  {user ? "Continue with Free" : "Sign Up Free"}
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-panel p-8 rounded-lg border-2 border-purple-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0">
                <div className="bg-purple-500 text-xs uppercase font-bold tracking-wider text-white py-1 px-4 transform rotate-45 translate-x-2 translate-y-3">
                  Popular
                </div>
              </div>
              
              <div className="text-center mb-6">
                <span className="text-purple-400 text-sm uppercase tracking-wide">Premium</span>
                <div className="flex items-center justify-center mt-2">
                  <h3 className="text-3xl font-bold">$20</h3>
                  <span className="text-gray-300 ml-2">lifetime access</span>
                </div>
                <p className="text-gray-400 mt-1">One-time payment</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-purple-400 mr-3" />
                  <span className="text-white font-medium">Unlimited portfolio assets</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-purple-400 mr-3" />
                  <span className="text-white font-medium">Advanced risk analysis</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-purple-400 mr-3" />
                  <span className="text-white font-medium">AI-powered optimization</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-purple-400 mr-3" />
                  <span className="text-white font-medium">Market scenario testing</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-purple-400 mr-3" />
                  <span className="text-white font-medium">Export and reporting features</span>
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