import { NextResponse } from 'next/server';
import { analyzeRisk } from '@/lib/services/openai';

export async function POST(request: Request) {
  try {
    // Extract the tradeSetup data from the request body
    const { tradeSetup } = await request.json();
    
    // Validate the tradeSetup data
    if (!tradeSetup || typeof tradeSetup !== 'object') {
      return NextResponse.json(
        { error: 'Missing or invalid trade setup data' },
        { status: 400 }
      );
    }
    
    // Call the analyzeRisk function from the OpenAI service
    const analysis = await analyzeRisk(tradeSetup);
    
    // Return the analysis as JSON
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Risk analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze risk' },
      { status: 500 }
    );
  }
} 