import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'

const createStoreWithMiddlewares = applyMiddleware(thunk)(createStore)

export function configureStore () {
  const store = createStoreWithMiddlewares(rootReducer, {})
  return store
}
