var JsApi = require('orchestra-jsapi')
var IPCAdapterChannel = 'IPCAdapter'

function IPCAdapter (ipcMain, webContents) {
  var self = this
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
    }
  })
}

module.exports = IPCAdapter

// var ApiAdapter = function () {
//   var self = this
//
//   self._universe = new JsApi()
//
//   self._universe.on('discoveredHubs', self.emit.bind(self, 'discoveredHubs'))
//   self._universe.on('stateDigest', self.emit.bind(self, 'stateDigest'))
//
//   EventEmitter.call(this)
// }
// util.inherits(ApiAdapter, EventEmitter)
//
// ApiAdapter.prototype.getHubs = function getHubs () {
//   return this._universe.getDiscoveredHubs()
// }
//
// ApiAdapter.prototype.loadActivities = function loadActivities (hubUuid) {
//   return this._universe.getActivitiesForHubWithUuid(hubUuid)
// }
//
// ApiAdapter.prototype.getStartedActivityForHubWithUuid = function getStartedActivityForHubWithUuid (hubUuid) {
//   return this._universe.getCurrentActivityForHub(hubUuid)
// }
//
// ApiAdapter.prototype.triggerActivity = function triggerActivity (hubUuid, activityId) {
//   return this._universe.startActivityForHub(hubUuid, activityId)
// }
//
// module.exports = new ApiAdapter()
