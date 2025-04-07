import { NextResponse } from 'next/server';
import { analyzeTradingJournal } from '@/lib/services/openai';

export async function POST(request: Request) {
  try {
    const { entries } = await request.json();
    
    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid journal entries' },
        { status: 400 }
      );
    }
    
    // Use the OpenAI service to analyze the trading journal
    const analysisData = await analyzeTradingJournal(entries);

    return NextResponse.json(analysisData);
  } catch (error) {
    console.error('Error processing trading journal analysis request:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze trading journal',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 