"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Entity = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// require ('dotenv').config();
var mysql = require('mysql2');

var config = require('config');

var Entity = /*#__PURE__*/function () {
  //static instancia;   // cuando no esta instanaciado es undefine
  function Entity(table) {
    _classCallCheck(this, Entity);

    this._table = table;
    this._sql;

    if (!!Entity.instancia) {
      return Entity.instancia;
    }

    Entity.instancia = this; // cargo la instanacia para hacer el singleton

    this.connection = Entity.conectar();
  }

  _createClass(Entity, [{
    key: "table_name",
    value: function table_name(sFields) {
      this._table = sFields;
    }
  }, {
    key: "select",
    value: function select(sFields) {
      this._sql = "SELECT ".concat(sFields, " FROM ").concat(this._table);
    }
  }, {
    key: "where",
    value: function where(sFields) {
      this._sql += " WHERE ".concat(sFields);
    }
  }, {
    key: "update",
    value: function update(sFields) {
      this._sql += "UPDATE ".concat(this._table, " SET ").concat(sFields);
    }
  }, {
    key: "insert",
    value: function insert(oFields) {
      // como me llega un objeto con la key = campos y los valores son los que se alamcenara lo proceso
      var aCampos = [];
      var aValor = [];

      for (var _i = 0, _Object$entries = Object.entries(oFields); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            key = _Object$entries$_i[0],
            value = _Object$entries$_i[1];

        aCampos.push(key);
        aValor.push(value);
      }

      this._sql = "INSERT INTO ".concat(this._table, " (").concat(aCampos, ") VALUES (").concat(aValor, ") ");
    }
  }, {
    key: "execute",
    value: function () {
      var _execute = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var con_promesa, _yield$con_promesa$ex, _yield$con_promesa$ex2, rows;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.connection;

              case 2:
                con_promesa = _context.sent.promise();
                _context.next = 5;
                return con_promesa.execute(this._sql);

              case 5:
                _yield$con_promesa$ex = _context.sent;
                _yield$con_promesa$ex2 = _slicedToArray(_yield$con_promesa$ex, 1);
                rows = _yield$con_promesa$ex2[0];
                this.clearVariable();
                return _context.abrupt("return", rows);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function execute() {
        return _execute.apply(this, arguments);
      }

      return execute;
    }()
  }, {
    key: "execute_id",
    value: function () {
      var _execute_id = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var con_promesa, _yield$con_promesa$ex3, _yield$con_promesa$ex4, rows, result;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.connection;

              case 2:
                con_promesa = _context2.sent.promise();
                _context2.next = 5;
                return con_promesa.execute(this._sql);

              case 5:
                _yield$con_promesa$ex3 = _context2.sent;
                _yield$con_promesa$ex4 = _slicedToArray(_yield$con_promesa$ex3, 2);
                rows = _yield$con_promesa$ex4[0];
                result = _yield$con_promesa$ex4[1];
                // console.log(rows);
                this.clearVariable();
                return _context2.abrupt("return", rows.insertId);

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function execute_id() {
        return _execute_id.apply(this, arguments);
      }

      return execute_id;
    }()
  }, {
    key: "clearVariable",
    value: function clearVariable() {
      // this._table = ''; 
      this._sql = '';
    }
  }, {
    key: "get_sql",
    get: function get() {
      return this._sql;
    }
  }, {
    key: "get_id",
    get: function get() {
      return this._id;
    }
  }], [{
    key: "conectar",
    value: function () {
      var _conectar = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var connection;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return mysql.createConnection({
                  host: config.get("dbConfig.DB_HOST_NAME"),
                  user: config.get("dbConfig.DB_USER"),
                  password: config.get("dbConfig.DB_PSWD"),
                  database: config.get("dbConfig.DB_DATABASE")
                });

              case 2:
                connection = _context3.sent;
                // const connection = await mysql.createConnection({
                //     host: process.env.DB_HOST_NAME,
                //     user: process.env.DB_USER,
                //     password: process.env.DB_PSWD,
                //     database: process.env.DB_DATABASE
                // });
                connection.on('error', function (err) {
                  console.error("Error En conexion" + err);
                });
                return _context3.abrupt("return", connection);

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function conectar() {
        return _conectar.apply(this, arguments);
      }

      return conectar;
    }()
  }]);

  return Entity;
}();

exports.Entity = Entity;