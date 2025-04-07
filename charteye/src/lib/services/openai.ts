import { OpenAI } from 'openai';
import { ChartAnalysis, IndicatorCode } from '@/types';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Mock analysis generator for development or if OpenAI API fails
const generateMockAnalysis = () => {
  const patterns = [
    'bullish breakout', 'bearish divergence', 'double top', 'double bottom',
    'head and shoulders', 'inverse head and shoulders', 'ascending triangle',
    'descending triangle', 'cup and handle', 'bull flag', 'bear flag'
  ];
  
  const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
  const overallGrade = (Math.random() * 3 + 6).toFixed(1); // 6.0 to 9.0
  
  return {
    analysis: `This chart shows a ${selectedPattern} pattern with strong confirmation from volume indicators. Price is testing a key level, and momentum is ${Math.random() > 0.5 ? 'increasing' : 'decreasing'}. There are clear support and resistance levels that can be used for entry and exit points. The overall structure suggests a ${Math.random() > 0.5 ? 'bullish' : 'bearish'} bias in the near term.`,
    grading: {
      patternClarity: parseFloat((Math.random() * 3 + 6).toFixed(1)),
      trendAlignment: parseFloat((Math.random() * 3 + 6).toFixed(1)),
      riskReward: parseFloat((Math.random() * 3 + 6).toFixed(1)),
      volumeConfirmation: parseFloat((Math.random() * 3 + 6).toFixed(1)),
      keyLevelProximity: parseFloat((Math.random() * 3 + 6).toFixed(1)),
      overallGrade: parseFloat(overallGrade)
    }
  };
};

export async function analyzeChart(imageUrl: string): Promise<any> {
  // Use mock data in development environment if no API key is available
  if (process.env.NODE_ENV !== 'production' || !process.env.OPENAI_API_KEY) {
    console.log('Using mock data for chart analysis (development mode)');
    return generateMockAnalysis();
  }
  
  try {
    // Make a request to OpenAI with the image URL
    const result = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'system',
          content: `You are an expert technical analyst for trading charts. Analyze the provided chart image in detail. 
          Focus on:
          1. Chart pattern identification
          2. Support & resistance levels
          3. Trend analysis
          4. Volume analysis
          5. Momentum indicators
          6. Key levels to watch
          
          Then provide a grade on a scale of 1-10 for:
          - Pattern clarity
          - Trend alignment
          - Risk/reward ratio
          - Volume confirmation
          - Proximity to key levels
          - Overall trading grade`
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
              },
            },
            {
              type: 'text',
              text: 'Please analyze this trading chart in detail and provide a technical analysis with grading.',
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    // Extract the analysis text
    const analysisText = result.choices[0]?.message?.content || '';
    
    // Extract grades from the analysis text using regex
    const patternClarityMatch = analysisText.match(/Pattern clarity:?\s*(\d+\.?\d*)/i);
    const trendAlignmentMatch = analysisText.match(/Trend alignment:?\s*(\d+\.?\d*)/i);
    const riskRewardMatch = analysisText.match(/Risk\/reward ratio:?\s*(\d+\.?\d*)/i);
    const volumeConfirmationMatch = analysisText.match(/Volume confirmation:?\s*(\d+\.?\d*)/i);
    const keyLevelProximityMatch = analysisText.match(/Proximity to key levels:?\s*(\d+\.?\d*)/i);
    const overallGradeMatch = analysisText.match(/Overall trading grade:?\s*(\d+\.?\d*)/i);
    
    // Process the grading
    const grading = {
      patternClarity: patternClarityMatch ? parseFloat(patternClarityMatch[1]) : 7.5,
      trendAlignment: trendAlignmentMatch ? parseFloat(trendAlignmentMatch[1]) : 7.5,
      riskReward: riskRewardMatch ? parseFloat(riskRewardMatch[1]) : 7.5,
      volumeConfirmation: volumeConfirmationMatch ? parseFloat(volumeConfirmationMatch[1]) : 7.5,
      keyLevelProximity: keyLevelProximityMatch ? parseFloat(keyLevelProximityMatch[1]) : 7.5,
      overallGrade: overallGradeMatch ? parseFloat(overallGradeMatch[1]) : 7.5
    };
    
    return {
      analysis: analysisText,
      grading,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    
    // Return mock data if OpenAI API fails
    console.log('Falling back to mock data due to OpenAI API error');
    return {
      ...generateMockAnalysis(),
      _mock: true,
      _apiError: true,
      createdAt: new Date().toISOString()
    };
  }
}

