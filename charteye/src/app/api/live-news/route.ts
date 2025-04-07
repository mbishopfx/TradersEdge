import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { fetchMarketData, formatMarketDataForAI } from '@/lib/services/marketData';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Types
type NewsHeadline = {
  id: string;
  text: string;
  source: string;
  timestamp: string;
}

type NewsAnalysis = {
  id: string;
  category: 'market-impact' | 'sector-analysis' | 'trend-prediction' | 'summary';
  title: string;
  content: string;
  timestamp: string;
}

// Path to news data directory - handle both local and SiteGround environments
function getNewsDataDir() {
  // Check for environment variables that might be set in SiteGround
  if (process.env.NEWS_DATA_DIR) {
    return process.env.NEWS_DATA_DIR;
  }
  
  // Default path relative to project root
  return path.join(process.cwd(), 'news-data');
}

const NEWS_DATA_DIR = getNewsDataDir();

// For debugging purposes
console.log(`[Live News API] Using news data directory: ${NEWS_DATA_DIR}`);

// Read news data from files
async function readNewsData() {
  // Ensure directory exists
  if (!fs.existsSync(NEWS_DATA_DIR)) {
    console.log(`[Live News API] Directory not found: ${NEWS_DATA_DIR}`);
    return {
      headlines: [],
      snippets: [],
      lastScrape: null
    };
  }

  // Read metadata file if it exists
  const metadataPath = path.join(NEWS_DATA_DIR, 'metadata.json');
  if (fs.existsSync(metadataPath)) {
    try {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
      console.log(`[Live News API] Found metadata file with ${metadata.latest_headlines?.length || 0} headlines`);
      
      // Check if we have the latest headlines in metadata
      if (metadata.latest_headlines && Array.isArray(metadata.latest_headlines)) {
        return {
          headlines: metadata.latest_headlines,
          lastScrape: metadata.last_scrape || null
        };
      }
    } catch (error) {
      console.error('[Live News API] Error reading metadata:', error);
    }
  }

  // If metadata doesn't have what we need, try reading the individual news files
  try {
    const files = fs.readdirSync(NEWS_DATA_DIR)
      .filter(file => file.endsWith('.json') && file !== 'metadata.json')
      .sort((a, b) => {
        // Sort by file modification time (newest first)
        return fs.statSync(path.join(NEWS_DATA_DIR, b)).mtime.getTime() - 
               fs.statSync(path.join(NEWS_DATA_DIR, a)).mtime.getTime();
      })
      .slice(0, 5); // Limit to 5 most recent files
      
    console.log(`[Live News API] Reading from ${files.length} news files`);
      
    const headlinesSet = new Set<string>();
    let allHeadlines: string[] = [];
    let allSnippets: string[] = [];
    
    for (const file of files) {
      const filePath = path.join(NEWS_DATA_DIR, file);
      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const fileData = JSON.parse(fileContent);
        
        if (fileData.headlines && Array.isArray(fileData.headlines)) {
          for (const headline of fileData.headlines) {
            if (!headlinesSet.has(headline)) {
              headlinesSet.add(headline);
              allHeadlines.push(headline);
            }
          }
        }
        
        if (fileData.snippets && Array.isArray(fileData.snippets)) {
          allSnippets = [...allSnippets, ...fileData.snippets.slice(0, 3)];
        }
      } catch (fileError) {
        console.error(`[Live News API] Error reading file ${filePath}:`, fileError);
        // Continue with other files
      }
    }
    
    console.log(`[Live News API] Extracted ${allHeadlines.length} headlines and ${allSnippets.length} snippets`);
    
    return {
      headlines: allHeadlines.slice(0, 20), // Limit to 20 headlines
      snippets: allSnippets.slice(0, 10),   // Limit to 10 content snippets
      lastScrape: new Date().toISOString()  // Current time as fallback
    };
  } catch (error) {
    console.error('[Live News API] Error reading news files:', error);
    return {
      headlines: [],
      snippets: [],
      lastScrape: null
    };
  }
}

