/** @jsx React.DOM */
var React = require('react')
	, $ = require('jquery')
	, Reflux = require('reflux')
	, hubStore = require('../stores/hubStore')
	, hubActions = require('../actions/hubActions')
	, Link = require('react-router').Link;

var HubList = React.createClass({
	
	mixins: [Reflux.connect(hubStore, 'hubs')]
	
	, getInitialState: function() {
		return {
			hubs: []
		};
	}
	
	, componentDidMount: function() {
		hubActions.reloadHubs();
		
	}
	
	, render: function() {
		return(
			<ul>{
				this.state.hubs.map(function(hub) {
					return <li key={ hub.uuid }><Link to="hub" params={ hub }>{ hub.friendlyName }</Link></li>
				})
			}</ul>
		);
	}
});

module.exports = HubList;