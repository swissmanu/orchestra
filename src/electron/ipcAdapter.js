'use strict'

const IPCResponder = require('electron-ipc-responder')
const JsApi = require('orchestra-jsapi')

class ElectronIPCAdapter extends IPCResponder {
  constructor (ipcMain, webContents) {
    super(webContents.send.bind(webContents), ipcMain.on.bind(ipcMain))

    const self = this

    self.jsApi = new JsApi()

    self.jsApi.on('hubOnline', (hub) => {
      self.tell('hubOnline', { hub })
    })

    self.jsApi.on('hubOffline', (hub) => {
      self.tell('hubOffline', { hub })
    })

    self.jsApi.on('stateDigest', function (stateDigestEvent) {
      const stateDigest = stateDigestEvent.stateDigest
      const hub = stateDigestEvent.hub
      self.tell('stateDigest', { stateDigest, hub })
    })

    self.registerTopic('getHubs', () => {
      return self.jsApi.getDiscoveredHubs().then((hubs) => { return { hubs } })
    })

    self.registerTopic('getActivities', (requestPayload) => {
      const hubUuid = requestPayload.hubUuid
      return self.jsApi.getActivitiesForHubWithUuid(hubUuid)
        .then((activities) => {
          return { hubUuid, activities }
        })
    })

    self.registerTopic('getCurrentActivityForHub', (requestPayload) => {
      const hubUuid = requestPayload.hubUuid
      return self.jsApi.getCurrentActivityForHub(hubUuid)
        .then(function (currentActivityId) {
          return { hubUuid, activityId: currentActivityId }
        })
    })

    self.registerTopic('startActivityForHub', (requestPayload) => {
      const activityId = requestPayload.activityId
      const hubUuid = requestPayload.hubUuid

      self.jsApi.startActivityForHub(hubUuid, activityId)
      return Promise.resolve()
    })
  }
}

module.exports = ElectronIPCAdapter
