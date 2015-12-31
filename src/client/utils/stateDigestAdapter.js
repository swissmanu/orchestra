import { UPDATE_HUB_FROM_STATE_DIGEST } from '../actions/hubs'
const ipcRenderer = window.require('electron').ipcRenderer

export default function (dispatch) {
  ipcRenderer.on('IPCAdapter', (event, envelope) => {
    const { topic } = envelope

    if (topic === 'stateDigest') {
      const hubUuid = envelope.stateDigest.hub.uuid
      const { activityId, activityStatus } = envelope.stateDigest.stateDigest

      dispatch({
        type: UPDATE_HUB_FROM_STATE_DIGEST,
        hubUuid: hubUuid,
        activityId: activityId,
        activityStatus: activityStatus
      })
    }
  })
}
