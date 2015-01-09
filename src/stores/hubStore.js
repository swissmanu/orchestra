var Reflux = require('reflux')
	, HubActions = require('../actions/hubActions')
	, $ = require('jquery')
	, q = require('q');


function getHubs() {
	var deferred = q.defer();

	$.get('/api/hubs', function(hubs) {
		deferred.resolve(hubs);
	});

	return deferred.promise;
}

module.exports = Reflux.createStore({
	listenables: [HubActions]

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
