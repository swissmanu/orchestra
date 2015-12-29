if (process.env.NODE_ENV === 'production') {
  module.exports = require('./productionStore')
} else {
  module.exports = require('./devStore')
}
