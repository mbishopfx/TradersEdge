import { NextResponse } from 'next/server';
import { getUserChartAnalyses } from '@/lib/services/firebase';
import { getAuth } from 'firebase-admin/auth';
import * as admin from 'firebase-admin';

// Required for static export
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate once per hour

// Initialize Firebase Admin for this API route if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      projectId: 'charteye-5be44',
      storageBucket: 'charteye-5be44.firebasestorage.app',
      databaseURL: 'https://charteye-5be44-default-rtdb.firebaseio.com'
    });
    console.log('Firebase Admin initialized in user analyses API route');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
  }
}

// We need to create a generateStaticParams function for static export
export async function generateStaticParams() {
  // Just return an empty params object since this is a static API
  return [{}];
}

// Return fallback data for static rendering
export async function GET() {
  try {
    // For static export, we can't use request.headers
    // Instead, we'll return sample data that the client-side can use
    // The actual authentication will happen on the client or API server
    
    // Sample user ID for static generation
    const userId = 'static-user';
    
    // Return mock analyses for static export
    return NextResponse.json({
      analyses: [
        {
          id: 'static-1',
          title: 'Market Analysis Example',
          imageUrl: 'https://placehold.co/800x600?text=Analysis+Example',
          createdAt: new Date().toISOString(),
          isPublic: true,
          indicators: ['Moving Averages', 'RSI', 'MACD'],
          summary: 'Example analysis for static generation'
        },
        {
          id: 'static-2',
          title: 'Technical Pattern Example',
          imageUrl: 'https://placehold.co/800x600?text=Pattern+Example',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          isPublic: true,
          indicators: ['Support/Resistance', 'Volume Profile'],
          summary: 'Example pattern analysis for static generation'
        }
      ],
      staticGeneration: true,
      note: 'This is static data. Real user data will be loaded from the API server.'
    });
  } catch (error) {
    console.error('Error generating static user analyses:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate static analyses',
        analyses: []
      },
      { status: 500 }
    );
  }
} 