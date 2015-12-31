import React from 'react'
import { connect } from 'react-redux'
import { fetchHubsIfNeeded } from '../actions/hubs'
import { Link } from 'react-router'

function select (state) {
  return {
    hubs: state.hubs,
    routing: state.routing
  }
}

class HubList extends React.Component {
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
        var classNames = 'item'

        return (
          <li key={ hub.uuid } className={ classNames }>
            <Link to={ '/hub/' + hub.uuid } activeClassName='is-selected'>{ hub.friendlyName }</Link>
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

export default connect(select)(HubList)
