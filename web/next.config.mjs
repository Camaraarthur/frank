/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: "http://localhost:4740/api/:path*",
    },
  ],
};

export default nextConfig;
