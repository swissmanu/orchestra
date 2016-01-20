import React from 'react'

class Control extends React.Component {
  render () {
    const { label } = this.props.control
    return (<div>{ label }</div>)
  }
}

Control.propTypes = {
  control: React.PropTypes.shape({
    label: React.PropTypes.string
  })
}

export default Control
