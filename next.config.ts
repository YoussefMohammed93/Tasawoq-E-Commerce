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
};

export default nextConfig;
