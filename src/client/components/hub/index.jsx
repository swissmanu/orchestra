import React from 'react'
import Activities from './activities'
import { setSelectedHubByUuid } from '../../actions/hubs'
import { fetchActivitiesForHubWithUuidIfNeeded } from '../../actions/activities'
import { connect } from 'react-redux'

class Hub extends React.Component {
  componentWillMount () {
    this.updateWithSelectedHubUuid(this.props.params.uuid)
  }

  componentWillReceiveProps (nextProps) {
    this.updateWithSelectedHubUuid(nextProps.params.uuid)
  }

  updateWithSelectedHubUuid (hubUuid) {
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

Hub.propTypes = {
  dispatch: React.PropTypes.func,
  params: React.PropTypes.shape({
    uuid: React.PropTypes.string
  })
}

export default connect()(Hub)
