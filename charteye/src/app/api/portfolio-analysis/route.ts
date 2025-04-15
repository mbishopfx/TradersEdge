import { NextResponse } from 'next/server';
import { analyzePortfolio } from '@/lib/services/openai';

// Required for static export
export const dynamic = 'force-static';

export async function POST(request: Request) {
  try {
    const { holdings } = await request.json();
    
    if (!holdings || !Array.isArray(holdings) || holdings.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid holdings data' },
        { status: 400 }
      );
    }
    
    // Use the OpenAI service to analyze the portfolio
    const portfolioData = await analyzePortfolio(holdings);

    return NextResponse.json(portfolioData);
  } catch (error) {
    console.error('Error processing portfolio analysis request:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze portfolio',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 