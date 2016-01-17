import IPCAdapter from 'electron-ipc-adapter'
import {
  newHubOnline,
  knownHubOffline,
  updateHubFromStateDigest
} from '../actions/hubs'

const ipcRenderer = window.require('electron').ipcRenderer
const realTimeIpcAdapter = new IPCAdapter(undefined, ipcRenderer.on.bind(ipcRenderer))

export default function (dispatch) {
  realTimeIpcAdapter.registerTopic('hubOnline', (payload) => {
    dispatch(newHubOnline(payload.hub))
    return Promise.resolve()
  })

  realTimeIpcAdapter.registerTopic('hubOffline', (payload) => {
    dispatch(knownHubOffline(payload.hub))
    return Promise.resolve()
  })

  realTimeIpcAdapter.registerTopic('stateDigest', (payload) => {
    const hubUuid = payload.hub.uuid
    const { stateDigest } = payload
    dispatch(updateHubFromStateDigest(hubUuid, stateDigest))

    return Promise.resolve()
  })
}
