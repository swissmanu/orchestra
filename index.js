var express = require('express')
var app = express()
var join = require('path').join

app.use(express.static(join(__dirname, 'build')))

module.exports = app
