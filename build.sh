#!/bin/bash
set -ex

echo "=== Running build script from the root directory ==="
echo "Current directory: $(pwd)"

# Check if we're in the right directory structure
if [ -d "charteye" ]; then
  echo "Found charteye directory, changing to it..."
  cd charteye

  # Check if build.sh exists in the charteye directory
  if [ -f "build.sh" ]; then
    echo "Found build.sh in charteye directory, executing it..."
    chmod +x build.sh
    ./build.sh
  else
    echo "ERROR: No build.sh found in charteye directory!"
    exit 1
  fi
else
  echo "ERROR: charteye directory not found!"
  echo "Current directory contents:"
  ls -la
  exit 1
fi 