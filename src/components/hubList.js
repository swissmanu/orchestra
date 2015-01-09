/** @jsx React.DOM */
var React = require('react')
	, Reflux = require('reflux')
	, hubStore = require('../stores/hubStore')
	, hubActions = require('../actions/hubActions')
	, Router = require('react-router')
	, Link = Router.Link;

var HubList = React.createClass({
	mixins: [
		Reflux.connect(hubStore, 'hubs')
		, Router.State
	]

	, getInitialState: function() {
		return {
			hubs: []
		};
	}

	, componentDidMount: function() {
		hubActions.reloadHubs();
	}

	, render: function() {
		var uuidOfSelectedHub = this.getParams().uuid;

		/* jshint ignore:start */
		return(
			<ul className={ this.props.className }>{
				this.state.hubs.map(function(hub) {
					var classNames = 'item';

					if(uuidOfSelectedHub === hub.uuid) {
						classNames += ' is-selected';
					}

					return <li key={ hub.uuid } className={ classNames }><Link to="hub" params={ hub }>{ hub.friendlyName }</Link></li>
				})
			}</ul>
		);
		/* jshint ignore:end */
	}
});

module.exports = HubList;
