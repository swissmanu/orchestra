var React = require('react')
	, Activities = require('./activities');

var Hub = React.createClass({
	
	render: function() {
		/* jshint ignore:start */
		return(
			<div className="l-content l-container">
				<Activities className="l-sidebar nav is-second-level" />
				<div className="l-content">Controls etc.</div>
			</div>
		);
		/* jshint ignore:end */
	}
});

module.exports = Hub;