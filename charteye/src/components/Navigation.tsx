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
  ShieldExclamationIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Navigation() {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { href: "/analysis", icon: ChartBarIcon, label: "Analysis", color: "text-gray-300" },
    { href: "/pattern-recognition", icon: DocumentChartBarIcon, label: "Patterns", color: "text-gray-300" },
    { href: "/portfolio-analysis", icon: ScaleIcon, label: "Portfolio", color: "text-gray-300" },
    { href: "/economic-news", icon: NewspaperIcon, label: "News", color: "text-gray-300" },
    { href: "/live-news", icon: NewspaperIcon, label: "Live", color: "text-green-400" },
    { href: "/trading-journal", icon: BookOpenIcon, label: "Journal", color: "text-gray-300" },
    { href: "/risk-analysis", icon: ShieldExclamationIcon, label: "Risk", color: "text-gray-300" },
    { href: "/indicators", icon: CodeBracketIcon, label: "Indicators", color: "text-gray-300" },
    { href: "/trading-insights", icon: LightBulbIcon, label: "Insights", color: "text-gray-300" },
  ];

  return (
    <nav className="glass-panel p-4 mb-8">
      <div className="container mx-auto">
        {/* Desktop and Mobile Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold animated-gradient">
            TraderTools
          </Link>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link, index) => (
              <Link 
                key={index} 
                href={link.href} 
                className={`flex items-center space-x-2 ${link.color} hover:text-white`}
              >
                <link.icon className={`w-5 h-5 ${link.label === "Live" ? "text-green-400" : ""}`} />
                <span className={link.label === "Live" ? "text-green-400" : ""}>{link.label}</span>
              </Link>
            ))}
            
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

        {/* Mobile menu, show/hide based on menu state */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden mt-4 pt-4 border-t border-gray-700"
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link, index) => (
                <Link 
                  key={index} 
                  href={link.href} 
                  className={`flex items-center space-x-2 ${link.color} hover:text-white py-2`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon className={`w-5 h-5 ${link.label === "Live" ? "text-green-400" : ""}`} />
                  <span className={link.label === "Live" ? "text-green-400" : ""}>{link.label}</span>
                </Link>
              ))}
              
              {!authLoading && (
                <div className="pt-4 border-t border-gray-700">
                  {user ? (
                    <div className="flex flex-col space-y-3">
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
                        className="btn-secondary text-sm w-full"
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
                      className="btn-primary w-full"
                    >
                      {isSigningIn ? (
                        <span className="flex items-center justify-center">
                          <div className="w-4 h-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                          Signing In...
                        </span>
                      ) : 'Sign In'}
                    </motion.button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
} 