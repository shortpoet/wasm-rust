"use strict";

var express = require('express');

var _require = require('../pkg/quadratic_lib.js'),
    solve = _require.solve;

var app = express();
var port = 8080;
app.use(express["static"](__dirname + '/public', {
  index: 'index.html'
}));
app.use(express.urlencoded({
  extended: false
}));
/*
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
  extended: true
})); 
*/

app.get('/', function (req, res) {
  return res.redirect("index.html");
});
app.post('/solve', function (req, res) {
  var a = parseFloat(req.body.a);
  var b = parseFloat(req.body.b);
  var c = parseFloat(req.body.c);
  res.send(solve([a, b, c]));
});
app.listen(port, function () {
  return console.log("Listening at http://localhost:".concat(port));
});