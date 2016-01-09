import IPCAdapter from 'electron-ipc-adapter'
import { UPDATE_HUB_FROM_STATE_DIGEST } from '../actions/hubs'
const ipcRenderer = window.require('electron').ipcRenderer

const stateDigestIpcAdapter = new IPCAdapter(undefined, ipcRenderer.on.bind(ipcRenderer))

export default function (dispatch) {
  stateDigestIpcAdapter.registerTopic('stateDigest', (payload) => {
    const hubUuid = payload.hub.uuid
    const { activityId, activityStatus } = payload.stateDigest

    dispatch({
      type: UPDATE_HUB_FROM_STATE_DIGEST,
      hubUuid: hubUuid,
      activityId: activityId,
      activityStatus: activityStatus
    })

    return Promise.resolve()
  })
}
