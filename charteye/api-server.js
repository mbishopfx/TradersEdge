const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
let port = process.env.API_PORT || 3001;
const MAX_PORT = port + 10; // Try up to 10 ports if needed

// Enhanced logging for Render deployment
console.log(`[API Server] Starting in ${process.env.NODE_ENV || 'development'} mode`);
console.log(`[API Server] Running on port ${port}`);
console.log(`[API Server] RENDER env: ${process.env.RENDER || 'not set'}`);

// Load environment variables from .env.local if present
try {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    console.log(`Loaded environment variables from ${envPath}`);
  }
} catch (error) {
  console.error('Error loading environment variables:', error);
}

// Enable CORS for all routes
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

// Attempt to initialize Firebase services - but don't crash if they fail
let getChartAnalysis = null;
let firebaseAdmin = null;

try {
  // Initialize Firebase Admin
  const admin = require('firebase-admin');
  if (!admin.apps.length) {
    try {
      // Try to use service account from file
      const serviceAccountPath = path.join(__dirname, 'charteye-5be44-firebase-adminsdk-fbsvc-df22fdb29f.json');
      if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = require(serviceAccountPath);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: 'charteye-5be44.appspot.com'
        });
        console.log('[Firebase] Admin initialized with service account file');
      } else {
        // Try to use environment variables
        console.log('[Firebase] Service account file not found, trying environment variables');
        
        // Check if we have all required environment variables
        const hasEnvVars = process.env.FIREBASE_PROJECT_ID && 
                          process.env.FIREBASE_CLIENT_EMAIL && 
                          process.env.FIREBASE_PRIVATE_KEY;
        
        if (hasEnvVars) {
          // Initialize with environment variables
          const projectId = process.env.FIREBASE_PROJECT_ID;
          
          try {
            // Note: The private key needs to be properly formatted from the environment variable
            const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
            
            admin.initializeApp({
              credential: admin.credential.cert({
                projectId: projectId,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey
              }),
              storageBucket: `${projectId}.appspot.com`
            });
            console.log('[Firebase] Admin initialized with environment variables');
          } catch (pkError) {
            console.error('[Firebase] Error with private key formatting:', pkError.message);
            
            // Fallback to simple project ID initialization
            admin.initializeApp({
              projectId: projectId,
              storageBucket: `${projectId}.appspot.com`
            });
            console.log('[Firebase] Admin initialized with project ID only (limited functionality)');
          }
        } else {
          // Last resort - initialize with just the project id
          const projectId = process.env.FIREBASE_PROJECT_ID || 'charteye-5be44';
          admin.initializeApp({
            projectId: projectId,
            storageBucket: `${projectId}.appspot.com`
          });
          console.log('[Firebase] Admin initialized with project ID:', projectId);
        }
      }
    } catch (initError) {
      console.error('[Firebase] Failed to initialize Firebase Admin:', initError);
    }
  }
  firebaseAdmin = admin;
  
  // Load Firebase client services
  try {
    const firebaseServices = require('./src/lib/services/firebase');
    getChartAnalysis = firebaseServices.getChartAnalysis;
    console.log('[Firebase] Client services loaded successfully');
  } catch (serviceError) {
    console.error('[Firebase] Failed to load Firebase client services:', serviceError);
  }
} catch (error) {
  console.error('[Firebase] Main initialization error:', error);
  console.log('[Firebase] API server will use mock data instead');
}

// Mock data for development or when Firebase is unavailable
const getMockAnalysis = (id) => {
  return {
    id,
    imageUrl: 'https://placehold.co/800x600?text=Chart+Example',
    analysis: 'This is a fallback chart analysis used for static exports. In production with Firebase, this would show the actual analysis stored in Firestore.',
    grading: {
      patternClarity: 7.5,
      trendAlignment: 7.5,
      riskReward: 7.5,
      volumeConfirmation: 7.5,
      keyLevelProximity: 7.5,
      overallGrade: 7.5
    },
    createdAt: new Date().toISOString()
  };
};

