import React from 'react'

import Activity from './activity'
import {
  fetchActivitiesForHubWithUuidIfNeeded,
  triggerActivityWithIdForHubWithUuid
} from '../actions/activities'

import { connect } from 'react-redux'
import ACTIVITY_STATUS from '../utils/activityStatus'
import isNumber from 'amp-is-number'
import classnames from 'classnames'

function selectHubForUuid (state, selectedHubUuid) {
  if (selectedHubUuid != null) {
    const selectedHub = state.hubs.items
      .filter((hub) => hub.uuid === selectedHubUuid)
      .pop()
    return selectedHub
  }
}

function selectActivitiesFromHub (hub) {
  if (hub != null) {
    hub.activities.items = hub.activities.items
      .sort((a, b) => {
        const aIsNumber = isNumber(a.activityOrder)
        const bIsNumber = isNumber(b.activityOrder)

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
    return hub.activities
  }
}

function selectCurrentActivityFromHub (hub) {
  if (hub != null) {
    const currentActivity = (hub.activities.items || [])
      .filter((activity) => activity.activityStatus === ACTIVITY_STATUS.STARTED)
      .pop()
    return currentActivity
  }
}

function select (state) {
  const selectedHubUuid = state.selectedHub
  const selectedHub = selectHubForUuid(state, selectedHubUuid)

  return {
    selectedHub,
    activities: selectActivitiesFromHub(selectedHub),
    currentActivity: selectCurrentActivityFromHub(selectedHub)
  }
}

class Activities extends React.Component {
  componentWillMount () {
    this.updateWithSelectedHubUuid(this.props.params.hubUuid)
  }

  componentWillReceiveProps (nextProps) {
    this.updateWithSelectedHubUuid(nextProps.params.hubUuid)
  }

  updateWithSelectedHubUuid (hubUuid) {
    this.props.dispatch(fetchActivitiesForHubWithUuidIfNeeded(hubUuid))
  }

  onClickActivity (hubUuid, activityId, event) {
    event.preventDefault()
    this.props.dispatch(triggerActivityWithIdForHubWithUuid(activityId, hubUuid))
  }

  render () {
    const { selectedHub, activities, currentActivity } = this.props
    const hasStartedActivity = (activities.items || [])
      .some((activity) => activity.activityStatus !== ACTIVITY_STATUS.OFF)

    if (selectedHub == null) {
      return (<div />)
    }
    return (
      <div className='l-content l-container'>
        { this.renderList(activities.items, currentActivity, selectedHub) }
        { (() => { if (hasStartedActivity) { return <div className='l-content' /> } })() }
      </div>
    )
  }

  renderList (activityItems = [], currentActivity, selectedHub = {}) {
    const self = this
    const hubUuid = selectedHub.uuid
    const isTurningOff = activityItems.some((activity) => activity.activityStatus === ACTIVITY_STATUS.TURNING_OFF)

    if (currentActivity == null && !isTurningOff) {
      activityItems = activityItems
        .filter((activity) => activity.id !== '-1')
    }

    return (
      <ol className='l-sidebar nav is-second-level'>{
        activityItems.map((activity) => {
          const isOnOrTurningOn = activity.id !== '-1' && (activity.activityStatus === ACTIVITY_STATUS.STARTING || activity.activityStatus === ACTIVITY_STATUS.STARTED)
          const isPendingTurnOffActivity = activity.id === '-1' && isTurningOff
          const linkClasses = classnames({
            'is-selected': isOnOrTurningOn || isPendingTurnOffActivity
          })

          return (
            <li key={ activity.id } className='item'>
              <a href='' className={ linkClasses } onClick={ self.onClickActivity.bind(self, hubUuid, activity.id) }>
                <Activity activity={ activity } isHubTurningOff={ isTurningOff } />
              </a>
            </li>
          )
        })
      }</ol>
    )
  }
}

Activities.propTypes = {
  params: React.PropTypes.shape({
    hubUuid: React.PropTypes.string
  }),
  dispatch: React.PropTypes.func,
  activities: React.PropTypes.shape({
    items: React.PropTypes.array,
    isFetching: React.PropTypes.bool
  }),
  currentActivity: React.PropTypes.object,
  selectedHub: React.PropTypes.object
}

module.exports = connect(select)(Activities)
