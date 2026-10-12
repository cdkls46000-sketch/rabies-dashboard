import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Export as static HTML for GitHub Pages */
  output: "export",
  basePath: "/rabies-dashboard",
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
