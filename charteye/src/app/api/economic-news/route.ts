import { NextResponse } from 'next/server';
import { analyzeEconomicNews } from '@/lib/services/openai';
import { fetchMarketData, formatMarketDataForAI } from '@/lib/services/marketData';

export async function POST(request: Request) {
  try {
    const { newsItems } = await request.json();
    
    if (!newsItems || !Array.isArray(newsItems) || newsItems.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid news items' },
        { status: 400 }
      );
    }
    
    // Fetch current market data
    const marketData = await fetchMarketData();
    const marketDataString = formatMarketDataForAI(marketData);
    
    // Use the OpenAI service to analyze economic news with current market context
    const analysisData = await analyzeEconomicNews(newsItems, marketDataString);
    
    // Include the raw market data in the response
    return NextResponse.json({
      ...analysisData,
      marketData
    });
  } catch (error) {
    console.error('Error processing economic news analysis request:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze economic news',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 