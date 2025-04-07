#!/bin/bash

# ChartEye Authentication and Payment Flow Test Runner
# This script runs a browser test to verify the authentication and payment flow

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
if ! curl -s "http://localhost:3000" > /dev/null; then
    echo "❌ The ChartEye application doesn't appear to be running on port 3000."
    echo "ℹ️ Starting the application for you..."
    
    # Start the application in the background
    cd "$PROJECT_ROOT" && npm run dev &
    APP_PID=$!
    
    # Wait for the app to start
    echo "⏱️ Waiting for the application to start..."
    for i in {1..30}; do
        if curl -s "http://localhost:3000" > /dev/null; then
            echo "✅ Application successfully started!"
            break
        fi
        
        if [ $i -eq 30 ]; then
            echo "❌ Failed to start the application. Please start it manually with 'npm run dev'."
            exit 1
        fi
        
        sleep 1
    done
fi

# Make test script executable
chmod +x "$SCRIPT_DIR/test-auth-payment.js"

echo "🚀 Running authentication and payment flow test..."
echo "ℹ️ This test requires manual interaction with the browser."
echo "ℹ️ Please follow the instructions in the console."

# Run the test script directly with node
node "$SCRIPT_DIR/test-auth-payment.js"

# If we started the app, stop it
if [ ! -z "$APP_PID" ]; then
    echo "🛑 Stopping the application..."
    kill $APP_PID
fi

exit 0 