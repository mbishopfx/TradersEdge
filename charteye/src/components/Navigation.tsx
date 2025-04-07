'use client';

import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  ChartBarIcon, 
  CodeBracketIcon, 
  LightBulbIcon, 
  UserCircleIcon,
  DocumentChartBarIcon,
  NewspaperIcon,
  BookOpenIcon,
  ScaleIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Navigation() {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="glass-panel p-4 mb-8">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          ChartEye
        </Link>

        <div className="flex items-center space-x-6">
          <Link href="/analysis" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <ChartBarIcon className="w-5 h-5" />
            <span>Analysis</span>
          </Link>
          <Link href="/pattern-recognition" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <DocumentChartBarIcon className="w-5 h-5" />
            <span>Patterns</span>
          </Link>
          <Link href="/portfolio-analysis" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <ScaleIcon className="w-5 h-5" />
            <span>Portfolio</span>
          </Link>
          <Link href="/economic-news" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <NewspaperIcon className="w-5 h-5" />
            <span>News</span>
          </Link>
          <Link href="/live-news" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <NewspaperIcon className="w-5 h-5 text-green-400" />
            <span className="text-green-400">Live</span>
          </Link>
          <Link href="/trading-journal" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <BookOpenIcon className="w-5 h-5" />
            <span>Journal</span>
          </Link>
          <Link href="/risk-analysis" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <ShieldExclamationIcon className="w-5 h-5" />
            <span>Risk</span>
          </Link>
          <Link href="/indicators" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <CodeBracketIcon className="w-5 h-5" />
            <span>Indicators</span>
          </Link>
          <Link href="/trading-insights" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <LightBulbIcon className="w-5 h-5" />
            <span>Insights</span>
          </Link>
          
          {authLoading ? (
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-blue-500 animate-spin"></div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
                ) : (
                  <UserCircleIcon className="w-8 h-8 text-gray-400" />
                )}
                <span className="text-gray-300">{user.displayName || user.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="btn-secondary text-sm"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="btn-primary"
            >
              {isSigningIn ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  Signing In...
                </span>
              ) : 'Sign In'}
            </motion.button>
          )}
        </div>
      </div>
    </nav>
  );
} 