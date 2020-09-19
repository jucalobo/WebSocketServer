"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validarLicencias = void 0;

var _class_mysql = require("./Classes/class_mysql.js");

var _filemanager = require("./filemanager.js");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var config = require('config');

var crypto = require('crypto');

var validarLicencias = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var dataFile, rsp, aKeys, isLicencia, _i, _Object$entries, _Object$entries$_i, key, value;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // abro el archivo licencias alamacenado en cnfiguracion
            dataFile = (0, _filemanager.readLicencias)();

            if (!dataFile.resp) {
              _context.next = 8;
              break;
            }

            _context.next = 4;
            return consultaBD();

          case 4:
            rsp = _context.sent;

            if (Object.keys(rsp).length !== 0) {
              // valido las claves son hash asi que no se desencripta vuelo ha hacer lo mismo que el generado
              // pero, jalo de la BD y encripto y comparo si esta en el array
              aKeys = dataFile.info.split("\r\n");
              isLicencia = true;

              for (_i = 0, _Object$entries = Object.entries(rsp); _i < _Object$entries.length; _i++) {
                _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), key = _Object$entries$_i[0], value = _Object$entries$_i[1];

                if (!buscarLicencia(aKeys, licencia(value.idDeviceCode))) {
                  console.log("Licencia faltante ".concat(value.idDeviceCode));
                  isLicencia = false;
                }
              }

              if (!isLicencia) {
                sinLicencia();
              }
            }

            _context.next = 9;
            break;

          case 8:
            sinLicencia();

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function validarLicencias() {
    return _ref.apply(this, arguments);
  };
}();

exports.validarLicencias = validarLicencias;

var sinLicencia = function sinLicencia() {
  var WebSocket = require('ws');

  var wss = new WebSocket(config.get("WS"));
  setInterval(function () {
    console.log('sin Licencias');
    wss.send('SIN_Licencias');
  }, 1500);
};

var licencia = function licencia(serialUNV) {
  // en cripto con hash la validacion deber ser encriptando de nuevo y comparando
  var hash = crypto.createHmac('sha256', serialUNV).update(process.env.PRIVATE_KEY).digest('hex');
  return hash;
};

var consultaBD = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var db;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // comparo con la informacion de la DB, saco toda la tabla 
            db = new _class_mysql.Entity('DeviceCode');
            db.table_name('DeviceCode');
            db.select('idDeviceCode');
            _context2.next = 5;
            return db.execute();

          case 5:
            return _context2.abrupt("return", _context2.sent);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function consultaBD() {
    return _ref2.apply(this, arguments);
  };
}();

var buscarLicencia = function buscarLicencia(aData, element) {
  var Buscar = aData.find(function (e) {
    if (element === e) {
      return true;
    }
  });

  if (Buscar) {
    return true;
  } else {
    return false;
  }
};