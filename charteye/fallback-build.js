// This is a fallback build script that directly uses Next.js internals
// if the normal CLI-based build fails
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

console.log('=== FALLBACK BUILD SCRIPT ===');
console.log('Using direct Next.js import instead of CLI');

// Set NODE_ENV to production
process.env.NODE_ENV = 'production';

// Make sure dependencies are installed with legacy peer deps
try {
  console.log('Ensuring dependencies are installed with --legacy-peer-deps...');
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to install dependencies:', error);
  // Continue anyway, as they might already be installed
}

// Try to directly use Next.js
try {
  console.log('Attempting to require next/dist/build');
  const nextBuild = require('next/dist/build').default;
  
  // Get the directory of the current file
  const dir = __dirname;
  console.log(`Building in directory: ${dir}`);
  
  // Check for next.config.js presence
  const configPath = path.join(dir, 'next.config.mjs');
  if (fs.existsSync(configPath)) {
    console.log(`Found config at ${configPath}`);
  } else {
    console.error(`Config not found at ${configPath}`);
  }
  
  // Run the Next.js build
  console.log('Starting build process...');
  nextBuild(dir, null)
    .then(() => {
      console.log('Build completed successfully!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Build failed:', err);
      process.exit(1);
    });
} catch (error) {
  console.error('Failed to run build:', error);
  process.exit(1);
} 