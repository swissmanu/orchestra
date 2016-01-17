import React from 'react'
import ActivityIndicator from './activityIndicator'

export default class LookingForHubs extends React.Component {
  render () {
    return (
      <div className='looking-for-hubs'>
        <div className='content'>
          <ActivityIndicator />
          <p>Looking for Hubs in your local network...</p>
        </div>
      </div>
    )
  }
}
