"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registroDesconocido = exports.registroResidente = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var rAxios = require('axios')["default"];

var config = require('config'); // origen hace referencia a la IP a la cual toca consultar las registros alamacenados 
// de las imagenes que tenga que esta formado de la fecha + temperatura de la persona 
// desconocida que se puso al frente 


var post = function post($Body) {
  var url_path = "http://".concat(config.get("HOST"), "/").concat(config.get("SLIM")); // console.log('url_path',url_path);
  // console.log('post body',$Body);

  return rAxios.post(url_path, $Body);
};

var registroResidente = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee($Body) {
    var rsp;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            $Body.Residente = 'true';
            _context.next = 3;
            return post($Body);

          case 3:
            rsp = _context.sent;
            return _context.abrupt("return");

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function registroResidente(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.registroResidente = registroResidente;

var registroDesconocido = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2($Body) {
    var rsp;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            $Body.Residente = 'false';
            _context2.next = 3;
            return post($Body);

          case 3:
            rsp = _context2.sent;
            return _context2.abrupt("return");

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function registroDesconocido(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.registroDesconocido = registroDesconocido;