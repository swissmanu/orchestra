/** @jsx React.DOM */
var React = require('react');

var HubList = React.createClass({
	getInitialState: function() {
		return {
			hubs: []
		};
	}
	
	, componentDidMount: function() {
		var self = this;
		
		$.get('http://localhost:8080/api/hubs', function(hubs) {
			self.setState({ hubs: hubs });
		});
	}
	
	, render: function() {
		return(
			<ul>{
				this.state.hubs.map(function(hub) {
					return <li key={ hub.uuid }>{ hub.friendlyName }</li>
				})
			}</ul>
		);
	}
});

module.exports = HubList;