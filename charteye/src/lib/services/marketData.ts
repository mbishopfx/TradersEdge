// Market data service to fetch real-time financial information

interface MarketData {
  indices: {
    name: string;
    value: number;
    change: number;
    percentChange: number;
  }[];
  currencies: {
    pair: string;
    rate: number;
    change: number;
    percentChange: number;
  }[];
  commodities: {
    name: string;
    price: number;
    change: number;
    percentChange: number;
  }[];
  rates: {
    name: string;
    value: number;
    change: number;
  }[];
  volatility: {
    name: string;
    value: number;
    change: number;
  }[];
  timestamp: string;
}

// For development and demo purposes, we'll use mock data
// In production, this would be replaced with actual API calls
function generateMockMarketData(): MarketData {
  // Helper function to generate random changes
  const randomChange = (base: number, volatility: number = 0.02) => {
    const change = (Math.random() - 0.5) * 2 * base * volatility;
    return {
      newValue: base + change,
      change,
      percentChange: (change / base) * 100
    };
  };

  // Get current date
  const now = new Date();
  
  // Major indices
  const spBase = 5000 + Math.random() * 200;
  const sp500 = randomChange(spBase);
  
  const nasdaqBase = 16000 + Math.random() * 500;
  const nasdaq = randomChange(nasdaqBase);
  
  const dowBase = 38000 + Math.random() * 1000;
  const dow = randomChange(dowBase);
  
  // Currencies
  const eurusdBase = 1.08 + Math.random() * 0.02;
  const eurusd = randomChange(eurusdBase, 0.01);
  
  const usdjpyBase = 150 + Math.random() * 5;
  const usdjpy = randomChange(usdjpyBase, 0.01);
  
  const gbpusdBase = 1.26 + Math.random() * 0.02;
  const gbpusd = randomChange(gbpusdBase, 0.01);
  
  // Commodities
  const goldBase = 2000 + Math.random() * 100;
  const gold = randomChange(goldBase, 0.015);
  
  const oilBase = 80 + Math.random() * 10;
  const oil = randomChange(oilBase, 0.025);
  
  // Interest rates
  const tenYearBase = 4.2 + (Math.random() - 0.5) * 0.5;
  const tenYear = randomChange(tenYearBase, 0.03);
  
  const twoYearBase = 4.8 + (Math.random() - 0.5) * 0.5;
  const twoYear = randomChange(twoYearBase, 0.03);
  
  // Volatility
  const vixBase = 15 + Math.random() * 10;
  const vix = randomChange(vixBase, 0.05);

  return {
    indices: [
      { name: 'S&P 500', value: sp500.newValue, change: sp500.change, percentChange: sp500.percentChange },
      { name: 'NASDAQ', value: nasdaq.newValue, change: nasdaq.change, percentChange: nasdaq.percentChange },
      { name: 'Dow Jones', value: dow.newValue, change: dow.change, percentChange: dow.percentChange }
    ],
    currencies: [
      { pair: 'EUR/USD', rate: eurusd.newValue, change: eurusd.change, percentChange: eurusd.percentChange },
      { pair: 'USD/JPY', rate: usdjpy.newValue, change: usdjpy.change, percentChange: usdjpy.percentChange },
      { pair: 'GBP/USD', rate: gbpusd.newValue, change: gbpusd.change, percentChange: gbpusd.percentChange }
    ],
    commodities: [
      { name: 'Gold', price: gold.newValue, change: gold.change, percentChange: gold.percentChange },
      { name: 'Crude Oil', price: oil.newValue, change: oil.change, percentChange: oil.percentChange }
    ],
    rates: [
      { name: '10-Year Treasury', value: tenYear.newValue, change: tenYear.change },
      { name: '2-Year Treasury', value: twoYear.newValue, change: twoYear.change }
    ],
    volatility: [
      { name: 'VIX', value: vix.newValue, change: vix.change }
    ],
    timestamp: now.toISOString()
  };
}

// In a production environment, this would connect to an actual financial data API
// such as Alpha Vantage, Finnhub, Yahoo Finance, etc.
export async function fetchMarketData(): Promise<MarketData> {
  // Check for API keys
  if (!process.env.FINANCIAL_API_KEY) {
    console.log('No financial API key found, using mock market data');
    return generateMockMarketData();
  }

  try {
    // This would be replaced with actual API calls in production
    // For example:
    // const response = await fetch(`https://financialapi.com/data?apikey=${process.env.FINANCIAL_API_KEY}`);
    // const data = await response.json();
    // return transformApiResponseToMarketData(data);

    // For now, return mock data
    return generateMockMarketData();
  } catch (error) {
    console.error('Error fetching market data:', error);
    // Fallback to mock data on error
    return generateMockMarketData();
  }
}

