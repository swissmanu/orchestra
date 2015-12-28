var React = require('react')
var Spinner = require('../spinner')

var Activity = React.createClass({
  propTypes: {
    activity: React.PropTypes.shape({
      label: React.PropTypes.string.isRequired
    })
  },

  _renderIcon: function (activity) {
    var icon

    if (activity.baseImageUri && activity.imageKey) {
      icon = <img src={ this.props.activity.baseImageUri + this.props.activity.imageKey } className='icon' />
    } else {
      icon = <i className='fa fa-film icon'></i>
    }

    return icon
  },

  render: function () {
    var activity = this.props.activity
    var classNames = 'activity'
    var spinner = activity.pending ? <Spinner /> : undefined

    if (activity.started) {
      classNames += ' is-started'
    }

    return (
    <span className={ classNames }>
				{ this._renderIcon(activity) }
				<span className='label'>{ activity.label }</span>
				{ spinner }
			</span>
    )
  }
})

module.exports = Activity
