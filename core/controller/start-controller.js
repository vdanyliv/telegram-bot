module.exports = (tg) => {
	tg.controller('StartContoller', ($) => {
		tg.for('/start', () => {
			$.sendMessage(
				'Commands: \n' +
				'/start - Show command list \n' +
				'/exchange  - Exchange rate (only ukraine) \n' +
				'/trendingtweets - Hot tweets \n' +
				'/twittertop - Hot tweets by tag' +
				'/gifbam - Gif spamer ((*)_(*)) '
			);
		});
	});
};