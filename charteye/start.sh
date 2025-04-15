#!/bin/bash
# Start both the static server and API server with robust process management for Render
echo "Starting servers for Render deployment..."

# Load environment variables from .env.render if it exists and we're on Render
if [ "$RENDER" = "true" ] && [ -f .env.render ]; then
  echo "Loading environment variables from .env.render for Render deployment..."
  export $(grep -v '^#' .env.render | xargs)
  echo "Environment variables loaded from .env.render"
fi

# Set environment variables
export PORT=${PORT:-10000}
export API_PORT=${API_PORT:-3001}
export NODE_ENV=${NODE_ENV:-production}
export RENDER=true
export RENDER_SERVICE_ID=${RENDER_SERVICE_ID:-local}

# Export Firebase config for the API server
export FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID:-charteye-5be44}
export FIREBASE_STORAGE_BUCKET=${FIREBASE_STORAGE_BUCKET:-charteye-5be44.firebasestorage.app}
export FIREBASE_DATABASE_URL=${FIREBASE_DATABASE_URL:-https://charteye-5be44-default-rtdb.firebaseio.com}

# Create a log directory if it doesn't exist
mkdir -p logs

# Create a PID directory for tracking processes
mkdir -p pids

# Create news-data directory if it doesn't exist
echo "Ensuring news-data directory exists..."
mkdir -p news-data
chmod 755 news-data

# Set NEWS_DATA_DIR environment variable to be available to the API
export NEWS_DATA_DIR=$(pwd)/news-data
echo "NEWS_DATA_DIR set to: $NEWS_DATA_DIR"

# Function to check if a process is running
is_running() {
  local pid=$1
  if [[ -z "$pid" ]]; then
    return 1
  fi
  if ps -p $pid > /dev/null; then
    return 0
  else
    return 1
  fi
}

# Function to start the API server
start_api_server() {
  echo "Starting API server on port $API_PORT..."
  node api-server.js > logs/api-server.log 2>&1 &
  API_PID=$!
  echo $API_PID > pids/api-server.pid
  echo "API server started with PID $API_PID"
  
  # Give the API server a moment to start
  sleep 3
  
  # Check if API server is still running
  if ! is_running $API_PID; then
    echo "WARNING: API server failed to start - check logs/api-server.log"
    tail -n 20 logs/api-server.log
  else
    echo "API server successfully started"
  fi
}

# Function to start the static server
start_static_server() {
  echo "Starting static file server on port $PORT..."
  node simple-server.js > logs/static-server.log 2>&1 &
  STATIC_PID=$!
  echo $STATIC_PID > pids/static-server.pid
  echo "Static server started with PID $STATIC_PID"
  
  # Check if static server started successfully
  sleep 2
  if ! is_running $STATIC_PID; then
    echo "WARNING: Static server failed to start - check logs/static-server.log"
    tail -n 20 logs/static-server.log
  else
    echo "Static server successfully started"
  fi
}

# Clean up function to handle graceful shutdown
cleanup() {
  echo "Shutting down servers..."
  
  # Kill API server if running
  if [[ -f pids/api-server.pid ]]; then
    API_PID=$(cat pids/api-server.pid)
    if is_running $API_PID; then
      echo "Stopping API server (PID $API_PID)..."
      kill -15 $API_PID 2>/dev/null || kill -9 $API_PID 2>/dev/null
    fi
    rm -f pids/api-server.pid
  fi
  
  # Kill static server if running
  if [[ -f pids/static-server.pid ]]; then
    STATIC_PID=$(cat pids/static-server.pid)
    if is_running $STATIC_PID; then
      echo "Stopping static server (PID $STATIC_PID)..."
      kill -15 $STATIC_PID 2>/dev/null || kill -9 $STATIC_PID 2>/dev/null
    fi
    rm -f pids/static-server.pid
  fi
  
  echo "All servers stopped"
  exit 0
}

# Register the cleanup function for various signals
trap cleanup SIGINT SIGTERM EXIT

# Print system information for debugging
echo "=== System Information ==="
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"
echo "Directory contents of out/: $(ls -la out/ 2>/dev/null || echo 'out/ directory not found')"
echo "==========================="

# Copy sample data files to news-data directory if they don't exist
echo "Ensuring sample news data files exist..."
if [ ! -f news-data/news_1.json ]; then
  echo "Creating sample news files..."
  
  # Create first sample news file
  cat > news-data/news_1.json << EOL
{
  "date": "$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")",
  "headlines": [
    "Sample headline created during server startup 1",
    "Markets show positive trends in recent session 1",
    "Technical indicators suggest potential breakout 1"
  ],
  "snippets": [
    "Market sentiment improved as economic data exceeded expectations.",
    "Trading volumes increased, suggesting strong institutional participation."
  ],
  "source": "startup-sample-1"
}
EOL

  # Create second sample news file  
  cat > news-data/news_2.json << EOL
{
  "date": "$(date -u -d "-1 day" +"%Y-%m-%dT%H:%M:%S.000Z")",
  "headlines": [
    "Sample headline created during server startup 2",
    "Analysts predict market volatility to continue 2",
    "Economic indicators point to stable growth 2"
  ],
  "snippets": [
    "Analysts recommend watching key support and resistance levels.",
    "Central bank communications continue to influence market direction."
  ],
  "source": "startup-sample-2"
}
EOL
  echo "Sample news files created"
fi

# Start the servers - start API server first, with more diagnostics
echo "Starting API server with diagnostics..."
export API_DEBUG=true
export USE_FALLBACK=true
start_api_server
start_static_server

# Wait a moment for servers to initialize
sleep 5

# Print health check info
echo "Checking API server health..."
curl -s http://localhost:$API_PORT/api/health || echo "API health check failed"

echo "Checking static server health..."
curl -s http://localhost:$PORT/health || echo "Static server health check failed"

# Monitor child processes and restart if needed
echo "Starting process monitor..."
while true; do
  sleep 10
  
  # Check and restart API server if needed
  if [[ -f pids/api-server.pid ]]; then
    API_PID=$(cat pids/api-server.pid)
    if ! is_running $API_PID; then
      echo "$(date): API server is down, restarting..."
      start_api_server
    fi
  fi
  
  # Check and restart static server if needed
  if [[ -f pids/static-server.pid ]]; then
    STATIC_PID=$(cat pids/static-server.pid)
    if ! is_running $STATIC_PID; then
      echo "$(date): Static server is down, restarting..."
      start_static_server
    fi
  fi
done
