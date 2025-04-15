const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
let port = process.env.API_PORT || 3001;
const MAX_PORT = port + 10; // Try up to 10 ports if needed

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
        console.log('Firebase Admin initialized with service account file');
      } else {
        // Try to use environment variables
        const projectId = process.env.FIREBASE_PROJECT_ID || 'charteye-5be44';
        admin.initializeApp({
          projectId: projectId,
          storageBucket: `${projectId}.appspot.com`
        });
        console.log('Firebase Admin initialized with project ID:', projectId);
      }
    } catch (initError) {
      console.error('Failed to initialize Firebase Admin:', initError);
    }
  }
  firebaseAdmin = admin;
  
  // Load Firebase client services
  const firebaseServices = require('./src/lib/services/firebase');
  getChartAnalysis = firebaseServices.getChartAnalysis;
  console.log('Firebase services loaded successfully');
} catch (error) {
  console.error('Failed to load Firebase services:', error);
  console.log('API server will use mock data instead');
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
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ error: 'Missing ID token' });
    }
    
    if (!firebaseAdmin) {
      // If Firebase Admin isn't available, return a mock token for development
      console.log('Firebase Admin not available - returning mock auth response');
      return res.json({
        uid: 'mock-user-123',
        email: 'mockuser@example.com',
        displayName: 'Mock User',
        isAuthenticated: true,
        _devMode: true
      });
    }
    
    try {
      // Verify the token
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
      console.log('Authentication successful for user:', decodedToken.uid);
      
      // Return the user data
      res.json({
        uid: decodedToken.uid,
        email: decodedToken.email || '',
        displayName: decodedToken.name || '',
        isAuthenticated: true
      });
    } catch (authError) {
      console.error('Error verifying auth token:', authError);
      res.status(401).json({ error: 'Invalid authentication token' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    port: port,
    server: 'api'
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

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  console.log('API server will continue running');
});

// Start the server with retries
let retries = 5;
const startServer = () => {
  const server = app.listen(port, () => {
    console.log(`✅ API server running at http://localhost:${port}/`);
  }).on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${port} is already in use`);
      
      // Try the next port if available
      if (port < MAX_PORT) {
        port++;
        console.log(`Attempting to use port ${port} instead...`);
        startServer();
      } else if (retries > 0) {
        // If we've exhausted our port range, wait and retry
        retries--;
        console.log(`All ports in range are busy. Retrying in 3 seconds... (${retries} attempts left)`);
        setTimeout(startServer, 3000);
      } else {
        console.error('Maximum retries exceeded. API server failed to start.');
        console.error('Please free up port in range', process.env.API_PORT || 3001, 'to', MAX_PORT);
        process.exit(1);
      }
    } else {
      console.error(`Failed to start API server on port ${port}:`, error);
      if (retries > 0) {
        retries--;
        console.log(`Retrying in 3 seconds... (${retries} attempts left)`);
        setTimeout(startServer, 3000);
      } else {
        console.error('Maximum retries exceeded. API server failed to start.');
        process.exit(1);
      }
    }
  });
  
  // Graceful shutdown
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
};

startServer(); 