#!/bin/bash
set -ex

echo "=== Environment Information ==="
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"
echo "Directory contents: $(ls -la)"

# Install dependencies
echo "=== Installing dependencies ==="
npm install

echo "=== Checking for Next.js installation ==="
npm list next

# Make sure npx is available
echo "=== Checking for npx ==="
which npx || (echo "npx not found, installing..." && npm install -g npx)

# List critical PATH directories
echo "=== PATH environment ==="
echo $PATH
echo "=== node_modules/.bin contents ==="
ls -la node_modules/.bin || echo "No node_modules/.bin directory found"

# Try the normal Next.js build
echo "=== Running Next.js build with npx ==="
export NODE_OPTIONS="--max-old-space-size=4096"
if npx --no-install next build; then
  echo "=== Build completed successfully! ==="
else
  echo "=== Standard build failed, trying fallback method ==="
  node fallback-build.js
fi 