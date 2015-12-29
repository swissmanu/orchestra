const isProduction = process.env.NODE_ENV === 'production'
const config = isProduction ? require('./webpack.production.config.js') : require('./webpack.development.config.js')

module.exports = config
