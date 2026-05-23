/** @type {import('next').NextConfig} */
const isGithubPages = process.env.DEPLOY_TARGET === "github-pages";

const nextConfig = {
  output: isGithubPages ? "export" : undefined,
  basePath: isGithubPages ? "/jack-studio-hub" : "",
  assetPrefix: isGithubPages ? "/jack-studio-hub/" : "",
  images: {
    unoptimized: true
  }
};

export default nextConfig;
