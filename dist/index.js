"use strict";

require("core-js/stable");

require("regenerator-runtime/runtime");

require("@babel/polyfill");

var _servidorIO = require("./js/servidorIO.js");

require('dotenv').config();

(0, _servidorIO.servidorIO)();