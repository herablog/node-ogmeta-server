var argv = require('optimist').argv;
var express = require('express');
var app = express();
var og = require('./lib/ogprops');

var PORT = argv.port || 3000;

app.disable('x-powered-by');

app.get('/ogprops', function (req, res) {
  var url = req.query.url;
  if (!url) {
    res.sendStatus(400);
    return;
  }
  og(url, function(err, result) {
    if (err) {
      res.sendStatus(err);
    } else {
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.header('Access-Control-Allow-Origin', '*');
      res.json(result);
    }
  });
});

var server = app.listen(PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Start Server http://%s:%s', host, port);
});
