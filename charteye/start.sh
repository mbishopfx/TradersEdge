#!/bin/bash
# Start both the static server and API server with robust process management for Render
echo "======================================================"
echo "Starting servers for Render deployment..."
echo "======================================================"

# Load environment variables from .env.render if it exists and we're on Render
if [ -f .env.render ]; then
  echo "Loading environment variables from .env.render..."
  set -a
  source .env.render
  set +a
  echo "Environment variables loaded from .env.render"
fi

# Set environment variables with defaults
export PORT=${PORT:-10000}
export API_PORT=${API_PORT:-3001}
export NODE_ENV=${NODE_ENV:-production}
export RENDER=true
export RENDER_SERVICE_ID=${RENDER_SERVICE_ID:-local}
export API_DEBUG=true
export USE_FALLBACK=true

# Export Firebase config for the API server
export FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID:-charteye-5be44}
export FIREBASE_STORAGE_BUCKET=${FIREBASE_STORAGE_BUCKET:-charteye-5be44.firebasestorage.app}
export FIREBASE_DATABASE_URL=${FIREBASE_DATABASE_URL:-https://charteye-5be44-default-rtdb.firebaseio.com}

# Print all environment variables (excluding sensitive ones)
echo "======================================================"
echo "Environment Variables:"
env | grep -v -E 'KEY|SECRET|PASSWORD|TOKEN' | sort
echo "======================================================"

# Create required directories
echo "Creating required directories..."
mkdir -p logs
mkdir -p pids
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
  echo "======================================================"
  echo "Starting API server on port $API_PORT..."
  echo "======================================================"
  # Make sure the log file exists and is writable
  touch logs/api-server.log
  chmod 644 logs/api-server.log
  
  # Start the API server
  node api-server.js > logs/api-server.log 2>&1 &
  API_PID=$!
  echo $API_PID > pids/api-server.pid
  echo "API server started with PID $API_PID"
  
  # Give the API server a moment to start
  sleep 5
  
  # Check if API server is still running
  if ! is_running $API_PID; then
    echo "ERROR: API server failed to start - check logs/api-server.log"
    echo "======================================================"
    echo "API Server Logs:"
    cat logs/api-server.log
    echo "======================================================"
    return 1
  else
    echo "API server successfully started"
    return 0
  fi
}

# Function to start the static server
start_static_server() {
  echo "======================================================"
  echo "Starting static file server on port $PORT..."
  echo "======================================================"
  # Make sure the log file exists and is writable
  touch logs/static-server.log
  chmod 644 logs/static-server.log
  
  # Start the static server
  node simple-server.js > logs/static-server.log 2>&1 &
  STATIC_PID=$!
  echo $STATIC_PID > pids/static-server.pid
  echo "Static server started with PID $STATIC_PID"
  
  # Check if static server started successfully
  sleep 5
  if ! is_running $STATIC_PID; then
    echo "ERROR: Static server failed to start - check logs/static-server.log"
    echo "======================================================"
    echo "Static Server Logs:"
    cat logs/static-server.log
    echo "======================================================"
    return 1
  else
    echo "Static server successfully started"
    return 0
  fi
}

# Clean up function to handle graceful shutdown
cleanup() {
  echo "======================================================"
  echo "Shutting down servers..."
  echo "======================================================"
  
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
echo "======================================================"
echo "System Information:"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"
echo "Directory listing:"
ls -la
echo "======================================================"

# Create sample metadata.json if it doesn't exist
if [ ! -f news-data/metadata.json ]; then
  echo "Creating sample metadata.json..."
  cat > news-data/metadata.json << EOL
{
  "last_scrape": "$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")",
  "latest_headlines": [
    "Gold hits new record high as inflation concerns persist",
    "USD strengthens against major currencies after Fed comments",
    "European markets close higher amid economic recovery hopes",
    "Oil prices stabilize following production cut agreements",
    "Fed officials signal potential pause in rate hikes"
  ],
  "sources": [
    "Reuters",
    "Bloomberg",
    "CNBC"
  ],
  "symbols": ["XAU", "USD", "EUR", "JPY", "GBP"]
}
EOL
  echo "Sample metadata.json created"
fi

# Create sample news files
for i in {1..3}; do
  if [ ! -f news-data/news_$i.json ]; then
    echo "Creating sample news_$i.json file..."
    cat > news-data/news_$i.json << EOL
{
  "date": "$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")",
  "headlines": [
    "Sample headline $i-1: Markets remain stable in recent trading",
    "Sample headline $i-2: Analysts predict continued growth",
    "Sample headline $i-3: Economic data exceeds expectations",
    "Sample headline $i-4: Central banks maintain current policy",
    "Sample headline $i-5: Technical indicators suggest bullish trend"
  ],
  "snippets": [
    "Market sentiment has improved following positive economic data.",
    "Investors are watching key support and resistance levels.",
    "Trading volumes indicate strong institutional participation."
  ],
  "source": "sample-data-$i"
}
EOL
    echo "Sample news_$i.json created"
  fi
done

# Start the servers - start API server first
echo "======================================================"
echo "Starting servers..."
echo "======================================================"

# Start API server with retries
MAX_RETRIES=3
retry_count=0
api_started=false

while [ $retry_count -lt $MAX_RETRIES ] && [ "$api_started" = false ]; do
  if start_api_server; then
    api_started=true
  else
    retry_count=$((retry_count + 1))
    echo "Retry $retry_count/$MAX_RETRIES: Restarting API server..."
    sleep 2
  fi
done

if [ "$api_started" = false ]; then
  echo "FATAL: Failed to start API server after $MAX_RETRIES attempts"
  exit 1
fi

# Start static server with retries
retry_count=0
static_started=false

while [ $retry_count -lt $MAX_RETRIES ] && [ "$static_started" = false ]; do
  if start_static_server; then
    static_started=true
  else
    retry_count=$((retry_count + 1))
    echo "Retry $retry_count/$MAX_RETRIES: Restarting static server..."
    sleep 2
  fi
done

if [ "$static_started" = false ]; then
  echo "FATAL: Failed to start static server after $MAX_RETRIES attempts"
  exit 1
fi

# Wait a moment for servers to initialize
sleep 5

# Print health check info
echo "======================================================"
echo "Performing health checks..."
echo "======================================================"

echo "Checking API server health..."
curl -v http://localhost:$API_PORT/api/health || echo "API health check failed"

echo "Checking static server health..."
curl -v http://localhost:$PORT/health || echo "Static server health check failed"

echo "======================================================"
echo "Both servers running. Entering monitoring mode."
echo "======================================================"

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
