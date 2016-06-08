module.exports = (tg) => {
	let ig = require('instagram-node').instagram();
	let config = require('../../config');
	let req = require('tiny_request');

	ig.use({
		client_id: config.instagramApi.client_id,
		client_secret: config.instagramApi.client_secret
	});

	tg.controller('WhereIAmController', ($) => {
		tg.for('/whereiam', () => {
			class WhereIAm {
				constructor() {
					this.showNavigation();
				}

				showNavigation() {
					$.runMenu({
					    message: 'Choose:',
					    options: {
					        parse_mode: 'Markdown'
					    },
					    'Show picture from this location': () => {
					    },
					    'Show intresting places near me': () => {
					    },
					    'Exit': () => {
					    }
					});  
				}

				static init() {
					return new WhereIAm();
				}
			}

			WhereIAm.init();
		});
	});
};