// Handle authentication
app.post('/api/auth/token', async (req, res) => {
  try {
    console.log('[API Auth] Received token request');
    
    // Check if the request body exists
    if (!req.body) {
      console.error('[API Auth] Missing request body');
      return res.status(400).json({ 
        error: 'Missing request body', 
        success: false 
      });
    }
    
    const { idToken } = req.body;
    
    // Validate the token
    if (!idToken) {
      console.error('[API Auth] Missing ID token in request body');
      return res.status(400).json({ 
        error: 'Missing ID token', 
        success: false 
      });
    }
    
    console.log('[API Auth] Token received, length:', idToken.length);
    
    if (!firebaseAdmin) {
      // If Firebase Admin isn't available, return a mock token for development
      console.log('[API Auth] Firebase Admin not available - returning mock auth response');
      return res.json({
        uid: 'mock-user-123',
        email: 'mockuser@example.com',
        displayName: 'Mock User',
        isAuthenticated: true,
        _devMode: true,
        success: true
      });
    }
    
    try {
      // Verify the token
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
      console.log('[API Auth] Authentication successful for user:', decodedToken.uid);
      
      // Return the user data
      res.json({
        uid: decodedToken.uid,
        email: decodedToken.email || '',
        displayName: decodedToken.name || decodedToken.displayName || '',
        isAuthenticated: true,
        success: true
      });
    } catch (authError) {
      console.error('[API Auth] Error verifying auth token:', authError);
      res.status(401).json({ 
        error: 'Invalid authentication token',
        message: authError.message || 'Token validation failed',
        success: false 
      });
    }
  } catch (error) {
    console.error('[API Auth] General auth error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message || 'Unknown error processing authentication request',
      success: false 
    });
  }
});

// Handle anonymous authentication
app.post('/api/auth/anonymous', async (req, res) => {
  try {
    console.log('[API Auth] Anonymous auth request received');
    
    // Generate a random user ID for anonymous users
    const anonymousId = 'anon-' + Math.random().toString(36).substring(2, 15);
    
    // Return mock user data
    res.json({
      uid: anonymousId,
      email: null,
      displayName: 'Guest User',
      isAnonymous: true,
      success: true,
      _devMode: true
    });
    
    console.log('[API Auth] Created anonymous user with ID:', anonymousId);
  } catch (error) {
    console.error('[API Auth] Error creating anonymous user:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message || 'Failed to create anonymous user',
      success: false 
    });
  }
});

// API Routes
app.get('/api/analysis/:id/public', async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Fetching analysis for ID: ${id}`);
    
    let analysis = null;
    
    // Try to get data from Firebase if available
    if (getChartAnalysis) {
      try {
        analysis = await getChartAnalysis(id);
      } catch (fbError) {
        console.error('Error fetching from Firebase:', fbError);
        // Fall back to mock data
      }
    }
    
    // Use mock data if Firebase fetch failed or isn't available
    if (!analysis) {
      console.log(`Using mock analysis for ID: ${id}`);
      analysis = getMockAnalysis(id);
    }
    
    // Remove sensitive information if it exists
    const { userId, ...publicAnalysis } = analysis;
    console.log(`Successfully prepared analysis for ID: ${id}`);
    
    res.json(publicAnalysis);
  } catch (error) {
    console.error('Error in /api/analysis/:id/public:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint - Make it the first route for reliability
app.get('/api/health', (req, res) => {
  // Send a detailed response for health checks
  const startTime = process.uptime();
  const uptimeHours = Math.floor(startTime / 3600);
  const uptimeMinutes = Math.floor((startTime % 3600) / 60);
  const uptimeSeconds = Math.floor(startTime % 60);
  
  const memoryUsage = process.memoryUsage();
  
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: port,
    server: 'api',
    firebaseAvailable: !!firebaseAdmin,
    firebaseFunctions: {
      getChartAnalysis: !!getChartAnalysis
    },
    uptime: {
      seconds: startTime,
      formatted: `${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s`
    },
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`
    },
    render: process.env.RENDER === 'true'
  });
});

