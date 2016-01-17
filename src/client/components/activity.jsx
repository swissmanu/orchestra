import React from 'react'
import ActivityIndicator from './activityIndicator'
import ACTIVITY_STATUS from '../utils/activityStatus'
import classnames from 'classnames'

export default class Activity extends React.Component {
  renderIcon (activity) {
    const hasCustomIcon = false // activity.baseImageUri && activity.imageKey
    const classes = classnames('icon', {
      'ion-wifi': !hasCustomIcon && activity.id !== '-1',
      'ion-power': !hasCustomIcon && activity.id === '-1',
      'custom-icon': hasCustomIcon
    })

    if (hasCustomIcon) {
      const imageUrl = activity.baseImageUri + activity.imageKey
      return (<img src={ imageUrl } className={ classes } />)
    }
    return (<i className={ classes }></i>)
  }

  renderLabel (activity) {
    const text = activity.id === '-1' ? 'Turn Off' : activity.label
    return <span className='label'>{ text }</span>
  }

  render () {
    const activity = this.props.activity
    const isStarting = activity.activityStatus === ACTIVITY_STATUS.STARTING

    return (
      <span className='activity'>
        { this.renderIcon(activity) }
        { this.renderLabel(activity) }
        { (() => { if (isStarting) { return <ActivityIndicator /> } })() }
      </span>
    )
  }
}

Activity.propTypes = {
  activity: React.PropTypes.shape({
    label: React.PropTypes.string.isRequired,
    baseImageUri: React.PropTypes.string,
    imageKey: React.PropTypes.string
  })
}
