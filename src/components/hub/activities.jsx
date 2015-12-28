var React = require('react')
var Reflux = require('reflux')
var Router = require('react-router')
var activityStore = require('../../stores/activityStore')
var activityActions = require('../../actions/activityActions')
var Activity = require('./activity')
var Spinner = require('../spinner')
var isNumber = require('amp-is-number')

var Activities = React.createClass({
  mixins: [
    Reflux.connect(activityStore, 'activities'),
    Router.State
  ],

  getInitialState: function () {
    activityActions.loadActivities(this.getParams().uuid)

    return {
      activities: []
    }
  },

  componentWillReceiveProps: function () {
    this.setState({ activities: [] })
    activityActions.loadActivities(this.getParams().uuid)
  },

  _sortActivities: function (activities) {
    return activities.sort(function (a, b) {
      var aIsNumber = isNumber(a.activityOrder)
      var bIsNumber = isNumber(b.activityOrder)

      if (aIsNumber && bIsNumber) {
        return a.activityOrder - b.activityOrder
      } else if (aIsNumber && !bIsNumber) {
        return 1
      } else if (!aIsNumber && bIsNumber) {
        return -1
      } else {
        return 0
      }
    })
  },

  _onClickActivity: function (hubUuid, activityId, event) {
    event.preventDefault()
    activityActions.triggerActivity(hubUuid, activityId)
  },

  _renderLoadingIndicator: function () {
    return (
      <div className='loading'>
        <span className='loading-spinner'><Spinner /></span>
        <span className='loading-text'>Fetching Activities...</span>
      </div>
    )
  },

  _renderActivityList: function (activities) {
    var self = this
    var hubUuid = self.getParams().uuid

    activities = this._sortActivities(activities)
    return (
      <ol>{
        activities.map(function (activity) {
          var classNames = 'item'

          if (activity.started) {
            classNames += ' is-selected' // reuse the nav components ability to show selected items
          }

          return (
            <li key={ activity.id } className={ classNames }>
              <a href='' onClick={ self._onClickActivity.bind(self, hubUuid, activity.id) }>
                <Activity activity={ activity } />
              </a>
            </li>
          )
        })
      }</ol>
    )
  },

  render: function () {
    var content
    var className = this.props.className + ' activities'

    if (this.state.activities.length === 0) {
      content = this._renderLoadingIndicator()
    } else {
      content = this._renderActivityList(this.state.activities)
    }

    return (
      <div className={ className }>
        { content }
      </div>
    )
  }
})

module.exports = Activities
