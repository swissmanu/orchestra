import React from 'react'
import ActivityIndicator from './activityIndicator'
import ACTIVITIY_STATUS from '../utils/activityStatus'

export default class Activity extends React.Component {
  renderIcon (activity) {
    let icon

    if (activity.baseImageUri && activity.imageKey) {
      icon = <img src={ this.props.activity.baseImageUri + this.props.activity.imageKey } className='icon' />
    } else {
      icon = <i className='fa fa-film icon'></i>
    }

    return icon
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
