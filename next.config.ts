import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["silent-bullfrog-663.convex.cloud"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.convex.cloud",
        port: "",
        pathname: "/api/storage/**",
      },
    ],
  },
  devIndicators: false,
  // Add this to serve fonts from public directory
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: "asset/resource",
    });
    return config;
  },
};

export default nextConfig;
