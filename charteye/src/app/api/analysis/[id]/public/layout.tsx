import React from 'react';
import { getAllPublicAnalysisIds } from '@/lib/services/firebase';

// This ensures the route layout is treated as a server component
export default function AnalysisPublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

// Generate static params for the [id] route
export async function generateStaticParams() {
  try {
    // Try to get real public analysis IDs from Firestore
    const ids = await getAllPublicAnalysisIds();
    
    // If we got real IDs, use them
    if (ids && ids.length > 0) {
      console.log(`Found ${ids.length} public analysis IDs for static generation`);
      return ids.map(id => ({ id }));
    }
  } catch (error) {
    console.error('Error getting public analysis IDs for static generation:', error);
  }
  
  // Fallback to placeholder IDs if Firestore query fails
  console.log('Using placeholder IDs for static generation');
  return [
    { id: 'placeholder' },
    { id: 'static-placeholder-1' },
    { id: 'static-placeholder-2' }
  ];
} 