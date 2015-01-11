var React = require('react')
	, Reflux = require('reflux')
	, Router = require('react-router')
	, activityStore = require('../../stores/activityStore')
	, activityActions = require('../../actions/activityActions')
	, Activity = require('./activity')
	, Spinner = require('../spinner')
	, isNumber = require('amp-is-number');

var Activities = React.createClass({

	mixins: [
		Reflux.connect(activityStore, 'activities')
		, Router.State
	]

	, getInitialState: function() {
		activityActions.loadActivities(this.getParams().uuid);

		return {
			activities: []
		};
	}

	, componentWillReceiveProps: function() {
		this.setState({ activities: [] });
		activityActions.loadActivities(this.getParams().uuid);
	}

	, _sortActivities: function(activities) {
		return activities.sort(function(a, b) {
			var aIsNumber = isNumber(a.activityOrder)
				, bIsNumber = isNumber(b.activityOrder);

			if(aIsNumber && bIsNumber) {
				return a.activityOrder - b.activityOrder
			} else if(aIsNumber && !bIsNumber) {
				return 1;
			} else if(!aIsNumber && bIsNumber) {
				return -1;
			} else {
				return 0;
			}
		});
	}

	, _onClickActivity: function(hubUuid, activityId, event) {
		event.preventDefault();
		activityActions.triggerActivity(hubUuid, activityId);
	}

	, _renderLoadingIndicator: function() {
		return(
			/* jshint ignore:start */
			<div className="loading">
				<span className="loading-spinner"><Spinner /></span>
				<span className="loading-text">Fetching Activities...</span>
			</div>
			/* jshint ignore:end */
		);
	}

	, _renderActivityList: function(activities) {
		var self = this
			, hubUuid = self.getParams().uuid;

		activities = this._sortActivities(activities);
		return (
			/* jshint ignore:start */
			<ol>{
				activities.map(function(activity) {
					var spinner = activity.pending ? <Spinner /> : undefined;
					return (
						<li key={ activity.id } className="item">
							<a href="" onClick={ self._onClickActivity.bind(self, hubUuid, activity.id) }>
								<Activity activity={ activity } />
								{ spinner }
							</a>
						</li>
					)
				})
			}</ol>
			/* jshint ignore:end */
		);
	}

	, render: function() {
		var content
			, className = this.props.className + ' activities';

		if(this.state.activities.length === 0) {
			content = this._renderLoadingIndicator();
		} else {
			content = this._renderActivityList(this.state.activities);
		}

		return (
			/* jshint ignore:start */
			<div className={ className }>
				{ content }
			</div>
			/* jshint ignore:end */
		);


	}
});

module.exports = Activities;
