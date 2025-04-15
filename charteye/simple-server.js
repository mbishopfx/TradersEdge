const express = require('express');
const path = require('path');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 3000;
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

// Proxy API requests to the API server
app.use('/api', createProxyMiddleware({
  target: `http://localhost:${apiPort}`,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api', // No rewrite needed
  },
  logLevel: 'debug',
}));

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, staticDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application is not built properly. Index file not found.');
  }
});

app.listen(port, () => {
  console.log(`Static server running at http://localhost:${port}/`);
  console.log(`Serving files from ${path.join(__dirname, staticDir)}`);
  console.log(`API requests will be proxied to http://localhost:${apiPort}`);
});
