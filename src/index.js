require ('dotenv').config();


import "core-js/stable";
import "regenerator-runtime/runtime";
import '@babel/polyfill'

import { servidorIO } from './js/servidorIO.js';

servidorIO();