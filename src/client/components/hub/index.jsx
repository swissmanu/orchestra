import React from 'react'
import Activities from './activities'
import { setSelectedHubByUuid } from '../../actions/hubs'
import { connect } from 'react-redux'

class Hub extends React.Component {
  componentWillMount () {
    this.props.dispatch(setSelectedHubByUuid(this.props.params.uuid))
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
