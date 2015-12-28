var React = require('react')

var Welcome = React.createClass({
  getDefaultProps: function () {
    return {
      className: 'l-content'
    }
  },

  render: function () {
    return (
      <div className={ this.props.className }>
        <h2>Orchestra</h2>
      </div>
    )
  }
})

module.exports = Welcome
