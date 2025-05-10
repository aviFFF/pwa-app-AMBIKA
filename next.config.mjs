import withPWA from 'next-pwa';

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable experimental features to avoid typing issues
  experimental: {
    typedRoutes: false
  },
  // External packages configuration
  serverExternalPackages: [],
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Add webpack configuration for jsPDF browser polyfills
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side specific configuration
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        stream: false,
        canvas: false,
        encoding: false
      };
    }
    
    // Add jspdf as external for server
    if (isServer) {
      config.externals = [...config.externals, 'canvas', 'jsdom'];
    }
    
    return config;
  }
};

export default pwaConfig(nextConfig); 