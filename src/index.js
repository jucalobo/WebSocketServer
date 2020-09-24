require ('dotenv').config();


import "core-js/stable";
import "regenerator-runtime/runtime";
import '@babel/polyfill'

import { servidor } from './js/servidorHTTP.js';
import { servidorIO } from './js/servidorIO.js';

servidorIO();
servidor();