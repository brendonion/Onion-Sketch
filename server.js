const express = require('express');
const httpProxy = require('http-proxy');
const bodyParser = require('body-parser');
const path = require('path');
const bundle = require('./server/webpackServer.js');
const socketio = require('socket.io');
const socketClient = require('socket.io-client')('http://localhost/3000');
const http = require('http');

const proxy = httpProxy.createProxyServer();
const router = express.Router();
const publicPath = path.resolve(__dirname, 'public');

const app = express();
const server = http.Server(app);
const io = socketio(server);

// server.listen(3001, () => console.log('listening on *:3001'));

bundle();

app.use(express.static(publicPath));

server.listen(3000, () => {
  console.log('server running on Port ' + 3000);
});

app.all('/build/*', (req, res) => {
  proxy.web(req, res, {
    target: 'http://localhost:8080'
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

proxy.on('error', (e) => {
  console.log('Could not connect to proxy please try again');
});

io.on('connection', (socket) => {
  console.log('connected', socket.id);

  socket.on('client:finishedShape', (data) => {
    console.log('data', data);
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });

});
