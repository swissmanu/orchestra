var React = require('react')
var ReactDOM = require('react-dom')
import HubList from './components/hubList'
import { Provider } from 'react-redux'
import { configureStore } from './store'


import Welcome from './components/welcome'
import Hub from './components/hub'

import { Router, Route, IndexRoute } from 'react-router'
import { createHistory } from 'history'
import { syncReduxAndRouter } from 'redux-simple-router'

const store = configureStore()
const history = createHistory()
syncReduxAndRouter(history, store)






class App extends React.Component {
  render() {
    return (
      <section className='l-container'>
        <HubList className='l-sidebar nav' />
        { this.props.children }
      </section>
    )
  }
}

ReactDOM.render((
  <Provider store={ store }>
    <Router>
      <Route path='/' component={ App } >
        <IndexRoute component={ Welcome } />
        <Route path='/hub/:uuid' component={ Hub } />
      </Route>
    </Router>
  </Provider>
  ), document.getElementById('app'))
