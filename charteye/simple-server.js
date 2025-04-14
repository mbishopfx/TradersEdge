const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const OUT_DIR = path.join(__dirname, 'out');

// Create a basic HTTP server to serve static files
const server = http.createServer((req, res) => {
  console.log(`Received request for ${req.url}`);
  
  // Set default path to index.html
  let filePath = path.join(OUT_DIR, req.url === '/' ? 'index.html' : req.url);
  
  // Handle direct HTML requests without extension
  if (!path.extname(filePath)) {
    filePath = `${filePath}.html`;
  }
  
  // Check if the file exists
  fs.access(filePath, fs.constants.R_OK, (err) => {
    if (err) {
      // File not found, serve index.html for client-side routing
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream(path.join(OUT_DIR, 'index.html')).pipe(res);
      return;
    }
    
    // Set content type based on file extension
    const ext = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (ext) {
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      case '.json':
        contentType = 'application/json';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
    }
    
    // Serve the file
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(port, () => {
  console.log(`Static server running at http://localhost:${port}/`);
  console.log(`Serving files from ${OUT_DIR}`);
});
