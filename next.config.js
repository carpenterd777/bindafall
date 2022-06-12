/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack");
const env = require("dotenv");

const { parsed } = env.config();
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(parsed));
    return config;
  },
};

module.exports = nextConfig;
