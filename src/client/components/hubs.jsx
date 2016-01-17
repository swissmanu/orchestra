import React from 'react'
import { connect } from 'react-redux'
import { fetchHubsIfNeeded } from '../actions/hubs'
import { Link } from 'react-router'
import ActivityIndicator from './activityIndicator'
import LookingForHubs from './lookingForHubs'
import { setSelectedHubByUuid } from '../actions/hubs'

function select (state) {
  return {
    hubs: state.hubs
  }
}

class Hubs extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.props.dispatch(fetchHubsIfNeeded())
  }

  updateSelectedHub (hubUuid) {
    this.props.dispatch(setSelectedHubByUuid(hubUuid))
  }

  renderHub (hub) {
    const isFetching = hub.activities != null && hub.activities.isFetching
    return (
      <div className='hub'>
        <span className='label'>{ hub.friendlyName }</span>
        { (() => { if (isFetching) { return <ActivityIndicator /> } })() }
      </div>
    )
  }

  render () {
    const self = this
    const { hubs } = this.props

    if (Array.isArray(hubs.items)) {
      const hubItems = hubs.items.map((hub) => (
          <li key={ hub.uuid } className='item'>
            <Link to={ '/hub/' + hub.uuid } onClick={ self.updateSelectedHub.bind(self, hub.uuid) } activeClassName='is-selected'>
              { this.renderHub(hub) }
            </Link>
          </li>
        )
      )

      return (<ul className='l-sidebar nav'>{ hubItems }</ul>)
    }

    return (<LookingForHubs />)
  }
}

export default connect(select)(Hubs)
