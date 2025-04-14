/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify removed for compatibility
  
  // Production build optimizations
  output: 'export', // Static HTML export
  distDir: 'out',  // Output to the 'out' directory
  
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
  
  // Add essential routes only
  async exportPathMap() {
    return {
      '/': { page: '/' },
      '/api/health': { page: '/api/health' }
    };
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
    unoptimized: true, // Needed for static export
  },
};

export default nextConfig; 