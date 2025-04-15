const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Using native fetch API in newer Node versions
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
let port = process.env.PORT || 10000;
const API_PORT = process.env.API_PORT || 3001;
// Improved API URL determination for Render deployment
const API_URL = process.env.API_URL || 
                (process.env.RENDER && process.env.RENDER_SERVICE_ID 
                  ? `http://localhost:${API_PORT}` 
                  : `http://localhost:${API_PORT}`);

console.log(`[Config] Static server configured with API_URL: ${API_URL}`);
console.log(`[Config] Running in environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`[Config] RENDER env: ${process.env.RENDER || 'not set'}`);

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

// Ensure news-data directory exists
const newsDataDir = process.env.NEWS_DATA_DIR || path.join(__dirname, 'news-data');
try {
  if (!fs.existsSync(newsDataDir)) {
    console.log(`Creating news-data directory at ${newsDataDir}`);
    fs.mkdirSync(newsDataDir, { recursive: true });
  }
} catch (err) {
  console.error(`Error creating news-data directory: ${err.message}`);
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

// Local fallback middleware for when API server is unavailable
const handleApiFallback = (req, res, reason) => {
  console.log(`[API Fallback] Using fallback for ${req.path} (Reason: ${reason})`);
  
  // Special handling for specific endpoints
  if (req.path === '/api/health') {
    return res.json({
      status: 'ok',
      fallback: true,
      timestamp: new Date().toISOString(),
      message: 'Static server fallback response'
    });
  }
  
  // Handle auth token requests
  if (req.path === '/api/auth/token') {
    return res.json({
      uid: 'fallback-user',
      email: 'fallback@example.com',
      displayName: 'Fallback User',
      isAuthenticated: true,
      success: true,
      _fallback: true
    });
  }
  
  // Handle anonymous auth
  if (req.path === '/api/auth/anonymous') {
    const anonymousId = 'anon-' + Math.random().toString(36).substring(2, 15);
    return res.json({
      uid: anonymousId,
      email: null,
      displayName: 'Guest User (Fallback)',
      isAnonymous: true,
      success: true,
      _fallback: true
    });
  }
  
  // Handle live news requests
  if (req.path === '/api/live-news') {
    const currency = req.query.currency || 'XAU';
    console.log(`[API Fallback] Live news request for ${currency}`);
    
    return res.json({
      analyses: [
        {
          id: `news-summary-${Date.now()}`,
          category: 'summary',
          title: `${currency} Market Summary`,
          content: `${currency} markets are experiencing normal volatility. This is fallback data from the static server.`,
          timestamp: new Date().toISOString(),
          currency
        },
        {
          id: `market-impact-${Date.now()}`,
          category: 'market-impact',
          title: `${currency} Market Impact Analysis`,
          content: `Economic indicators suggest moderate impact on ${currency}. This is fallback data.`,
          timestamp: new Date().toISOString(),
          currency
        },
        {
          id: `sector-analysis-${Date.now()}`,
          category: 'sector-analysis',
          title: `${currency} Sector Analysis`,
          content: `The ${currency} sector shows resilience in current market conditions. This is fallback data.`,
          timestamp: new Date().toISOString(),
          currency
        },
        {
          id: `trend-prediction-${Date.now()}`,
          category: 'trend-prediction',
          title: `${currency} Trend Prediction`,
          content: `Technical analysis suggests ${currency} may continue its current pattern. This is fallback data.`,
          timestamp: new Date().toISOString(),
          currency
        }
      ],
      nextUpdateTime: new Date(Date.now() + 15 * 60000).toISOString(),
      currency,
      _fallback: true
    });
  }
  
  // Handle user analyses requests
  if (req.path === '/api/user/analyses') {
    return res.json({
      analyses: Array.from({ length: 3 }, (_, i) => ({
        id: `fallback-analysis-${i+1}`,
        title: `Fallback Analysis ${i+1}`,
        summary: 'This is fallback analysis data from the static server.',
        imageUrl: `https://placehold.co/800x600?text=Fallback+Chart+${i+1}`,
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
        isPublic: true,
        _fallback: true
      })),
      totalCount: 3,
      hasMore: false,
      _fallback: true
    });
  }
  
  // Handle analysis requests
  if (req.path.startsWith('/api/analysis/')) {
    const id = req.path.split('/').pop();
    return res.json({
      id: id || 'fallback-id',
      title: 'Fallback Chart Analysis',
      imageUrl: 'https://placehold.co/800x600?text=Fallback+Chart',
      analysis: 'This is fallback analysis text provided by the static server when the API server is unavailable.',
      grading: {
        patternClarity: 7.0,
        trendAlignment: 7.5,
        riskReward: 8.0,
        volumeConfirmation: 6.5,
        keyLevelProximity: 7.5,
        overallGrade: 7.3
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _fallback: true
    });
  }
  
  // General fallback for API routes
  res.json({
    success: true,
    fallback: true,
    message: 'API fallback response',
    path: req.path,
    note: 'The API server is unavailable. Using static fallback data.',
    timestamp: new Date().toISOString()
  });
};

