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

// Helper function to check if API server is running
const checkApiServer = async () => {
  try {
    const response = await fetch(`http://localhost:${apiPort}/api/health`);
    return response.ok;
  } catch (e) {
    return false;
  }
};

// Configure proxy middleware for API requests with error handling
const proxyOptions = {
  target: `http://localhost:${apiPort}`,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api', // No rewrite needed
  },
  logLevel: 'info',  // Changed from debug to reduce log noise
  onError: (err, req, res) => {
    console.error(`Proxy error for ${req.url}:`, err.message);
    
    // Try to serve a static JSON file as fallback (for static export)
    const apiPath = req.url.replace(/^\/api/, '');
    const staticApiPath = path.join(__dirname, staticDir, 'api', apiPath, 'index.json');
    
    if (fs.existsSync(staticApiPath)) {
      console.log(`Serving static API fallback: ${staticApiPath}`);
      try {
        const data = JSON.parse(fs.readFileSync(staticApiPath, 'utf8'));
        res.json(data);
      } catch (readError) {
        console.error(`Error reading static API fallback: ${readError.message}`);
        res.status(502).json({
          error: 'Static API fallback failed',
          message: 'Could not read static API data.',
          static: true,
          timestamp: new Date().toISOString()
        });
      }
    } else {
      // If no static API fallback, return a generic response
      res.status(502).json({
        error: 'API server unavailable',
        message: 'The API server is not responding. The application will continue to function with limited features.',
        path: req.url,
        static: true,
        timestamp: new Date().toISOString()
      });
    }
  }
};

// Setup proxy with retries
let proxySetupAttempts = 0;
const maxProxySetupAttempts = 5;

const setupProxy = () => {
  console.log(`Setting up API proxy to http://localhost:${apiPort} (attempt ${proxySetupAttempts + 1}/${maxProxySetupAttempts})`);
  
  checkApiServer().then(isRunning => {
    if (isRunning) {
      console.log('✅ API server is running. Setting up proxy.');
      // Proxy API requests to the API server
      app.use('/api', createProxyMiddleware(proxyOptions));
      console.log('API proxy successfully configured');
    } else {
      proxySetupAttempts++;
      console.warn(`⚠️ API server not detected at http://localhost:${apiPort}`);
      
      if (proxySetupAttempts < maxProxySetupAttempts) {
        console.log(`Will retry proxy setup in 3 seconds...`);
        setTimeout(setupProxy, 3000);
      } else {
        console.error(`❌ Failed to connect to API server after ${maxProxySetupAttempts} attempts.`);
        console.log('Setting up API proxy anyway, will use static fallbacks when needed');
        app.use('/api', createProxyMiddleware(proxyOptions));
      }
    }
  });
};

// Start the proxy setup process
setupProxy();

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
