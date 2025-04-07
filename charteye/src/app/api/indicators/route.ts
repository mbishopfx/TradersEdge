import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Skip authentication in development mode
    let userId = 'dev-user-123';
    
    // In production, we would verify the auth token
    if (process.env.NODE_ENV === 'production') {
      // Production authentication code would go here
      // This is temporarily skipped for development
    }

    // Parse request body
    const body = await request.json();
    const { language, description } = body;
    
    if (!language || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Use OpenAI to generate indicator code
    const languageMap: Record<string, string> = {
      pine: 'Pine Script for TradingView',
      mql4: 'MQL4 for MetaTrader 4',
      mql5: 'MQL5 for MetaTrader 5',
    };
    
    const languageName = languageMap[language] || language;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert programmer specializing ONLY in ${languageName}. Given a user request, generate clean, accurate, and well-commented code for the trading indicator. Include comments explaining the logic. The output should ONLY be code with comments, no explanations outside of code comments.`
        },
        {
          role: "user",
          content: description
        }
      ],
      max_tokens: 2000
    });

    const code = response.choices[0].message.content;
    
    return NextResponse.json({ code });
  } catch (error) {
    console.error('Error generating indicator code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 