/** @jsx React.DOM */
var React = require('react')
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
		/* jshint ignore:start */
		return(
			<ul className={ this.props.className }>{
				this.state.hubs.map(function(hub) {
					return <li key={ hub.uuid } className="item"><Link to="hub" params={ hub }>{ hub.friendlyName }</Link></li>
				})
			}</ul>
		);
		/* jshint ignore:end */
	}
});

module.exports = HubList;