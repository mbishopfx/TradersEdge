const express = require('express');
const path = require('path');
const fs = require('fs');
const { getChartAnalysis } = require('./src/lib/services/firebase');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'out' directory
app.use(express.static(path.join(__dirname, 'out')));

// Handle API routes
app.get('/api/analysis/:id/public', async (req, res) => {
  try {
    const id = req.params.id;
    const analysis = await getChartAnalysis(id);
    
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    
    // Remove sensitive information
    const { userId, ...publicAnalysis } = analysis;
    res.json(publicAnalysis);
  } catch (error) {
    console.error('Error fetching analysis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'out', 'index.html'));
});

app.listen(port, () => {
  console.log(`Static server running at http://localhost:${port}/`);
  console.log(`Serving files from ${path.join(__dirname, 'out')}`);
});
