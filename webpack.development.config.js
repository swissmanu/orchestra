const webpack = require('webpack')
const config = require('./webpack.base.config.js')

config.entry.client = config.entry.client.concat([
  'webpack/hot/dev-server'
])

//config.output.publicPath = 'dist/'

config.module.loaders = config.module.loaders.concat([
  { test: /\.jsx?$/, loaders: ['react-hot', 'babel-loader?presets[]=react,presets[]=es2015'], exclude: /(node_modules)/ }
])

config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin()
])

module.exports = config
