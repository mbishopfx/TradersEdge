#!/bin/bash

# ChartEye Upload Limit Test Runner
# This script runs the upload limit test simulation

# Set script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js to run this test."
    exit 1
fi

# Check if npm packages are installed
PACKAGES_NEEDED=("node-fetch" "form-data")
MISSING_PACKAGES=()

for package in "${PACKAGES_NEEDED[@]}"; do
    if ! node -e "try{require('$package')}catch(e){process.exit(1)}" &> /dev/null; then
        MISSING_PACKAGES+=("$package")
    fi
done

if [ ${#MISSING_PACKAGES[@]} -ne 0 ]; then
    echo "❌ Some required packages are missing. Installing: ${MISSING_PACKAGES[*]}"
    cd "$PROJECT_ROOT" && npm install ${MISSING_PACKAGES[*]} --no-save
fi

# Check for test image
TEST_IMAGE="$SCRIPT_DIR/test-chart.png"
if [ ! -f "$TEST_IMAGE" ]; then
    echo "❌ Test image not found at $TEST_IMAGE"
    echo "🔍 Downloading sample chart image..."
    curl -s -o "$TEST_IMAGE" https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Candlestick_chart_for_S%26P_500.png/800px-Candlestick_chart_for_S%26P_500.png
    if [ ! -f "$TEST_IMAGE" ]; then
        echo "❌ Failed to download test image"
        exit 1
    fi
    echo "✅ Test image downloaded successfully"
fi

# Make test script executable
TEST_SCRIPT="$SCRIPT_DIR/testUploadLimit.js"
chmod +x "$TEST_SCRIPT"

echo "🚀 Running upload limit test simulation..."
node "$TEST_SCRIPT"

exit 0 