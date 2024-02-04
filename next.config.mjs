/** @type {import('next').NextConfig} */
const nextConfig = {
 webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Exclude HTML files from being processed by Webpack
    config.module.rules.push({
      test: /\.html$/,
      exclude: /node_modules/,
      use: 'html-loader' // You may need to install html-loader: npm install html-loader --save-dev
    });

    return config;
  },
};

export default nextConfig;
