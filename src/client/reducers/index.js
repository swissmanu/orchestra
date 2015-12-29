import { combineReducers } from 'redux'
import hubs from './hubs'
import selectedHub from './selectedHub'
import { routeReducer } from 'redux-simple-router'

export default combineReducers({
  routing: routeReducer,
  selectedHub,
  hubs
})
