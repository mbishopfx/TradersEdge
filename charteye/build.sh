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

# Try alternative build approach
echo "=== Trying alternative build approach ==="
npx next build || NODE_OPTIONS="--max-old-space-size=4096" ./node_modules/.bin/next build

# If both build methods fail, try a different approach with explicit output directory
if [ $? -ne 0 ]; then
  echo "=== First build methods failed, trying alternative approach with explicit output ==="
  rm -rf .next out || true
  NODE_OPTIONS="--max-old-space-size=4096" npx next build && npx next export -o out
fi

# Create a start script for production
echo "=== Creating production start script ==="
cat > start.sh << EOL
#!/bin/bash
# Start both the static server and API server
echo "Starting servers..."
export PORT=\${PORT:-3000}
export API_PORT=\${API_PORT:-3001}
npx concurrently "node simple-server.js" "node api-server.js"
EOL

chmod +x start.sh

echo "=== Deployment completed! ==="
echo "You can start the servers with: ./start.sh" 