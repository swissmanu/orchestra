var React = require('react')
	, Router = require('react-router')
	, hubStore = require('../../stores/hubStore')
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
		/* jshint ignore:start */
		return (
			<ol className={ this.props.className }>{
				this.state.activities.map(function(activity) {
					return <li key={ activity.id } className="item"><a href="#">{ activity.label }</a></li>
				})
			}</ol>
		);
		/* jshint ignore:end */
	}
});