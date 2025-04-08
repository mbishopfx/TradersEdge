'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  CodeBracketIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

export default function IndicatorsLandingPage() {
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
            <CodeBracketIcon className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Indicator Generation
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Generate custom trading indicators in MQL4, MQL5, and Pine Script
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            {user ? (
              <Link href="/indicators" className="btn-primary px-8 py-3 text-lg">
                Create Indicators
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
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
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
            <h2 className="text-3xl font-bold mb-6">How Indicator Generation Works</h2>
            
            <div className="glass-panel p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">AI-Powered Code Generation</h3>
              <p className="text-gray-300 mb-4">
                Describe the indicator you want to create in plain English, and our AI will generate 
                high-quality, optimized code ready to use in your trading platform. No coding knowledge required.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Multi-Platform Support</h3>
              <p className="text-gray-300 mb-4">
                Generate indicators for all major trading platforms including MetaTrader 4, MetaTrader 5, and TradingView
                (Pine Script). Easily port your custom indicators between different platforms.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Customization & Optimization</h3>
              <p className="text-gray-300 mb-4">
                Fine-tune your indicators with parameterization options, visual settings, and performance optimizations.
                Get code that is not just functional, but efficient and professionally written.
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
                  <SparklesIcon className="w-6 h-6 text-cyan-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">No Coding Skills Needed</h3>
                </div>
                <p className="text-gray-300">
                  Create complex technical indicators without writing a single line of code yourself.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <SparklesIcon className="w-6 h-6 text-cyan-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Custom Trading Edge</h3>
                </div>
                <p className="text-gray-300">
                  Develop unique indicators that match your specific trading strategy and give you an edge in the markets.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <SparklesIcon className="w-6 h-6 text-cyan-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Rapid Development</h3>
                </div>
                <p className="text-gray-300">
                  Create indicators in minutes instead of hours or days, letting you test new ideas quickly.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <SparklesIcon className="w-6 h-6 text-cyan-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Learning Resource</h3>
                </div>
                <p className="text-gray-300">
                  Study the generated code to improve your understanding of indicator development and programming.
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
                  <SparklesIcon className="h-5 w-5 text-cyan-400 mr-3" />
                  <span className="text-gray-300">Generate 3 indicators per month</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-cyan-400 mr-3" />
                  <span className="text-gray-300">Basic indicator types</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-cyan-400 mr-3" />
                  <span className="text-gray-300">Standard code optimization</span>
                </div>
              </div>
              
              <div className="text-center">
                <Link href={user ? "/indicators" : "/login"} className="btn-secondary w-full py-3">
                  {user ? "Continue with Free" : "Sign Up Free"}
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-panel p-8 rounded-lg border-2 border-cyan-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0">
                <div className="bg-cyan-500 text-xs uppercase font-bold tracking-wider text-white py-1 px-4 transform rotate-45 translate-x-2 translate-y-3">
                  Popular
                </div>
              </div>
              
              <div className="text-center mb-6">
                <span className="text-cyan-400 text-sm uppercase tracking-wide">Premium</span>
                <div className="flex items-center justify-center mt-2">
                  <h3 className="text-3xl font-bold">$20</h3>
                  <span className="text-gray-300 ml-2">lifetime access</span>
                </div>
                <p className="text-gray-400 mt-1">One-time payment</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-cyan-400 mr-3" />
                  <span className="text-white font-medium">Unlimited indicator generation</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-cyan-400 mr-3" />
                  <span className="text-white font-medium">Advanced indicator types</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-cyan-400 mr-3" />
                  <span className="text-white font-medium">High-performance optimization</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-cyan-400 mr-3" />
                  <span className="text-white font-medium">Multi-platform code generation</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-cyan-400 mr-3" />
                  <span className="text-white font-medium">Detailed code documentation</span>
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