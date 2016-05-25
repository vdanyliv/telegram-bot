"use strict";
let express = require('express');
let app = express();
let port = process.env.PORT || 8080;


app.listen(port, function() {
    console.log('Our app is running on http://telegram-bot-app.herokuapp.com:' + port);

    let config = require('./config');
	let tg = require('telegram-node-bot')(config.telegramApi.token);
	let route = require('./core/route')(tg);
});