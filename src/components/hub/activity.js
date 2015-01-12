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
		} else {
			/* jshint ignore:start */
			icon = <i className="fa fa-film icon"></i>
			/* jshint ignore:end */
		}

		return icon;
	}

	, render: function() {
		var classNames = 'activity';

		if(this.props.activity.started) {
			classNames += ' is-started';
		}

		return (
			/* jshint ignore:start */
			<span className={ classNames }>
				{ this._renderIcon(this.props.activity) }
				<span className="label">{ this.props.activity.label }</span>
			</span>
			/* jshint ignore:end */
		)

	}
});

module.exports = Activity;
