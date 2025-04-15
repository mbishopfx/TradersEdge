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

// Parse JSON BEFORE the proxy middleware
app.use(express.json());

// Path to the static files (Next.js export output)
const staticDir = path.join(__dirname, 'out');

// Set up a special middleware for auth token endpoint with additional debugging
app.use('/api/auth/token', (req, res, next) => {
  console.log('[Auth Debug] Auth token request received');
  console.log('[Auth Debug] Method:', req.method);
  console.log('[Auth Debug] Headers:', JSON.stringify(req.headers));
  if (req.body) {
    console.log('[Auth Debug] Body (partial):', JSON.stringify({
      ...req.body,
      idToken: req.body.idToken ? '***REDACTED***' : undefined
    }));
  }
  next();
});

// Set up proxy for API routes to forward to the API server
app.use('/api', createProxyMiddleware({
  target: API_URL,
  changeOrigin: true,
  pathRewrite: { '^/api': '/api' },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] ${req.method} ${req.url} -> ${API_URL}${req.url}`);
    
    // If the body-parser middleware has already parsed the body, we need to rewrite it
    if (req.body && Object.keys(req.body).length > 0) {
      const bodyData = JSON.stringify(req.body);
      // Update content-length header
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      // Write body to request
      proxyReq.write(bodyData);
      proxyReq.end();
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    // Log the status code of the proxied response
    console.log(`[Proxy Response] ${req.method} ${req.url} -> Status: ${proxyRes.statusCode}`);
    
    // Special handling for auth endpoint
    if (req.url.includes('/auth/token')) {
      let responseBody = '';
      const originalWrite = res.write;
      const originalEnd = res.end;
      
      // Capture the response body
      proxyRes.on('data', (chunk) => {
        responseBody += chunk.toString('utf8');
      });
      
      // Log response when it completes
      proxyRes.on('end', () => {
        try {
          const parsedBody = JSON.parse(responseBody);
          console.log('[Auth Debug] Response status:', proxyRes.statusCode);
          console.log('[Auth Debug] Response (sanitized):', {
            ...parsedBody,
            uid: parsedBody.uid ? '***REDACTED***' : undefined,
            email: parsedBody.email ? '***REDACTED***' : undefined
          });
        } catch (e) {
          console.log('[Auth Debug] Could not parse response body');
        }
      });
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
  console.log(`✅ API requests will be proxied to ${API_URL}`);
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