// Optional: helper function to get key market variables as a string summary
export function getMarketSummary(data: MarketData): string {
  const formatChange = (change: number, isPercent: boolean = false) => {
    const prefix = change >= 0 ? '+' : '';
    const value = isPercent ? change.toFixed(2) + '%' : change.toFixed(2);
    return `${prefix}${value}`;
  };

  // Select key metrics for summary
  const keyMetrics = [
    `S&P 500: ${data.indices[0].value.toFixed(0)} (${formatChange(data.indices[0].percentChange, true)})`,
    `NASDAQ: ${data.indices[1].value.toFixed(0)} (${formatChange(data.indices[1].percentChange, true)})`,
    `10Y Yield: ${data.rates[0].value.toFixed(2)}% (${formatChange(data.rates[0].change)})`,
    `Gold: $${data.commodities[0].price.toFixed(2)} (${formatChange(data.commodities[0].percentChange, true)})`,
    `Oil: $${data.commodities[1].price.toFixed(2)} (${formatChange(data.commodities[1].percentChange, true)})`,
    `EUR/USD: ${data.currencies[0].rate.toFixed(4)} (${formatChange(data.currencies[0].percentChange, true)})`,
    `VIX: ${data.volatility[0].value.toFixed(2)} (${formatChange(data.volatility[0].change)})`
  ];

  return keyMetrics.join(' | ');
}

// Format market data into a concise context string for AI analysis
export function formatMarketDataForAI(data: MarketData): string {
  const formatDirection = (value: number) => value >= 0 ? 'up' : 'down';
  
  const marketContext = `
Current Market Conditions (as of ${new Date(data.timestamp).toLocaleString()}):

MAJOR INDICES:
- S&P 500: ${data.indices[0].value.toFixed(0)}, ${formatDirection(data.indices[0].change)} ${Math.abs(data.indices[0].percentChange).toFixed(2)}%
- NASDAQ: ${data.indices[1].value.toFixed(0)}, ${formatDirection(data.indices[1].change)} ${Math.abs(data.indices[1].percentChange).toFixed(2)}%
- Dow Jones: ${data.indices[2].value.toFixed(0)}, ${formatDirection(data.indices[2].change)} ${Math.abs(data.indices[2].percentChange).toFixed(2)}%

CURRENCIES:
- EUR/USD: ${data.currencies[0].rate.toFixed(4)}, ${formatDirection(data.currencies[0].change)} ${Math.abs(data.currencies[0].percentChange).toFixed(2)}%
- USD/JPY: ${data.currencies[1].rate.toFixed(2)}, ${formatDirection(data.currencies[1].change)} ${Math.abs(data.currencies[1].percentChange).toFixed(2)}%
- GBP/USD: ${data.currencies[2].rate.toFixed(4)}, ${formatDirection(data.currencies[2].change)} ${Math.abs(data.currencies[2].percentChange).toFixed(2)}%

COMMODITIES:
- Gold: $${data.commodities[0].price.toFixed(2)}, ${formatDirection(data.commodities[0].change)} ${Math.abs(data.commodities[0].percentChange).toFixed(2)}%
- Oil (WTI): $${data.commodities[1].price.toFixed(2)}, ${formatDirection(data.commodities[1].change)} ${Math.abs(data.commodities[1].percentChange).toFixed(2)}%

BONDS & VOLATILITY:
- 10-Year Treasury Yield: ${data.rates[0].value.toFixed(2)}%, ${formatDirection(data.rates[0].change)} ${Math.abs(data.rates[0].change).toFixed(2)}
- 2-Year Treasury Yield: ${data.rates[1].value.toFixed(2)}%, ${formatDirection(data.rates[1].change)} ${Math.abs(data.rates[1].change).toFixed(2)}
- VIX Volatility Index: ${data.volatility[0].value.toFixed(2)}, ${formatDirection(data.volatility[0].change)} ${Math.abs(data.volatility[0].change).toFixed(2)}
`;

  return marketContext;
} 