var React = require('react')
var Activities = require('./activities')

var Hub = React.createClass({
  render: function () {
    return (
      <div className='l-content l-container'>
        <Activities className='l-sidebar nav is-second-level' />
        <div className='l-content'>Controls etc.</div>
      </div>
    )
  }
})

module.exports = Hub