// Set up proxy for API routes to forward to the API server
const apiProxy = createProxyMiddleware({
  target: API_URL,
  changeOrigin: true,
  pathRewrite: { '^/api': '/api' },
  timeout: 5000, // 5 second timeout for API requests
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
    if (req.url.includes('/auth/')) {
      let responseBody = '';
      
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
    console.error('[Proxy Error]', err.message);
    
    // Use our fallback handler
    handleApiFallback(req, res, `Proxy Error: ${err.message}`);
  }
});

// Check API server availability before each request
app.use('/api', (req, res, next) => {
  // Skip health check for certain paths to avoid loops
  if (req.path === '/health') {
    return next();
  }
  
  // For authentication endpoints, always forward the request rather than health-checking first
  if (req.path.includes('/auth/')) {
    console.log(`[API Forward] Directly forwarding auth request to API server: ${req.path}`);
    return next();
  }
  
  // On Render, we want to be more lenient with API checks but still provide fallbacks if needed
  if (process.env.RENDER) {
    console.log(`[API Check] Running on Render for ${req.path}`);
    
    // Use a quick timeout to avoid slowing down the response
    const timeoutMs = 1000; // Just 1 second timeout on Render
    
    // Use node-fetch with proper timeout handling
    const fetchOptions = { 
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    };
    
    // Create a timeout promise with increased timeout for Render
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Health check timeout')), timeoutMs);
    });
    
    // Race the fetch against the timeout
    Promise.race([
      fetch(`${API_URL}/api/health`, fetchOptions),
      timeoutPromise
    ])
    .then(response => {
      if (response.ok) {
        console.log('[API Check] API server is available on Render');
        next(); // Proceed to the proxy
      } else {
        console.warn(`[API Check] API server returned status ${response.status} on Render`);
        handleApiFallback(req, res, `API Health check failed with status ${response.status}`);
      }
    })
    .catch(error => {
      console.error('[API Check] Quick timeout for API on Render:', error.message);
      handleApiFallback(req, res, `Quick connection error: ${error.message}`);
    });
    
    return;
  }
  
  // For non-Render environments, use the original logic with a longer timeout
  // Try to connect to the API server's health endpoint
  const apiCheckUrl = `${API_URL}/api/health`;
  console.log(`[API Check] Checking API availability at ${apiCheckUrl}`);
  
  // Use node-fetch with proper timeout handling
  const fetchOptions = { 
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  };
  
  // Create a timeout promise with increased timeout for Render
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Health check timeout')), 5000); // Increased from 2000ms
  });
  
  // Race the fetch against the timeout
  Promise.race([
    fetch(apiCheckUrl, fetchOptions),
    timeoutPromise
  ])
  .then(response => {
    if (response.ok) {
      console.log('[API Check] API server is available');
      next(); // Proceed to the proxy
    } else {
      console.warn(`[API Check] API server returned status ${response.status}`);
      handleApiFallback(req, res, `API Health check failed with status ${response.status}`);
    }
  })
  .catch(error => {
    console.error('[API Check] Error checking API availability:', error.message);
    handleApiFallback(req, res, `Connection error: ${error.message}`);
  });
});

// Apply the proxy middleware
app.use('/api', apiProxy);

// Serve static files from the 'out' directory
app.use(express.static(staticDir, {
  maxAge: '1h', // Cache static assets for 1 hour
  etag: true,
  index: false // Don't serve index.html for directory requests
}));

