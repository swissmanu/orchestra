var React = require('react')
	, Router = require('react-router')
	, hubStore = require('../stores/hubStore')
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

	, render: function() {
		return (
			<div>
				<h2>Activities for { this.state.hub.friendlyName }</h2>
				<ol>{
					this.state.activities.map(function(activity) {
						return <li key={ activity.id }>{ activity.label }</li>
					})
				}</ol>
			</div>
		);
	}
});