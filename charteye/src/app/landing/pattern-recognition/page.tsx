'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  DocumentChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

export default function PatternRecognitionLandingPage() {
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
            <DocumentChartBarIcon className="w-16 h-16 text-indigo-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600">
              Pattern Recognition
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Identify chart patterns and key price levels with AI-powered recognition
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            {user ? (
              <Link href="/pattern-recognition" className="btn-primary px-8 py-3 text-lg">
                Start Recognition
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
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
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
            <h2 className="text-3xl font-bold mb-6">How Pattern Recognition Works</h2>
            
            <div className="glass-panel p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Advanced Pattern Detection</h3>
              <p className="text-gray-300 mb-4">
                Our AI system is trained on thousands of historical chart patterns to accurately detect
                common technical patterns like head and shoulders, double tops/bottoms, triangles, wedges,
                and more complex formations that might be missed by the human eye.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Key Level Identification</h3>
              <p className="text-gray-300 mb-4">
                Automatically identify critical support and resistance levels, pivot points, and price zones
                that can act as important areas for trade decisions. The AI highlights these on your charts
                with clear visual indicators.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Probability Scoring</h3>
              <p className="text-gray-300 mb-4">
                Each identified pattern comes with a statistical probability score based on historical 
                pattern completion rates, helping you focus on the patterns most likely to play out in your favor.
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
                  <SparklesIcon className="w-6 h-6 text-indigo-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Never Miss a Pattern</h3>
                </div>
                <p className="text-gray-300">
                  Let AI spot patterns that would be easy to miss during manual chart analysis, ensuring you never overlook a potential trading opportunity.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <SparklesIcon className="w-6 h-6 text-indigo-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Enhance Decision-Making</h3>
                </div>
                <p className="text-gray-300">
                  Use pattern probability scores to make more informed trading decisions based on historical pattern success rates.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <SparklesIcon className="w-6 h-6 text-indigo-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Trade with Precision</h3>
                </div>
                <p className="text-gray-300">
                  Identify optimal entry and exit points based on pattern completion and key price level interactions.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <SparklesIcon className="w-6 h-6 text-indigo-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Pattern Learning</h3>
                </div>
                <p className="text-gray-300">
                  Improve your own pattern recognition skills by studying the AI's identifications and explanations over time.
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
                  <SparklesIcon className="h-5 w-5 text-indigo-400 mr-3" />
                  <span className="text-gray-300">5 free pattern recognitions per month</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-indigo-400 mr-3" />
                  <span className="text-gray-300">Basic pattern types</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-indigo-400 mr-3" />
                  <span className="text-gray-300">Simple level detection</span>
                </div>
              </div>
              
              <div className="text-center">
                <Link href={user ? "/pattern-recognition" : "/login"} className="btn-secondary w-full py-3">
                  {user ? "Continue with Free" : "Sign Up Free"}
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-panel p-8 rounded-lg border-2 border-indigo-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0">
                <div className="bg-indigo-500 text-xs uppercase font-bold tracking-wider text-white py-1 px-4 transform rotate-45 translate-x-2 translate-y-3">
                  Popular
                </div>
              </div>
              
              <div className="text-center mb-6">
                <span className="text-indigo-400 text-sm uppercase tracking-wide">Premium</span>
                <div className="flex items-center justify-center mt-2">
                  <h3 className="text-3xl font-bold">$20</h3>
                  <span className="text-gray-300 ml-2">lifetime access</span>
                </div>
                <p className="text-gray-400 mt-1">One-time payment</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-indigo-400 mr-3" />
                  <span className="text-white font-medium">Unlimited pattern recognitions</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-indigo-400 mr-3" />
                  <span className="text-white font-medium">40+ advanced pattern types</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-indigo-400 mr-3" />
                  <span className="text-white font-medium">Advanced probability scoring</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-indigo-400 mr-3" />
                  <span className="text-white font-medium">Multi-timeframe analysis</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-indigo-400 mr-3" />
                  <span className="text-white font-medium">Lifetime updates</span>
                </div>
              </div>
              
              <div className="text-center">
                <Link href={user ? "/upgrade" : "/login"} className="btn-primary w-full py-3">
                  {user ? "Upgrade Now" : "Get Premium"}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-indigo-900/20"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Spot Patterns Like a Pro?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join traders who are enhancing their pattern recognition abilities with ChartEye
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {user ? (
              <Link href="/pattern-recognition" className="btn-primary px-8 py-3 text-lg">
                Start Recognition Now
              </Link>
            ) : (
              <Link href="/login" className="btn-primary px-8 py-3 text-lg">
                Get Started Today
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
} 