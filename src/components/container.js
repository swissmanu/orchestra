/** @jsx React.DOM */
var React = require('react')
	, HubList = require('./hubList');

var Container = React.createClass({
	render: function() {
		return <HubList />
	}
});

module.exports = Container;