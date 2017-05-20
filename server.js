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

let clients = {};
let shapes = {};

function chooseOne() {
  return Math.floor(Math.random() * 2) + 1;
}


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

// TODO join a game room by having the client create the room

io.on('connection', (socket) => {
  console.log('connected', socket.id);

  socket.on('client:roomCreated', (room) => {
    if (clients[room] == undefined) {
      clients[room] = {players: 1, creator: socket.id, startPressed: 0, playersReady: 0};
      socket.join(room);
      io.sockets.in(room).emit('server:roomJoined', room);
    }
    io.sockets.emit('server:roomCreated', room);
  });

  socket.on('client:roomJoined', (room) => {
    if (clients[room].players == 1 && clients[room].creator != socket.id) {
      clients[room].players = 2;
      socket.join(room);
      console.log('2 in room: ', room);
      io.sockets.in(room).emit('server:enoughPlayers', room);
    } else {
      console.log('2 in room already, cannot join ', room);
      return;
    }
  });

  socket.on('client:waitForStart', (room) => {
    if (clients[room].startPressed == 0) {
      clients[room].startPressed = 1;
    } else if (clients[room].startPressed == 1) {
      clients[room].startPressed = 2;
      io.sockets.in(room).emit('server:prepStart');
    } else {
      return;
    }
  });

  socket.on('client:cancelStart', (room) => {
    if (clients[room].startPressed == 1) {
      clients[room].startPressed = 0;
    } else {
      return;
    }
  });
  
  // Data sent to client is messed, needs fixing
  socket.on('client:finishedShape', (data) => {
    if (shapes[data.room] == undefined) {
      shapes[data.room] = {first: data.value, second: null}
    } else if (shapes[data.room].first) {
      shapes[data.room].second = data.value;
      let chosenShape = chooseOne();
      if (chosenShape == 1) {
        console.log('shape one is chosen', shapes[data.room].first);
        io.sockets.in(data.room).emit('server:shapeChosen', shapes[data.room].first);
      } else if (chosenShape == 2) {
        console.log('shape two is chosen', shapes[data.room].second);
        io.sockets.in(data.room).emit('server:shapeChosen', shapes[data.room].second);
      } else {
        return;
      }
    } else {
      return;
    }
  });

  socket.on('client:playerIsReady', (room) => {
    if (clients[room].playersReady == 0) {
      clients[room].playersReady = 1;
    } else if (clients[room].playersReady == 1) {
      clients[room].playersReady = 2;
      io.sockets.in(room).emit('server:playersReady');
    } else {
      return;
    }
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });

});
