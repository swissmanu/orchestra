/** @jsx React.DOM */
/* jshint ignore:start */
var React = require('react')
	, HubList = require('./components/hubList')
	, HubActivities = require('./components/hubActivities')

	, Router = require('react-router')
	, Route = Router.Route
	, DefaultRoute = Router.DefaultRoute
	, RouteHandler = Router.RouteHandler
	, Link = Router.Link;

var App = React.createClass({
	getInitialState: function() {
		return {
			selectedHub: undefined
		};
	}
	
	, render: function() {
		return (
			<section>
				<aside>
					<HubList selectedHub={ this.state.selectedHub } />
				</aside>
				<div>
					<RouteHandler />
				</div>
			</section>
		);
	}
});

var routes = (
	<Route handler={App}>
		<Route name="hub" path="/hub/:uuid" handler={ HubActivities } />
	</Route>
);

Router.run(routes, Router.HistoryLocation, function(Handler) {
	React.render(<Handler/>, document.body)
});