"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.servidorIO = void 0;

var WebSocket = require('ws');

var wss = new WebSocket.Server({
  port: 3000
});
wss.on('open', function () {
  console.log('Puerto socket abierto');
});

var servidorIO = function servidorIO() {
  wss.on('connection', function (ws, req) {
    var ip = req.socket.remoteAddress;
    console.log('Se conecto el cliente ip:', ip);
    ws.on('message', function (data) {
      console.log('WS send', data);
      wss.clients.forEach(function (client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    });
  });
};

exports.servidorIO = servidorIO;