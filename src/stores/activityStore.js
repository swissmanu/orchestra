var Reflux = require('reflux')
	, activityActions = require('../actions/activityActions')
	, api = require('../api');

module.exports = Reflux.createStore({
	listenables: [activityActions]

	, init: function() {
		var self = this;

		api.on('stateDigest', function(stateDigest) {
			console.log('stateDigest', stateDigest);
		});
	}

	, onLoadActivities: function(hubUuid) {
		api.loadActivities(hubUuid)
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

		api.triggerActivity(hubUuid, activityId)
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
