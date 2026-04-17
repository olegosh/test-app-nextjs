import type { NextConfig } from 'next';

const config: NextConfig = {
  cacheComponents: true,
  transpilePackages: [
    '@product-portal/ui',
    '@product-portal/constants',
    '@product-portal/types',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dummyjson.com',
      },
    ],
  },
};

export default config;
