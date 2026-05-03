import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@genlayer-school/content",
    "@genlayer-school/sdk",
    "@genlayer-school/ui",
  ],
};

export default nextConfig;
