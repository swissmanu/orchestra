import React from 'react'
import Activity from './activity'
import { triggerActivityWithIdForHubWithUuid } from '../actions/activities'
import { connect } from 'react-redux'
import ACTIVITIY_STATUS from '../utils/activityStatus'
import isNumber from 'amp-is-number'

function select (state) {
  const selectedHubUuid = state.selectedHub
  const selectedHub = state.hubs.items
    .filter((hub) => hub.uuid === selectedHubUuid)
    .pop()
  const currentActivity = (selectedHub.activities.items || [])
    .filter((activity) => activity.activityStatus === ACTIVITIY_STATUS.STARTED)
    .pop()

  return {
    activities: selectedHub.activities,
    currentActivity,
    hubUuid: selectedHub.uuid
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
    this.props.dispatch(triggerActivityWithIdForHubWithUuid(activityId, hubUuid))
  }

  _renderActivityList (activities = [], currentActivity = {}) {
    const self = this
    const hubUuid = self.props.hubUuid

    if (currentActivity.id === '-1') {
      activities = activities
        .filter((activity) => activity.id !== '-1')
    }
    activities = self._sortActivities(activities)

    return (
      <ol>{
        activities.map(function (activity) {
          let linkClassNames

          if (activity.activityStatus === ACTIVITIY_STATUS.STARTING || activity.activityStatus === ACTIVITIY_STATUS.STARTED) {
            linkClassNames += ' is-selected' // reuse the nav components ability to show selected items
          }

          return (
            <li key={ activity.id } className='item'>
              <a href='' className={ linkClassNames } onClick={ self._onClickActivity.bind(self, hubUuid, activity.id) }>
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
    let className = 'activities'
    const activitiesPresent = !this.props.activities.isFetching && Array.isArray(this.props.activities.items)

    if (activitiesPresent) {
      content = this._renderActivityList(this.props.activities.items, this.props.currentActivity)
      className += ' l-sidebar nav is-second-level'
    }

    return (
      <div className={ className }>
        { content }
      </div>
    )
  }
}

Activities.propTypes = {
  className: React.PropTypes.string,
  dispatch: React.PropTypes.func,
  activities: React.PropTypes.shape({
    items: React.PropTypes.array,
    isFetching: React.PropTypes.bool
  }),
  currentActivity: React.PropTypes.object
}

module.exports = connect(select)(Activities)
