'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowPathIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-panel p-8 text-center max-w-md">
        <ChartBarIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-gray-300 mb-6">
          {error.message || 'Failed to load analysis. Please try again.'}
        </p>
        <button onClick={resetErrorBoundary} className="btn-primary">
          Try Again
        </button>
      </div>
    </div>
  );
}

function ViewSharedAnalysisClient({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch(`/api/analysis/${params.id}/public`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Analysis not found or has been removed');
          }
          throw new Error('Failed to load analysis');
        }
        
        const data = await response.json();
        setAnalysis(data);
      } catch (error) {
        console.error('Error fetching shared analysis:', error);
        setError((error as Error).message || 'Failed to load analysis');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="w-12 h-12 mx-auto text-blue-400 animate-spin" />
          <p className="mt-4 text-xl">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-panel p-8 text-center max-w-md">
          <ChartBarIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Analysis Not Found</h2>
          <p className="text-gray-300 mb-6">
            {error || 'This analysis may have been removed or is not publicly available.'}
          </p>
          <Link href="/" className="btn-primary">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            ChartEye Analysis
          </h1>
          <p className="text-gray-300 mt-2">
            AI-powered trading chart analysis
          </p>
        </div>

        <div className="glass-panel p-6">
          <div className="relative h-80 w-full mb-6">
            <Image
              src={analysis.imageUrl}
              alt="Trading Chart"
              fill
              style={{ objectFit: 'contain' }}
              className="rounded-lg"
            />
          </div>

          <h2 className="text-xl font-semibold mb-4">Technical Analysis</h2>
          <div className="prose prose-invert max-w-none">
            <p>{analysis.analysis}</p>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h2 className="text-xl font-semibold mb-4">Trade Grading</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-lg">Pattern Clarity</h3>
              <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${analysis.grading.patternClarity * 10}%` }}
                ></div>
              </div>
              <p className="text-right">{analysis.grading.patternClarity.toFixed(1)}/10</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg">Trend Alignment</h3>
              <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500"
                  style={{ width: `${analysis.grading.trendAlignment * 10}%` }}
                ></div>
              </div>
              <p className="text-right">{analysis.grading.trendAlignment.toFixed(1)}/10</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg">Risk/Reward</h3>
              <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${analysis.grading.riskReward * 10}%` }}
                ></div>
              </div>
              <p className="text-right">{analysis.grading.riskReward.toFixed(1)}/10</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg">Volume Confirmation</h3>
              <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500"
                  style={{ width: `${analysis.grading.volumeConfirmation * 10}%` }}
                ></div>
              </div>
              <p className="text-right">{analysis.grading.volumeConfirmation.toFixed(1)}/10</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg">Key Level Proximity</h3>
              <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500"
                  style={{ width: `${analysis.grading.keyLevelProximity * 10}%` }}
                ></div>
              </div>
              <p className="text-right">{analysis.grading.keyLevelProximity.toFixed(1)}/10</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <h3 className="text-xl mb-2">Overall Grade</h3>
            <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              {analysis.grading.overallGrade.toFixed(1)}/10
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="btn-primary">
            Create Your Own Analysis
          </Link>
        </div>

        <div className="text-sm text-gray-400 mt-8 p-4 border border-gray-800 rounded-lg">
          <p>
            <strong>Disclaimer:</strong> AI-generated analysis is for informational and educational purposes only.
            It does NOT constitute financial or investment advice. Trading involves substantial risk of loss.
            Users are solely responsible for their own trading decisions. Past performance is not indicative of future results.
          </p>
        </div>
      </div>
    </ErrorBoundary>
  );
}

// Server Component Wrapper
export default function ViewSharedAnalysis({ params }: { params: { id: string } }) {
  return <ViewSharedAnalysisClient params={params} />;
}

// This function is required for static site generation with dynamic routes
export async function generateStaticParams() {
  // Since we don't know all possible IDs at build time,
  // we'll return an empty array and handle missing routes at runtime
  // or we could fetch some popular/featured analyses to pre-generate
  return [];
} 