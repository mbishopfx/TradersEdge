import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/lib/services/firebase';
import { UserProfile } from '@/types';

interface PremiumStatusResult {
  isPremium: boolean;
  isLoading: boolean;
  error: Error | null;
  uploadCount: number;
  profile: UserProfile | null;
  checkStatus: () => Promise<void>;
}

export function usePremiumStatus(): PremiumStatusResult {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [uploadCount, setUploadCount] = useState<number>(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const checkStatus = async () => {
    if (!user) {
      setIsLoading(false);
      setIsPremium(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userProfile = await getUserProfile(user.uid);
      
      if (userProfile) {
        setProfile(userProfile);
        setUploadCount(userProfile.uploadCount || 0);
        setIsPremium(userProfile.accountStatus === 'Premium');
      } else {
        // If no profile exists, user is not premium
        setIsPremium(false);
      }
    } catch (err) {
      console.error('Error checking premium status:', err);
      setError(err instanceof Error ? err : new Error('Failed to check premium status'));
      setIsPremium(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      checkStatus();
    } else {
      setIsLoading(false);
      setIsPremium(false);
    }
  }, [user]);

  return {
    isPremium,
    isLoading,
    error,
    uploadCount,
    profile,
    checkStatus
  };
} 