/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');
const path = require('path');

const nextConfig = {
  i18n,
  output: 'standalone',
  reactStrictMode: process.env.NODE_ENV === 'development' ? false : true,
  compress: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://10.1.251.110:8090/api/:path*',
        // source: '/api',
        // destination: 'https://10.1.251.110:8090', // 将请求代理到目标URL 67727a41b5b1d4dfca981e4045b1bb2f1e7fef0e3e8825c028949d186cad4c00
      },
    ];
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve.fallback,
          fs: false
        }
      };
    }
    Object.assign(config.resolve.alias, {
      '@mongodb-js/zstd': false,
      '@aws-sdk/credential-providers': false,
      snappy: false,
      aws4: false,
      'mongodb-client-encryption': false,
      kerberos: false,
      'supports-color': false,
      'bson-ext': false,
      'pg-native': false
    });
    config.module = {
      ...config.module,
      rules: config.module.rules.concat([
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          use: ['@svgr/webpack']
        }
      ]),
      exprContextCritical: false,
      unknownContextCritical: false
    };

    return config;
  },
  transpilePackages: ['@fastgpt/*'],
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'winston', 'winston-mongodb', 'pg'],
    outputFileTracingRoot: path.join(__dirname, '../../')
  }
};

module.exports = nextConfig;
