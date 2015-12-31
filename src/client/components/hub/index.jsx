import React from 'react'
import Activities from './activities'
import { setSelectedHubByUuid } from '../../actions/hubs'
import { fetchActivitiesForHubWithUuidIfNeeded } from '../../actions/activities'
import { connect } from 'react-redux'

class Hub extends React.Component {
  componentWillMount () {
    const hubUuid = this.props.params.uuid

    this.props.dispatch(setSelectedHubByUuid(hubUuid))
    this.props.dispatch(fetchActivitiesForHubWithUuidIfNeeded(hubUuid))
  }

  render () {
    return (
      <div className='l-content l-container'>
        <Activities className='l-sidebar nav is-second-level' />
        <div className='l-content'>Controls etc.</div>
      </div>
    )
  }
}

export default connect()(Hub)
