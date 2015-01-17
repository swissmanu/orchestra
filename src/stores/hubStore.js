var Reflux = require('reflux')
	, HubActions = require('../actions/hubActions')
	, api = require('../api');

module.exports = Reflux.createStore({
	listenables: [HubActions]

	, init: function() {
		var self = this;

		api.on('discoveredHubs', function(hubs) {
			self.trigger(hubs);
		});
	}

	, onReloadHubs: function() {
		api.getHubs()
			.then(HubActions.reloadHubsCompleted)
			.catch(HubActions.reloadHubsFailed);
	}

	, onReloadHubsCompleted: function(hubs) {
		this.trigger(hubs);
	}

	, onReloadHubsFailed: function() {

	}
});
