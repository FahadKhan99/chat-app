/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.html$/,
      loader: "ignore-loader",
    });
    return config;
  },
  images: {
    domains: [
      "res.cloudinary.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
    ], // This would allow images from those domains
  },
  experimental: {
    swcPlugins: [
      ["next-superjson-plugin", {}], // plugin for warning as Date Objects
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // This will ignore ESLint errors during builds
  },
};

export default nextConfig;
