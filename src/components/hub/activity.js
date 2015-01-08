var React = require('react');

var Activity = React.createClass({
	
	propTypes: {
		activity: React.PropTypes.shape({
			label: React.PropTypes.string.isRequired
		})
	}
	
	, _renderIcon: function(activity) {
		var icon;
		
		if(activity.baseImageUri && activity.imageKey) {
			/* jshint ignore:start */
			icon = <img src={ this.props.activity.baseImageUri + this.props.activity.imageKey } className="icon" />
			/* jshint ignore:end */
		}
		
		return icon;
	}
	
	, render: function() {
		return (
			/* jshint ignore:start */
			<span className="activity">
				{ this._renderIcon(this.props.activity) }
				<span className="label">{ this.props.activity.label }</span>
			</span>
			/* jshint ignore:end */
		)
		
	}
});

module.exports = Activity;