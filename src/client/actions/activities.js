const ipcRenderer = window.require('electron').ipcRenderer

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
  ipcRenderer.send('IPCAdapter', {
    topic: 'startActivityForHub',
    hubUuid: hubUuid,
    activityId: activitiyId
  })

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

    ipcRenderer.send('IPCAdapter', { topic: 'getActivities', hubUuid: hubUuid })
    ipcRenderer.on('IPCAdapter', function (event, envelope) {
      if (envelope.topic === 'getActivities-reply' && envelope.hubUuid && Array.isArray(envelope.activities)) {
        dispatch(receiveActivities(envelope.hubUuid, envelope.activities))
      }
    })
  }
}

function shouldFetchActivitiesForHubWithUuid (state, hubUuid) {
  const hubs = state.hubs || { items: [] }
  const hub = hubs.items
    .filter((hub) => hub.uuid === hubUuid)
    .pop()

  if (!hub || !hub.activities || hub.activities.items.length === 0) { return true }
  if (hub.activities.isFetching) { return false }
  return hub.activities.didInvalidate
}
