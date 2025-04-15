const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
let port = process.env.PORT || 10000;
const API_PORT = process.env.API_PORT || 3001;
const API_URL = process.env.API_URL || `http://localhost:${API_PORT}`;

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

// CORS configuration
app.use(cors());

// Path to the static files (Next.js export output)
const staticDir = path.join(__dirname, 'out');

// Set up proxy for API routes to forward to the API server
app.use('/api', createProxyMiddleware({
  target: API_URL,
  changeOrigin: true,
  pathRewrite: { '^/api': '/api' },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] ${req.method} ${req.url} -> ${API_URL}${req.url}`);
    
    // Add content-length header for POST requests with a body
    if (req.method === 'POST' && req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onError: (err, req, res) => {
    console.error('[Proxy Error]', err);
    res.status(500).json({ 
      error: 'Proxy Error', 
      message: 'Failed to connect to API server',
      path: req.url
    });
  }
}));

// Parse JSON before the proxy middleware
app.use(express.json());

// Serve static files from the 'out' directory
app.use(express.static(staticDir, {
  maxAge: '1h', // Cache static assets for 1 hour
  etag: true,
  index: false // Don't serve index.html for directory requests
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    port,
    server: 'static'
  });
});

// Handle all routes for single page application
// This will redirect all routes to index.html
app.get('*', (req, res, next) => {
  // Skip API routes (already handled by proxy)
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  // Check if the requested file exists
  const filePath = path.join(staticDir, req.path);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return res.sendFile(filePath);
  }
  
  // For routes like /about, /profile etc., serve the index.html
  console.log(`Route ${req.path} not found, serving index.html instead`);
  res.sendFile(path.join(staticDir, 'index.html'));
});

// Start the server
const server = app.listen(port, () => {
  console.log(`✅ Static server running at http://localhost:${port}/`);
}).on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${port} is already in use`);
    port++;
    console.log(`Attempting to use port ${port} instead...`);
    
    app.listen(port, () => {
      console.log(`✅ Static server running at http://localhost:${port}/`);
    }).on('error', (err) => {
      console.error(`❌ Failed to start server on port ${port}:`, err);
      process.exit(1);
    });
  } else {
    console.error(`❌ Failed to start server:`, error);
    process.exit(1);
  }
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('Received shutdown signal. Closing static server gracefully...');
  server.close(() => {
    console.log('Static server closed');
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
