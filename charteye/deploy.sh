#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting ChartEye deployment process..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "❌ .env.local file not found. Please create it with your environment variables."
  exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building the application..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Please check the logs for errors."
  exit 1
fi

# Run tests (if you have them)
# echo "🧪 Running tests..."
# npm test

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed successfully!"
echo "🌐 Your application should now be live at https://charteye.vercel.app"
echo "📝 Don't forget to set up your environment variables in the Vercel dashboard." 