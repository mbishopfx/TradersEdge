import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import * as path from 'path';
import * as fs from 'fs';

// Check if Firebase Admin has already been initialized
const apps = admin.apps.length ? admin.apps : [];

if (!apps.length) {
  try {
    // Try to load service account from file in the project directory
    const serviceAccountPath = path.join(process.cwd(), 'charteye-5be44-firebase-adminsdk-fbsvc-df22fdb29f.json');
    
    if (fs.existsSync(serviceAccountPath)) {
      // Use the service account file if it exists
      console.log('Using Firebase service account file at:', serviceAccountPath);
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'charteye-5be44.appspot.com'
      });
      
      console.log('Firebase Admin initialized successfully with service account file');
    } else {
      console.warn('Service account file not found at:', serviceAccountPath);
      throw new Error('Service account file not found');
    }
  } catch (error) {
    console.error('Error initializing Firebase Admin with service account:', error);
    
    try {
      // Fall back to environment variables
      console.log('Falling back to environment variables for Firebase Admin');
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY 
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
        : undefined;
        
      if (!projectId || !clientEmail || !privateKey) {
        throw new Error('Firebase Admin environment variables are not set properly');
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey
        }),
        storageBucket: `${projectId}.appspot.com`
      });
      
      console.log('Firebase Admin initialized successfully with env variables');
    } catch (fallbackError) {
      console.error('Failed to initialize with environment variables:', fallbackError);
    }
  }
}

// Export the admin services
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

export { auth, db, storage }; 