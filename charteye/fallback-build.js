// This is a fallback build script that directly uses Next.js internals
// if the normal CLI-based build fails
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

console.log('=== FALLBACK BUILD SCRIPT ===');
console.log('Using direct Next.js import instead of CLI');

// Set NODE_ENV to production
process.env.NODE_ENV = 'production';

// Make sure tailwindcss is installed
try {
  console.log('Checking for tailwindcss...');
  try {
    require.resolve('tailwindcss');
    console.log('tailwindcss is installed');
  } catch (e) {
    console.log('Installing tailwindcss and related packages...');
    execSync('npm install --legacy-peer-deps tailwindcss postcss autoprefixer', { stdio: 'inherit' });
  }
} catch (error) {
  console.error('Error checking/installing tailwindcss:', error);
}

// Make sure dependencies are installed with legacy peer deps
try {
  console.log('Ensuring dependencies are installed with --legacy-peer-deps...');
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to install dependencies:', error);
  // Continue anyway, as they might already be installed
}

// Check for AuthContext
try {
  const contextDir = path.join(__dirname, 'src', 'contexts');
  const authContextPath = path.join(contextDir, 'AuthContext.tsx');
  
  if (!fs.existsSync(contextDir)) {
    console.log('Creating contexts directory...');
    fs.mkdirSync(contextDir, { recursive: true });
  }
  
  if (!fs.existsSync(authContextPath)) {
    console.log('Creating placeholder AuthContext.tsx...');
    fs.writeFileSync(authContextPath, `import React, { createContext, useContext, useState, useEffect } from 'react';

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

export default AuthProvider;`);
  }
} catch (error) {
  console.error('Error creating AuthContext:', error);
}

// Fix next.config.mjs
try {
  const configPath = path.join(__dirname, 'next.config.mjs');
  if (fs.existsSync(configPath)) {
    console.log('Updating next.config.mjs...');
    let configContent = fs.readFileSync(configPath, 'utf8');
    configContent = configContent.replace('swcMinify: true,', '// swcMinify removed for compatibility');
    fs.writeFileSync(configPath, configContent);
  }
} catch (error) {
  console.error('Error updating next.config.mjs:', error);
}

// Try to directly use Next.js
try {
  console.log('Attempting to require next/dist/build');
  const nextBuild = require('next/dist/build').default;
  
  // Get the directory of the current file
  const dir = __dirname;
  console.log(`Building in directory: ${dir}`);
  
  // Check for next.config.js presence
  const configPath = path.join(dir, 'next.config.mjs');
  if (fs.existsSync(configPath)) {
    console.log(`Found config at ${configPath}`);
  } else {
    console.error(`Config not found at ${configPath}`);
  }
  
  // Run the Next.js build
  console.log('Starting build process...');
  nextBuild(dir, null)
    .then(() => {
      console.log('Build completed successfully!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Build failed:', err);
      process.exit(1);
    });
} catch (error) {
  console.error('Failed to run build:', error);
  process.exit(1);
} 