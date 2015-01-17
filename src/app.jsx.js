/** @jsx React.DOM */
var React = require('react')
	, HubList = require('./components/hubList.jsx')
	, Hub = require('./components/hub.jsx')
	, Welcome = require('./components/welcome.jsx')

	, Router = require('react-router')
	, Route = Router.Route
	, RouteHandler = Router.RouteHandler
	, DefaultRoute = Router.DefaultRoute;

var App = React.createClass({

	render: function() {
		/* jshint ignore:start */
		return (
			<section className="l-container">
				<HubList className="l-sidebar nav" />
				<RouteHandler />
			</section>
		);
		/* jshint ignore:end */
	}

});


/* jshint ignore:start */
var routes = (
	<Route handler={App} path="/">
		<DefaultRoute handler={ Welcome } />
		<Route name="hub" path="/hub/:uuid" handler={ Hub } />
	</Route>
);

Router.run(routes/*, Router.HistoryLocation*/, function(Handler) {
	React.render(<Handler/>, document.body)
});
/* jshint ignore:end */
