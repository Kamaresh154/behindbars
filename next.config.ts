import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const basePath = isGitHubPages ? "/behindbars" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.behindbars.in" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  trailingSlash: true,
  turbopack: {},
  webpack(config) {
    // Allow importing GLSL shader files.
    config.module.rules.push({
      test: /\.(glsl|vert|frag)$/,
      use: "raw-loader",
      exclude: /node_modules/,
    });
    return config;
  },
};

export default nextConfig;
