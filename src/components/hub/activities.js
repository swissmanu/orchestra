var React = require('react')
	, Router = require('react-router')
	, hubStore = require('../../stores/hubStore')
	, hubActions = require('../../actions/hubActions')
	, Activity = require('./activity')
	, Spinner = require('../spinner')
	, q = require('q')
	, isNumber = require('amp-is-number');

var Activities = React.createClass({

	mixins: [Router.State]

	, getInitialState: function() {
		this._load();
		return {
			hub: {}
			, activities: []
			, loading: true
		};
	}

	, componentWillReceiveProps: function() {
		this._load();
	}

	, _load: function() {
		var self = this
			, uuid = this.getParams().uuid;

		self.setState({ loading: true });

		q.all([
			hubStore.getHub(uuid)
			, hubStore.getActivitiesForHubWithUuid(uuid)
		]).then(function(data) {
			self.setState({
				hub: data[0]
				, activities: self._sortActivities(data[1])
				, loading: false
			});
		});

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

	, _onClickActivity: function(hub, activity, event) {
		event.preventDefault();
		hubActions.triggerActivity(hub, activity);
	}

	, _renderLoadingIndicator: function() {
		return(
			/* jshint ignore:start */
			<div class="loading">
				<Spinner />
				Loading
			</div>
			/* jshint ignore:end */
		);
	}

	, _renderActivityList: function(activities) {
		var self = this;


		return (
			/* jshint ignore:start */
			<ol>{
				activities.map(function(activity) {
					return (
						<li key={ activity.id } className="item">
							<a href="" onClick={ self._onClickActivity.bind(self, self.state.hub, activity) }>
								<Activity activity={ activity } />
								<Spinner />
							</a>
						</li>
					)
				})
			}</ol>
			/* jshint ignore:end */
		);
	}

	, render: function() {
		var content;

		if(this.state.loading) {
			content = this._renderLoadingIndicator();
		} else {
			content = this._renderActivityList(this.state.activities);
		}

		return (
			/* jshint ignore:start */
			<div className={ this.props.className }>
				{ content }
			</div>
			/* jshint ignore:end */
		);


	}
});

module.exports = Activities;
