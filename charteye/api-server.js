const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.API_PORT || 3001;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Attempt to initialize Firebase services - but don't crash if they fail
let getChartAnalysis = null;
try {
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
    port: port
  });
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

// Start the server with retries
let retries = 5;
const startServer = () => {
  try {
    app.listen(port, () => {
      console.log(`API server running at http://localhost:${port}/`);
    });
  } catch (error) {
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
};

startServer(); 