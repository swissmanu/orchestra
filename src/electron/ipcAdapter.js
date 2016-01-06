'use strict'

const q = require('q')
const JsApi = require('orchestra-jsapi')
const IPCAdapter = require('../shared/ipcAdapter')

class ElectronIPCAdapter extends IPCAdapter {
  constructor (ipcMain, webContents) {
    super(webContents.send.bind(webContents), ipcMain.on.bind(ipcMain))

    const self = this

    self.jsApi = new JsApi()

    self.jsApi.on('discoveredHubs', (hubs) => {
      self.tell('discoveredHubs', { hubs })
    })

    self.jsApi.on('stateDigest', function (stateDigest) {
      self.tell('stateDigest', { stateDigest })
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
      return q.when()
    })
  }
}

module.exports = ElectronIPCAdapter
