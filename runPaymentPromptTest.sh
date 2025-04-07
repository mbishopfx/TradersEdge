#!/bin/bash

# ChartEye Payment Prompt UI Test Runner
# This script runs a browser test to verify the payment prompt UI

# Set script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js to run this test."
    exit 1
fi

# Check if puppeteer is installed
if ! node -e "try{require('puppeteer')}catch(e){process.exit(1)}" &> /dev/null; then
    echo "❌ Puppeteer is not installed. Installing now..."
    cd "$PROJECT_ROOT" && npm install puppeteer --no-save
fi

# Check if the app is running
if ! curl -s "http://localhost:3003" > /dev/null; then
    echo "❌ The ChartEye application doesn't appear to be running on port 3003."
    echo "🔍 Make sure to start the app with 'npm run dev' before running this test."
    exit 1
fi

# Make test script executable
TEST_SCRIPT="$SCRIPT_DIR/testPaymentPrompt.js"

echo "🚀 Running payment prompt UI manual test..."
echo "ℹ️  This test requires manual interaction with the browser."
echo "ℹ️  Please follow the instructions in the console."

# Run the test script directly with node
node "$TEST_SCRIPT"

exit 0 