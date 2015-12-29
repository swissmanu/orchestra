import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import DevTools from '../containers/devTools'
import { persistState } from 'redux-devtools'

const finalCreateStore = compose(
    applyMiddleware(thunk),
    DevTools.instrument(),
    persistState(getDebugSessionKey())
)(createStore)

function getDebugSessionKey () {
  // You can write custom logic here!
  // By default we try to read the key from ?debug_session=<key> in the address bar
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/)
  return (matches && matches.length > 0) ? matches[1] : null
}

export function configureStore () {
  const store = finalCreateStore(rootReducer, {})

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers'))
    )
  }

  return store
}
