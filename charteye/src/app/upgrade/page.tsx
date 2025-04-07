'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircleIcon, LockClosedIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getUserProfile } from '@/lib/services/firebase';
import { UserProfile } from '@/types';

export default function UpgradePage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already premium
    const checkUserStatus = async () => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
          
          if (profile?.accountStatus === 'Premium') {
            setIsSuccess(true);
          }
        } catch (error) {
          console.error('Error getting user profile:', error);
        }
      }
    };

    checkUserStatus();
  }, [user]);

  const handleUpgrade = async () => {
    if (!user) {
      toast.error('Please sign in to upgrade your account');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);
    setDebugInfo(null);
    
    try {
      // Get the user's ID token
      const token = await user.getIdToken();
      
      // Create a payment link with Square
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });
      
      // Get the raw response text
      const respText = await response.text();
      
      // Try to parse JSON, if it fails, show error with raw response
      let data;
      try {
        data = JSON.parse(respText);
      } catch (parseError) {
        setDebugInfo(`Response could not be parsed as JSON: ${respText.substring(0, 200)}...`);
        throw new Error('Invalid response from server. Response was not valid JSON.');
      }
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment link');
      }
      
      // Redirect to Square checkout
      if (data.paymentLink) {
        window.location.href = data.paymentLink;
      } else {
        throw new Error('No payment link received');
      }
    } catch (error: any) {
      toast.error('Payment processing failed. Please try again.');
      setPaymentError(error.message || 'An error occurred during payment setup');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTestUpgrade = async () => {
    if (!user) {
      toast.error('Please sign in to test upgrade');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);
    setDebugInfo(null);
    
    try {
      // Call the test upgrade API
      const response = await fetch('/api/payment/test-upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          userId: user.uid,
          testKey: 'test-upgrade-key-123'
        })
      });
      
      // Get raw response
      const respText = await response.text();
      
      try {
        const data = JSON.parse(respText);
        
        if (response.ok && data.success) {
          setIsSuccess(true);
          toast.success('Test upgrade successful! You now have premium access.');
        } else {
          throw new Error(data.error || 'Test upgrade failed');
        }
      } catch (parseError) {
        setDebugInfo(`Response could not be parsed as JSON: ${respText.substring(0, 200)}...`);
        throw new Error('Invalid response from server. Response was not valid JSON.');
      }
    } catch (error: any) {
      toast.error('Test upgrade failed. Please check console for details.');
      setPaymentError(error.message || 'An error occurred during test upgrade');
      console.error('Test upgrade error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Check URL parameters for payment status when component mounts
  useEffect(() => {
    const status = searchParams.get('status');
    const orderId = searchParams.get('order_id');
    const userId = searchParams.get('user_id');
    
    console.log('URL params:', { status, orderId, userId });
    
    if (status === 'success' && orderId && user) {
      toast.success('Payment received! Verifying...');
      
      // Verify the payment with our backend
      const verifyPayment = async () => {
        try {
          setIsProcessing(true);
          
          const token = await user.getIdToken();
          const response = await fetch('/api/payment', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, orderId })
          });
          
          // Get the raw response text
          const respText = await response.text();
          
          // Try to parse JSON, if it fails, show error with raw response
          let data;
          try {
            data = JSON.parse(respText);
          } catch (parseError) {
            setDebugInfo(`Verification response could not be parsed as JSON: ${respText.substring(0, 200)}...`);
            throw new Error('Invalid response from server. Response was not valid JSON.');
          }
          
          if (response.ok && data.success) {
            setIsSuccess(true);
            toast.success('Upgrade successful! You now have premium access.');
            
            // Remove the URL parameters after a short delay
            setTimeout(() => {
              router.replace('/upgrade');
            }, 1000);
          } else {
            throw new Error(data.error || 'Payment verification failed');
          }
        } catch (error: any) {
          toast.error('Payment verification failed. Please contact support.');
          setPaymentError(error.message);
          console.error('Payment verification error:', error);
        } finally {
          setIsProcessing(false);
        }
      };
      
      verifyPayment();
    }
  }, [user, searchParams, router]);

  // Show debug information in development mode
  const renderDebugInfo = () => {
    if (process.env.NODE_ENV !== 'production' && (paymentError || debugInfo)) {
      return (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg text-xs font-mono overflow-auto max-h-60">
          <h3 className="font-bold mb-2">Debug Information:</h3>
          {paymentError && <p className="text-red-400 mb-2">Error: {paymentError}</p>}
          {debugInfo && <p className="text-gray-300 whitespace-pre-wrap">{debugInfo}</p>}
        </div>
      );
    }
    return null;
  };

  // Render the test button in development mode
  const renderTestButton = () => {
    if (process.env.NODE_ENV !== 'production' && !isSuccess) {
      return (
        <div className="mt-6 p-4 bg-yellow-900/20 rounded-lg">
          <h3 className="text-yellow-400 font-bold mb-2">Development Testing</h3>
          <p className="text-sm mb-4">This button is only visible in development mode.</p>
          <button
            onClick={handleTestUpgrade}
            disabled={isProcessing}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded w-full"
          >
            Test Upgrade (Development Only)
          </button>
        </div>
      );
    }
    return null;
  };

  if (!user) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
        <p className="mb-6">Please sign in to upgrade your ChartEye account.</p>
        <Link href="/" className="btn-primary">
          Return to Home
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Premium Access Activated!</h1>
          <p className="mb-8">Thank you for upgrading to ChartEye Premium. You now have lifetime access to all premium features.</p>
          <Link href="/analysis" className="btn-primary">
            Start Using Premium Features
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Upgrade to ChartEye Premium</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Unlock unlimited access to all features with a one-time payment
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Premium Plan Details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel p-8 rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-6">Premium Benefits</h2>
          
          <ul className="space-y-4">
            {[
              'Unlimited AI chart analyses',
              'Unlimited pattern recognition',
              'Full portfolio analysis with detailed insights',
              'Complete economic news impact assessments',
              'Comprehensive trading journal analysis',
              'Advanced risk management calculations',
              'Unlimited indicator generation',
              'Priority response times',
              'All future feature updates included'
            ].map((benefit, index) => (
              <li key={index} className="flex items-start">
                <CheckCircleIcon className="h-6 w-6 text-blue-400 mr-2 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
          
          <div className="mt-8 p-4 bg-blue-900/20 rounded-lg">
            <p className="text-sm text-gray-300">
              ChartEye Premium is a one-time purchase. No recurring subscription fees or hidden costs.
            </p>
          </div>
        </motion.div>
        
        {/* Payment Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-panel p-8 rounded-lg"
        >
          <div className="text-center mb-6">
            <span className="text-blue-400 text-sm uppercase tracking-wide">Premium Lifetime Access</span>
            <div className="flex items-center justify-center mt-2">
              <h3 className="text-4xl font-bold">$20</h3>
              <span className="text-gray-300 ml-2">one-time payment</span>
            </div>
          </div>
          
          {paymentError && (
            <div className="mb-6 p-4 bg-red-900/20 rounded-lg text-red-400 text-sm">
              <p>Error: {paymentError}</p>
              <p className="mt-2">Please try again or contact support if the issue persists.</p>
            </div>
          )}
          
          <div className="space-y-6 mb-8">
            <div className="flex items-center p-4 bg-gray-800 bg-opacity-40 rounded-lg">
              <LockClosedIcon className="h-5 w-5 text-green-400 mr-3" />
              <span className="text-sm text-gray-300">Secure checkout with Square payment processing</span>
            </div>
          </div>
          
          <button
            onClick={handleUpgrade}
            disabled={isProcessing}
            className="btn-primary w-full py-3 text-lg"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-3"></div>
                Processing...
              </span>
            ) : (
              'Upgrade Now - $20'
            )}
          </button>
          
          <p className="text-center text-xs text-gray-400 mt-4">
            By clicking "Upgrade Now", you agree to our Terms of Service and Privacy Policy.
          </p>
          
          {renderDebugInfo()}
          {renderTestButton()}
        </motion.div>
      </div>
      
      <div className="mt-12 text-center text-sm text-gray-400">
        <p>Have questions about upgrading? <a href="mailto:support@charteye.com" className="text-blue-400 hover:underline">Contact our support team</a></p>
      </div>
    </div>
  );
} 