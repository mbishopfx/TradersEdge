import { getAllPublicAnalysisIds } from '@/lib/services/firebase';
import ViewSharedAnalysis from './page';

// Configure for static export
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

// This is required for static export with dynamic routes
export async function generateStaticParams() {
  try {
    // Get all public analysis IDs from Firestore
    const ids = await getAllPublicAnalysisIds();
    
    // Return an array of objects with the id parameter
    return ids.map((id: string) => ({
      id: id.toString()
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return a minimal set of IDs for fallback
    return [
      { id: 'fallback-1' },
      { id: 'fallback-2' }
    ];
  }
}

// Metadata for the page
export const metadata = {
  title: 'View Chart Analysis | ChartEye',
  description: 'View AI-powered trading chart analysis',
};

export default function Page({ params }: { params: { id: string } }) {
  return <ViewSharedAnalysis params={params} />;
} 