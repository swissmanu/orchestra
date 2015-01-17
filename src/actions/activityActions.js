var Reflux = require('reflux');

var ActivityActions = Reflux.createActions([
	'loadActivities'
	, 'loadActivitiesCompleted'
	, 'loadActivitiesFailed'

	, 'triggerActivity'
	, 'triggerActivityCompleted'
	, 'triggerActivityFailed'
]);

module.exports = ActivityActions;
