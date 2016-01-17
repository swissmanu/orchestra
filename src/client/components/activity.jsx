import React from 'react'
import ActivityIndicator from './activityIndicator'
import ACTIVITY_STATUS from '../utils/activityStatus'
import classnames from 'classnames'

export default class Activity extends React.Component {
  renderIcon (activity) {
    const { id, baseImageUri, imageKey } = activity
    const hasCustomIcon = false // activity.baseImageUri && activity.imageKey
    const classes = classnames('icon', {
      'ion-wifi': !hasCustomIcon && id !== '-1',
      'ion-power': !hasCustomIcon && id === '-1',
      'custom-icon': hasCustomIcon
    })

    if (hasCustomIcon) {
      const imageUrl = baseImageUri + imageKey
      return (<img src={ imageUrl } className={ classes } />)
    }
    return (<i className={ classes }></i>)
  }

  renderLabel (activity) {
    const { id, label } = activity
    const text = (id === '-1') ? 'Turn Off' : label
    return <span className='label'>{ text }</span>
  }

  render () {
    const { activity, isHubTurningOff } = this.props
    const { id, activityStatus } = activity
    const isPending = (activityStatus === ACTIVITY_STATUS.STARTING || (id === '-1' && isHubTurningOff))

    return (
      <span className='activity'>
        { this.renderIcon(activity) }
        { this.renderLabel(activity) }
        { (() => { if (isPending) { return <ActivityIndicator /> } })() }
      </span>
    )
  }
}

Activity.propTypes = {
  activity: React.PropTypes.shape({
    label: React.PropTypes.string.isRequired,
    baseImageUri: React.PropTypes.string,
    imageKey: React.PropTypes.string
  }),
  isHubTurningOff: React.PropTypes.bool
}
