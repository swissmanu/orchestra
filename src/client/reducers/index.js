import { combineReducers } from 'redux'
import selectedHub from './selectedHub'
import hubs from './hubs'

export default combineReducers({
  selectedHub,
  hubs
})
