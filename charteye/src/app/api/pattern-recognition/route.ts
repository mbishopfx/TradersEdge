import { NextResponse } from 'next/server';
import { recognizeChartPattern } from '@/lib/services/openai';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Missing file' },
        { status: 400 }
      );
    }
    
    // Create a temporary object URL for the uploaded image
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    const imageUrl = `data:${file.type};base64,${base64}`;

    // Use the OpenAI service to recognize patterns
    const patternData = await recognizeChartPattern(imageUrl);

    return NextResponse.json(patternData);
  } catch (error) {
    console.error('Error processing pattern recognition request:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to recognize patterns',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 