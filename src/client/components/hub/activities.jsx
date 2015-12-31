import React from 'react'
import Activity from './activity'
import Spinner from '../spinner'
import { connect } from 'react-redux'
var isNumber = require('amp-is-number')

function select (state) {
  const selectedHubUuid = state.selectedHub
  const selectedHub = state.hubs.items
    .filter((hub) => hub.uuid === selectedHubUuid)
    .pop()

  return {
    activities: selectedHub.activities
  }
}

class Activities extends React.Component {
  componentWillReceiveProps () {
    // this.setState({ activities: [] })
    // activityActions.loadActivities(this.getParams().uuid)
  }

  _sortActivities (activities) {
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
  }

  _onClickActivity (hubUuid, activityId, event) {
    event.preventDefault()
    //activityActions.triggerActivity(hubUuid, activityId)
  }

  _renderLoadingIndicator () {
    return (
      <div className='loading'>
        <span className='loading-spinner'><Spinner /></span>
        <span className='loading-text'>Fetching Activities...</span>
      </div>
    )
  }

  _renderActivityList (activities = []) {
    const self = this

    activities = this._sortActivities(activities)
    return (
      <ol>{
        activities.map(function (activity) {
          var classNames = 'item'

          if (activity.started) {
            classNames += ' is-selected' // reuse the nav components ability to show selected items
          }
          // <a href='' onClick={ self._onClickActivity.bind(self, hubUuid, activity.id) }>
          return (
            <li key={ activity.id } className={ classNames }>
              <a href=''>
                <Activity activity={ activity } />
              </a>
            </li>
          )
        })
      }</ol>
    )
  }

  render () {
    let content
    const className = this.props.className + ' activities'

    if (this.props.activities.isFetching) {
      content = this._renderLoadingIndicator()
    } else {
      content = this._renderActivityList(this.props.activities.items)
    }

    return (
      <div className={ className }>
        { content }
      </div>
    )
  }
}

module.exports = connect(select)(Activities)
