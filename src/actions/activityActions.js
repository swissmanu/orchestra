var Reflux = require('reflux')
	, $ = require('jquery');

var ActivityActions = Reflux.createActions([
	'loadActivities'
	, 'loadActivitiesCompleted'
	, 'loadActivitiesFailed'

	, 'triggerActivity'
	, 'triggerActivityCompleted'
	, 'triggerActivityFailed'
]);

module.exports = ActivityActions;
