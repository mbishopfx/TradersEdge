const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');
const fs = require('fs');

console.log('=== SERVER STARTUP DIAGNOSTICS ===');
console.log(`Node version: ${process.version}`);
console.log(`Current directory: ${process.cwd()}`);
console.log(`Environment: ${process.env.NODE_ENV}`);

// Load environment variables from .env file if present
try {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    console.log(`Loaded environment variables from ${envPath}`);
  } else {
    console.log(`No .env.local file found at ${envPath}`);
    
    // Try .env as fallback
    const defaultEnvPath = path.join(__dirname, '.env');
    if (fs.existsSync(defaultEnvPath)) {
      require('dotenv').config({ path: defaultEnvPath });
      console.log(`Loaded environment variables from ${defaultEnvPath}`);
    } else {
      console.log(`No .env file found at ${defaultEnvPath}`);
    }
  }
} catch (error) {
  console.error('Error loading environment variables:', error);
}

// Determine if we're in development or production
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

console.log('=== Environment Variables ===');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`PORT: ${port}`);
console.log(`NEWS_DATA_DIR: ${process.env.NEWS_DATA_DIR || 'not set'}`);

// Check if the Next.js app exists
try {
  console.log('Checking for Next.js build output...');
  const buildOutputDir = path.join(__dirname, '.next');
  if (fs.existsSync(buildOutputDir)) {
    console.log(`Found Next.js build output at ${buildOutputDir}`);
    if (fs.existsSync(path.join(buildOutputDir, 'server'))) {
      console.log('Server directory exists in build output');
    } else {
      console.warn('Warning: Server directory missing in Next.js build output');
    }
  } else {
    console.warn(`Warning: Next.js build output not found at ${buildOutputDir}`);
  }
} catch (error) {
  console.error('Error checking Next.js build output:', error);
}

// Create the Next.js app
console.log('Creating Next.js app instance...');
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Log important environment information
console.log(`Server starting with configuration:
- Environment: ${dev ? 'development' : 'production'}
- Hostname: ${hostname}
- Port: ${port}
- News data directory: ${process.env.NEWS_DATA_DIR || path.join(__dirname, 'news-data')}
`);

// Check news data directory
const newsDataDir = process.env.NEWS_DATA_DIR || path.join(__dirname, 'news-data');
try {
  if (!fs.existsSync(newsDataDir)) {
    console.log(`Creating news data directory at ${newsDataDir}`);
    fs.mkdirSync(newsDataDir, { recursive: true });
  } else {
    console.log(`News data directory exists at ${newsDataDir}`);
    console.log(`Contents: ${fs.readdirSync(newsDataDir).join(', ') || 'empty'}`);
  }
} catch (error) {
  console.error(`Error with news data directory: ${error.message}`);
}

// Initialize and start the server
console.log('Preparing Next.js app...');
app.prepare()
  .then(() => {
    console.log('Next.js app prepared successfully');
    
    const server = createServer(async (req, res) => {
      try {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query string
        const parsedUrl = parse(req.url, true);
        
        // Add a health check endpoint
        if (parsedUrl.pathname === '/api/health') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ 
            status: 'ok', 
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
          }));
          return;
        }
        
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error handling request:', err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });
    
    server.once('error', (err) => {
      console.error('Server startup error:', err);
      process.exit(1);
    });
    
    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://${hostname}:${port}`);
    });
  })
  .catch((err) => {
    console.error('Next.js app preparation failed:', err);
    console.error('Stack trace:', err.stack);
    process.exit(1);
  }); 