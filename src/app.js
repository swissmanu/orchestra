/** @jsx React.DOM */
/* jshint ignore:start */
var React = require('react')
	, Container = require('./container');

React.renderComponent(
	<Container />
	, document.getElementById('content')
);
