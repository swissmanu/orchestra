import { SET_SELECTED_HUB } from '../actions/hubs'

export default function selectedHub (prevState = '', action) {
  switch (action.type) {
    case SET_SELECTED_HUB:
      return action.hubUuid
    default:
      return prevState
  }
}
