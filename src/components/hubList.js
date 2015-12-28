/** @jsx React.DOM */
var React = require('react')
var Reflux = require('reflux')
var hubStore = require('../stores/hubStore')
var hubActions = require('../actions/hubActions')
var Router = require('react-router')
var Link = Router.Link

var HubList = React.createClass({
  mixins: [
    Reflux.connect(hubStore, 'hubs'),
    Router.State
  ],

  getInitialState: function () {
    return {
      hubs: []
    }
  },

  componentDidMount: function () {
    hubActions.reloadHubs()
  },

  render: function () {
    var uuidOfSelectedHub = this.getParams().uuid

    return (
      <ul className={ this.props.className }>{
        this.state.hubs.map(function (hub) {
          var classNames = 'item'

          if (uuidOfSelectedHub === hub.uuid) {
            classNames += ' is-selected'
          }

          return <li key={ hub.uuid } className={ classNames }><Link to='hub' params={ hub }>{ hub.friendlyName }</Link></li>
        })
      }</ul>
    )
  }
})

module.exports = HubList
