'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ShieldExclamationIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

export default function RiskAnalysisLandingPage() {
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
            <ShieldExclamationIcon className="w-16 h-16 text-red-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-600">
              Risk Analysis
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Calculate optimal position size and analyze risk/reward for trade setups
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            {user ? (
              <Link href="/risk-analysis" className="btn-primary px-8 py-3 text-lg">
                Analyze Risk
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
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
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
            <h2 className="text-3xl font-bold mb-6">How Risk Analysis Works</h2>
            
            <div className="glass-panel p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Position Size Calculator</h3>
              <p className="text-gray-300 mb-4">
                Enter your account size, risk tolerance percentage, and stop loss distance to calculate
                the optimal position size for any trade. Never risk more than you're comfortable losing.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Risk/Reward Analysis</h3>
              <p className="text-gray-300 mb-4">
                Visualize and calculate risk/reward ratios for potential trades. Set your take profit
                and stop loss levels to determine if a trade meets your minimum reward requirements.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Trade Probability Assessment</h3>
              <p className="text-gray-300 mb-4">
                Our AI evaluates your trade setup based on historical patterns and market conditions,
                giving you an estimated probability of success and highlighting potential risk factors.
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
                  <SparklesIcon className="w-6 h-6 text-red-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Protect Your Capital</h3>
                </div>
                <p className="text-gray-300">
                  Ensure you never risk too much on a single trade with precise position sizing calculations.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <SparklesIcon className="w-6 h-6 text-red-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Improve Win Rate</h3>
                </div>
                <p className="text-gray-300">
                  Take only high-probability trades with favorable risk/reward ratios to enhance long-term profitability.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <SparklesIcon className="w-6 h-6 text-red-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Trading Psychology</h3>
                </div>
                <p className="text-gray-300">
                  Trade with confidence knowing your risk is calculated and controlled, reducing emotional decision-making.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <SparklesIcon className="w-6 h-6 text-red-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Scenario Analysis</h3>
                </div>
                <p className="text-gray-300">
                  Test different entry, stop loss, and target levels to optimize your trade setup before execution.
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
                  <SparklesIcon className="h-5 w-5 text-red-400 mr-3" />
                  <span className="text-gray-300">Basic position sizing</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-red-400 mr-3" />
                  <span className="text-gray-300">Simple risk/reward calculator</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-red-400 mr-3" />
                  <span className="text-gray-300">Limited market assessments</span>
                </div>
              </div>
              
              <div className="text-center">
                <Link href={user ? "/risk-analysis" : "/login"} className="btn-secondary w-full py-3">
                  {user ? "Continue with Free" : "Sign Up Free"}
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-panel p-8 rounded-lg border-2 border-red-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0">
                <div className="bg-red-500 text-xs uppercase font-bold tracking-wider text-white py-1 px-4 transform rotate-45 translate-x-2 translate-y-3">
                  Popular
                </div>
              </div>
              
              <div className="text-center mb-6">
                <span className="text-red-400 text-sm uppercase tracking-wide">Premium</span>
                <div className="flex items-center justify-center mt-2">
                  <h3 className="text-3xl font-bold">$20</h3>
                  <span className="text-gray-300 ml-2">lifetime access</span>
                </div>
                <p className="text-gray-400 mt-1">One-time payment</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-red-400 mr-3" />
                  <span className="text-white font-medium">Advanced position sizing</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-red-400 mr-3" />
                  <span className="text-white font-medium">Comprehensive risk assessment</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-red-400 mr-3" />
                  <span className="text-white font-medium">AI trade probability analysis</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-red-400 mr-3" />
                  <span className="text-white font-medium">Multiple scenario testing</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-red-400 mr-3" />
                  <span className="text-white font-medium">Risk management templates</span>
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