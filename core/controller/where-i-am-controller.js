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
					        parse_mode: 'Markdown' // in options field you can pass some additional data, like parse_mode
					    },
					    'Auth': () => {
					    	req.post({ 
					    			url: 'https://api.instagram.com/oauth/authorize/?client_id=7697c93a292c49ba9c6b637587395fa3&redirect_uri=REDIRECT-URI&response_type=code',
					    		}, (body, response, err) => {
								console.error(arguments);
							});
					    },
					    'Show picture from this location': () => {
					    	ig.location('location_id', function(err, result, remaining, limit) {
					    		console.error(arguments);
					    	});
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