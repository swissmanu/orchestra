'use strict'

var JsApi = require('orchestra-jsapi')
var IPCAdapterChannel = 'IPCAdapter'

module.exports = class IPCAdapter {
  constructor (ipcMain, webContents) {
    var self = {}
    self.jsApi = new JsApi()

    this.webContents = webContents

    self.jsApi.on('discoveredHubs', function (hubs) {
      webContents.send(IPCAdapterChannel, {
        topic: 'discoveredHubs',
        hubs: hubs
      })
    })

    self.jsApi.on('stateDigest', function (stateDigest) {
      webContents.send(IPCAdapterChannel, {
        topic: 'stateDigest',
        stateDigest: stateDigest
      })
    })

    ipcMain.on(IPCAdapterChannel, function (event, envelope) {
      const topic = envelope.topic
      const id = envelope.id

      if (topic === 'getHubs') {
        self.jsApi.getDiscoveredHubs()
          .then(function (hubs) {
            event.sender.send(IPCAdapterChannel, {
              topic: topic,
              id: id,
              payload: {
                hubs: hubs
              }
            })
          })
      } else if (topic === 'getActivities') {
        var uuid = envelope.payload.hubUuid

        self.jsApi.getActivitiesForHubWithUuid(uuid)
          .then(function (activities) {
            event.sender.send(IPCAdapterChannel, {
              id: id,
              payload: {
                hubUuid: uuid,
                activities: activities
              }
            })
          })
      } else if (topic === 'startActivityForHub') {
        var hubUuid = envelope.payload.hubUuid
        var activityId = envelope.payload.activityId

        self.jsApi.startActivityForHub(hubUuid, activityId)
      } else if (topic === 'getCurrentActivityForHub') {
        var hubUuid = envelope.payload.hubUuid

        self.jsApi.getCurrentActivityForHub(hubUuid)
          .then(function (currentActivityId) {
            event.sender.send(IPCAdapterChannel, {
              topic: topic,
              id: id,
              payload: {
                hubUuid: hubUuid,
                activityId: currentActivityId
              }
            })
          })
      }
    })
  }
}