export async function generateIndicatorCode(
  description: string,
  language: 'MQL4' | 'MQL5' | 'PineScript'
): Promise<IndicatorCode> {
  if (process.env.NODE_ENV !== 'production' || !process.env.OPENAI_API_KEY) {
    console.log('Using mock data for indicator code generation (development mode)');
    return {
      id: '', // Will be set by the database
      userId: '', // Will be set by the database
      language,
      description,
      code: `// Mock ${language} code for: ${description}\n// This is a placeholder generated in development mode\n\n// Sample indicator code\nindicator("${description}", overlay=true);\n\n// Calculate some example values\nfloat value = ta.sma(close, 14);\n\n// Plot the result\nplot(value, color=color.blue, title="Example")\n`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert programmer specializing in ${language} for trading platforms. Generate clean, accurate, and well-commented code for the trading indicator. Include comments explaining the code's logic.`
        },
        {
          role: "user",
          content: description
        }
      ],
      max_tokens: 1000
    });

    return {
      id: '', // Will be set by the database
      userId: '', // Will be set by the database
      language,
      description,
      code: response.choices[0].message.content || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error calling OpenAI API for indicator code generation:', error);
    
    // Return mock data if OpenAI API fails
    return {
      id: '', 
      userId: '', 
      language,
      description,
      code: `// Mock ${language} code for: ${description}\n// This is generated due to an API error\n\n// Sample indicator code\nindicator("${description}", overlay=true);\n\n// Calculate some example values\nfloat value = ta.sma(close, 14);\n\n// Plot the result\nplot(value, color=color.blue, title="Example")\n`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _mock: true,
      _apiError: true
    };
  }
}

// New feature: Pattern Recognition
export async function recognizeChartPattern(imageUrl: string): Promise<any> {
  if (process.env.NODE_ENV !== 'production' || !process.env.OPENAI_API_KEY) {
    console.log('Using mock data for pattern recognition (development mode)');
    
    const patterns = [
      { name: 'Head and Shoulders', probability: 0.85, tradingSignal: 'Bearish', description: 'A reversal pattern consisting of three peaks, with the middle peak being the highest.' },
      { name: 'Double Bottom', probability: 0.78, tradingSignal: 'Bullish', description: 'A reversal pattern where price makes two lows at approximately the same level.' },
      { name: 'Cup and Handle', probability: 0.67, tradingSignal: 'Bullish', description: 'A bullish continuation pattern resembling a cup with a handle.' },
      { name: 'Bull Flag', probability: 0.92, tradingSignal: 'Bullish', description: 'A consolidation pattern that occurs after a strong upward movement.' },
      { name: 'Falling Wedge', probability: 0.72, tradingSignal: 'Bullish', description: 'A bullish pattern formed by converging trendlines, with both sloping downward.' }
    ];
    
    // Select 1-3 random patterns
    const numPatterns = Math.floor(Math.random() * 3) + 1;
    const selectedPatterns = [];
    const patternsCopy = [...patterns];
    
    for (let i = 0; i < numPatterns; i++) {
      if (patternsCopy.length === 0) break;
      const randomIndex = Math.floor(Math.random() * patternsCopy.length);
      selectedPatterns.push({
        ...patternsCopy[randomIndex],
        probability: (Math.random() * 0.3 + 0.6).toFixed(2) // 0.6 to 0.9
      });
      patternsCopy.splice(randomIndex, 1);
    }
    
    // Sort by probability
    selectedPatterns.sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability));
    
    return {
      patterns: selectedPatterns,
      keyLevels: {
        support: [Math.floor(Math.random() * 1000) / 10, Math.floor(Math.random() * 900) / 10],
        resistance: [Math.floor(Math.random() * 1100) / 10 + 100, Math.floor(Math.random() * 1200) / 10 + 150]
      },
      summary: `The chart displays ${selectedPatterns.length > 1 ? 'multiple patterns' : 'a pattern'} with ${selectedPatterns[0].name} being the most prominent. This suggests a ${selectedPatterns[0].tradingSignal.toLowerCase()} bias in the near term.`,
      createdAt: new Date().toISOString()
    };
  }
  
  try {
    const result = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'system',
          content: `You are an expert in recognizing chart patterns for trading. Analyze the provided chart image and identify any technical patterns present.
          For each pattern detected, provide:
          1. Pattern name
          2. Confidence level (0.0-1.0)
          3. Trading signal (Bullish/Bearish/Neutral)
          4. Brief description of the pattern
          
          Also identify key support and resistance levels visible on the chart.
          
          Format your response as JSON with the following structure:
          {
            "patterns": [
              {
                "name": "Pattern Name",
                "probability": 0.85,
                "tradingSignal": "Bullish/Bearish/Neutral",
                "description": "Brief description"
              }
            ],
            "keyLevels": {
              "support": [123.45, 120.00],
              "resistance": [130.00, 135.50]
            },
            "summary": "Brief overall analysis of the patterns detected"
          }`
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
              },
            },
            {
              type: 'text',
              text: 'Identify the chart patterns in this image with confidence levels.',
            },
          ],
        },
      ],
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    // Parse the JSON response
    const responseContent = result.choices[0]?.message?.content || '{}';
    const patternData = JSON.parse(responseContent);
    
    return {
      ...patternData,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error calling OpenAI API for pattern recognition:', error);
    
    // Mock data for failover
    return {
      patterns: [
        { 
          name: 'Double Top', 
          probability: 0.75, 
          tradingSignal: 'Bearish',
          description: 'A reversal pattern forming after an uptrend, consisting of two peaks at approximately the same level.' 
        }
      ],
      keyLevels: {
        support: [105.50, 100.00],
        resistance: [115.25, 120.50]
      },
      summary: 'The chart shows a Double Top pattern which indicates a potential reversal of the current uptrend. Key support levels should be monitored for confirmation.',
      createdAt: new Date().toISOString(),
      _mock: true,
      _apiError: true
    };
  }
}

