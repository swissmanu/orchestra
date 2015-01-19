var EventEmitter = require('events').EventEmitter
	, util = require('util')
	, q = require('q')
	, isString = require('amp-is-string')
	, jsApi = require('orchestra-jsapi');


var ApiAdapter = function() {
	var self = this;

	self._universe = new jsApi();

	self._universe.on('discoveredHubs', self.emit.bind(self, 'discoveredHubs'));
	self._universe.on('stateDigest', self.emit.bind(self, 'stateDigest'));

	EventEmitter.call(this);
};
util.inherits(ApiAdapter, EventEmitter);

ApiAdapter.prototype.getHubs = function getHubs() {
	return this._universe.getDiscoveredHubs();
};

ApiAdapter.prototype.loadActivities = function loadActivities(hubUuid) {
	return this._universe.getActivitiesForHubWithUuid(hubUuid);
};

ApiAdapter.prototype.getStartedActivityForHubWithUuid = function getStartedActivityForHubWithUuid(hubUuid) {
	return this._universe.getCurrentActivityForHub(hubUuid);
};

ApiAdapter.prototype.triggerActivity = function triggerActivity(hubUuid, activityId) {
	return this._universe.startActivityForHub(hubUuid, activityId);
};


module.exports = new ApiAdapter();

