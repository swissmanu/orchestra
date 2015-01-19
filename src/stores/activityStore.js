var Reflux = require('reflux')
	, activityActions = require('../actions/activityActions')
	, apiAdapter = require('../apiAdapter/js')
	, q = require('q')
	, isNumber = require('amp-is-number')
	, isString = require('amp-is-string');

module.exports = Reflux.createStore({
	listenables: [activityActions]

	, init: function() {
		var self = this;

		apiAdapter.on('stateDigest', function(stateDigest) {
			if(stateDigest.hub.uuid === self._hubUuid) {
				console.log('got stateDigest', stateDigest);

				self.activities.forEach(function(activity) {
					activity.pending = false;
					activity.started = false;

					if(activity.id === stateDigest.stateDigest.activityId) {
						switch(stateDigest.stateDigest.activityStatus) {
							case 1:
								activity.pending = true;
								break;
							case 2:
								activity.started = true;
								break;
						}
					}
				});

				self.trigger(self.activities);
			}
		});
	}

	, onLoadActivities: function(hubUuid) {
		this._hubUuid = hubUuid;

		q.all([
			apiAdapter.loadActivities(hubUuid)
			, apiAdapter.getStartedActivityForHubWithUuid(hubUuid)
		])
			.then(function(results) {
				var activities = results[0]
					, currentActivity = results[1];

				activities.some(function(activity) {
					if(activity.id === currentActivity.id) {
						activity.started = true;
						return true;
					}
				});

				activityActions.loadActivitiesCompleted(activities);
			})
			.catch(activityActions.loadActivitiesFailed);
	}

	, onLoadActivitiesCompleted: function(activities) {
		this.activities = activities;
		this.trigger(activities);
	}

	, onLoadActivitiesFailed: function() {

	}


	, onTriggerActivity: function(hubUuid, activityId) {
		apiAdapter.triggerActivity(hubUuid, activityId)
			.then(activityActions.triggerActivityCompleted.bind(this, activityId))
			.catch(activityActions.triggerActivityFailed.bind(this, activityId))
	}

	, onTriggerActivityCompleted: function(activityId) {

	}

	, onTriggerActivityFailed: function() {

	}
});
