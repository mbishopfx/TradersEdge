/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify removed for compatibility
  
  // Production build optimizations for App Router
  output: 'export', // Export static files instead of 'standalone'
  
  // Skip typechecking and linting during build
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
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

  // Handle dynamic API routes in static export
  experimental: {
    appDir: true,
  },
  
  // Configure which routes should be handled by the static export
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/analysis/:id/public',
          destination: '/api/analysis/[id]/public',
        },
      ],
    };
  },
};

export default nextConfig; 