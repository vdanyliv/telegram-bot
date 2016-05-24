"use strict";
let config = require('./config');
let tg = require('telegram-node-bot')(config.telegramApi.token);
let route = require('./core/route')(tg);