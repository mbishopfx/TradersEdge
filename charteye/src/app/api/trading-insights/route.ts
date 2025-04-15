import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// OpenAI client initialization
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a master retail trader with years of experience in the markets. You've made millions by staying patient, observant, and disciplined. Your approach combines technical analysis, market psychology, and risk management.

Your goal is to help traders with practical, actionable advice. Focus on:
- Providing specific trading strategies and setups
- Explaining technical analysis concepts clearly
- Teaching proper risk management techniques
- Helping with market psychology and emotional control
- Being realistic about market expectations and potential returns

When giving advice, be specific but also explain the reasoning behind your suggestions. Help traders develop their own skills rather than just following your signals.

FORMATTING GUIDELINES - FOLLOW THESE EXACTLY:
1. Use clear paragraph breaks (double line breaks) between different thoughts or sections
2. For bullet point lists, format them exactly like this:

   Here's a list of important points:

   - First point with important details
   - Second point that matters a lot
   - Third critical point to remember

3. For numbered lists, format them exactly like this:

   Follow these steps in order:

   1. First do this important step
   2. Then proceed to this next step
   3. Finally complete this last step

4. Use code blocks for examples of indicators or calculations, like this:

   \`\`\`
   RSI = 100 - (100 / (1 + RS))
   where RS = Average Gain / Average Loss
   \`\`\`

5. Use *asterisks* for emphasis and \`backticks\` for technical terms or code inline

6. Keep paragraphs concise (3-5 lines) and focused

Remember that all trading involves risk, and you should always emphasize proper risk management. Try to include specific examples that help illustrate your advice whenever possible.`;

// Enable developer mode if needed
const DEVELOPER_MODE = process.env.NODE_ENV !== 'production';

export const dynamic = 'force-static';

export async function POST(request: Request) {
  try {
    const { message, userId } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Missing message content' },
        { status: 400 }
      );
    }

    // Generate response using OpenAI
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        model: 'gpt-4',
        max_tokens: 1000,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content || 
        "I'm sorry, I couldn't generate a response at this time. Please try again later.";

      return NextResponse.json({ 
        response,
        timestamp: new Date().toISOString()
      });
    } catch (aiError) {
      console.error('Error getting AI response:', aiError);
      
      // Fallback response in case of OpenAI API error
      if (DEVELOPER_MODE) {
        return NextResponse.json({ 
          response: "As a seasoned trader, I've learned that the most important aspect of trading is risk management. Always define your risk before entering a position, and never risk more than 1-2% of your account on a single trade.\n\nThis approach has helped me stay in the game during tough market periods and capitalize on opportunities when they arise.\n\nHere are the key risk management principles I follow:\n\n- Setting stop losses before entering trades\n- Position sizing based on account percentage rather than fixed amounts\n- Diversifying across different assets and strategies\n- Never averaging down on losing positions\n\nThe formula for position sizing is actually quite simple:\n\n```\nPosition Size = Account Size × Risk Percentage ÷ Stop Loss Distance\n```\n\nFor example, if you have a $10,000 account, are willing to risk 1%, and your stop loss is 50 pips away, your position size would be adjusted to risk exactly $100 on that trade.\n\nWhat specific trading challenge are you facing right now?",
          timestamp: new Date().toISOString(),
          _devMode: true
        });
      } else {
        return NextResponse.json(
          { error: 'Failed to generate trading insights' },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 