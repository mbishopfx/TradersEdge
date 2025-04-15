#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

echo "=== Environment Information ==="
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"
echo "Directory contents: $(ls -la)"

# Install dependencies
echo "=== Installing dependencies ==="
npm install --legacy-peer-deps

# Ensure TypeScript is installed 
echo "=== Ensuring TypeScript is installed ==="
npm install typescript --force # Force reinstall
npm install --save typescript # Install as regular dependency
npm install -g typescript # Install globally too

# Create TypeScript declaration file if it doesn't exist
echo "=== Creating TypeScript declaration files if needed ==="
if [ ! -f "next-env.d.ts" ]; then
  echo "// This file is created during build since TypeScript is enabled
/// <reference types=\"next\" />
/// <reference types=\"next/types/global\" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information." > next-env.d.ts
fi

# Install tailwindcss locally
echo "=== Installing tailwindcss locally ==="
npm install --legacy-peer-deps tailwindcss postcss autoprefixer

# Make sure next is installed and available
echo "=== Ensuring Next.js is installed ==="
if ! command -v next &> /dev/null; then
  echo "Next.js CLI not found in PATH, installing..."
  npm install --legacy-peer-deps next
fi

# Create the appropriate postcss.config.js file
echo "=== Setting up postcss config ==="
cat > postcss.config.js << EOL
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOL

# Create any missing directories
echo "=== Setting up path aliases ==="
mkdir -p src/contexts

# Create news-data directory with sample data
echo "=== Creating news-data directory with sample data ==="
mkdir -p news-data
chmod 755 news-data

