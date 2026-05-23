/** @type {import('next').NextConfig} */
const isGithubPages = process.env.DEPLOY_TARGET === "github-pages";

const nextConfig = {
  output: isGithubPages ? "export" : undefined,
  basePath: isGithubPages ? "/jack-studio-service" : "",
  assetPrefix: isGithubPages ? "/jack-studio-service/" : "",
  images: {
    unoptimized: true
  }
};

export default nextConfig;
