import { combineReducers } from 'redux'
import hubs from './hubs'
import { routeReducer } from 'redux-simple-router'

export default combineReducers({
  routing: routeReducer,
  hubs
})
