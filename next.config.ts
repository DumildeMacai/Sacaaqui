
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  devIndicators: {
    allowedDevOrigins: [
        'https://*.google.com',
        'https://*.cloud.google.com',
        'https://*.firebase.google.com',
        'https://*.cloudworkstations.dev',
    ],
  }
};

export default nextConfig;
