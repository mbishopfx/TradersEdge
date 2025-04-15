import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { fetchMarketData, formatMarketDataForAI } from '@/lib/services/marketData';

export const dynamic = 'force-static';
export const revalidate = 900; // Revalidate every 15 minutes

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

interface NewsAnalysis {
  id: string;
  category: 'market-impact' | 'sector-analysis' | 'trend-prediction' | 'summary';
  title: string;
  content: string;
  timestamp: string;
  currency?: string;
}

interface AnalysisResponse {
  analyses: NewsAnalysis[];
  nextUpdateTime: string;
}

// Path to news data directory - handle both local and SiteGround environments
function getNewsDataDir() {
  // Check for environment variables that might be set in SiteGround or Render
  if (process.env.NEWS_DATA_DIR) {
    return process.env.NEWS_DATA_DIR;
  }
  
  // Try multiple possible locations
  const possiblePaths = [
    // Default path relative to project root
    path.join(process.cwd(), 'news-data'),
    // Absolute path for Render
    '/data/news-data',
    // Path relative to the server directory
    path.join(process.cwd(), '..', 'news-data'),
    // Path relative to the Next.js app directory
    path.join(process.cwd(), '..', '..', 'news-data')
  ];
  
  // Try each path and use the first one that exists or is creatable
  for (const dirPath of possiblePaths) {
    try {
      if (!fs.existsSync(dirPath)) {
        // Try to create the directory
        console.log(`[Live News API] Attempting to create directory: ${dirPath}`);
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      // Test if directory is writable
      const testFile = path.join(dirPath, '.test-write');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      
      console.log(`[Live News API] Using news data directory: ${dirPath}`);
      return dirPath;
    } catch (error: any) {
      console.log(`[Live News API] Cannot use directory ${dirPath}: ${error.message}`);
      // Continue to next path
    }
  }
  
  // If no path works, fall back to default
  const defaultPath = path.join(process.cwd(), 'news-data');
  console.log(`[Live News API] Falling back to default path: ${defaultPath}`);
  return defaultPath;
}

const NEWS_DATA_DIR = getNewsDataDir();

// For debugging purposes
console.log(`[Live News API] Final news data directory: ${NEWS_DATA_DIR}`);

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
async function generateNewsAnalysis(headlines: string[], snippets: string[], currency: string): Promise<AnalysisResponse> {
  // Safety check
  if (!headlines || headlines.length === 0) {
    console.warn('[Live News API] No headlines provided for analysis');
    return generateMockAnalysis(headlines);
  }

  try {
    const timestamp = new Date().toISOString();
    
    // Prepare the prompt for OpenAI
    const prompt = `Analyze the following financial news headlines and snippets specifically for ${currency} (${getCurrencyFullName(currency)}):
    
Headlines:
${headlines.join('\n')}

${snippets.length > 0 ? `Additional Context:\n${snippets.join('\n')}` : ''}

Please provide a comprehensive analysis including:
1. A brief market summary focusing on ${currency}
2. Market impact analysis specific to ${currency}
3. Sector analysis related to ${currency}
4. Short-term trend prediction for ${currency}

Format the response as a JSON object with the following structure:
{
  "marketSummary": "string",
  "marketImpact": "string",
  "sectorAnalysis": "string",
  "trendPrediction": "string"
}`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a financial analyst specializing in currency and market analysis. Provide concise, data-driven insights."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    // Parse the response
    const analysisText = completion.choices[0]?.message?.content || '';
    let analysisData;
    
    try {
      analysisData = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('[Live News API] Error parsing OpenAI response:', parseError);
      return generateMockAnalysis(headlines);
    }

    // Calculate next update time (15 minutes from now)
    const nextUpdateTime = new Date();
    nextUpdateTime.setMinutes(nextUpdateTime.getMinutes() + 15);

    return {
      analyses: [
        {
          id: uuidv4(),
          category: 'summary',
          title: `${currency} Market Summary`,
          content: analysisData.marketSummary || analysisData.summary || 'Summary not available',
          timestamp,
          currency
        },
        {
          id: uuidv4(),
          category: 'market-impact',
          title: `${currency} Market Impact Analysis`,
          content: analysisData.marketImpact || 'Impact analysis not available',
          timestamp,
          currency
        },
        {
          id: uuidv4(),
          category: 'sector-analysis',
          title: `${currency} Sector Analysis`,
          content: analysisData.sectorAnalysis || 'Sector analysis not available',
          timestamp,
          currency
        },
        {
          id: uuidv4(),
          category: 'trend-prediction',
          title: `${currency} Trend Prediction`,
          content: analysisData.trendPrediction || 'Trend prediction not available',
          timestamp,
          currency
        }
      ],
      nextUpdateTime: nextUpdateTime.toISOString()
    };
  } catch (error) {
    console.error('[Live News API] Error generating news analysis:', error);
    return generateMockAnalysis(headlines);
  }
}

// Helper function to get full currency name
function getCurrencyFullName(currency: string): string {
  const currencyNames: { [key: string]: string } = {
    'XAU': 'Gold',
    'USD': 'US Dollar',
    'EUR': 'Euro',
    'GBP': 'British Pound',
    'JPY': 'Japanese Yen'
  };
  return currencyNames[currency] || currency;
}

// Generate mock analysis for development or if OpenAI fails
function generateMockAnalysis(headlines: string[]): AnalysisResponse {
  const timestamp = new Date().toISOString();
  const nextUpdateTime = new Date(Date.now() + 15 * 60 * 1000);
  
  return {
    analyses: [
      {
        id: uuidv4(),
        category: 'summary',
        title: 'Market Summary',
        content: 'Mock market summary data',
        timestamp
      },
      {
        id: uuidv4(),
        category: 'market-impact',
        title: 'Market Impact Analysis',
        content: 'Mock market impact analysis',
        timestamp
      },
      {
        id: uuidv4(),
        category: 'sector-analysis',
        title: 'Sector Analysis',
        content: 'Mock sector analysis',
        timestamp
      },
      {
        id: uuidv4(),
        category: 'trend-prediction',
        title: 'Trend Prediction',
        content: 'Mock trend prediction',
        timestamp
      }
    ],
    nextUpdateTime: nextUpdateTime.toISOString()
  };
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

// Instead of using request.url, we'll support the main currency pairs via staticParams
export async function generateStaticParams() {
  return [
    { currency: 'XAU' },   // Gold
    { currency: 'BTC' },   // Bitcoin
    { currency: 'EUR' },   // Euro
    { currency: 'JPY' },   // Japanese Yen
    { currency: 'GBP' }    // British Pound
  ];
}

// Modified GET function that doesn't use request.url
export async function GET(
  request: Request,
  context: { params: { currency?: string } }
) {
  try {
    console.log('[Live News API] Processing request');
    
    // Get currency from static params or use XAU as default
    // This avoids using request.url which causes the static export bailout
    const currency = context?.params?.currency || 'XAU';
    
    // Read news data
    const { headlines, snippets, lastScrape } = await readNewsData();
    
    // Format headlines
    const formattedHeadlines = formatHeadlines(headlines || [], lastScrape);
    
    // Generate analysis if we have headlines
    const { analyses, nextUpdateTime } = await generateNewsAnalysis(headlines || [], snippets || [], currency);
    
    console.log(`[Live News API] Returning ${formattedHeadlines.length} headlines and ${analyses.length} analyses for ${currency}`);
    
    // Return data
    return NextResponse.json({
      headlines: formattedHeadlines,
      analyses,
      lastUpdated: new Date().toISOString(),
      nextUpdateTime
    });
  } catch (error) {
    console.error('[Live News API] Error in live-news API:', error);
    
    // Generate mock data with the new structure
    const mockData = generateMockAnalysis([]);
    
    // Return error response with fallback mock data
    return NextResponse.json({
      headlines: [],
      analyses: mockData.analyses,
      lastUpdated: new Date().toISOString(),
      nextUpdateTime: mockData.nextUpdateTime,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        note: 'Using fallback data due to error'
      }
    });
  }
} 