// New feature: Portfolio Analysis
export async function analyzePortfolio(holdings: any[]): Promise<any> {
  if (process.env.NODE_ENV !== 'production' || !process.env.OPENAI_API_KEY) {
    console.log('Using mock data for portfolio analysis (development mode)');
    
    const sectors = ['Technology', 'Healthcare', 'Finance', 'Consumer Goods', 'Energy', 'Utilities', 'Communication Services'];
    const riskLevels = ['Low', 'Moderate', 'High'];
    
    return {
      diversification: {
        score: (Math.random() * 3 + 7).toFixed(1),
        sectorExposure: sectors.slice(0, 3).map(sector => ({
          sector,
          percentage: (Math.random() * 40 + 10).toFixed(1) + '%'
        })),
        riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)]
      },
      recommendations: [
        'Consider adding exposure to defensive sectors for better balance',
        'Your portfolio may be overweight in technology stocks',
        'Look into adding more dividend-paying stocks for income'
      ],
      riskAssessment: {
        volatility: (Math.random() * 0.4 + 0.6).toFixed(2),
        sharpeRatio: (Math.random() * 1 + 0.5).toFixed(2),
        betaAverage: (Math.random() * 1.5 + 0.5).toFixed(2)
      },
      summary: 'Your portfolio shows moderate diversification but may benefit from exposure to additional sectors. The overall risk profile is moderate with a slight tilt toward growth assets.'
    };
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert portfolio analyst. Analyze the provided portfolio holdings and provide insights on diversification, risk assessment, and recommendations for improvement. Format your response as JSON.`
        },
        {
          role: "user",
          content: `Analyze this portfolio: ${JSON.stringify(holdings)}`
        }
      ],
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });

    const responseContent = response.choices[0]?.message?.content || '{}';
    const analysisData = JSON.parse(responseContent);
    
    return analysisData;
  } catch (error) {
    console.error('Error calling OpenAI API for portfolio analysis:', error);
    
    // Mock data for failover
    return {
      diversification: {
        score: 7.5,
        sectorExposure: [
          { sector: 'Technology', percentage: '42%' },
          { sector: 'Finance', percentage: '28%' },
          { sector: 'Healthcare', percentage: '15%' }
        ],
        riskLevel: 'Moderate-High'
      },
      recommendations: [
        'Consider adding exposure to defensive sectors like Utilities and Consumer Staples',
        'Your portfolio is technology-heavy, which increases volatility',
        'Consider adding some fixed income assets for stability'
      ],
      riskAssessment: {
        volatility: 0.85,
        sharpeRatio: 0.68,
        betaAverage: 1.25
      },
      summary: 'Your portfolio shows moderate diversification but is concentrated in technology and finance sectors. Consider broadening your holdings to reduce sector-specific risks.',
      _mock: true,
      _apiError: true
    };
  }
}

// New feature: Economic News Analysis
export async function analyzeEconomicNews(newsItems: string[], marketData?: string): Promise<any> {
  if (process.env.NODE_ENV !== 'production' || !process.env.OPENAI_API_KEY) {
    console.log('Using mock data for economic news analysis (development mode)');
    
    const marketImpacts = ['Positive', 'Negative', 'Neutral', 'Mixed'];
    const sectors = ['Technology', 'Finance', 'Healthcare', 'Retail', 'Energy'];
    
    return {
      summary: 'Recent economic data suggests moderate growth with inflation gradually declining. Central banks may maintain current monetary policy in the near term.',
      marketSentiment: marketImpacts[Math.floor(Math.random() * marketImpacts.length)],
      keyEvents: [
        {
          event: 'Federal Reserve Meeting',
          impact: marketImpacts[Math.floor(Math.random() * marketImpacts.length)],
          analysis: 'The Fed indicated a possible rate cut in the coming months if inflation continues to decline.'
        },
        {
          event: 'Unemployment Report',
          impact: marketImpacts[Math.floor(Math.random() * marketImpacts.length)],
          analysis: 'Job growth exceeded expectations, suggesting economic resilience.'
        }
      ],
      sectorImpact: sectors.map(sector => ({
        sector,
        impact: marketImpacts[Math.floor(Math.random() * marketImpacts.length)],
        details: `${sector} stocks may ${Math.random() > 0.5 ? 'benefit from' : 'face headwinds due to'} recent developments.`
      })),
      tradingOpportunities: [
        'Consider defensive stocks if economic uncertainty increases',
        'Watch for opportunities in sectors benefiting from policy changes',
        'Monitor yield curve for potential shift in market direction'
      ]
    };
  }
  
  try {
    // Build the prompt with news items and market data if available
    let prompt = `Analyze these economic news items and their market impact: ${JSON.stringify(newsItems)}`;
    
    // Include market data context if provided
    if (marketData) {
      prompt += `\n\nHere is current market data to incorporate in your analysis:\n${marketData}`;
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert financial analyst specializing in economic news interpretation. Analyze the provided news items and explain their potential impact on markets. Identify which sectors may be affected, market sentiment, and possible trading opportunities. Use the real-time market data provided to inform your analysis and recommend specific trading actions based on the news in the context of current market conditions. Format your response as JSON.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });

    const responseContent = response.choices[0]?.message?.content || '{}';
    const analysisData = JSON.parse(responseContent);
    
    return analysisData;
  } catch (error) {
    console.error('Error calling OpenAI API for economic news analysis:', error);
    
    // Mock data for failover
    return {
      summary: 'Recent economic news indicates mixed signals with inflation concerns balanced against solid employment data.',
      marketSentiment: 'Mixed',
      keyEvents: [
        {
          event: 'CPI Data Release',
          impact: 'Negative',
          analysis: 'Inflation came in higher than expected, raising concerns about aggressive monetary policy.'
        },
        {
          event: 'GDP Growth Figures',
          impact: 'Positive',
          analysis: 'Economic growth exceeded forecasts, suggesting resilience despite higher interest rates.'
        }
      ],
      sectorImpact: [
        {
          sector: 'Technology',
          impact: 'Negative',
          details: 'Higher rates typically pressure growth stocks valuation models.'
        },
        {
          sector: 'Finance',
          impact: 'Positive',
          details: 'Banks may benefit from higher interest rate spreads if rates remain elevated.'
        }
      ],
      tradingOpportunities: [
        'Consider value stocks over growth if inflation remains persistent',
        'Financial sector may outperform in rising rate environment',
        'Watch for defensive stocks if economic uncertainty increases'
      ],
      _mock: true,
      _apiError: true
    };
  }
}

// New feature: Trading Journal Assistant
export async function analyzeTradingJournal(journalEntries: any[]): Promise<any> {
  if (process.env.NODE_ENV !== 'production' || !process.env.OPENAI_API_KEY) {
    console.log('Using mock data for trading journal analysis (development mode)');
    
    return {
      strengths: [
        'Consistent use of stop losses',
        'Good trade planning',
        'Patience in entry execution'
      ],
      weaknesses: [
        'Frequently exiting profitable trades too early',
        'Overtrading during volatile market conditions',
        'Inconsistent position sizing'
      ],
      patterns: [
        'Most successful on trend-following strategies',
        'Better performance on longer timeframes',
        'Higher win rate in morning trading sessions'
      ],
      recommendations: [
        'Consider scaling out of profitable trades instead of full exits',
        'Implement a minimum wait time before entering trades during high volatility',
        'Standardize position sizing based on volatility'
      ],
      summary: 'Your trading shows a solid foundation with good risk management. Main areas for improvement include holding winners longer and more consistent position sizing.'
    };
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert trading coach analyzing a trader's journal entries. Identify patterns, strengths, weaknesses, and provide actionable recommendations to improve trading performance. Focus on psychological aspects, risk management, and strategy optimization. Format your response as JSON.`
        },
        {
          role: "user",
          content: `Analyze these trading journal entries: ${JSON.stringify(journalEntries)}`
        }
      ],
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });

    const responseContent = response.choices[0]?.message?.content || '{}';
    const analysisData = JSON.parse(responseContent);
    
    return analysisData;
  } catch (error) {
    console.error('Error calling OpenAI API for trading journal analysis:', error);
    
    // Mock data for failover
    return {
      strengths: [
        'Consistent application of trading plan',
        'Patience in waiting for setup confirmation',
        'Good record-keeping discipline'
      ],
      weaknesses: [
        'Tendency to move stop losses during trades',
        'Overtrading during drawdown periods',
        'Chasing entries after missing initial setup'
      ],
      patterns: [
        'Higher success rate with trend-following vs. counter-trend trades',
        'Better performance in less crowded markets',
        'Consistent weakness in holding winners long enough'
      ],
      recommendations: [
        'Implement a rule against moving stop losses once placed',
        'Add mandatory break after 3 consecutive losses',
        'Use trailing stops for winning trades to maximize gains',
        'Consider a trading checklist before each entry to ensure discipline'
      ],
      summary: 'Your trading journal shows solid fundamentals but room for improvement in discipline and maximizing winners. Focus on letting profitable trades run longer and maintaining strict stop loss discipline.',
      _mock: true,
      _apiError: true
    };
  }
}

