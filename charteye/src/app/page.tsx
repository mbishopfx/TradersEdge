'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ChartBarIcon, 
  CodeBracketIcon, 
  DocumentChartBarIcon,
  NewspaperIcon,
  BookOpenIcon,
  ScaleIcon, 
  ShieldExclamationIcon,
  LightBulbIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export default function Home() {
  const { user } = useAuth();
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Handle mounting state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Floating animation for background elements
  const floatingAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  // Staggered text animation
  const textAnimation = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const features = [
    {
      id: 'analysis',
      name: 'AI Chart Analysis',
      description: 'Upload your charts and get detailed technical analysis with objective grading',
      icon: ChartBarIcon,
      color: 'text-blue-400',
      href: '/landing/analysis'
    },
    {
      id: 'patterns',
      name: 'Pattern Recognition',
      description: 'Identify chart patterns and key price levels with AI-powered recognition',
      icon: DocumentChartBarIcon,
      color: 'text-indigo-400',
      href: '/landing/pattern-recognition'
    },
    {
      id: 'portfolio',
      name: 'Portfolio Analysis',
      description: 'Get insights on your portfolio diversity, risk exposure, and optimization',
      icon: ScaleIcon,
      color: 'text-purple-400',
      href: '/landing/portfolio-analysis'
    },
    {
      id: 'news',
      name: 'Economic News',
      description: 'Analyze how economic news will impact markets, sectors and trading opportunities',
      icon: NewspaperIcon,
      color: 'text-green-400',
      href: '/landing/economic-news'
    },
    {
      id: 'journal',
      name: 'Trading Journal',
      description: 'Log your trades and receive AI-powered insights to improve performance',
      icon: BookOpenIcon,
      color: 'text-yellow-400',
      href: '/landing/trading-journal'
    },
    {
      id: 'risk',
      name: 'Risk Analysis',
      description: 'Calculate optimal position size and analyze risk/reward for trade setups',
      icon: ShieldExclamationIcon,
      color: 'text-red-400',
      href: '/landing/risk-analysis'
    },
    {
      id: 'indicators',
      name: 'Indicator Generation',
      description: 'Generate custom trading indicators in MQL4, MQL5, and Pine Script',
      icon: CodeBracketIcon,
      color: 'text-cyan-400',
      href: '/landing/indicators'
    },
    {
      id: 'insights',
      name: 'Trading Insights',
      description: 'Chat with AI about market strategies, technical questions and trading advice',
      icon: LightBulbIcon,
      color: 'text-orange-400',
      href: '/landing/trading-insights'
    }
  ];

  // Don't render anything until after client-side hydration
  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
          
          {/* Animated background elements */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              y: [0, 15, 0]
            }}
            transition={{ 
              opacity: { duration: 1 },
              y: {
                duration: 6, 
                repeat: Infinity,
                ease: "easeInOut" 
              }
            }}
            className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              y: [0, -20, 0]
            }}
            transition={{ 
              opacity: { duration: 1 },
              y: {
                duration: 7, 
                repeat: Infinity,
                ease: "easeInOut" 
              }
            }}
            className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              y: [0, 10, 0]
            }}
            transition={{ 
              opacity: { duration: 1 },
              y: {
                duration: 5, 
                repeat: Infinity,
                ease: "easeInOut" 
              }
            }}
            className="absolute top-2/3 left-1/3 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"
          />
        </div>
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6 max-w-4xl mx-auto px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block relative"
            >
              <motion.span
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              />
              <motion.h1 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.8,
                  ease: "easeOut"
                }}
                className="text-5xl md:text-6xl font-bold animated-gradient"
              >
                TraderTools
              </motion.h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
            >
              AI-powered chart analysis, risk management, and trading insights for modern traders
            </motion.p>

            {/* Animated underline */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "150px" }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"
            />

            {/* Floating badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap justify-center gap-2 mt-4"
            >
              {["AI Analysis", "Risk Management", "Pattern Recognition", "Trading Insights"].map((badge, index) => (
                <motion.span 
                  key={badge}
                  custom={index}
                  variants={textAnimation}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -5 }}
                  className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-gray-200"
                >
                  {badge}
                </motion.span>
              ))}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              {user ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/analysis" className="btn-primary px-8 py-3 text-lg">
                    Start Analyzing
                  </Link>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="#pricing" className="btn-primary px-8 py-3 text-lg">
                    Get Started
                  </Link>
                </motion.div>
              )}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="#features" className="btn-secondary px-8 py-3 text-lg">
                  Explore Features
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Traders</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive AI tools to enhance your trading decisions and improve performance
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              variants={item}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative glass-panel p-6 rounded-lg transition-all duration-300 overflow-hidden group"
              onMouseEnter={() => setIsHovering(feature.id)}
              onMouseLeave={() => setIsHovering(null)}
            >
              <Link href={feature.href} className="absolute inset-0 z-10" aria-label={feature.name}></Link>
              
              <div className="relative z-0">
                <motion.div
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{feature.name}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: isHovering === feature.id ? 0.2 : 0,
                  scale: isHovering === feature.id ? 1 : 0
                }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-lg"
              />
              
              <motion.div 
                className="absolute bottom-4 right-4"
                initial={{ opacity: 0, x: 10 }}
                animate={{ 
                  opacity: isHovering === feature.id ? 1 : 0,
                  x: isHovering === feature.id ? 0 : 10
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-sm text-white font-medium px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-sm">
                  Explore →
                </span>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How it Works */}
      <section className="bg-gray-900/50 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How TraderTools Works</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Powerful AI analysis at your fingertips in three simple steps
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Upload",
                description: "Upload your chart images or input your trading data into our secure platform",
                icon: "1",
                delay: 0.1
              },
              {
                title: "Analyze",
                description: "Our advanced AI models analyze your data using deep learning technology",
                icon: "2",
                delay: 0.2
              },
              {
                title: "Optimize",
                description: "Receive actionable insights to enhance your trading strategy and performance",
                icon: "3", 
                delay: 0.3
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: step.delay }}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Start with free analysis credits and upgrade for unlimited access
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-panel p-8 rounded-lg border border-gray-700"
          >
            <div className="text-center mb-6">
              <span className="text-gray-300 text-sm uppercase tracking-wide">Free Plan</span>
              <h3 className="text-3xl font-bold mt-2">$0</h3>
              <p className="text-gray-400 mt-1">No credit card required</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <SparklesIcon className="h-5 w-5 text-blue-400 mr-3" />
                <span className="text-gray-300">5 free analysis credits per month</span>
              </div>
              <div className="flex items-center">
                <SparklesIcon className="h-5 w-5 text-blue-400 mr-3" />
                <span className="text-gray-300">Access to all features</span>
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
              <Link href={user ? "/analysis" : "#"} className="btn-secondary w-full py-3">
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
                <span className="text-white font-medium">Unlimited analysis and insights</span>
              </div>
              <div className="flex items-center">
                <SparklesIcon className="h-5 w-5 text-blue-400 mr-3" />
                <span className="text-white font-medium">Priority response times</span>
              </div>
              <div className="flex items-center">
                <SparklesIcon className="h-5 w-5 text-blue-400 mr-3" />
                <span className="text-white font-medium">Advanced chart pattern recognition</span>
              </div>
              <div className="flex items-center">
                <SparklesIcon className="h-5 w-5 text-blue-400 mr-3" />
                <span className="text-white font-medium">Detailed portfolio and risk analysis</span>
              </div>
              <div className="flex items-center">
                <SparklesIcon className="h-5 w-5 text-blue-400 mr-3" />
                <span className="text-white font-medium">Unlimited trading journal insights</span>
              </div>
              <div className="flex items-center">
                <SparklesIcon className="h-5 w-5 text-blue-400 mr-3" />
                <span className="text-white font-medium">Lifetime updates and new features</span>
              </div>
            </div>
            
            <div className="text-center">
              <Link href={user ? "/upgrade" : "#"} className="btn-primary w-full py-3">
                {user ? "Upgrade Now" : "Get Premium"}
              </Link>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-8 text-gray-400 text-sm"
        >
          <p>All plans include our standard security features and regular platform updates.</p>
          <p className="mt-2">Need custom enterprise solutions? <a href="mailto:contact@tradertools.com" className="text-blue-400 hover:underline">Contact us</a></p>
        </motion.div>
      </section>

      {/* Testimonials/CTA Section */}
      <section className="relative bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-indigo-900/30 py-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Trading?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of traders using TraderTools to gain an edge in the markets
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
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
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
              Learn more about features
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="text-sm text-gray-400 p-6 border border-gray-800 rounded-lg">
          <h3 className="font-medium mb-2">Disclaimer:</h3>
          <p>
            TraderTools provides AI-generated analysis for informational and educational purposes only.
            It does NOT constitute financial or investment advice. Trading involves substantial risk of loss.
            Users are solely responsible for their own trading decisions. Past performance is not indicative of future results.
          </p>
        </div>
      </section>
    </div>
  );
}
