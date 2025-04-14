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

export default function UpgradeContent() {
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
      // Get the user's ID token
      const token = await user.getIdToken();
      
      // Create a test payment link
      const response = await fetch('/api/payment/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create test payment link');
      }
      
      // Redirect to Square checkout
      if (data.paymentLink) {
        window.location.href = data.paymentLink;
      } else {
        throw new Error('No payment link received');
      }
    } catch (error: any) {
      toast.error('Test payment processing failed. Please try again.');
      setPaymentError(error.message || 'An error occurred during test payment setup');
      console.error('Test payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderDebugInfo = () => {
    if (!debugInfo) return null;
    
    return (
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900">Debug Information</h3>
        <pre className="mt-2 text-xs text-gray-500 whitespace-pre-wrap">{debugInfo}</pre>
      </div>
    );
  };

  const renderTestButton = () => {
    if (process.env.NODE_ENV !== 'development') return null;
    
    return (
      <button
        onClick={handleTestUpgrade}
        disabled={isProcessing}
        className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : 'Test Upgrade (Dev Only)'}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Upgrade to Premium
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Get access to advanced features and unlimited usage
          </p>
        </div>

        {isSuccess ? (
          <div className="mt-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-center">
                <CheckCircleIcon className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
                You are already a Premium member!
              </h3>
              <p className="mt-2 text-sm text-gray-500 text-center">
                Thank you for your support. You have full access to all premium features.
              </p>
              <div className="mt-6 text-center">
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Unlimited Usage</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      No more daily limits on analysis and indicators
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Advanced Features</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Access to premium indicators and advanced analysis tools
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Priority Support</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get faster responses to your questions and issues
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={handleUpgrade}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Upgrade Now'}
                </button>
                {renderTestButton()}
              </div>

              {paymentError && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-700">{paymentError}</p>
                </div>
              )}
              {renderDebugInfo()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 