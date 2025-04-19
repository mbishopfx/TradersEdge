const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Pre-trained responses for common trading scenarios
const tradingResponses = {
  patterns: {
    'double top': 'A double top pattern suggests a potential reversal from an uptrend to a downtrend. Key levels to watch are the neckline and previous support levels.',
    'double bottom': 'A double bottom pattern indicates a potential reversal from a downtrend to an uptrend. Watch for confirmation with volume and break above the neckline.',
    'head and shoulders': 'The head and shoulders pattern is a bearish reversal pattern. The neckline acts as key support, and a break below it often leads to further downside.',
    'triangle': 'Triangle patterns can be either continuation or reversal patterns. Watch for breakout direction and volume confirmation for validity.'
  },
  indicators: {
    'rsi': 'RSI above 70 indicates overbought conditions, while below 30 indicates oversold. Divergences can signal potential reversals.',
    'macd': 'MACD crossovers and divergences can signal trend changes. Watch for histogram expansion for momentum confirmation.',
    'moving averages': 'Moving averages help identify trends. The 200 SMA is often used for long-term trend direction, while shorter MAs like 20 and 50 help with shorter-term trends.'
  },
  general: {
    'support': 'Support levels are price levels where buying pressure may overcome selling pressure. They often form at previous lows or consolidation areas.',
    'resistance': 'Resistance levels are price levels where selling pressure may overcome buying pressure. They often form at previous highs or consolidation areas.',
    'volume': 'Volume confirmation is crucial for validating price movements. Higher volume on breakouts increases the reliability of the move.',
    'trend': 'Trends can be identified using higher highs and higher lows (uptrend) or lower highs and lower lows (downtrend). Moving averages can help confirm trend direction.'
  }
};

exports.getTradingChatResponse = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const { message } = data;
  if (!message) {
    throw new functions.https.HttpsError('invalid-argument', 'Message is required.');
  }

  // Convert message to lowercase for matching
  const lowerMessage = message.toLowerCase();

  // Check for pattern mentions
  for (const [pattern, response] of Object.entries(tradingResponses.patterns)) {
    if (lowerMessage.includes(pattern)) {
      return { response, type: 'pattern' };
    }
  }

  // Check for indicator mentions
  for (const [indicator, response] of Object.entries(tradingResponses.indicators)) {
    if (lowerMessage.includes(indicator)) {
      return { response, type: 'indicator' };
    }
  }

  // Check for general trading concepts
  for (const [concept, response] of Object.entries(tradingResponses.general)) {
    if (lowerMessage.includes(concept)) {
      return { response, type: 'general' };
    }
  }

  // Default response if no specific match is found
  return {
    response: "I can help you with technical analysis patterns, indicators, and general trading concepts. What specific aspect would you like to learn more about?",
    type: 'general'
  };
}); 