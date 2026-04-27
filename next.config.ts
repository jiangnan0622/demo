import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  devIndicators: false,
  output: isGithubPages ? "export" : undefined,
  basePath: isGithubPages ? "/demo" : undefined,
  assetPrefix: isGithubPages ? "/demo/" : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
