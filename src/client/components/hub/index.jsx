import React from 'react'
import Activities from './activities'

export default class Hub extends React.Component {
  render () {
    return (
      <div className='l-content l-container'>
        <Activities className='l-sidebar nav is-second-level' />
        <div className='l-content'>Controls etc.</div>
      </div>
    )
  }
}
