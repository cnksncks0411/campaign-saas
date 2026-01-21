import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel deployment configuration
  output: 'standalone',
  
  // Ensure all routes are properly handled
  trailingSlash: false,
  
  // Enable static exports where possible
  reactStrictMode: true,
};

export default nextConfig;
