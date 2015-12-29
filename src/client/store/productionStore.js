import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'

const finalCreateStore = applyMiddleware(thunk)(createStore)

export function configureStore () {
  const store = finalCreateStore(rootReducer, {})
  return store
}
