/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'm3sp86s1-3000.brs.devtunnels.ms',
      ],
    },
  },
};

module.exports = nextConfig