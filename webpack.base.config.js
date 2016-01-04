const join = require('path').join
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    client: [join(__dirname, 'src', 'client', 'index.jsx')]
  },

  output: {
    path: join(__dirname, 'dist'),
    filename: '[name].js'
  },

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.scss']
  },

  module: {
    loaders: [
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('css!sass') },
      { test: /\.woff$/, loader: 'url-loader?limit=100000' }
    ]
  },

  plugins: [
    new ExtractTextPlugin('client.css')
  ]
}
