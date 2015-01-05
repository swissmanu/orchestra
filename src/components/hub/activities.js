var React = require('react')
	, Router = require('react-router')
	, hubStore = require('../../stores/hubStore')
	, hubActions = require('../../actions/hubActions')
	, q = require('q');

module.exports = React.createClass({
	mixins: [Router.State]

	, getInitialState: function() {
		this.load();
		return {
			hub: {}
			, activities: []
		};
	}
	
	, componentWillReceiveProps: function() {
		this.load();
	}
	
	, load: function() {
		var self = this
			, uuid = this.getParams().uuid;

		q.all([
			hubStore.getHub(uuid)
			, hubStore.getActivitiesForHubWithUuid(uuid)
		]).then(function(data) {
			self.setState({
				hub: data[0]
				, activities: data[1]
			});
		});
		
	}

	, _onClickActivity: function(activity, event) {
		event.preventDefault();
		hubActions.triggerActivity(this.state.hub, activity);
	}
	
	, render: function() {
		var self = this;
		
		/* jshint ignore:start */
		return (
			<ol className={ this.props.className }>{
				this.state.activities.map(function(activity) {
					return <li key={ activity.id } className="item"><a href="#" onClick={ self._onClickActivity.bind(this, activity) }>{ activity.label }</a></li>
				})
			}</ol>
		);
		/* jshint ignore:end */
	}
});