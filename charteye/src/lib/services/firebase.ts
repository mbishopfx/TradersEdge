import { 
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  setDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { ChartAnalysis, IndicatorCode, UserProfile, SharedAnalysis } from '@/types';

// Error handling wrapper for Firestore operations
const handleFirestoreOperation = async <T>(operation: () => Promise<T>, fallbackValue: T): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    console.error('Firestore operation error:', error);
    
    // Check for Firestore API not enabled error
    if (error.message?.includes('PERMISSION_DENIED') && error.message?.includes('Cloud Firestore API has not been used')) {
      console.warn('Firestore API not enabled. Please enable it in the Firebase console.');
      alert('Firebase Firestore API is not enabled. Please visit https://console.firebase.google.com/project/charteye-5be44/firestore to enable it.');
    }
    
    // Check for offline error
    if (error.code === 'unavailable' || error.message?.includes('offline')) {
      console.warn('Device is offline, using local fallback data if available');
    }
    
    return fallbackValue;
  }
};

// Chart Analysis
export async function uploadChartImage(file: File, userId: string): Promise<string> {
  console.log('Uploading chart image for user:', userId, 'filename:', file.name);
  
  let retryCount = 0;
  const maxRetries = 3;
  
  while (retryCount < maxRetries) {
    try {
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const storageRef = ref(storage, `charts/${userId}/${fileName}`);
      console.log('Storage path:', `charts/${userId}/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      console.log('Successfully uploaded file:', snapshot.metadata.name);
      
      const downloadUrl = await getDownloadURL(storageRef);
      console.log('Download URL generated:', downloadUrl.substring(0, 50) + '...');
      
      return downloadUrl;
    } catch (error: any) {
      retryCount++;
      console.error(`Error uploading image (attempt ${retryCount}/${maxRetries}):`, error);
      
      // If offline, create a temporary local URL
      if (error.code === 'unavailable' || error.message?.includes('offline')) {
        if (typeof window !== 'undefined') {
          const localUrl = URL.createObjectURL(file);
          console.warn('Using local blob URL for offline testing:', localUrl);
          return localUrl;
        }
      }
      
      // If permission denied and we still have retries left
      if ((error.code === 'storage/unauthorized' || error.code === 'permission-denied') 
          && retryCount < maxRetries) {
        console.log(`Permission denied for storage, waiting before retry ${retryCount}/${maxRetries}`);
        // Wait 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      
      // If on server or last retry, use placeholder URL as fallback
      if (retryCount >= maxRetries || typeof window === 'undefined') {
        console.warn('Falling back to placeholder image');
        return `https://placehold.co/800x600?text=Chart+Image+(${userId})`;
      }
    }
  }
  
  // Final fallback in case of exhausted retries
  return `https://placehold.co/800x600?text=Chart+Image+Fallback`;
}

