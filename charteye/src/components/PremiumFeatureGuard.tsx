'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useAuth } from '@/contexts/AuthContext';

interface PremiumFeatureGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  allowFreeTrialUploads?: boolean;
}

const DEFAULT_FREE_TRIAL_LIMIT = 10;

export default function PremiumFeatureGuard({
  children,
  fallback,
  allowFreeTrialUploads = false
}: PremiumFeatureGuardProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { isPremium, isLoading, uploadCount } = usePremiumStatus();

  const isWithinFreeTrialLimit = allowFreeTrialUploads && uploadCount < DEFAULT_FREE_TRIAL_LIMIT;
  
  // While loading, show nothing
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to homepage
  if (!user) {
    useEffect(() => {
      router.push('/');
    }, [router]);
    
    return null;
  }

  // If user has premium access or is within free trial limit, show the feature
  if (isPremium || isWithinFreeTrialLimit) {
    return <>{children}</>;
  }

  // If fallback is provided, show that instead of redirecting
  if (fallback) {
    return <>{fallback}</>;
  }

  // Otherwise, redirect to upgrade page
  useEffect(() => {
    router.push('/upgrade');
  }, [router]);
  
  return null;
} 