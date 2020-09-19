"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readLicencias = exports.imgSave = exports.fileSave = void 0;

var moment = require('moment');

var config = require('config');

var fs = require('fs');

var fileSave = function fileSave(data) {
  var FileName = getFileName();
  fs.appendFile(config.get("FS_PATH") + FileName, data, function (error) {
    if (error) {
      console.log('Error escribiendo Historico', error);
    } else {// console.log('Registro Almacenado')    
    }
  });
};

exports.fileSave = fileSave;

var getFileName = function getFileName() {
  return moment().format("YYYYMMDD") + '.log';
};

var imgSave = function imgSave(nameFile, data) {
  fs.appendFile(config.get("IMG_PATH") + nameFile, data, {
    encoding: 'base64'
  }, function (error) {
    if (error) {
      console.log('Error escribiendo IMG', error);
    } else {//   console.log('Imagen Almacenada')    
    }
  });
};

exports.imgSave = imgSave;

var readLicencias = function readLicencias() {
  try {
    var data = fs.readFileSync('./config/licencias.key', {
      encoding: 'utf8',
      flag: 'r'
    });
    return {
      "resp": true,
      "info": data
    };
  } catch (err) {
    return {
      "resp": false,
      "info": 'archivo no localizado '
    };
  }
};

exports.readLicencias = readLicencias;