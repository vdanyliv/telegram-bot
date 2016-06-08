"use strict";
let express = require('express');
let app = express();
let port = process.env.PORT || 9090;


app.listen(port, function() {
    console.log('Our app is running on http://telegram-bot-app.herokuapp.com:' + port);

    let config = require('./config');
	let tg = require('./core/helpers/api/telegram')(config.telegramApi.token);
	let route = require('./core/route')(tg);
});