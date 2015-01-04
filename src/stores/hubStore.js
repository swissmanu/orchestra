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
		getHubs().then(this.updateHubs);
	}
	
	, getHub: function(uuid) {
		var deferred = q.defer();
		
		getHubs()
			.then(function(hubs) {
				hubs = hubs.filter(function(hub) {
					return hub.uuid === uuid;
				});
				
				if(hubs.length === 1) {
					deferred.resolve(hubs[0]);
				} else {
					deferred.reject();
				}
			});
		
		return deferred.promise;
	}
	
	, getActivitiesForHubWithUuid: function(uuid) {
		var deferred = q.defer();

		$.get('/api/hubs/' + uuid + '/activities', function(activities) {
			deferred.resolve(activities);
		});

		return deferred.promise;
	}
	
	, updateHubs: function(hubs) {
		this.trigger(hubs);
	}
});