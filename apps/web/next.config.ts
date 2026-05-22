import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@genlayer-school/content",
    "@genlayer-school/sdk",
    "@genlayer-school/ui",
    "motion",
  ],
};

export default nextConfig;
