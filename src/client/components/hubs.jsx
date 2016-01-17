import React from 'react'
import { connect } from 'react-redux'
import { fetchHubsIfNeeded } from '../actions/hubs'
import { Link } from 'react-router'
import ActivityIndicator from './activityIndicator'
import classnames from 'classnames'
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

  render () {
    const self = this
    const { hubs } = this.props
    let list

    if (Array.isArray(hubs.items)) {
      const hubItems = hubs.items.map((hub) => {
        const { activities } = hub

        return (
          <li key={ hub.uuid } className='item hub'>
            <Link to={ '/hub/' + hub.uuid } onClick={ self.updateSelectedHub.bind(self, hub.uuid) } activeClassName='is-selected'>
              { hub.friendlyName }
              {
                (() => {
                  if (activities != null && activities.isFetching) {
                    return <ActivityIndicator />
                  }
                })()
              }
            </Link>
          </li>
        )
      })
      list = (<ul className={ this.props.className }>{ hubItems }</ul>)
    } else {
      list = (<p>No hubs found</p>)
    }

    return list
  }
}

export default connect(select)(Hubs)