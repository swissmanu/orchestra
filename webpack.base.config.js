const join = require('path').join
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: [ join(__dirname, 'src', 'client', 'index.jsx') ],

  output: {
    filename: 'app.js',
    path: join(__dirname, 'dist'),
    publicPath: '/dist/'
  },

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.scss']
  },

  module: {
    loaders: [
      // { test: /\.tsx?$/, loader: 'ts-loader' }, // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      //{ test: /\.jsx?$/, loader: 'babel', exclude: /(node_modules)/, query: { presets: ['react', 'es2015'] } }
    //   { test: /\.html$/, loader: 'file?name=[name].[ext]' }

      { test: /\.scss$/, loader: ExtractTextPlugin.extract('css!sass') },
      { test: /\.woff$/, loader: 'url-loader?limit=100000' }

    ]
  },

  plugins: [
    new ExtractTextPlugin('styles.css')
  ]
}
