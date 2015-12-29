import {
    FETCH_HUBS_REQUEST,
    FETCH_HUBS_SUCCESS,
    FETCH_HUBS_FAILED,
    INVALIDATE_HUBS
} from '../actions/hubs'

const plainExtend = require('amp-extend')
const extend = (...targets) => plainExtend.apply(this, [{}].concat(targets))

export default function hubs (prevState = {}, action) {
  switch (action.type) {
    case INVALIDATE_HUBS:
      return extend(prevState, {
        didInvalidate: true
      })
    case FETCH_HUBS_REQUEST:
      return extend(prevState, {
        isFetching: true,
        didInvalidate: false
      })
    case FETCH_HUBS_SUCCESS:
      return extend(prevState, {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: action.recivedAt,
        items: action.hubs
      })
    case FETCH_HUBS_FAILED:
      return extend(prevState, {
        isFetching: false
      })
    default:
      return prevState
  }
}
