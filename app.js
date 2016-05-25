"use strict";
let express = require('express');
let app = express();
let port = process.env.PORT || 8080;

// set the view engine to ejs

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
    
    let config = require('./config');
	let tg = require('telegram-node-bot')(config.telegramApi.token);
	let route = require('./core/route')(tg);
});