import React from 'react'
import Control from './control'

class ControlGroup extends React.Component {
  render () {
    const { name } = this.props.controlGroup
    const controls = this.props.controlGroup['function']
      .map((control) => (<li key={ `${name}-${control.name}` }><Control control={ control } onExecuteAction={ this.onExecuteAction.bind(this, control) } /></li>))

    return (
        <li>{ name }
          <ul>{ controls }</ul>
        </li>
    )
  }

  onExecuteAction (control, action) {
    this.props.onExecuteAction(control, action)
  }
}

ControlGroup.propTypes = {
  onExecuteAction: React.PropTypes.func,
  controlGroup: React.PropTypes.shape({
    name: React.PropTypes.string,
    'function': React.PropTypes.array
  })
}

export default ControlGroup
