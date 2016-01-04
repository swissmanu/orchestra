const webpack = require('webpack')
const webpackTargetElectronRenderer = require('webpack-target-electron-renderer')
const config = require('./webpack.base.config.js')
const join = require('path').join
const fs = require('fs')

config.entry.electron = join(__dirname, 'src/electron/index.js')

config.module.loaders = config.module.loaders.concat([
  { test: /\.jsx?$/, loaders: ['babel-loader?presets[]=react,presets[]=es2015'], exclude: /(node_modules)/ }
])

config.plugins = config.plugins.concat([
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({
    '__DEV__': false,
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      screw_ie8: true,
      warnings: false
    }
  })
])

// thx http://jlongster.com/Backend-Apps-with-Webpack--Part-I :
config.externals = {}
fs.readdirSync('node_modules')
  .filter((module) => module !== '.bin')
  .forEach((module) => config.externals[module] = 'commonjs ' + module)
config.target = webpackTargetElectronRenderer(config)

module.exports = config
