import React from 'react'

class Control extends React.Component {
  render () {
    const { label, action } = this.props.control
    return (<div onClick={ this.onClickControl.bind(this, action) }>{ label }</div>)
  }

  onClickControl (action) {
    this.props.onExecuteAction(action)
  }
}

Control.propTypes = {
  onExecuteAction: React.PropTypes.func,
  control: React.PropTypes.shape({
    label: React.PropTypes.string,
    action: React.PropTypes.string
  })
}

export default Control
