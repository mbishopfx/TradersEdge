const express = require('express');
const path = require('path');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 10000;
const apiPort = process.env.API_PORT || 3001;

// Determine which output directory to use
let staticDir = 'out';
if (!fs.existsSync(path.join(__dirname, 'out'))) {
  console.log('Output directory "out" not found, checking for .next...');
  if (fs.existsSync(path.join(__dirname, '.next'))) {
    staticDir = '.next';
    console.log('Using .next directory for static files');
  } else {
    console.warn('WARNING: Neither "out" nor ".next" directories found!');
    // Create an empty out directory to prevent errors
    fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });
  }
}

console.log(`Serving static files from ${path.join(__dirname, staticDir)}`);

// Serve static files from the output directory
app.use(express.static(path.join(__dirname, staticDir)));

// Setup health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    server: 'static',
    staticDir,
    port
  });
});

// Configure proxy middleware for API requests with error handling
const proxyOptions = {
  target: `http://localhost:${apiPort}`,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api', // No rewrite needed
  },
  logLevel: 'debug',
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    
    // Try to serve a static JSON file as fallback (for static export)
    const apiPath = req.url.replace(/^\/api/, '');
    const staticApiPath = path.join(__dirname, staticDir, 'api', apiPath, 'index.json');
    
    if (fs.existsSync(staticApiPath)) {
      console.log(`Serving static API fallback: ${staticApiPath}`);
      res.json(JSON.parse(fs.readFileSync(staticApiPath, 'utf8')));
    } else {
      // If no static API fallback, return a generic response
      res.status(502).json({
        error: 'API server unavailable',
        message: 'The API server is not responding. Please try again later.',
        static: true,
        timestamp: new Date().toISOString()
      });
    }
  }
};

// Proxy API requests to the API server
app.use('/api', createProxyMiddleware(proxyOptions));

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, staticDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application is not built properly. Index file not found.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Static server running at http://localhost:${port}/`);
  console.log(`Serving files from ${path.join(__dirname, staticDir)}`);
  console.log(`API requests will be proxied to http://localhost:${apiPort}`);
});
