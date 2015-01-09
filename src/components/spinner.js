var React = require('react');

var Spinner = React.createClass({
	render: function() {
		return(
			/* jshint ignore:start */
			<i className="fa fa-cog fa-spin spinner"></i>
			/* jshint ignore:end */
		);
	}
});

module.exports = Spinner;
