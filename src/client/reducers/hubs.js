import { FETCH_HUBS_REQUEST, FETCH_HUBS_SUCCESS, FETCH_HUBS_FAILED, INVALIDATE_HUBS } from '../actions/hubs'
import { FETCH_ACTIVITIES_REQUEST, FETCH_ACTIVITIES_SUCCESS, FETCH_ACTIVITIES_FAILED, INVALIDATE_ACTIVITIES } from '../actions/activities'

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

    case INVALIDATE_ACTIVITIES: {
      const index = lookupHubIndexByUuid(action.hubUuid, prevState.items)
      return extend(prevState, {
        items: [
          ...prevState.items.slice(0, index),
          extend(prevState.items[index].activities, { didInvalidate: true }),
          ...prevState.items.slice(index + 1)
        ]
      })
    }
    case FETCH_ACTIVITIES_REQUEST: {
      const index = lookupHubIndexByUuid(action.hubUuid, prevState.items)
      return extend(prevState, {
        items: [
          ...prevState.items.slice(0, index),
          extend(prevState.items[index], {
            activities: extend(prevState.items[index].activities, {
              isFetching: true,
              didInvalidate: false
            })
          }),
          ...prevState.items.slice(index + 1)
        ]
      })
    }
    case FETCH_ACTIVITIES_SUCCESS: {
      const index = lookupHubIndexByUuid(action.hubUuid, prevState.items)
      return extend(prevState, {
        items: [
          ...prevState.items.slice(0, index),
          extend(prevState.items[index], {
            activities: extend(prevState.items[index].activities, {
              isFetching: false,
              didInvalidate: false,
              lastUpdated: action.recivedAt,
              items: action.activities
            })
          }),
          ...prevState.items.slice(index + 1)
        ]
      })
    }
    case FETCH_ACTIVITIES_FAILED: {
      const index = lookupHubIndexByUuid(action.hubUuid, prevState.items)
      return extend(prevState, {
        items: [
          ...prevState.items.slice(0, index),
          extend(prevState.items[index], {
            activities: extend(prevState.items[index].activities, {
              isFetching: false
            })
          }),
          ...prevState.items.slice(index + 1)
        ]
      })
    }

    default:
      return prevState
  }
}

function lookupHubIndexByUuid (hubUuid, hubs) {
  let foundIndex = -1

  hubs.some((hub, index) => {
    if (hub.uuid === hubUuid) {
      foundIndex = index
      return true
    }
    return false
  })

  return foundIndex
}