// Health check endpoint
app.get('/health', (req, res) => {
  // Capture memory and uptime stats
  const startTime = process.uptime();
  const uptimeHours = Math.floor(startTime / 3600);
  const uptimeMinutes = Math.floor((startTime % 3600) / 60);
  const uptimeSeconds = Math.floor(startTime % 60);
  
  const memoryUsage = process.memoryUsage();
  
  // Check API server status
  const apiCheckUrl = `${API_URL}/api/health`;
  let apiServerStatus = 'checking';
  
  // Build the response
  const response = { 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port,
    server: 'static',
    build_info: {
      render: process.env.RENDER === 'true',
      render_service_id: process.env.RENDER_SERVICE_ID || 'local',
      fallback_enabled: USE_FALLBACK ? 'true' : 'false',
      api_debug: API_DEBUG ? 'true' : 'false'
    },
    apiServer: {
      url: API_URL,
      status: apiServerStatus
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
    static_dir: staticDir,
    news_data_dir: NEWS_DATA_DIR,
    directories: {
      exists: fs.existsSync(staticDir),
      content: fs.existsSync(staticDir) ? fs.readdirSync(staticDir).slice(0, 10) : [],
      news_data_exists: fs.existsSync(NEWS_DATA_DIR),
      news_data_content: fs.existsSync(NEWS_DATA_DIR) ? fs.readdirSync(NEWS_DATA_DIR) : []
    }
  };
  
  // Send response immediately without waiting for API check
  res.json(response);
  
  // Log but don't block on API check
  setTimeout(() => {
    fetch(`${API_URL}/api/health`, { 
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    })
    .then(response => {
      console.log(`[Health] API server health check: ${response.ok ? 'OK' : 'Error'}`);
    })
    .catch(err => {
      console.log(`[Health] API server unreachable: ${err.message}`);
    });
  }, 10);
});

// Special diagnostic endpoint
app.get('/diagnostic', (req, res) => {
  const response = {
    time: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    render: process.env.RENDER === 'true',
    directories: {
      current: process.cwd(),
      static: staticDir,
      news_data: NEWS_DATA_DIR
    },
    files: {
      static_exists: fs.existsSync(staticDir),
      static_files: fs.existsSync(staticDir) ? fs.readdirSync(staticDir).slice(0, 20) : [],
      news_data_exists: fs.existsSync(NEWS_DATA_DIR),
      news_data_files: fs.existsSync(NEWS_DATA_DIR) ? fs.readdirSync(NEWS_DATA_DIR) : []
    },
    environment_variables: Object.keys(process.env)
      .filter(key => !key.includes('KEY') && !key.includes('SECRET') && !key.includes('TOKEN') && !key.includes('PASSWORD'))
      .reduce((obj, key) => {
        obj[key] = process.env[key];
        return obj;
      }, {})
  };
  
  res.json(response);
});

// Handle all routes for single page application
// This will redirect all routes to index.html
app.get('*', (req, res, next) => {
  // Skip API routes (already handled by proxy)
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  // Check if the requested file exists with exact path
  const filePath = path.join(staticDir, req.path);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return res.sendFile(filePath);
  }
  
  // For HTML routes, try to find exact HTML file
  // This helps with static routes like /about.html
  if (!req.path.endsWith('.html') && !req.path.endsWith('/')) {
    const htmlPath = path.join(staticDir, `${req.path}.html`);
    if (fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) {
      return res.sendFile(htmlPath);
    }
  }
  
  // Check for index.html in directory
  if (req.path.endsWith('/')) {
    const indexPath = path.join(staticDir, req.path, 'index.html');
    if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
      return res.sendFile(indexPath);
    }
  }
  
  // Check for directory with index.html
  const dirIndexPath = path.join(staticDir, req.path, 'index.html');
  if (fs.existsSync(dirIndexPath) && fs.statSync(dirIndexPath).isFile()) {
    return res.sendFile(dirIndexPath);
  }
  
  // For SPA routes like /about, /profile etc., serve the index.html
  console.log(`Route ${req.path} not found as a file, serving index.html instead`);
  const indexPath = path.join(staticDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  
  // If even the index.html doesn't exist, return a 404
  res.status(404).send('File not found');
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
