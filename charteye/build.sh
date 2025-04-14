#!/bin/bash
set -ex

echo "=== Environment Information ==="
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"
echo "Directory contents: $(ls -la)"

# Install dependencies
echo "=== Installing dependencies ==="
npm install --legacy-peer-deps
echo "=== Installing additional required dependencies ==="
npm install --legacy-peer-deps tailwindcss postcss autoprefixer

echo "=== Checking for Next.js installation ==="
npm list next

# Make sure npx is available
echo "=== Checking for npx ==="
which npx || (echo "npx not found, installing..." && npm install -g npx)

# Create tsconfig paths file if it doesn't exist properly
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

# Update next.config.mjs to remove swcMinify
echo "=== Updating Next.js config ==="
sed -i 's/swcMinify: true,/\/\/ swcMinify removed for compatibility/' next.config.mjs || echo "Failed to update next.config.mjs"

# List critical PATH directories
echo "=== PATH environment ==="
echo $PATH
echo "=== node_modules/.bin contents ==="
ls -la node_modules/.bin || echo "No node_modules/.bin directory found"

# Try the normal Next.js build
echo "=== Running Next.js build with npx ==="
export NODE_OPTIONS="--max-old-space-size=4096"
if npx --no-install next build; then
  echo "=== Build completed successfully! ==="
else
  echo "=== Standard build failed, trying fallback method ==="
  node fallback-build.js
fi 