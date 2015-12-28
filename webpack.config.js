var join = require('path').join
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    javascript: join(__dirname, 'src', 'index.tsx'),
    html: join(__dirname, 'src', 'index.html')
  },
  output: {
    filename: 'app.js',
    path: join(__dirname, 'dist')
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader' }, // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.html$/, loader: 'file?name=[name].[ext]' },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('css!sass') }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css')
  ]
}
