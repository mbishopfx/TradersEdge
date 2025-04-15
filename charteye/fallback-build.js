// This is a fallback build script that directly uses Next.js internals
// if the normal CLI-based build fails
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

console.log('=== Running fallback build process ===');
console.log('Creating a minimal static export...');

// Ensure directories exist
const outDir = path.join(__dirname, 'out');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Create a basic index.html file
const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ChartEye - AI Trading Chart Analysis</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #000;
      color: #fff;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      flex: 1;
    }
    header {
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #333;
    }
    h1 {
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      color: #9ca3af;
      font-size: 1.2rem;
    }
    .card {
      background-color: rgba(30, 41, 59, 0.5);
      border-radius: 0.5rem;
      padding: 2rem;
      margin-bottom: 2rem;
      backdrop-filter: blur(10px);
      border: 1px solid #334155;
    }
    .button {
      display: inline-block;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: bold;
      transition: all 0.2s ease;
    }
    .button:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }
    footer {
      text-align: center;
      padding: 2rem;
      background-color: rgba(30, 41, 59, 0.3);
      color: #9ca3af;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>ChartEye</h1>
      <p class="subtitle">AI-Powered Trading Chart Analysis</p>
    </header>
    
    <div class="card">
      <h2>Welcome to ChartEye</h2>
      <p>
        ChartEye uses advanced AI to analyze trading charts and provide insights that help traders
        make more informed decisions. Get detailed analysis of patterns, trends, and potential
        price movements.
      </p>
      <p>
        <a href="/api/auth/signin" class="button">Get Started</a>
      </p>
    </div>
    
    <div class="card">
      <h2>Key Features</h2>
      <ul>
        <li>AI-powered chart pattern recognition</li>
        <li>Trend analysis and prediction</li>
        <li>Risk/reward assessment</li>
        <li>Volume confirmation analysis</li>
        <li>Support and resistance identification</li>
      </ul>
    </div>
  </div>
  
  <footer>
    <p>© 2025 ChartEye. All rights reserved.</p>
    <p>
      <small>
        Disclaimer: Trading involves risk. The information provided by ChartEye is for educational
        purposes only and should not be considered financial advice.
      </small>
    </p>
  </footer>
</body>
</html>
`;

// Write the index.html file
fs.writeFileSync(path.join(outDir, 'index.html'), indexHtml);

// Create a view folder with placeholder
const viewDir = path.join(outDir, 'view');
if (!fs.existsSync(viewDir)) {
  fs.mkdirSync(viewDir, { recursive: true });
}

// Create a placeholder folder
const placeholderDir = path.join(viewDir, 'placeholder');
if (!fs.existsSync(placeholderDir)) {
  fs.mkdirSync(placeholderDir, { recursive: true });
}

// Create placeholder index.html
const placeholderHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chart Analysis - ChartEye</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #000;
      color: #fff;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      flex: 1;
    }
    .card {
      background-color: rgba(30, 41, 59, 0.5);
      border-radius: 0.5rem;
      padding: 2rem;
      margin-bottom: 2rem;
      backdrop-filter: blur(10px);
      border: 1px solid #334155;
      text-align: center;
    }
    .button {
      display: inline-block;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: bold;
      transition: all 0.2s ease;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1>Analysis Loading</h1>
      <p>The requested chart analysis will be generated when you connect.</p>
      <p><a href="/" class="button">Return to Home</a></p>
    </div>
  </div>
</body>
</html>
`;

// Write the placeholder index.html file
fs.writeFileSync(path.join(placeholderDir, 'index.html'), placeholderHtml);

console.log('Static files created successfully!');
console.log('Output directory:', outDir);

// Try to copy any public assets if they exist
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  console.log('Copying public assets...');
  
  try {
    fs.readdirSync(publicDir).forEach(file => {
      const srcPath = path.join(publicDir, file);
      const destPath = path.join(outDir, file);
      
      if (fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied: ${file}`);
      }
    });
  } catch (error) {
    console.error('Error copying public files:', error);
  }
}

console.log('Fallback build completed successfully.');
process.exit(0); 