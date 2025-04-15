/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Production build optimizations for App Router
  output: 'export', // Export static files instead of 'standalone'
  
  // Skip typechecking and linting during build
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
    tsconfigPath: './tsconfig.json', // Explicitly point to tsconfig
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  
  // Disable source maps in production to improve build times
  productionBrowserSourceMaps: false,
  
  // Enable trailingSlash for static export compatibility
  trailingSlash: true,
  
  // Enable basePath if deploying to a subdirectory
  // basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  
  // Configure static fallbacks
  generateBuildId: async () => {
    return 'charteye-build-' + Date.now();
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tradertools-5be44.firebasestorage.app',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      }
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true, // Required for static export
  },
  
  // Updated experimental features
  experimental: {
    esmExternals: true
  }
};

export default nextConfig; 