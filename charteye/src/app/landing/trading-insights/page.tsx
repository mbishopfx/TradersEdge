'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  LightBulbIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

export default function TradingInsightsLandingPage() {
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
            <LightBulbIcon className="w-16 h-16 text-orange-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-600">
              Trading Insights
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Chat with AI about market strategies, technical questions and trading advice
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            {user ? (
              <Link href="/trading-insights" className="btn-primary px-8 py-3 text-lg">
                Start Chatting
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
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"></div>
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
            <h2 className="text-3xl font-bold mb-6">How Trading Insights Works</h2>
            
            <div className="glass-panel p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Personalized AI Assistant</h3>
              <p className="text-gray-300 mb-4">
                Engage in natural conversations with our AI trading advisor, asking any questions about 
                trading strategies, market analysis, or specific trading scenarios. The AI provides tailored 
                responses based on your unique needs.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Market Knowledge</h3>
              <p className="text-gray-300 mb-4">
                Get insights on market conditions, technical analysis concepts, fundamental analysis 
                approaches, and risk management strategies from an AI with extensive trading knowledge.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Continuous Learning</h3>
              <p className="text-gray-300 mb-4">
                Our AI assistant improves over time, learning from conversations and staying updated with 
                the latest trading approaches and market understanding to provide increasingly valuable insights.
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
                  <SparklesIcon className="w-6 h-6 text-orange-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">24/7 Trading Mentor</h3>
                </div>
                <p className="text-gray-300">
                  Access professional-level trading advice anytime you need it, without waiting or scheduling appointments.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <SparklesIcon className="w-6 h-6 text-orange-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Strategy Development</h3>
                </div>
                <p className="text-gray-300">
                  Refine your trading approach by discussing ideas and getting feedback on potential strategies.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <SparklesIcon className="w-6 h-6 text-orange-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Trading Education</h3>
                </div>
                <p className="text-gray-300">
                  Learn complex trading concepts explained in simple terms, tailored to your level of understanding.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <SparklesIcon className="w-6 h-6 text-orange-400 mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold">Emotional Discipline</h3>
                </div>
                <p className="text-gray-300">
                  Discuss trading challenges and get objective advice to help maintain discipline during emotional market periods.
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
                  <SparklesIcon className="h-5 w-5 text-orange-400 mr-3" />
                  <span className="text-gray-300">10 messages per day</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-orange-400 mr-3" />
                  <span className="text-gray-300">Basic trading advice</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-orange-400 mr-3" />
                  <span className="text-gray-300">Standard response time</span>
                </div>
              </div>
              
              <div className="text-center">
                <Link href={user ? "/trading-insights" : "/login"} className="btn-secondary w-full py-3">
                  {user ? "Continue with Free" : "Sign Up Free"}
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-panel p-8 rounded-lg border-2 border-orange-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0">
                <div className="bg-orange-500 text-xs uppercase font-bold tracking-wider text-white py-1 px-4 transform rotate-45 translate-x-2 translate-y-3">
                  Popular
                </div>
              </div>
              
              <div className="text-center mb-6">
                <span className="text-orange-400 text-sm uppercase tracking-wide">Premium</span>
                <div className="flex items-center justify-center mt-2">
                  <h3 className="text-3xl font-bold">$20</h3>
                  <span className="text-gray-300 ml-2">lifetime access</span>
                </div>
                <p className="text-gray-400 mt-1">One-time payment</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-orange-400 mr-3" />
                  <span className="text-white font-medium">Unlimited messages</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-orange-400 mr-3" />
                  <span className="text-white font-medium">Advanced trading strategies</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-orange-400 mr-3" />
                  <span className="text-white font-medium">Priority response time</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-orange-400 mr-3" />
                  <span className="text-white font-medium">Detailed market explanations</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-orange-400 mr-3" />
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
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-orange-900/20"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Professional Trading Advice?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join traders who are enhancing their skills with AI-powered trading insights
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {user ? (
              <Link href="/trading-insights" className="btn-primary px-8 py-3 text-lg">
                Start Chatting Now
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