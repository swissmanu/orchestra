import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute } from 'react-router'

import { configureStore } from '../store'
import { syncReduxAndRouter } from 'redux-simple-router'
import { createHistory } from 'history'

import App from '../components/app'
import Welcome from '../components/welcome'
import Hub from '../components/hub'
import stateDigestAdapter from '../utils/stateDigestAdapter'

// Create and setup the redux store:
const store = configureStore()
const history = createHistory()
syncReduxAndRouter(history, store)
stateDigestAdapter(store.dispatch)

export default class Root extends React.Component {
  render () {
    return (
      <Provider store={ store }>
        <div>
          <Router>
            <Route path='/' component={ App } >
              <IndexRoute component={ Welcome } />
              <Route path='/hub/:uuid' component={ Hub } />
            </Route>
          </Router>
          {
            (() => {
              if (process.env.NODE_ENV !== 'production') {
                const DevTools = require('./devTools')
                return <DevTools />
              }
            })()
          }
        </div>
      </Provider>
      )
  }
}
