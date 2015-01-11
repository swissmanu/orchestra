var Primus = require('./primusClient')
	, EventEmitter = require('events').EventEmitter
	, util = require('util')
	, $ = require('jquery')
	, q = require('q')
	, isString = require('amp-is-string');


var Api = function() {
	var self = this;

	self._primus = new Primus('ws://localhost:8080');

	self._primus.write({ action: 'subscribe', topic: 'discoveredHubs' });
	self._primus.write({ action: 'subscribe', topic: 'stateDigest' });

	self._primus.on('data', function(data) {
		if(isString(data.topic)) {
			if(data.topic === 'discoveredHubs') {
				self.emit('discoveredHubs', data.data);
			} else if(data.topic === 'stateDigest') {
				self.emit('stateDigest', data.data);
			}
		}
	});

	EventEmitter.call(this);
};
util.inherits(Api, EventEmitter);

Api.prototype.getHubs = function getHubs() {
	var deferred = q.defer();

	$.get('/api/hubs', function(hubs) {
		deferred.resolve(hubs);
	});

	return deferred.promise;
};

Api.prototype.loadActivities = function loadActivities(hubUuid) {
	var deferred = q.defer();

	$.get('/api/hubs/' + hubUuid + '/activities', function(activities) {
		deferred.resolve(activities);
	});

	return deferred.promise;
};

Api.prototype.getStartedActivityForHubWithUuid = function getStartedActivityForHubWithUuid(hubUuid) {
	var deferred = q.defer();

	$.get('/api/hubs/' + hubUuid + '/activities/current', function(startedActivity) {
		deferred.resolve(startedActivity);
	});

	return deferred.promise;
};

Api.prototype.triggerActivity = function triggerActivity(hubUuid, activityId) {
	var deferred = q.defer();

	$.post('/api/hubs/' + hubUuid + '/activities/' + activityId + '/on', function() {
		deferred.resolve();
	});

	return deferred.promise;
};


module.exports = new Api();

