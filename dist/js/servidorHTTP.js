"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.servidor = void 0;

var _class_mysql = require("./Classes/class_mysql.js");

var _filemanager = require("./filemanager.js");

var axios = _interopRequireWildcard(require("./Providers/provider_axios.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var config = require('config'); // const host = '192.168.2.10';


var host = config.get("HOST");
var port = 6666;

var WebSocket = require('ws');

var wss = new WebSocket(config.get("WS"));

var express = require('express');

var bodyParser = require('body-parser');

var app = express();

var cors = require('cors'); // se incrementa el lime a 50 MB por que el tamaño de lo que llega es bastante grande


app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.raw({
  limit: '50mb'
}));
app.use(bodyParser.text({
  limit: '50mb'
}));
app.use(cors());
wss.on('open', function () {
  console.log('Cliente local abierto');
});
app.get('*', function (req, res) {
  console.log('LLEGO UN GET DESCONOCIDO');
  respuestaHTTP(res);
});
app.post('/LAPI/V1.0/System/Event/Notification/PersonVerification', function (req, res) {
  console.log('LLEGO PersonVerification');
  BD_Save_Person(req.body);
  fileLog(req);
  respuestaHTTP(res);
});
app.post('/LAPI/V1.0/PACS/Controller/Event/Notifications', function (req, res) {
  console.log('LLEGO Notifications');
  BD_Save_Person(req.body);
  fileLog(req);
  respuestaHTTP(res);
});
app.post('/LAPI/V1.0/PACS/Controller/HeartReportInfo', function (req, res) {
  console.log('LLEGO HeartReportInfo');
  fileLog(req);
  BD_ActualizarRecibidos(req.body);
  respuestaHTTP(res);
});

var respuestaHTTP = function respuestaHTTP(res) {
  res.statusCode = 200; // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:2323');

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Content-Type', 'text/plain');
  res.end('Servidor pruebas TechBoss V1.4');
};

var fileLog = function fileLog(req) {
  //desestructuro el req
  var headers = req.headers,
      method = req.method,
      url = req.url,
      body = req.body; // para no saturar el archivo no guardare la imagen  para esto trabajo todo en JSON y despues lo regeso a String

  var data_body = typeof body !== 'string' ? body : JSON.parse(body);

  if (data_body.hasOwnProperty('FaceInfoList')) {
    data_body.Temperatura = data_body.FaceInfoList[0].Temperature;
    data_body.isMascara = data_body.FaceInfoList[0].MaskFlag;
    delete data_body.FaceInfoList;
  }

  (0, _filemanager.fileSave)('**********************+++++++++++++++++***********************' + "\r\n");
  (0, _filemanager.fileSave)('------------' + req.socket.remoteAddress + '--------------------' + "\r\n");
  (0, _filemanager.fileSave)('----------------' + url + '----------------------' + "\r\n");
  (0, _filemanager.fileSave)('********************************************************' + "\r\n");
  (0, _filemanager.fileSave)(JSON.stringify(data_body));
  (0, _filemanager.fileSave)("\r\n");
  (0, _filemanager.fileSave)('********************************************************' + "\r\n");
};

var BD_ActualizarRecibidos = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(body) {
    var json_Body, dataInfo, db, rsp;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // se maneja todo en JSON
            json_Body = typeof body !== 'string' ? body : JSON.parse(body);
            dataInfo = {
              'idDeviceCode': "'".concat(json_Body.DeviceCode, "'"),
              'HoraRecibido': "'".concat(json_Body.Time, "'")
            };
            db = new _class_mysql.Entity('ControlRecibido');
            db.table_name('ControlRecibido');
            db.select('idControlRecibido');
            db.where("idDeviceCode LIKE ".concat(dataInfo.idDeviceCode));
            _context.next = 8;
            return db.execute();

          case 8:
            rsp = _context.sent;
            db.table_name('ControlRecibido');

            if (Object.keys(rsp).length === 0) {
              db.insert(dataInfo);
            } else {
              db.update("HoraRecibido = ".concat(dataInfo.HoraRecibido));
              db.where("idDeviceCode LIKE ".concat(dataInfo.idDeviceCode));
            }

            db.execute_id().then(function (id) {
              console.log(id);
            });
            wss.send('BD_ActualizarRecibidos');

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function BD_ActualizarRecibidos(_x) {
    return _ref.apply(this, arguments);
  };
}(); // const BD_Save_Person = async (body, ip) => {


var BD_Save_Person = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(body) {
    var json_Body, idPersona, CardID, dataInfo, fileData, fileName, MatchFaceID, validar, db, id;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            json_Body = typeof body !== 'string' ? body : JSON.parse(body);
            console.log("'".concat(json_Body.DeviceCode, "'"));
            idPersona = json_Body.LibMatInfoList[0].MatchPersonInfo.PersonCode == '' ? 0 : json_Body.LibMatInfoList[0].MatchPersonInfo.PersonCode;
            CardID = json_Body.LibMatInfoList[0].MatchPersonInfo.CardID == '' ? 0 : json_Body.LibMatInfoList[0].MatchPersonInfo.CardID;
            dataInfo = {
              'FechaDispositivo': "FROM_UNIXTIME(".concat(json_Body.Timestamp, ",\"%Y-%m-%d %H:%m:%s\")"),
              'idDeviceCode': "'".concat(json_Body.DeviceCode, "'"),
              'NombrePersona': "'".concat(json_Body.LibMatInfoList[0].MatchPersonInfo.PersonName, "'"),
              'idPersona': "'".concat(idPersona, "'"),
              'CardID': "'".concat(CardID, "'"),
              'Gender': "'".concat(json_Body.LibMatInfoList[0].MatchPersonInfo.Gender, "'"),
              'Temperatura': "'".concat(json_Body.FaceInfoList[0].Temperature, "'"),
              'isMascara': "'".concat(json_Body.FaceInfoList[0].MaskFlag, "'"),
              'Foto': "'".concat(json_Body.FaceInfoList[0].PanoImage.Name, "'"),
              'ID_Seq': "'".concat(json_Body.Seq, "'")
            };
            fileData = json_Body.FaceInfoList[0].PanoImage.Data;
            fileName = json_Body.FaceInfoList[0].PanoImage.Name;
            MatchFaceID = json_Body.LibMatInfoList[0].MatchFaceID;
            _context2.next = 10;
            return Validar_idRecibidos(dataInfo.idDeviceCode, dataInfo.ID_Seq, dataInfo.Foto);

          case 10:
            validar = _context2.sent;

            if (!validar) {
              _context2.next = 33;
              break;
            }

            console.log('Nuevo registro');
            db = new _class_mysql.Entity('InfoRecibidos');
            db.table_name('InfoRecibidos');
            db.insert(dataInfo);
            _context2.next = 18;
            return db.execute_id();

          case 18:
            id = _context2.sent;
            console.log('InfoRecibidos', id);
            registrar_Recibidos(dataInfo.idDeviceCode, dataInfo.ID_Seq); //valido si es residente
            // if(dataInfo.NombrePersona.indexOf('No registrado') < 0 ){

            if (!(MatchFaceID > 0)) {
              _context2.next = 28;
              break;
            }

            console.log("Residente");
            _context2.next = 25;
            return axios.registroResidente(dataInfo);

          case 25:
            wss.send('Actualizar_Monitoreo');
            _context2.next = 32;
            break;

          case 28:
            console.log("Desconocido");
            _context2.next = 31;
            return axios.registroDesconocido(dataInfo);

          case 31:
            wss.send("Registrar_Recibidos, ".concat(dataInfo.idDeviceCode, ", ").concat(dataInfo.ID_Seq));

          case 32:
            // imgSave( json_Body.FaceInfoList[0].PanoImage.Name, json_Body.FaceInfoList[0].PanoImage.Data );
            (0, _filemanager.imgSave)(fileName, fileData);

          case 33:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function BD_Save_Person(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var Validar_idRecibidos = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(idDeviceCode, ID_Seq, Foto) {
    var db, rsp;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // esta funcion validar si el paquete ya fue recibido para no duplicar su entrada
            db = new _class_mysql.Entity('InfoRecibidos');
            db.table_name('InfoRecibidos');
            db.select('idInfoRecibidos');
            db.where("idDeviceCode LIKE ".concat(idDeviceCode, " AND ID_Seq=").concat(ID_Seq, " AND Foto=").concat(Foto));
            _context3.next = 6;
            return db.execute();

          case 6:
            rsp = _context3.sent;

            if (!(Object.keys(rsp).length === 0)) {
              _context3.next = 11;
              break;
            }

            return _context3.abrupt("return", true);

          case 11:
            return _context3.abrupt("return", false);

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function Validar_idRecibidos(_x3, _x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

var registrar_Recibidos = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(idDeviceCode, ID_Seq) {
    var dataInfo, db, rsp;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log("'".concat(idDeviceCode, "'"));
            dataInfo = {
              idDeviceCode: idDeviceCode,
              ID_Seq: ID_Seq
            };
            db = new _class_mysql.Entity('ControlRecibido');
            db.table_name('ControlRecibido');
            db.select('idControlRecibido');
            db.where("idDeviceCode LIKE ".concat(idDeviceCode));
            _context4.next = 8;
            return db.execute();

          case 8:
            rsp = _context4.sent;

            if (Object.keys(rsp).length === 0) {
              db.insert(dataInfo);
            } else {
              db.update("ID_Seq = ".concat(ID_Seq));
              db.where("idDeviceCode LIKE ".concat(idDeviceCode));
            }

            db.execute_id().then(function (id) {
              console.log('Registrar_Recibidos', id);
            });

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function registrar_Recibidos(_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();

var servidor = function servidor() {
  app.listen(port, function () {
    console.log("Servidor HTTP corriendo en http://".concat(host, ":").concat(port));
  });
};

exports.servidor = servidor;