const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  devServer: {
    https: false,
    port: process.env.NODE_ENV === 'production' ? 4888 : 4999,
  },
  configureWebpack: {
    resolve: {
      alias: {
        zlib: 'browserify-zlib',
      },
      fallback: {
        // crypto: false, // Avoid overriding the 'fs' module,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        constants: require.resolve('constants-browserify'),
        buffer: require.resolve('buffer'),
        path: false,
        fs: false,
        timers: false,
        zlib: 'browserify-zlib',
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
    ],
  },
})
