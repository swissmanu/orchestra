const webpack = require('webpack')
const config = require('./webpack.base.config.js')

config.entry = config.entry.concat([
  'webpack/hot/dev-server'
])

config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin()
])

config.module.loaders = config.module.loaders.concat([
  { test: /\.jsx?$/, loaders: ['react-hot', 'babel-loader?presets[]=react,presets[]=es2015'], exclude: /(node_modules)/ }
])

module.exports = config
