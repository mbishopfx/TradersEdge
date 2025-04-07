const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env file if present
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    console.log('Loaded environment variables from .env file');
  }
} catch (error) {
  console.error('Error loading environment variables:', error);
}

// Determine if we're in development or production
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Create the Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Log important environment information
console.log(`Server starting with configuration:
- Environment: ${dev ? 'development' : 'production'}
- Hostname: ${hostname}
- Port: ${port}
- News data directory: ${process.env.NEWS_DATA_DIR || path.join(__dirname, 'news-data')}
`);

// Initialize and start the server
app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query string
      const parsedUrl = parse(req.url, true);
      
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
  .once('error', (err) => {
    console.error('Server startup error:', err);
    process.exit(1);
  })
  .listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
})
.catch((err) => {
  console.error('Next.js app preparation failed:', err);
  process.exit(1);
}); 