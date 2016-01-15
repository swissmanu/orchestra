import React from 'react'
import { connect } from 'react-redux'
import { fetchHubsIfNeeded } from '../actions/hubs'
import { Link } from 'react-router'
import ActivityIndicator from './activityIndicator'

function select (state) {
  return {
    hubs: state.hubs,
    routing: state.routing
  }
}

class Hubs extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.props.dispatch(fetchHubsIfNeeded())
  }

  render () {
    let list

    if (Array.isArray(this.props.hubs.items)) {
      let hubs = this.props.hubs.items.map((hub) => {
        const { activities } = hub

        return (
          <li key={ hub.uuid } className='item hub'>
            <Link to={ '/hub/' + hub.uuid } activeClassName='is-selected'>
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
      list = (<ul className={ this.props.className }>{ hubs }</ul>)
    } else {
      list = (<p>No hubs found</p>)
    }

    return list
  }
}

export default connect(select)(Hubs)
