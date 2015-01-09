var Reflux = require('reflux')
	, activityActions = require('../actions/activityActions')
	, $ = require('jquery')
	, q = require('q');


function loadActivities(hubUuid) {
	var deferred = q.defer();
	console.log(hubUuid);
	$.get('/api/hubs/' + hubUuid + '/activities', function(activities) {
		deferred.resolve(activities);
	});

	return deferred.promise;
}

function triggerActivity(hubUuid, activityId) {
	var deferred = q.defer();

	$.post('/api/hubs/' + hubUuid + '/activities/' + activityId + '/on', function() {
		deferred.resolve();
	});

	return deferred.promise;
}

module.exports = Reflux.createStore({
	listenables: [activityActions]

	, onLoadActivities: function(hubUuid) {
		loadActivities(hubUuid)
			.then(activityActions.loadActivitiesCompleted)
			.catch(activityActions.loadActivitiesFailed);
	}

	, onLoadActivitiesCompleted: function(activities) {
		this.activities = activities;
		this.trigger(activities);
	}

	, onLoadActivitiesFailed: function() {

	}
	

	, onTriggerActivity: function(hubUuid, activityId) {
		this.activities.some(function(activity) {
			if(activity.id === activityId) {
				activity.pending = true;
				return true;
			}
		});
		this.trigger(this.activities);

		triggerActivity(hubUuid, activityId)
			.then(activityActions.triggerActivityCompleted.bind(this, activityId))
			.catch(activityActions.triggerActivityFailed.bind(this, activityId))
	}

	, onTriggerActivityCompleted: function(activityId) {
		this.activities.some(function(activity) {
			if(activity.id === activityId) {
				activity.pending = false;
				return true;
			}
		});

		this.trigger(this.activities);
	}

	, onTriggerActivityFailed: function() {

	}
});
