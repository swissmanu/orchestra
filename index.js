var express = require('express')
	, app = express()
	, join = require('path').join

app.use(express.static(join(__dirname, 'src')));

module.exports = app;