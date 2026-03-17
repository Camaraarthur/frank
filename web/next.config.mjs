/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: "http://localhost:4740/api/:path*",
    },
  ],
  // Increase proxy timeout for long-running research requests
  experimental: {
    proxyTimeout: 120000,
  },
};

export default nextConfig;
