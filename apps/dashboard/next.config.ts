import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    transpilePackages: ["@myorg/data", "@myorg/auth"],
};

export default nextConfig;
