import React from 'react'
import Control from './control'

class ControlGroup extends React.Component {
  render () {
    const { name } = this.props.controlGroup
    const controls = this.props.controlGroup['function']
      .map((control) => <Control key={ `${name}-${control.name}` } control={ control } />)
      .map((control) => (<li>{ control }</li>))

    return (
        <li>{ name }
          <ul>{ controls }</ul>
        </li>
    )
  }
}

ControlGroup.propTypes = {
  controlGroup: React.PropTypes.shape({
    name: React.PropTypes.string,
    'function': React.PropTypes.array
  })
}

export default ControlGroup