// Generate AI analysis from news data
async function generateNewsAnalysis(headlines: string[], snippets: string[]) {
  // Safety check
  if (!headlines || headlines.length === 0) {
    console.log('[Live News API] No headlines available for analysis');
    return generateMockAnalysis([]);
  }

  // Check for OpenAI key
  if (!process.env.OPENAI_API_KEY) {
    console.log('[Live News API] OpenAI API key not found, using mock data');
    return generateMockAnalysis(headlines);
  }
  
  try {
    // Get current market data to incorporate into the analysis
    const marketData = await fetchMarketData();
    const marketContext = formatMarketDataForAI(marketData);
    
    // Combined content from headlines and snippets
    const newsContent = [
      "HEADLINES:",
      ...headlines.slice(0, 10).map((h, i) => `${i+1}. ${h}`),
      "\nSNIPPETS:",
      ...snippets.slice(0, 5).map((s, i) => `${i+1}. ${s.substring(0, 300)}...`)
    ].join("\n");
    
    console.log('[Live News API] Sending analysis request to OpenAI');
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using 3.5-turbo for cost efficiency, change to gpt-4 if needed
      messages: [
        {
          role: "system",
          content: `You are an expert financial news analyst. Analyze recent financial news headlines and create 4 concise analyses:
          1. Market Summary: A brief summary of the overall market situation based on the news.
          2. Market Impact: How these news items could impact major indices and asset classes.
          3. Sector Analysis: Which sectors might be most affected by these developments.
          4. Trend Prediction: What trends or market movements might develop based on this news.
          Format responses in JSON. Keep each analysis concise - no more than 2-3 sentences.`
        },
        {
          role: "user",
          content: `Please analyze these financial news items:\n\n${newsContent}\n\nCurrent market context:\n${marketContext}`
        }
      ],
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const responseContent = response.choices[0]?.message?.content || '{}';
    console.log('[Live News API] Received response from OpenAI');
    
    // Try to parse the response as JSON, with fallback
    let analysisData;
    try {
      analysisData = JSON.parse(responseContent);
    } catch (parseError) {
      console.error('[Live News API] Error parsing OpenAI response:', parseError);
      console.log('[Live News API] Falling back to mock data due to parse error');
      return generateMockAnalysis(headlines);
    }
    
    const timestamp = new Date().toISOString();
    
    return [
      {
        id: uuidv4(),
        category: 'summary',
        title: 'Market Summary',
        content: analysisData.marketSummary || analysisData.summary || 'Summary not available',
        timestamp
      },
      {
        id: uuidv4(),
        category: 'market-impact',
        title: 'Market Impact Analysis',
        content: analysisData.marketImpact || 'Impact analysis not available',
        timestamp
      },
      {
        id: uuidv4(),
        category: 'sector-analysis',
        title: 'Sector Analysis',
        content: analysisData.sectorAnalysis || 'Sector analysis not available',
        timestamp
      },
      {
        id: uuidv4(),
        category: 'trend-prediction',
        title: 'Trend Prediction',
        content: analysisData.trendPrediction || 'Trend prediction not available',
        timestamp
      }
    ];
  } catch (error) {
    console.error('[Live News API] Error generating news analysis:', error);
    return generateMockAnalysis(headlines);
  }
}

