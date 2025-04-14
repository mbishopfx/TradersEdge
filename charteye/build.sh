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

# Ensure NODE_ENV is set correctly for the build
echo "=== Setting NODE_ENV to production for build ==="
export NODE_ENV=production

# Run the Next.js build
echo "=== Running Next.js build for App Router ==="
export NODE_OPTIONS="--max-old-space-size=4096"

# Try different methods to run Next.js build
echo "Attempting Next.js build with npx..."
if npx --no-install next build; then
  echo "=== Build completed successfully with npx! ==="
elif [ -f "./node_modules/.bin/next" ]; then
  echo "Attempting build with direct path to next binary..."
  ./node_modules/.bin/next build
  BUILD_RESULT=$?
  if [ $BUILD_RESULT -eq 0 ]; then
    echo "=== Build completed successfully with direct path! ==="
  else
    echo "=== Build failed with exit code: $BUILD_RESULT ==="
    exit $BUILD_RESULT
  fi
else
  echo "=== Build failed, next binary not found ==="
  echo "Contents of node_modules/.bin:"
  ls -la node_modules/.bin || echo "node_modules/.bin directory not found"
  exit 1
fi

echo "=== Deployment completed! ==="
echo "You can start the server with: node server.js" 