import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@vocalia/shared", "@vocalia/db"],
};

export default nextConfig;
