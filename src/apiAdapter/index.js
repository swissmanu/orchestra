var Primus = require('./primusClient')
	, EventEmitter = require('events').EventEmitter
	, util = require('util')
	, request = require('browser-request')
	, q = require('q')
	, isString = require('amp-is-string')
	, validTopics = ['discoveredHubs', 'stateDigest'];


var ApiAdapter = function() {
	var self = this;

	self._primus = new Primus('ws://localhost:8080');

	self._primus.write({ action: 'subscribe', topic: 'discoveredHubs' });
	self._primus.write({ action: 'subscribe', topic: 'stateDigest' });

	self._primus.on('data', function(data) {
		var topic = data.topic;
		if(isString(topic) && validTopics.indexOf(topic) !== -1) {
			self.emit(topic, data.data);
		}
	});

	EventEmitter.call(this);
};
util.inherits(ApiAdapter, EventEmitter);

ApiAdapter.prototype.getHubs = function getHubs() {
	var deferred = q.defer();

	request('/api/hubs', function(err, response, body) {
		deferred.resolve(JSON.parse(body));
	});

	return deferred.promise;
};

ApiAdapter.prototype.loadActivities = function loadActivities(hubUuid) {
	var deferred = q.defer();

	request('/api/hubs/' + hubUuid + '/activities', function(err, response, body) {
		deferred.resolve(JSON.parse(body));
	});

	return deferred.promise;
};

ApiAdapter.prototype.getStartedActivityForHubWithUuid = function getStartedActivityForHubWithUuid(hubUuid) {
	var deferred = q.defer();

	request('/api/hubs/' + hubUuid + '/activities/current', function(err, response, body) {
		deferred.resolve(JSON.parse(body));
	});

	return deferred.promise;
};

ApiAdapter.prototype.triggerActivity = function triggerActivity(hubUuid, activityId) {
	var deferred = q.defer();

	request.post({
		url: '/api/hubs/' + hubUuid + '/activities/' + activityId + '/on'
	}, function() {
		deferred.resolve();
	});

	return deferred.promise;
};


module.exports = new ApiAdapter();

