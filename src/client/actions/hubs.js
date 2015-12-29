const ipcRenderer = window.require('electron').ipcRenderer

export const INVALIDATE_HUBS = 'INVALIDATE_HUBS'
export const FETCH_HUBS_REQUEST = 'FETCH_HUBS_REQUEST'
export const FETCH_HUBS_SUCCESS = 'FETCH_HUBS_SUCCESS'
export const FETCH_HUBS_FAILED = 'FETCH_HUBS_FAILED'

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

    ipcRenderer.send('IPCAdapter', { topic: 'getHubs' })
    ipcRenderer.on('IPCAdapter', function (event, envelope) {
      if (envelope.topic === 'getHubs-reply' && Array.isArray(envelope.hubs)) {
        dispatch(receiveHubs(envelope.hubs))
      }
    })
  }
}

function shouldFetchHubs (state) {
  const hubs = state.hubs

  if (!hubs || !hubs.items || hubs.items.length === 0) { return true }
  if (hubs.isFetching) { return false }
  return hubs.didInvalidate
}
