var JsApi = require('orchestra-jsapi')
var IPCAdapterChannel = 'IPCAdapter'

function IPCAdapter (ipcMain, webContents) {
  var self = {}
  self.jsApi = new JsApi()

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
    var topic = envelope.topic

    if (topic === 'getHubs') {
      self.jsApi.getDiscoveredHubs()
        .then(function (hubs) {
          event.sender.send(IPCAdapterChannel, {
            topic: 'getHubs-reply',
            hubs: hubs
          })
        })
    } else if (topic === 'getActivities') {
      var uuid = envelope.hubUuid
      self.jsApi.getActivitiesForHubWithUuid(uuid)
        .then(function (activities) {
          event.sender.send(IPCAdapterChannel, {
            topic: 'getActivities-reply',
            hubUuid: uuid,
            activities: activities
          })
        })
    } else if (topic === 'startActivityForHub') {
      var hubUuid = envelope.hubUuid
      var activityId = envelope.activityId
      self.jsApi.startActivityForHub(hubUuid, activityId)
    } else if (topic === 'getCurrentActivityForHub') {
      var hubUuid = envelope.hubUuid
      self.jsApi.getCurrentActivityForHub(hubUuid)
        .then(function (currentActivityId) {
          event.sender.send(IPCAdapterChannel, {
            topic: 'getCurrentActivityForHub-reply',
            hubUuid: hubUuid,
            activityId: currentActivityId
          })
        })
    }
  })
}

module.exports = IPCAdapter
