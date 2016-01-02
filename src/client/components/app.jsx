import React from 'react'
import HubList from './hubList'

require('../scss/app.scss')

export default class App extends React.Component {
  render () {
    return (
      <section className='l-container'>
        <HubList className='l-sidebar nav' />
        { this.props.children }
      </section>
    )
  }
}

App.propTypes = {
  children: React.PropTypes.object
}