import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Use fallback values if environment variables are not available
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBV1JmWmbq9Zz78aU3PyBu2ERgvQNKDJiU",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "charteye-5be44.firebaseapp.com",
  databaseURL: "https://charteye-5be44-default-rtdb.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "charteye-5be44",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "charteye-5be44.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1088594164829",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1088594164829:web:c159dd2c36161e532fe1b4",
  measurementId: "G-JNFPR6PQT6"
};

// Check if Firebase config has valid values
const hasValidConfig = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "undefined" && 
  firebaseConfig.projectId && 
  firebaseConfig.projectId !== "undefined";

// Output warning if the configuration might be invalid
if (!hasValidConfig) {
  console.warn("Firebase config may be invalid:", 
    JSON.stringify({...firebaseConfig, apiKey: firebaseConfig.apiKey ? "[HIDDEN]" : undefined}));
}

console.log("Initializing Firebase with project:", firebaseConfig.projectId);

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Enable offline persistence when in browser
if (typeof window !== 'undefined') {
  // Enable offline data persistence
  enableIndexedDbPersistence(db)
    .catch((err) => {
      console.error('Error enabling offline persistence:', err);
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time
        console.warn('Persistence failed: Multiple tabs open');
      } else if (err.code === 'unimplemented') {
        // The current browser does not support persistence
        console.warn('Persistence not supported by browser');
      }
    });
}

// Initialize Analytics only in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Configure Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Export initialized services
export { app, auth, db, storage, analytics, googleProvider }; 