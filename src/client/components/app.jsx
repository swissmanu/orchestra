import React from 'react'
import Hubs from './hubs'

export default class App extends React.Component {
  render () {
    return (
      <section className='l-container'>
        <Hubs />
        { this.props.children }
      </section>
    )
  }
}

App.propTypes = {
  children: React.PropTypes.object
}
