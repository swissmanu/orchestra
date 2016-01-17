import ipcAdapter from '../utils/ipcAdapter'

export const INVALIDATE_ACTIVITIES = 'INVALIDATE_ACTIVITIES'
export const FETCH_ACTIVITIES_REQUEST = 'FETCH_ACTIVITIES_REQUEST'
export const FETCH_ACTIVITIES_SUCCESS = 'FETCH_ACTIVITIES_SUCCESS'
export const FETCH_ACTIVITIES_FAILED = 'FETCH_ACTIVITIES_FAILED'
export const TRIGGER_ACTIVITY = 'TRIGGER_ACTIVITY'

export function invalidateActivitiesForHubWithUuid (hubUuid) {
  return {
    type: INVALIDATE_ACTIVITIES,
    hubUuid: hubUuid
  }
}

export function fetchActivitiesForHubWithUuidIfNeeded (hubUuid) {
  return (dispatch, getState) => {
    if (shouldFetchActivitiesForHubWithUuid(getState(), hubUuid)) {
      return dispatch(fetchActivitiesForHubWithUuid(hubUuid))
    }
  }
}

export function triggerActivityWithIdForHubWithUuid (activitiyId, hubUuid) {
  ipcAdapter.startActivityForHub(activitiyId, hubUuid)
  return {
    type: TRIGGER_ACTIVITY,
    activitiyId: activitiyId,
    hubUuid: hubUuid
  }
}

function requestActivities (hubUuid) {
  return { type: FETCH_ACTIVITIES_REQUEST, hubUuid: hubUuid }
}

function receiveActivities (hubUuid, activities) {
  return {
    type: FETCH_ACTIVITIES_SUCCESS,
    hubUuid: hubUuid,
    activities: activities,
    recivedAt: Date.now()
  }
}

// function failedHubs (error) {
//   return {
//     type: FETCH_HUBS_FAILED,
//     error: error
//   }
// }

function fetchActivitiesForHubWithUuid (hubUuid) {
  return (dispatch) => {
    dispatch(requestActivities(hubUuid))

    ipcAdapter.getActivities(hubUuid)
      .then((activities) => dispatch(
        receiveActivities(hubUuid, activities)
      ))
  }
}

function shouldFetchActivitiesForHubWithUuid (state, hubUuid) {
  const hubs = state.hubs || { items: [] }
  const hub = hubs.items
    .filter((hub) => hub.uuid === hubUuid)
    .pop()

  if (hub.activities.isFetching) { return false }
  if (hub.activities == null || hub.activities.items.length === 0) { return true }
  return hub.activities.didInvalidate
}
