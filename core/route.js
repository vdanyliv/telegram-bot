module.exports = (tg) => {
	let ExchangeRate = require('./controller/exchange-rate')(tg);
	let OtherwiseController = require('./controller/otherwise-controller')(tg);
	let StartContoller = require('./controller/start-controller')(tg);
	let TrendingTweetsController = require('./controller/trending-tweets-controller')(tg);
	let WhereIAmController = require('./controller/where-i-am-controller')(tg);

	tg.router
		.when(['/start'], 'StartContoller')
		.when(['/exchange'], 'ExchangeRate')
		.when(['/trendingtweets', '/twittertop'], 'TrendingTweetsController')
		.when(['/whereiam'], 'WhereIAmController')
		.otherwise('OtherwiseController');

};