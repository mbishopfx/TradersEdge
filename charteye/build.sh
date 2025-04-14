#!/bin/bash
set -e

echo "Starting build process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Make sure npx is available
echo "Checking for npx..."
which npx || (echo "npx not found, installing..." && npm install -g npx)

# Use npx to run next build
echo "Running Next.js build with npx..."
npx next build

echo "Build completed successfully!" 