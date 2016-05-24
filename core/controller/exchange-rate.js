module.exports = (tg) => {
	let req = require('tiny_request');

	tg.controller('ExchangeRate', ($) => {
		tg.for('/exchange', () => {
			let rate = '',
				getData;
		
			getData = new Promise(function (resolve, reject) {
				req.get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5', (body, response, err) => {
					if (!err) {
						return resolve(JSON.parse(body));
					}
					else {
						$.sendMessage('Please try again later :(');
					}
				});
			});

			getData.then((data) => {
				for (let obj in data) {
					for (let key in data[obj]) {
						if (key === 'ccy') rate += 'Курс: ' + data[obj][key] + ' => ' + data[obj]['base_ccy'] + '\n';
						if (key === 'buy') rate += 'Купівля: ' + String(Number(data[obj][key]).toFixed(2)) + ' ' + data[obj]['base_ccy'] + '\n';
						if (key === 'sale') rate += 'Продаж: ' + String(Number(data[obj][key]).toFixed(2)) + ' ' + data[obj]['base_ccy'] + '\n';
					}

					rate += '\n';
				}

				$.sendMessage(rate);
			});
		});
	});
};