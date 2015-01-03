var React = require('react')
	, Router = require('react-router');

module.exports = React.createClass({
	mixins: [Router.State]

	, render: function() {
		var params = this.getParams();
		return (<div>Acitivites for { params.uuid }</div>);
	}
});