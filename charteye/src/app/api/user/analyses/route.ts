import { NextResponse } from 'next/server';
import { getUserChartAnalyses } from '@/lib/services/firebase';
import { getAuth } from 'firebase-admin/auth';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin for this API route if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'charteye-5be44',
    storageBucket: 'charteye-5be44.appspot.com',
    databaseURL: 'https://charteye-5be44-default-rtdb.firebaseio.com'
  });
  console.log('Firebase Admin initialized in user analyses API route');
}

// Enable developer mode if needed (when authentication isn't working)
const DEVELOPER_MODE = process.env.NODE_ENV !== 'production';

export async function GET(request: Request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    let userId = 'dev-user-123';
    let isAuthenticated = false;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        // Verify the Firebase ID token
        const token = authHeader.substring(7);
        const decodedToken = await getAuth().verifyIdToken(token);
        userId = decodedToken.uid;
        isAuthenticated = true;
      } catch (authError) {
        console.error('Authentication error:', authError);
        // In developer mode, we'll continue with the default userId
        if (!DEVELOPER_MODE) {
          return NextResponse.json(
            { error: 'Invalid authentication token' },
            { status: 401 }
          );
        }
      }
    } else if (!DEVELOPER_MODE) {
      // In production, require authentication
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    try {
      // Get all analyses for the user from Firestore
      const analyses = await getUserChartAnalyses(userId);
      return NextResponse.json({ analyses });
    } catch (firestoreError) {
      console.error('Firestore error:', firestoreError);
      
      if (DEVELOPER_MODE) {
        // In development mode, return empty list if Firestore fails
        return NextResponse.json({ 
          analyses: [],
          _devMode: true,
          _error: 'Failed to fetch analyses from Firestore'
        });
      }
      
      throw firestoreError; // Re-throw in production mode
    }
  } catch (error) {
    console.error('Error fetching user analyses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 