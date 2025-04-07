'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

export default function AnalysisLandingPage() {
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
            <ChartBarIcon className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              AI Chart Analysis
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Upload your charts and get detailed technical analysis with objective grading
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            {user ? (
              <Link href="/analysis" className="btn-primary px-8 py-3 text-lg">
                Start Analyzing
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
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
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
            <h2 className="text-3xl font-bold mb-6">How AI Chart Analysis Works</h2>
            
            <div className="glass-panel p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Upload & Analyze</h3>
              <p className="text-gray-300 mb-4">
                Simply upload your trading chart images, and our advanced AI model will analyze the technical patterns, 
                support and resistance levels, momentum indicators, and overall market structure.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Get Detailed Insights</h3>
              <p className="text-gray-300 mb-4">
                Receive comprehensive analysis of your chart, including pattern identification, trend strength assessment, 
                key price levels, and potential scenarios. Each analysis is personalized to your specific chart.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Objective Grading</h3>
              <p className="text-gray-300 mb-4">
                Our AI provides objective grading across multiple factors including pattern clarity, trend alignment, 
                risk/reward ratio, volume confirmation, and key level proximity. Get an overall grade to help you 
                evaluate trade quality.
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
                  <SparklesIcon className="w-6 h-6 text-blue-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Eliminate Confirmation Bias</h3>
                </div>
                <p className="text-gray-300">
                  Get an objective second opinion on your charts to avoid emotional trading decisions and confirmation bias.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <SparklesIcon className="w-6 h-6 text-blue-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Improve Trade Selection</h3>
                </div>
                <p className="text-gray-300">
                  Use pattern grading to focus on the highest quality trading opportunities and improve your win rate.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <SparklesIcon className="w-6 h-6 text-blue-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Learn & Improve</h3>
                </div>
                <p className="text-gray-300">
                  Learn from AI analysis to recognize key patterns and improve your own chart reading skills over time.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <SparklesIcon className="w-6 h-6 text-blue-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Save Time</h3>
                </div>
                <p className="text-gray-300">
                  Get instant analysis of complex chart patterns without spending hours on manual technical analysis.
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
                  <SparklesIcon className="h-5 w-5 text-blue-400 mr-3" />
                  <span className="text-gray-300">5 free analysis credits per month</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-blue-400 mr-3" />
                  <span className="text-gray-300">Standard response time</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-blue-400 mr-3" />
                  <span className="text-gray-300">Basic chart analysis</span>
                </div>
              </div>
              
              <div className="text-center">
                <Link href={user ? "/analysis" : "/login"} className="btn-secondary w-full py-3">
                  {user ? "Continue with Free" : "Sign Up Free"}
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-panel p-8 rounded-lg border-2 border-blue-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0">
                <div className="bg-blue-500 text-xs uppercase font-bold tracking-wider text-white py-1 px-4 transform rotate-45 translate-x-2 translate-y-3">
                  Popular
                </div>
              </div>
              
              <div className="text-center mb-6">
                <span className="text-blue-400 text-sm uppercase tracking-wide">Premium</span>
                <div className="flex items-center justify-center mt-2">
                  <h3 className="text-3xl font-bold">$20</h3>
                  <span className="text-gray-300 ml-2">lifetime access</span>
                </div>
                <p className="text-gray-400 mt-1">One-time payment</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-blue-400 mr-3" />
                  <span className="text-white font-medium">Unlimited chart analysis</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-blue-400 mr-3" />
                  <span className="text-white font-medium">Priority response times</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-blue-400 mr-3" />
                  <span className="text-white font-medium">Advanced pattern recognition</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-blue-400 mr-3" />
                  <span className="text-white font-medium">Detailed grading & insights</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-blue-400 mr-3" />
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
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-blue-900/20"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Enhance Your Chart Analysis?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of traders using ChartEye to gain an edge in the markets
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {user ? (
              <Link href="/analysis" className="btn-primary px-8 py-3 text-lg">
                Start Analyzing Now
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