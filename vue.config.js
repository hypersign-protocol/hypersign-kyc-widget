const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  devServer: {
    https: false,
    port: 4888,
  },
  configureWebpack: {
    resolve: {
      fallback: {
        crypto: false, // Avoid overriding the 'fs' module,
        path: false,
        fs: false,
        timers: false,
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ]
  }
})
