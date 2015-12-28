/** @jsx React.DOM */
var React = require('react')
var HubList = require('./components/hubList')
var Hub = require('./components/hub')
var Welcome = require('./components/welcome')

var Router = require('react-router')
var Route = Router.Route
var RouteHandler = Router.RouteHandler
var DefaultRoute = Router.DefaultRoute

var App = React.createClass({
  render: function () {
    return (
      <section className='l-container'>
        <HubList className='l-sidebar nav' />
        <RouteHandler />
      </section>
    )
  }
})

var routes = (
  <Route handler={App} path='/'>
    <DefaultRoute handler={ Welcome } />
    <Route name='hub' path='/hub/:uuid' handler={ Hub } />
  </Route>
)

// Router.run(routes /*, Router.HistoryLocation*/, function (Handler) {
Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body)
})
