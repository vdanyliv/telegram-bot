module.exports = (tg) => {
	tg.controller('OtherwiseController', ($) => {
		$.sendMessage('say waaaat!');
	});
};