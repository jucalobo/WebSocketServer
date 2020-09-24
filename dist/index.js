"use strict";

require("core-js/stable");

require("regenerator-runtime/runtime");

require("@babel/polyfill");

var _servidorHTTP = require("./js/servidorHTTP.js");

var _servidorIO = require("./js/servidorIO.js");

require('dotenv').config();

(0, _servidorIO.servidorIO)();
(0, _servidorHTTP.servidor)();