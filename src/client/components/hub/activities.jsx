import React from 'react'
import Activity from './activity'
import Spinner from '../spinner'
import { triggerActivityWithIdForHubWithUuid } from '../../actions/activities'
import { connect } from 'react-redux'
import ACTIVITIY_STATUS from '../../utils/activityStatus'
import isNumber from 'amp-is-number'

function select (state) {
  const selectedHubUuid = state.selectedHub
  const selectedHub = state.hubs.items
    .filter((hub) => hub.uuid === selectedHubUuid)
    .pop()

  return {
    activities: selectedHub.activities,
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
    const hubUuid = self.props.hubUuid

    activities = self._sortActivities(activities)
    return (
      <ol>{
        activities.map(function (activity) {
          let linkClassNames

          if (activity.activityStatus === ACTIVITIY_STATUS.STARTING || activity.activityStatus == ACTIVITIY_STATUS.STARTED) {
            linkClassNames += ' is-selected' // reuse the nav components ability to show selected items
          }

          return (
            <li key={ activity.id } className='item activity'>
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

Activities.propTypes = {
  className: React.PropTypes.string,
  dispatch: React.PropTypes.func,
  activities: React.PropTypes.shape({
    items: React.PropTypes.array,
    isFetching: React.PropTypes.bool
  })
}

module.exports = connect(select)(Activities)
