import ipcAdapter from '../utils/ipcAdapter'

export const INVALIDATE_HUBS = 'INVALIDATE_HUBS'
export const FETCH_HUBS_REQUEST = 'FETCH_HUBS_REQUEST'
export const FETCH_HUBS_SUCCESS = 'FETCH_HUBS_SUCCESS'
export const FETCH_HUBS_FAILED = 'FETCH_HUBS_FAILED'
export const SET_SELECTED_HUB = 'SET_SELECTED_HUB'
export const UPDATE_HUB_FROM_STATE_DIGEST = 'UPDATE_HUB_FROM_STATE_DIGEST'
export const HUB_ONLINE = 'HUB_ONLINE'
export const HUB_OFFLINE = 'HUB_OFFLINE'

export function setSelectedHubByUuid (hubUuid) {
  return {
    type: SET_SELECTED_HUB,
    hubUuid: hubUuid
  }
}

export function invalidateHubs () {
  return {
    type: INVALIDATE_HUBS
  }
}

export function fetchHubsIfNeeded () {
  return (dispatch, getState) => {
    if (shouldFetchHubs(getState())) {
      return dispatch(fetchHubs())
    }
  }
}

function requestHubs () {
  return { type: FETCH_HUBS_REQUEST }
}

function receiveHubs (hubs) {
  return {
    type: FETCH_HUBS_SUCCESS,
    hubs: hubs,
    recivedAt: Date.now()
  }
}

// function failedHubs (error) {
//   return {
//     type: FETCH_HUBS_FAILED,
//     error: error
//   }
// }

function fetchHubs () {
  return (dispatch) => {
    dispatch(requestHubs())
    ipcAdapter.getHubs()
      .then((hubs) => dispatch(receiveHubs(hubs)))
  }
}

function shouldFetchHubs (state) {
  const hubs = state.hubs

  if (!hubs || !hubs.items || hubs.items.length === 0) { return true }
  if (hubs.isFetching) { return false }
  return hubs.didInvalidate
}

export function updateHubFromStateDigest (hubUuid, stateDigest) {
  return {
    type: UPDATE_HUB_FROM_STATE_DIGEST,
    hubUuid: hubUuid,
    stateDigest: stateDigest
  }
}

export function newHubOnline (hub) {
  return {
    type: HUB_ONLINE,
    hub
  }
}

export function knownHubOffline (hub) {
  return {
    type: HUB_OFFLINE,
    hub
  }
}