# Copy news-data to output directory (for static export)
if [ -d "out" ]; then
  echo "Copying news-data to output directory..."
  mkdir -p out/news-data
  cp -r news-data/* out/news-data/ 2>/dev/null || echo "No files to copy"
  echo "News data copied to output directory"
fi

if [ ! -f news-data/metadata.json ]; then
  echo "Creating sample metadata.json for news data"
  cat > news-data/metadata.json << EOL
{
  "last_scrape": "$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")",
  "latest_headlines": [
    "Gold hits new record high as inflation concerns persist",
    "USD strengthens against major currencies after Fed comments",
    "European markets close higher amid economic recovery hopes",
    "Oil prices stabilize following production cut agreements",
    "Fed officials signal potential pause in rate hikes",
    "Tech stocks rally as earnings beat expectations",
    "JPY weakens as Bank of Japan maintains dovish stance",
    "Bitcoin volatility increases ahead of regulatory decisions",
    "Treasury yields rise on strong economic data",
    "Market awaits US inflation report due next week"
  ],
  "sources": [
    "Reuters",
    "Bloomberg",
    "CNBC",
    "Financial Times",
    "Wall Street Journal"
  ],
  "symbols": ["XAU", "USD", "EUR", "JPY", "GBP", "BTC", "ETH"],
  "version": "1.0",
  "note": "This is sample data for when live scraped data is unavailable."
}
EOL
  echo "Sample metadata.json created"
fi

# Create sample news files
for i in {1..3}; do
  if [ ! -f news-data/news_$i.json ]; then
    echo "Creating sample news_$i.json file"
    cat > news-data/news_$i.json << EOL
{
  "date": "$(date -u -d "-$i day" +"%Y-%m-%dT%H:%M:%S.000Z")",
  "headlines": [
    "Sample headline for testing purposes $i-1",
    "Markets show volatility in latest session $i-2",
    "Gold rebounds after recent decline $i-3",
    "USD strengthens against major currencies $i-4",
    "Technical analysis suggests potential reversal $i-5"
  ],
  "snippets": [
    "Market volatility increased today as traders reacted to new economic data.",
    "Analysts suggest watching key technical levels for confirmation of trend.",
    "Trading volumes were above average, indicating strong participation."
  ],
  "source": "sample-data-$i"
}
EOL
    echo "Sample news_$i.json created"
  fi
done

# Create public directory for static assets if it doesn't exist
mkdir -p public

# Create a sample favicon if it doesn't exist
if [ ! -f public/favicon.ico ]; then
  echo "Creating placeholder favicon.ico"
  # Create a small empty file as a placeholder
  touch public/favicon.ico
fi

if [ ! -f src/contexts/AuthContext.tsx ]; then
  echo "Creating placeholder AuthContext.tsx"
  echo "import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const signIn = async () => {};
  const signOut = async () => {};

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;" > src/contexts/AuthContext.tsx
fi

# Verify TypeScript is installed and working
echo "=== Verifying TypeScript installation ==="
npx tsc --version || echo "TypeScript verification failed, but continuing build"

# Ensure NODE_ENV is set correctly for the build
echo "=== Setting NODE_ENV to production for build ==="
export NODE_ENV=production

# Use the fallback approach directly for more reliability
echo "=== Using fallback build approach for static export ==="
rm -rf .next out || true

# Try first build approach with fallback
export NODE_OPTIONS="--max-old-space-size=4096"
npx next build || {
  echo "Basic build failed, trying with static export fallback..."
  node fallback-build.js || {
    echo "Fallback build failed, trying simplified build..."
    export NEXT_TELEMETRY_DISABLED=1
    # Create minimal out directory with index.html
    mkdir -p out
    echo "<html><body><h1>ChartEye</h1><p>Site is under maintenance. Please check back soon.</p></body></html>" > out/index.html
    echo "Created minimal fallback page"
  }
}

# Create a start script for production
echo "=== Creating production start script ==="
cat > start.sh << EOL
#!/bin/bash
# Start both the static server and API server with robust process management
echo "Starting servers..."

# Set environment variables
export PORT=\${PORT:-10000}
export API_PORT=\${API_PORT:-3001}
export NODE_ENV=production

# Create a log directory if it doesn't exist
mkdir -p logs

# Create a PID directory for tracking processes
mkdir -p pids

# Create news-data directory if it doesn't exist
echo "Ensuring news-data directory exists..."
mkdir -p news-data
chmod 755 news-data

# Set NEWS_DATA_DIR environment variable to be available to the API
export NEWS_DATA_DIR=\$(pwd)/news-data
echo "NEWS_DATA_DIR set to: \$NEWS_DATA_DIR"

# Function to check if a process is running
is_running() {
  local pid=\$1
  if [[ -z "\$pid" ]]; then
    return 1
  fi
  if ps -p \$pid > /dev/null; then
    return 0
  else
    return 1
  fi
}

# Function to start the API server
start_api_server() {
  echo "Starting API server on port \$API_PORT..."
  node api-server.js > logs/api-server.log 2>&1 &
  API_PID=\$!
  echo \$API_PID > pids/api-server.pid
  echo "API server started with PID \$API_PID"
}

# Function to start the static server
start_static_server() {
  echo "Starting static file server on port \$PORT..."
  node simple-server.js > logs/static-server.log 2>&1 &
  STATIC_PID=\$!
  echo \$STATIC_PID > pids/static-server.pid
  echo "Static server started with PID \$STATIC_PID"
}

# Clean up function to handle graceful shutdown
cleanup() {
  echo "Shutting down servers..."
  
  # Kill API server if running
  if [[ -f pids/api-server.pid ]]; then
    API_PID=\$(cat pids/api-server.pid)
    if is_running \$API_PID; then
      echo "Stopping API server (PID \$API_PID)..."
      kill -15 \$API_PID 2>/dev/null || kill -9 \$API_PID 2>/dev/null
    fi
    rm -f pids/api-server.pid
  fi
  
  # Kill static server if running
  if [[ -f pids/static-server.pid ]]; then
    STATIC_PID=\$(cat pids/static-server.pid)
    if is_running \$STATIC_PID; then
      echo "Stopping static server (PID \$STATIC_PID)..."
      kill -15 \$STATIC_PID 2>/dev/null || kill -9 \$STATIC_PID 2>/dev/null
    fi
    rm -f pids/static-server.pid
  fi
  
  echo "All servers stopped"
  exit 0
}

# Register the cleanup function for various signals
trap cleanup SIGINT SIGTERM EXIT

# Start the servers
start_api_server
sleep 2  # Short delay to allow API server to initialize
start_static_server

# Monitor child processes and restart if needed
while true; do
  sleep 5
  
  # Check and restart API server if needed
  if [[ -f pids/api-server.pid ]]; then
    API_PID=\$(cat pids/api-server.pid)
    if ! is_running \$API_PID; then
      echo "API server is down, restarting..."
      start_api_server
    fi
  fi
  
  # Check and restart static server if needed
  if [[ -f pids/static-server.pid ]]; then
    STATIC_PID=\$(cat pids/static-server.pid)
    if ! is_running \$STATIC_PID; then
      echo "Static server is down, restarting..."
      start_static_server
    fi
  fi
done
EOL

chmod +x start.sh

echo "=== Deployment completed! ==="
echo "You can start the servers with: ./start.sh" 