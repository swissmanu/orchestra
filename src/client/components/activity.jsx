import React from 'react'
import ActivityIndicator from './activityIndicator'
import ACTIVITIY_STATUS from '../utils/activityStatus'
import classnames from 'classnames'

export default class Activity extends React.Component {
  renderIcon (activity) {
    const hasCustomIcon = activity.baseImageUri && activity.imageKey
    const classes = classnames('icon', {
      'ion-wifi': !hasCustomIcon && activity.id !== '-1',
      'ion-power': !hasCustomIcon && activity.id === '-1',
      'custom-icon': hasCustomIcon
    })

    if (hasCustomIcon) {
      const imageUrl = this.props.activity.baseImageUri + this.props.activity.imageKey
      return (<img src={ imageUrl } className={ classes } />)
    }
    return (<i className={ classes }></i>)
  }

  render () {
    const activity = this.props.activity
    const spinner = activity.activityStatus === ACTIVITIY_STATUS.STARTING ? <ActivityIndicator /> : undefined

    return (
      <span className='activity'>
        { this.renderIcon(activity) }
        <span className='label'>{ activity.label }</span>
        { spinner }
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
