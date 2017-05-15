const express = require('express');
const httpProxy = require('http-proxy');
const bodyParser = require('body-parser');
const path = require('path');
const bundle = require('./server/webpackServer.js');

const proxy = httpProxy.createProxyServer();
const router = express.Router();
const publicPath = path.resolve(__dirname, 'public');

const app = express();
var server = require('http').Server(app);
const io = require('socket.io')(server);

bundle();

app.use(express.static(publicPath));

app.all('/build/*', (req, res) => {
  proxy.web(req, res, {
    target: 'http://localhost:8080'
  });
});

proxy.on('error', (e) => {
  console.log('Could not connect to proxy please try again');
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
  console.log('server running on Port ' + 3000);
});

