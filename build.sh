#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

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
    BUILD_RESULT=$?
    if [ $BUILD_RESULT -ne 0 ]; then
      echo "Build failed in charteye/build.sh with exit code: $BUILD_RESULT"
      exit $BUILD_RESULT
    fi
  else
    echo "ERROR: No build.sh found in charteye directory!"
    echo "Attempting to run npm build directly..."
    npm ci && npm run build
    BUILD_RESULT=$?
    if [ $BUILD_RESULT -ne 0 ]; then
      echo "Direct npm build failed with exit code: $BUILD_RESULT"
      exit $BUILD_RESULT
    fi
  fi
else
  echo "ERROR: charteye directory not found!"
  echo "Current directory contents:"
  ls -la
  exit 1
fi

echo "Build completed successfully!"
exit 0 