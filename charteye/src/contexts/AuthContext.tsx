'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  UserCredential,
  signInAnonymously
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import toast from 'react-hot-toast';

// Flag to determine if we should use the API server for auth
// This helps with static exports where Firebase client might not work
const USE_API_SERVER = true; // Always use API server in static export

// Check if we're on an authorized domain for Firebase Auth
// The error comes from the domain not being in Firebase Auth settings
let isAuthorizedDomain = false; // Assume unauthorized by default for safety
if (typeof window !== 'undefined') {
  // Only localhost is authorized for Firebase Auth popup
  if (window.location.hostname === 'localhost') {
    isAuthorizedDomain = true;
  }
}

// For debugging
const logDebug = (message: string, ...args: any[]) => {
  console.log(`[Auth] ${message}`, ...args);
};

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

// Create a consistent guest user to avoid navigation issues
const createGuestUser = (id?: string): MockUser => {
  const userId = id || 'guest-' + Math.random().toString(36).substring(2, 9);
  return {
    uid: userId,
    email: null,
    displayName: 'Guest User',
    isAnonymous: true,
    photoURL: null,
    _isMockUser: true
  };
};

// Standard guest user for consistency
const GUEST_USER = createGuestUser('standard-guest');

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // For API server auth, we'll store the token in localStorage
  const storeToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      logDebug('Token stored in localStorage');
    } else {
      localStorage.removeItem('authToken');
      setToken(null);
      logDebug('Token removed from localStorage');
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    logDebug('AuthProvider initialized, USE_API_SERVER =', USE_API_SERVER);
    logDebug('Domain authorization status:', isAuthorizedDomain ? 'Authorized' : 'Unauthorized');
    
    if (USE_API_SERVER) {
      // For API server auth, check localStorage for token
      const storedToken = localStorage.getItem('authToken');
      
      if (storedToken) {
        logDebug('Found stored token, validating with API server');
        
        // Validate the token with our API server
        fetch('/api/auth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken: storedToken }),
        })
        .then(response => {
          logDebug('Token validation response status:', response.status);
          
          if (response.status === 401) {
            // If unauthorized, remove the token and use guest user
            logDebug('Token rejected with 401 status, switching to guest user');
            localStorage.removeItem('authToken');
            setUser(GUEST_USER);
            setLoading(false);
            return null;
          }
          
          if (response.ok) return response.json();
          throw new Error(`Token validation failed with status: ${response.status}`);
        })
        .then(userData => {
          if (!userData) return; // Already handled 401 case
          
          if (!userData.success) {
            throw new Error('Authentication failed: ' + (userData.message || 'Invalid response'));
          }
          
          logDebug('Token validated successfully', userData);
          
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
          // Set guest user on error
          setUser(GUEST_USER);
        })
        .finally(() => {
          setLoading(false);
        });
      } else {
        logDebug('No stored token found, using guest user');
        setUser(GUEST_USER);
        setLoading(false);
      }
    } else {
      // Use Firebase auth directly
      logDebug('Using direct Firebase authentication');
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        logDebug('Firebase auth state changed', user ? 'User authenticated' : 'No user');
        if (user) {
          setUser(user);
        } else {
          // When not authenticated with Firebase, use guest user
          setUser(GUEST_USER);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, []);

  const signInWithGoogle = async () => {
    try {
      logDebug('Sign-in attempt started');
      setLoading(true);
      
      // For unauthorized domains, skip the popup and use API-only auth
      if (!isAuthorizedDomain) {
        logDebug('Unauthorized domain detected, using API-only auth');
        try {
          // Make a direct request to our API server for authentication
          const response = await fetch('/api/auth/anonymous', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (!response.ok) {
            throw new Error(`API server authentication failed with status ${response.status}`);
          }
          
          const userData = await response.json();
          
          if (!userData.success) {
            throw new Error(userData.message || 'Authentication failed');
          }
          
          logDebug('Anonymous auth successful', userData);
          
          // Create a mock user
          const mockUser: MockUser = {
            uid: userData.uid || 'anon-' + Math.random().toString(36).substring(2, 9),
            email: userData.email || null,
            displayName: userData.displayName || 'Guest User',
            isAnonymous: true,
            photoURL: null,
            _isMockUser: true
          };
          
          setUser(mockUser);
          // Store a mock token
          const mockToken = 'mockToken-' + Math.random().toString(36).substring(2, 15);
          storeToken(mockToken);
          
          toast.success('Signed in as a guest user');
          return;
        } catch (apiError: any) {
          console.error('API-only auth error:', apiError);
          toast.error('Could not sign in. Using guest mode.');
          
          // Fall back to completely local auth with stable guest
          setUser(GUEST_USER);
          return;
        }
      }
      
      // For authorized domains, try Firebase signin with popup
      try {
        logDebug('Attempting Firebase popup sign-in');
        const result = await signInWithPopup(auth, googleProvider);
        logDebug('Firebase popup sign-in successful');
        
        if (USE_API_SERVER) {
          // We got a Firebase user, now get an ID token
          try {
            logDebug('Getting ID token');
            const idToken = await result.user.getIdToken();
            logDebug('ID token acquired, length:', idToken.length);
            
            // Validate with our API server
            logDebug('Validating token with API server');
            const response = await fetch('/api/auth/token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ idToken }),
            });
            
            logDebug('API response status:', response.status);
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`API token validation failed: ${response.status} - ${errorText}`);
            }
            
            const userData = await response.json();
            logDebug('API validation successful', userData);
            
            if (!userData.success) {
              throw new Error('Authentication failed: ' + (userData.message || 'Server returned error'));
            }
            
            // Store the token for future use
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
          } catch (apiError: any) {
            console.error('API auth error:', apiError);
            toast.error(`Sign-in error: ${apiError.message || 'Failed to validate with server'}`);
            throw apiError;
          }
        } else {
          // Standard Firebase only
          toast.success('Successfully signed in!');
          return result;
        }
      } catch (firebaseError: any) {
        logDebug('Firebase sign-in error:', firebaseError);
        
        // If we hit the unauthorized domain error, fall back to anonymous auth
        if (firebaseError.code === 'auth/unauthorized-domain') {
          logDebug('Unauthorized domain error detected, falling back to anonymous auth');
          
          // Use the stable guest user
          setUser(GUEST_USER);
          // Use a fake token for the mock user
          storeToken('mock-token-' + Date.now());
          
          toast.success('Signed in as a guest user');
          return;
        }
        
        // Handle other Firebase errors
        if (firebaseError.code === 'auth/popup-closed-by-user') {
          toast.error('Sign-in cancelled. Please try again.');
        } else if (firebaseError.code === 'auth/popup-blocked') {
          toast.error('Pop-up was blocked. Please allow pop-ups for this site.');
        } else {
          toast.error(`Sign-in error: ${firebaseError.message || 'Unknown error'}`);
        }
        
        throw firebaseError;
      }
    } catch (error: any) {
      console.error('Overall sign-in error:', error);
      toast.error('Failed to sign in. Please try again.');
      
      // Always ensure we have a user, even after errors
      if (!user) {
        setUser(GUEST_USER);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      logDebug('Sign-out initiated');
      if (USE_API_SERVER) {
        // For API server, just clear the token
        storeToken(null);
        // Set to guest user instead of null
        setUser(GUEST_USER);
      } else {
        // Standard Firebase sign out
        await firebaseSignOut(auth);
        // Set to guest user after signout
        setUser(GUEST_USER);
      }
      logDebug('Sign-out completed');
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