// Generate mock analysis for development or if OpenAI fails
function generateMockAnalysis(headlines: string[]) {
  const timestamp = new Date().toISOString();
  console.log('[Live News API] Generating mock analysis data');
  
  // Try to personalize mock data based on headlines if available
  let marketSentiment = 'neutral';
  if (headlines.length > 0) {
    const positiveWords = ['rise', 'gain', 'jump', 'up', 'higher', 'bullish', 'growth', 'positive'];
    const negativeWords = ['fall', 'drop', 'decline', 'down', 'lower', 'bearish', 'recession', 'negative'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    for (const headline of headlines) {
      const lowerHeadline = headline.toLowerCase();
      for (const word of positiveWords) {
        if (lowerHeadline.includes(word)) positiveCount++;
      }
      for (const word of negativeWords) {
        if (lowerHeadline.includes(word)) negativeCount++;
      }
    }
    
    if (positiveCount > negativeCount) marketSentiment = 'positive';
    else if (negativeCount > positiveCount) marketSentiment = 'negative';
  }
  
  const mockAnalyses = [
    {
      id: uuidv4(),
      category: 'summary' as const,
      title: 'Market Summary',
      content: marketSentiment === 'positive' 
        ? 'Markets are showing strength following positive economic data and corporate earnings. Investor sentiment appears optimistic despite lingering inflation concerns.'
        : marketSentiment === 'negative'
          ? 'Markets are facing headwinds due to disappointing economic reports and geopolitical tensions. Investors remain cautious amid concerns about monetary policy tightening.'
          : 'Markets are showing mixed signals following recent central bank comments and economic data releases. Investors remain cautious amid ongoing inflation concerns.',
      timestamp
    },
    {
      id: uuidv4(),
      category: 'market-impact' as const,
      title: 'Market Impact Analysis',
      content: marketSentiment === 'positive'
        ? 'Equity indices appear poised for further gains with technology and cyclical sectors leading. Bond yields may rise as investors reduce safe-haven positions in favor of riskier assets.'
        : marketSentiment === 'negative'
          ? 'Equity indices may face downward pressure in the near term, particularly in growth sectors. Bond markets could see inflows as investors seek safety amid uncertainty.'
          : 'Equity indices may experience increased volatility with a slight negative bias. Bond yields could stabilize as rate hike expectations have been largely priced in.',
      timestamp
    },
    {
      id: uuidv4(),
      category: 'sector-analysis' as const,
      title: 'Sector Analysis',
      content: marketSentiment === 'positive'
        ? 'Technology and consumer discretionary sectors should benefit from improved sentiment and spending. Financial stocks may also perform well in a rising rate environment.'
        : marketSentiment === 'negative'
          ? 'Defensive sectors like utilities, healthcare, and consumer staples may outperform. Technology and consumer discretionary stocks face challenges from reduced spending and higher rates.'
          : 'Financial and technology sectors appear most vulnerable to near-term pressure. Defensive sectors like utilities and consumer staples may outperform in this environment.',
      timestamp
    },
    {
      id: uuidv4(),
      category: 'trend-prediction' as const,
      title: 'Trend Prediction',
      content: marketSentiment === 'positive'
        ? 'Look for continuation of the recent uptrend with potential breakouts above key resistance levels. Dollar weakness may persist as risk appetite improves and capital flows to emerging markets.'
        : marketSentiment === 'negative'
          ? 'Markets may test recent support levels with increased selling pressure. Safe-haven currencies like the USD and JPY could strengthen as risk aversion increases.'
          : 'Watch for consolidation in major indices with potential support tests. Currency markets suggest dollar strength may continue as safe-haven flows persist.',
      timestamp
    }
  ];
  
  return mockAnalyses;
}

// Format headlines for response
function formatHeadlines(headlines: string[], lastScrape: string | null): NewsHeadline[] {
  if (!headlines || headlines.length === 0) {
    return [];
  }
  
  return headlines.map(headline => ({
    id: uuidv4(),
    text: headline,
    source: 'Financial News',
    timestamp: lastScrape || new Date().toISOString()
  }));
}

export async function GET() {
  try {
    console.log('[Live News API] Processing request');
    
    // Read news data
    const { headlines, snippets, lastScrape } = await readNewsData();
    
    // Format headlines
    const formattedHeadlines = formatHeadlines(headlines || [], lastScrape);
    
    // Generate analysis if we have headlines
    const analyses = await generateNewsAnalysis(headlines || [], snippets || []);
    
    console.log(`[Live News API] Returning ${formattedHeadlines.length} headlines and ${analyses.length} analyses`);
    
    // Return data
    return NextResponse.json({
      headlines: formattedHeadlines,
      analyses,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Live News API] Error in live-news API:', error);
    
    // Return error response with fallback mock data
    return NextResponse.json({
      headlines: [],
      analyses: generateMockAnalysis([]),
      lastUpdated: new Date().toISOString(),
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        note: 'Using fallback data due to error'
      }
    });
  }
} 