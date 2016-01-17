import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute } from 'react-router'

import { configureStore } from '../store'

import App from '../components/app'
import Welcome from '../components/welcome'
import Activities from '../components/activities'
import stateDigestAdapter from '../utils/stateDigestAdapter'

// Create and setup the redux store:
const store = configureStore()
stateDigestAdapter(store.dispatch)

export default class Root extends React.Component {
  render () {
    return (
      <Provider store={ store }>
        <div>
          <Router>
            <Route path='/' component={ App } >
              <IndexRoute component={ Welcome } />
              <Route path='/hub/:hubUuid' component={ Activities } />
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
