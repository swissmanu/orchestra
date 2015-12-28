var Reflux = require('reflux')
var HubActions = require('../actions/hubActions')
var apiAdapter = require('../apiAdapter/js')

module.exports = Reflux.createStore({
  listenables: [HubActions],

  init: function () {
    var self = this

    apiAdapter.on('discoveredHubs', function (hubs) {
      self.trigger(hubs)
    })
  },

  onReloadHubs: function () {
    apiAdapter.getHubs()
      .then(HubActions.reloadHubsCompleted)
      .catch(HubActions.reloadHubsFailed)
  },

  onReloadHubsCompleted: function (hubs) {
    this.trigger(hubs)
  },

  onReloadHubsFailed: function () {}
})
