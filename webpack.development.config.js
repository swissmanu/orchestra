const webpack = require('webpack')
const config = require('./webpack.base.config.js')

config.entry = config.entry.concat([
  'webpack/hot/dev-server'
])

config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin()
])

config.module.loaders = config.module.loaders.concat([
  { test: /\.jsx?$/, loader: 'babel-loader', exclude: /(node_modules)/, query: { presets: ['react', 'es2015'] } }
])

module.exports = config
