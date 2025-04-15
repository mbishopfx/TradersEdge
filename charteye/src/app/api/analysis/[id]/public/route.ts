import { NextResponse } from 'next/server';
import { getChartAnalysis, getAllPublicAnalysisIds } from '@/lib/services/firebase';

// Enable developer mode if needed
const DEVELOPER_MODE = process.env.NODE_ENV !== 'production';

// For static export, we need to handle this differently
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

// Generate static params for the [id] route
export async function generateStaticParams() {
  try {
    // Try to get all public analysis IDs from Firestore
    if (typeof getAllPublicAnalysisIds === 'function') {
      const ids = await getAllPublicAnalysisIds();
      return ids.map(id => ({ id }));
    }
  } catch (error) {
    console.error('Error getting public analysis IDs:', error);
  }
  
  // Fallback to placeholder 
  return [{ id: 'placeholder' }];
}

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing analysis ID' },
        { status: 400 }
      );
    }
    
    // Fetch the analysis from Firestore
    try {
      const analysis = await getChartAnalysis(id);
      
      if (!analysis) {
        return NextResponse.json(
          { error: 'Analysis not found' },
          { status: 404 }
        );
      }
      
      // Remove sensitive information like userId before returning
      const { userId, ...publicAnalysis } = analysis;
      
      return NextResponse.json(publicAnalysis);
    } catch (firestoreError) {
      console.error('Error fetching analysis from Firestore:', firestoreError);
      
      if (DEVELOPER_MODE) {
        // In development mode, return a generic mock analysis if Firestore fails
        return NextResponse.json({
          id: id,
          imageUrl: 'https://placehold.co/800x600?text=Chart+Example',
          analysis: 'This is a fallback chart analysis used when the database connection fails. In production, this would show the actual analysis stored in Firestore.',
          grading: {
            patternClarity: 7.5,
            trendAlignment: 7.5,
            riskReward: 7.5,
            volumeConfirmation: 7.5,
            keyLevelProximity: 7.5,
            overallGrade: 7.5
          },
          createdAt: new Date().toISOString(),
          _devMode: true,
          _error: 'Failed to fetch from Firestore'
        });
      }
      
      throw firestoreError; // Re-throw in production mode
    }
  } catch (error) {
    console.error('Error fetching public analysis:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 