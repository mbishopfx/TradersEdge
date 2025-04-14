/**
 * Wrapper script to execute the actual server in the charteye subdirectory
 */
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

// Check if we're in the right directory structure
const charteyePath = path.join(__dirname, 'charteye');
const serverPath = path.join(charteyePath, 'simple-server.js');

if (fs.existsSync(charteyePath)) {
  console.log(`Found charteye directory at ${charteyePath}`);
  
  if (fs.existsSync(serverPath)) {
    console.log(`Found server script at ${serverPath}, executing it...`);
    
    // Change to the charteye directory and run the server from there
    process.chdir(charteyePath);
    
    // Execute the server script
    const server = spawn('node', ['simple-server.js'], {
      stdio: 'inherit',
      cwd: charteyePath
    });
    
    server.on('error', (error) => {
      console.error('Failed to start server:', error);
      process.exit(1);
    });
    
    server.on('close', (code) => {
      console.log(`Server process exited with code ${code}`);
      process.exit(code);
    });
  } else {
    console.error(`ERROR: No simple-server.js found in ${charteyePath}!`);
    process.exit(1);
  }
} else {
  console.error('ERROR: charteye directory not found!');
  console.error('Current directory contents:');
  fs.readdirSync(__dirname).forEach(file => {
    console.error(`- ${file}`);
  });
  process.exit(1);
} 