export async function saveChartAnalysis(analysis: ChartAnalysis): Promise<string> {
  console.log('Saving chart analysis:', {
    userId: analysis.userId,
    imageUrl: analysis.imageUrl?.substring(0, 50) + '...',
    timestamp: analysis.createdAt
  });
  
  let retryCount = 0;
  const maxRetries = 3;
  
  while (retryCount < maxRetries) {
    try {
      const docRef = await addDoc(collection(db, 'chartAnalyses'), analysis);
      console.log('Successfully saved analysis with ID:', docRef.id);
      return docRef.id;
    } catch (error: any) {
      retryCount++;
      console.error(`Error saving analysis (attempt ${retryCount}/${maxRetries}):`, error);
      
      // If offline, create a temporary local ID
      if (error.code === 'unavailable' || error.message?.includes('offline')) {
        const tempId = `temp-${Date.now()}`;
        console.log('Device is offline, using temporary ID:', tempId);
        // Store locally if needed
        if (typeof window !== 'undefined') {
          localStorage.setItem(`chart-analysis-${tempId}`, JSON.stringify(analysis));
        }
        return tempId;
      }
      
      // If permission denied and we still have retries left
      if (error.code === 'permission-denied' && retryCount < maxRetries) {
        console.log(`Permission denied, waiting before retry ${retryCount}/${maxRetries}`);
        // Wait 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      
      // If last retry or different error, use development fallback
      if (retryCount >= maxRetries || error.code !== 'permission-denied') {
        console.log('Using development fallback for saveChartAnalysis');
        // For development, return a mock ID
        return `dev-${Date.now()}`;
      }
    }
  }
  
  // If we've exhausted retries, return a fallback ID
  return `fallback-${Date.now()}`;
}

export async function getChartAnalysis(id: string): Promise<ChartAnalysis | null> {
  // Check for local temporary data first
  if (id.startsWith('temp-') && typeof window !== 'undefined') {
    const localData = localStorage.getItem(`chart-analysis-${id}`);
    if (localData) {
      return JSON.parse(localData) as ChartAnalysis;
    }
  }
  
  return handleFirestoreOperation(async () => {
    const docRef = doc(db, 'chartAnalyses', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as ChartAnalysis) : null;
  }, null as ChartAnalysis | null);
}

export async function getUserChartAnalyses(userId: string): Promise<ChartAnalysis[]> {
  return handleFirestoreOperation(async () => {
    const q = query(
      collection(db, 'chartAnalyses'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChartAnalysis));
  }, [] as ChartAnalysis[]);
}

// Indicator Code
export async function saveIndicatorCode(code: IndicatorCode): Promise<string> {
  const docRef = await addDoc(collection(db, 'indicatorCodes'), code);
  return docRef.id;
}

export async function getIndicatorCode(id: string): Promise<IndicatorCode | null> {
  const docRef = doc(db, 'indicatorCodes', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as IndicatorCode) : null;
}

export async function getUserIndicatorCodes(userId: string): Promise<IndicatorCode[]> {
  const q = query(
    collection(db, 'indicatorCodes'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IndicatorCode));
}

// User Profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  return handleFirestoreOperation(async () => {
    const docRef = doc(db, 'userProfiles', userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      // Create a default profile if it doesn't exist
      const defaultProfile: UserProfile = {
        userId,
        displayName: 'User',
        email: '',
        accountStatus: 'Free',
        uploadCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Create the user profile document
      await setDoc(docRef, defaultProfile);
      return defaultProfile;
    }
    
    return docSnap.data() as UserProfile;
  }, null as UserProfile | null);
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
  await handleFirestoreOperation(async () => {
    const docRef = doc(db, 'userProfiles', userId);
    await updateDoc(docRef, data);
  }, undefined);
}

// Social Sharing
export async function saveSharedAnalysis(shared: SharedAnalysis): Promise<string> {
  const docRef = await addDoc(collection(db, 'sharedAnalyses'), shared);
  return docRef.id;
}

export async function getSharedAnalyses(analysisId: string): Promise<SharedAnalysis[]> {
  const q = query(
    collection(db, 'sharedAnalyses'),
    where('analysisId', '==', analysisId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SharedAnalysis));
}

// Get all public analysis IDs for static generation
export const getAllPublicAnalysisIds = async (): Promise<string[]> => {
  return handleFirestoreOperation(async () => {
    try {
      console.log('Fetching public analysis IDs for static generation...');
      
      // For static generation during build, we need to query Firestore directly
      const q = query(
        collection(db, 'chartAnalyses'),
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc'),
        limit(20) // Limit to avoid too many static pages
      );
      
      const querySnapshot = await getDocs(q);
      console.log(`Found ${querySnapshot.size} public analyses`);
      
      return querySnapshot.docs.map(doc => doc.id);
    } catch (error: any) {
      console.error('Error in getAllPublicAnalysisIds:', error);
      
      // If index error, provide detailed guidance
      if (error.code === 'failed-precondition' && error.message?.includes('index')) {
        console.warn(`
          This query requires a Firestore index. Please create it at:
          https://console.firebase.google.com/project/charteye-5be44/firestore/indexes
          
          The required index is for collection 'chartAnalyses' with fields:
          - isPublic (Ascending)
          - createdAt (Descending)
          
          Alternatively, you can deploy the updated firestore.indexes.json file using:
          firebase deploy --only firestore:indexes
        `);
      }
      
      // For static generation, provide at least some placeholder IDs
      return process.env.NODE_ENV === 'development' 
        ? ['placeholder1', 'placeholder2', 'placeholder3']
        : [];
    }
  }, [] as string[]); // Empty array as fallback
} 