"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SocketWEB = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var WebSocket = require('ws');

var SocketWEB = /*#__PURE__*/function () {
  function SocketWEB() {
    _classCallCheck(this, SocketWEB);

    // abro un WebSocket cliente
    try {
      this.wss = new WebSocket('ws://192.168.2.10:3000'); // this.wss.on('open', ()=>{
      //this.wss.send('cliente Principal Conectado')
      // });

      this.wss.on('error', function error(err) {
        console.log('Error: ' + err.code);
      });
      this.wss.on('open', this.heartbeat);
      this.wss.on('message', function incoming(data) {
        console.log(data);
      });
    } catch (e) {
      console.log('error', e);
    }
  }

  _createClass(SocketWEB, [{
    key: "send",
    value: function send(data) {// this.wss.send(data);
    }
  }, {
    key: "heartbeat",
    value: function heartbeat() {
      var _this = this;

      clearTimeout(this.pingTimeout);
      this.pingTimeout = setTimeout(function () {
        _this.terminate();
      }, 1000);
    }
  }]);

  return SocketWEB;
}();

exports.SocketWEB = SocketWEB;