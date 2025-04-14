const express = require('express');
const cors = require('cors');
const { getChartAnalysis } = require('./src/lib/services/firebase');

const app = express();
const port = process.env.API_PORT || 3001;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// API Routes
app.get('/api/analysis/:id/public', async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Fetching analysis for ID: ${id}`);
    
    const analysis = await getChartAnalysis(id);
    
    if (!analysis) {
      console.log(`Analysis not found for ID: ${id}`);
      return res.status(404).json({ error: 'Analysis not found' });
    }
    
    // Remove sensitive information
    const { userId, ...publicAnalysis } = analysis;
    console.log(`Successfully fetched analysis for ID: ${id}`);
    res.json(publicAnalysis);
  } catch (error) {
    console.error('Error fetching analysis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}/`);
}); 