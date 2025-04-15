'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  UserCredential
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import toast from 'react-hot-toast';

// Flag to determine if we should use the API server for auth
// This helps with static exports where Firebase client might not work
const USE_API_SERVER = process.env.NEXT_PUBLIC_USE_API_SERVER === 'true' || 
                      typeof window !== 'undefined' && window.location.hostname !== 'localhost';

// Mock user structure to match Firebase User interface
interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAnonymous: boolean;
  photoURL: string | null;
  _isMockUser?: boolean;
}

interface AuthContextType {
  user: User | MockUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<UserCredential | void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // For API server auth, we'll store the token in localStorage
  const storeToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
    } else {
      localStorage.removeItem('authToken');
      setToken(null);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    if (USE_API_SERVER) {
      // For API server auth, check localStorage for token
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        // Validate the token with our API server
        fetch('/api/auth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken: storedToken }),
        })
        .then(response => {
          if (response.ok) return response.json();
          throw new Error('Token validation failed');
        })
        .then(userData => {
          // Create a mock user that matches the Firebase User interface
          const mockUser: MockUser = {
            uid: userData.uid,
            email: userData.email || null,
            displayName: userData.displayName || null,
            isAnonymous: false,
            photoURL: null,
            _isMockUser: true
          };
          setUser(mockUser);
          setToken(storedToken);
        })
        .catch(error => {
          console.error('Error validating token:', error);
          localStorage.removeItem('authToken');
        })
        .finally(() => {
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    } else {
      // Use Firebase auth directly
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      if (USE_API_SERVER) {
        try {
          // First get an ID token from Firebase
          const result = await signInWithPopup(auth, googleProvider);
          const idToken = await result.user.getIdToken();
          
          // Then validate it with our API server
          const response = await fetch('/api/auth/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }),
          });
          
          if (!response.ok) throw new Error('API token validation failed');
          
          const userData = await response.json();
          storeToken(idToken);
          
          // Create a mock user
          const mockUser: MockUser = {
            uid: userData.uid,
            email: userData.email || null,
            displayName: userData.displayName || null,
            isAnonymous: false,
            photoURL: null,
            _isMockUser: true
          };
          setUser(mockUser);
          
          toast.success('Successfully signed in!');
          return result;
        } catch (error: any) {
          console.error('API auth error:', error);
          toast.error('Sign-in failed. Please try again.');
          throw error;
        }
      } else {
        // Standard Firebase authentication
        const result = await signInWithPopup(auth, googleProvider);
        toast.success('Successfully signed in!');
        return result;
      }
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      
      // Show user-friendly error message
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Pop-up was blocked. Please allow pop-ups for this site.');
      } else {
        toast.error('Failed to sign in. Please try again.');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      if (USE_API_SERVER) {
        // For API server, just clear the token
        storeToken(null);
        setUser(null);
      } else {
        // Standard Firebase sign out
        await firebaseSignOut(auth);
      }
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out. Please try again.');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 