// User analyses endpoint
app.get('/api/user/analyses', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let userId = 'dev-user-123';
    let isAuthenticated = false;
    
    if (authHeader && authHeader.startsWith('Bearer ') && firebaseAdmin) {
      try {
        // Verify the token
        const token = authHeader.substring(7);
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
        userId = decodedToken.uid;
        isAuthenticated = true;
      } catch (authError) {
        console.error('Authentication error:', authError);
        // In development mode, we'll continue with the default userId
        if (process.env.NODE_ENV === 'production') {
          return res.status(401).json({ error: 'Invalid authentication token' });
        }
      }
    } else if (process.env.NODE_ENV === 'production') {
      // In production, require authentication
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Return mock analyses for the user
    res.json({
      analyses: [
        {
          id: 'sample-1',
          title: 'Sample Analysis 1',
          createdAt: new Date().toISOString(),
          imageUrl: 'https://placehold.co/800x600?text=Sample+1'
        },
        {
          id: 'sample-2',
          title: 'Sample Analysis 2',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          imageUrl: 'https://placehold.co/800x600?text=Sample+2'
        }
      ],
      userId,
      isAuthenticated
    });
  } catch (error) {
    console.error('Error in /api/user/analyses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generic routes for static build
app.all('/api/*', (req, res) => {
  // This is a catch-all for API routes in static export
  console.log(`Handling static API request for: ${req.path}`);
  res.json({ 
    message: "This is a static API response", 
    path: req.path,
    method: req.method,
    note: "This API route is pre-rendered for static export"
  });
});

// Add routes for each major section to prevent 502 errors
app.get('/api/trading-insights', (req, res) => {
  console.log('Handling trading-insights request');
  res.json({
    insights: [
      {
        id: 'insight-1',
        title: 'Market Overview',
        content: 'Markets are showing mixed signals with tech stocks leading gains.',
        timestamp: new Date().toISOString()
      },
      {
        id: 'insight-2',
        title: 'Sector Rotation',
        content: 'Capital is flowing from defensive to growth sectors.',
        timestamp: new Date(Date.now() - 86400000).toISOString()
      }
    ],
    success: true
  });
});

app.get('/api/portfolio-analysis', (req, res) => {
  console.log('Handling portfolio-analysis request');
  res.json({
    portfolioStats: {
      totalValue: 125000,
      dailyChange: 1.2,
      riskScore: 65,
      diversificationScore: 72
    },
    holdings: [
      { symbol: 'AAPL', weight: 15.2, performance: 3.4 },
      { symbol: 'MSFT', weight: 12.5, performance: 2.1 },
      { symbol: 'AMZN', weight: 8.7, performance: -1.2 }
    ],
    recommendations: [
      'Consider reducing technology exposure',
      'Add more defensive assets for balance'
    ],
    success: true
  });
});

app.get('/api/risk-analysis', (req, res) => {
  console.log('Handling risk-analysis request');
  res.json({
    riskMetrics: {
      volatility: 18.5,
      maxDrawdown: 12.3,
      sharpeRatio: 1.2,
      sortinoRatio: 1.5
    },
    riskFactors: [
      { factor: 'Market Risk', exposure: 'High', impact: 'Significant' },
      { factor: 'Interest Rate Risk', exposure: 'Medium', impact: 'Moderate' },
      { factor: 'Sector Concentration', exposure: 'High', impact: 'Significant' }
    ],
    recommendations: [
      'Increase position sizing controls',
      'Consider hedging market exposure'
    ],
    success: true
  });
});

app.get('/api/trading-journal', (req, res) => {
  console.log('Handling trading-journal request');
  res.json({
    entries: [
      {
        id: 'entry-1',
        date: new Date().toISOString(),
        trade: { symbol: 'AAPL', direction: 'Long', entry: 170.25, exit: 175.50 },
        notes: 'Followed the trend, waited for pullback to EMA.',
        result: 'Win'
      },
      {
        id: 'entry-2',
        date: new Date(Date.now() - 86400000).toISOString(),
        trade: { symbol: 'MSFT', direction: 'Short', entry: 320.75, exit: 315.25 },
        notes: 'Technical breakdown from resistance.',
        result: 'Win'
      }
    ],
    stats: {
      winRate: 65,
      profitFactor: 1.8,
      averageWin: 2.1,
      averageLoss: 1.2
    },
    success: true
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  console.log('API server will continue running');
});

// Look for startServer function and replace with an improved version
const startServer = () => {
  // Create server with resilient error handling
  const server = app.listen(port, () => {
    console.log(`✅ API server running at http://localhost:${port}/`);
    console.log(`${new Date().toISOString()} - API Server started successfully`);
    
    // Create a marker file to indicate server is running - useful for monitoring
    try {
      fs.writeFileSync('logs/api-running.txt', new Date().toISOString());
    } catch (err) {
      console.warn('Could not write server marker file:', err.message);
    }
  }).on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${port} is already in use`);
      if (port < MAX_PORT) {
        port++;
        console.log(`Attempting to use port ${port} instead...`);
        setTimeout(startServer, 1000);
      } else {
        console.error(`❌ Exceeded maximum port attempts (${MAX_PORT})`);
        process.exit(1);
      }
    } else {
      console.error(`❌ Failed to start server:`, error);
      process.exit(1);
    }
  });

  // Graceful shutdown handler
  const gracefulShutdown = () => {
    console.log('Received shutdown signal. Closing API server gracefully...');
    server.close(() => {
      console.log('API server closed');
      process.exit(0);
    });
    
    // Force close if it takes too long
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  // Listen for termination signals
  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
  
  return server;
};

// Start the server
startServer();

// Export the app for testing
module.exports = app; 