module.exports = (tg) => {
	tg.controller('StartContoller', ($) => {
		tg.for('/start', () => {
			$.sendMessage(
				'Команди: \n' +
				'/start - показати всі команди бота \n' +
				'/exchange  - курс валют \n' +
				'/trendingtweets - гаряченьке у твіттері \n' +
				'/twittertop - топ по тегу'
			);
		});
	});
};