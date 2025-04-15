#!/bin/bash
# Start both the static server and API server with robust process management for Render
echo "Starting servers for Render deployment..."

# Set environment variables
export PORT=${PORT:-10000}
export API_PORT=${API_PORT:-3001}
export NODE_ENV=${NODE_ENV:-production}
export RENDER=true
export RENDER_SERVICE_ID=${RENDER_SERVICE_ID:-local}

# Create a log directory if it doesn't exist
mkdir -p logs

# Create a PID directory for tracking processes
mkdir -p pids

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
echo "Directory contents of out/: $(ls -la out/)"
echo "==========================="

# Start the servers - start API server first
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
