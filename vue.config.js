const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  devServer: {
    https: false,
    port: 4999,
  },
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
          },
          // Separate large libraries
          vuetify: {
            test: /[\\/]node_modules[\\/]vuetify[\\/]/,
            name: 'vuetify',
            chunks: 'all',
            priority: 20,
          },
          crypto: {
            test: /[\\/]node_modules[\\/](@iden3|crypto-js|bip39)[\\/]/,
            name: 'crypto',
            chunks: 'all',
            priority: 15,
          },
          facephi: {
            test: /[\\/]node_modules[\\/]@facephi[\\/]/,
            name: 'facephi',
            chunks: 'all',
            priority: 15,
          },
        },
      },
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: process.env.NODE_ENV === 'production',
              drop_debugger: process.env.NODE_ENV === 'production',
            },
          },
        }),
      ],
    },
    resolve: {
      alias: {
        zlib: 'browserify-zlib',
      },
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        constants: require.resolve('constants-browserify'),
        buffer: require.resolve('buffer'),
        path: false,
        fs: false,
        timers: false,
        zlib: 'browserify-zlib',
        vm: false, // Fix the vm polyfill warning
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new webpack.NormalModuleReplacementPlugin(/node:crypto/, (resource) => {
        resource.request = resource.request.replace(/^node:/, '')
      }),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      // Add compression for production
      ...(process.env.NODE_ENV === 'production'
        ? [
            new CompressionPlugin({
              algorithm: 'gzip',
              test: /\.(js|css|html|svg)$/,
              threshold: 10240,
              minRatio: 0.8,
            }),
          ]
        : []),
    ],
  },
  chainWebpack: (config) => {
    // Remove unused CSS
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimize(true)
    }
  },
})