// New feature: Risk Analysis
export async function analyzeRisk(tradeSetup: any): Promise<any> {
  if (process.env.NODE_ENV !== 'production' || !process.env.OPENAI_API_KEY) {
    console.log('Using mock data for risk analysis (development mode)');
    
    return {
      positionSize: {
        recommended: `${(Math.random() * 4 + 1).toFixed(1)}%`,
        units: Math.floor(Math.random() * 500) + 100
      },
      riskRewardRatio: (Math.random() * 3 + 1).toFixed(2),
      stopLoss: {
        price: (Math.random() * 10 + 90).toFixed(2),
        distance: `${(Math.random() * 2 + 0.5).toFixed(1)}%`
      },
      targetPrice: {
        price: (Math.random() * 20 + 110).toFixed(2),
        distance: `${(Math.random() * 5 + 3).toFixed(1)}%`
      },
      winProbability: `${(Math.random() * 30 + 40).toFixed(0)}%`,
      expectancy: (Math.random() * 0.4 + 0.1).toFixed(2),
      recommendations: [
        'Consider tightening stop loss to improve risk-reward ratio',
        'Multiple take-profit levels may improve overall profitability',
        'Current market volatility suggests reducing position size'
      ]
    };
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert risk manager for trading. Analyze the provided trade setup and calculate optimal position size, stop loss placement, take profit levels, and overall risk assessment. Consider account size, market volatility, and trading style in your analysis. Format your response as JSON.`
        },
        {
          role: "user",
          content: `Analyze risk for this trade setup: ${JSON.stringify(tradeSetup)}`
        }
      ],
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const responseContent = response.choices[0]?.message?.content || '{}';
    const analysisData = JSON.parse(responseContent);
    
    return analysisData;
  } catch (error) {
    console.error('Error calling OpenAI API for risk analysis:', error);
    
    // Mock data for failover
    return {
      positionSize: {
        recommended: '2.5%',
        units: 250
      },
      riskRewardRatio: 1.85,
      stopLoss: {
        price: 95.30,
        distance: '1.5%'
      },
      targetPrice: {
        price: 105.75,
        distance: '2.8%'
      },
      winProbability: '55%',
      expectancy: 0.27,
      recommendations: [
        'Current risk-reward ratio is acceptable but could be improved',
        'Consider multiple take-profit levels (partial exits)',
        'Given current market conditions, this position size is appropriate'
      ],
      _mock: true,
      _apiError: true
    };
  }
} 