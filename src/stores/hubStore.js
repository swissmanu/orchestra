var Reflux = require('reflux')
	, HubActions = require('../actions/hubActions')
	, $ = require('jquery')
	, q = require('q')
	, Primus = require('../primusClient');

function getHubs() {
	var deferred = q.defer();

	$.get('/api/hubs', function(hubs) {
		deferred.resolve(hubs);
	});

	return deferred.promise;
}

module.exports = Reflux.createStore({
	listenables: [HubActions]

	, init: function() {
		var self = this;

		this._primus = new Primus('ws://localhost:8080');

		this._primus.write({
			action: 'subscribe'
			, topic: 'discoveredHubs'
		});

		this._primus.on('data', function(data) {
			self.trigger(data.data);
		});
	}

	, onReloadHubs: function() {
		getHubs()
			.then(HubActions.reloadHubsCompleted)
			.catch(HubActions.reloadHubsFailed);
	}

	, onReloadHubsCompleted: function(hubs) {
		this.trigger(hubs);
	}

	, onReloadHubsFailed: function() {

	}
});
