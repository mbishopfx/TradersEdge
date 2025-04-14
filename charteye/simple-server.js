const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 3000;
const apiPort = process.env.API_PORT || 3001;

// Serve static files from the 'out' directory
app.use(express.static(path.join(__dirname, 'out')));

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
  res.sendFile(path.join(__dirname, 'out', 'index.html'));
});

app.listen(port, () => {
  console.log(`Static server running at http://localhost:${port}/`);
  console.log(`Serving files from ${path.join(__dirname, 'out')}`);
  console.log(`API requests will be proxied to http://localhost:${apiPort}`);
});
