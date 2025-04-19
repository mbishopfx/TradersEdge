import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// Token usage tracking
const TOKEN_LIMIT = 1000; // Free tier limit
const TOKEN_COST_PER_ANALYSIS = 10; // Tokens per chart analysis

export const trackTokenUsage = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    await setDoc(userRef, {
      tokensUsed: 0,
      isPremium: false,
      createdAt: new Date().toISOString()
    });
    return { tokensUsed: 0, isPremium: false };
  }
  
  return userDoc.data();
};

export const incrementTokenUsage = async (userId) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    tokensUsed: increment(TOKEN_COST_PER_ANALYSIS)
  });
  
  const userData = await getDoc(userRef);
  return userData.data();
};

export const checkTokenLimit = async (userId) => {
  const userData = await trackTokenUsage(userId);
  return {
    canProceed: userData.isPremium || userData.tokensUsed < TOKEN_LIMIT,
    tokensUsed: userData.tokensUsed,
    tokensRemaining: TOKEN_LIMIT - userData.tokensUsed
  };
};

// Authentication
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Create or update user document
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLogin: new Date().toISOString()
    }, { merge: true });
    
    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Trading Chat Agent
export const getTradingChatResponse = async (message, userId) => {
  const tokenCheck = await checkTokenLimit(userId);
  if (!tokenCheck.canProceed) {
    throw new Error('Token limit reached. Please upgrade to premium to continue.');
  }
  
  const chatFunction = httpsCallable(functions, 'getTradingChatResponse');
  const response = await chatFunction({ message });
  
  await incrementTokenUsage(userId);
  return response.data;
};

export { auth, db, functions }; 