/** @type {import('next').NextConfig} */
const nextConfig = {async rewrites() {
    return [
      {
        source: '/api/:path*',                      // cualquier /api/...
        destination: 'http://localhost:3001/api/:path*', // lo redirige internamente a tu server
      },
    ];
  },};

export default nextConfig;
