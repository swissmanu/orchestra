import {
  FETCH_HUBS_REQUEST,
  FETCH_HUBS_SUCCESS,
  FETCH_HUBS_FAILED,
  INVALIDATE_HUBS,
  UPDATE_HUB_FROM_STATE_DIGEST,
  HUB_ONLINE,
  HUB_OFFLINE
} from '../actions/hubs'
import {
  FETCH_ACTIVITIES_REQUEST,
  FETCH_ACTIVITIES_SUCCESS,
  FETCH_ACTIVITIES_FAILED,
  INVALIDATE_ACTIVITIES
} from '../actions/activities'
import ACTIVITIY_STATUS from '../utils/activityStatus'

import { extend, replaceItemAtIndex } from '../utils/stateManipulation'

export default function hubs (prevState = {}, action) {
  switch (action.type) {
    case HUB_ONLINE:
      return extend(prevState, {
        items: [prepareHubState(action.hub)].concat(prevState.items)
      })
    case HUB_OFFLINE: {
      const index = lookupHubIndexByUuid(action.hub.uuid, prevState.items)
      return extend(prevState, {
        items: prevState.items.splice(index, 1)
      })
    }
    case UPDATE_HUB_FROM_STATE_DIGEST: {
      const index = lookupHubIndexByUuid(action.hubUuid, prevState.items)
      const { activityId, activityStatus } = action.stateDigest

      return extend(prevState, {
        items: replaceItemAtIndex(prevState.items, index,
          extend(prevState.items[index], {
            activities: extend(prevState.items[index].activities, {
              items: prevState.items[index].activities.items.map((activity) => {
                if (activity.id === activityId) {
                  return extend(activity, {
                    activityStatus: activityStatus
                  })
                } else {
                  return extend(activity, {
                    activityStatus: ACTIVITIY_STATUS.OFF
                  })
                }
              })
            })
          })
        )
      })
    }

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
        items: action.hubs.map(prepareHubState)
      })
    case FETCH_HUBS_FAILED:
      return extend(prevState, {
        isFetching: false
      })

    case INVALIDATE_ACTIVITIES: {
      const index = lookupHubIndexByUuid(action.hubUuid, prevState.items)
      return extend(prevState, {
        items: replaceItemAtIndex(prevState.items, index,
          extend(prevState.items[index].activities, { didInvalidate: true })
        )
      })
    }
    case FETCH_ACTIVITIES_REQUEST: {
      const index = lookupHubIndexByUuid(action.hubUuid, prevState.items)
      return extend(prevState, {
        items: replaceItemAtIndex(prevState.items, index,
          extend(prevState.items[index], {
            activities: extend(prevState.items[index].activities, {
              isFetching: true,
              didInvalidate: false
            })
          })
        )
      })
    }
    case FETCH_ACTIVITIES_SUCCESS: {
      const index = lookupHubIndexByUuid(action.hubUuid, prevState.items)
      return extend(prevState, {
        items: replaceItemAtIndex(prevState.items, index,
          extend(prevState.items[index], {
            activities: extend(prevState.items[index].activities, {
              isFetching: false,
              didInvalidate: false,
              lastUpdated: action.recivedAt,
              items: action.activities
            })
          })
        )
      })
    }
    case FETCH_ACTIVITIES_FAILED: {
      const index = lookupHubIndexByUuid(action.hubUuid, prevState.items)
      return extend(prevState, {
        items: replaceItemAtIndex(prevState.items, index,
          extend(prevState.items[index], {
            activities: extend(prevState.items[index].activities, {
              isFetching: false
            })
          })
        )
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

function prepareHubState (hub) {
  return extend(hub, {
    activities: {
      isFetching: false,
      items: []
    }
  })
}
