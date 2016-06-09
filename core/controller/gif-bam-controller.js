module.exports = (tg) => {
	let req = require('tiny_request');
	let Immutable = require('immutable');
	let config = require('../../config');

	let userGifSettings = Immutable.fromJS({});
	let defaultGifSettings = Immutable.fromJS({
		repeatable: false,
		frequencyShow: null,
		viewedGif: [],
		index: 0, //REMOVE!!!
		endPoint: {
			random: {
				api: '/v1/gifs/random',
				tags: null
			},
			translate: {
				api: '/v1/gifs/translate'
			},
			id: {
				api: '/v1/gifs'
			},
			search: {
				api: '/v1/gifs/search',
				rating: 'g',
				q: null
			}
		}
	});

	tg.controller('GifBamController', ($) => {
		tg.for('/gifbam', () => {
			class GifBam {
				constructor() {
					this.userId = $.user.id;
					this.setNewUser();
					this.showMenu();

					console.error(userGifSettings);
				}

				setNewUser() {
					console.error(this.userId);
					if (!userGifSettings.get(this.userId)) {
						userGifSettings = userGifSettings.set(this.userId, defaultGifSettings);
					}
				}

				showMenu() {
					$.runMenu({
					    message: 'Choose:',
					    options: {
					        parse_mode: 'Markdown'
					    },
					    'Search gif by keyword': () => {
					    	this.gifByKeyWord();
					    },
					    'Random GifBaam': () => {
					    	this.randomGif();
					    },
					    'Reset all GifBaam settings': () => {
					    	userGifSettings = userGifSettings.set(this.userId, defaultGifSettings);
					    }
					}); 
				}
				
				gifByKeyWord() {
					let keyword,
						self = this;

					if (!userGifSettings.getIn([this.userId, 'endPoint', 'search', 'q'])) {
						$.sendMessage('Write some keyword');
						$.waitForRequest(($) => {
							if ($.message.text.length > 2) {
								keyword = $.message.text.replace(/ /g, '+');
								userGifSettings = userGifSettings.setIn([this.userId, 'endPoint', 'search', 'q'], keyword);
								
								$.sendMessage('Need to choose PG? (type yes or no)');
								$.waitForRequest(($) => {
									if ($.message.text === 'yes') {
										askForPG();
									}
									else {
										this.getGif('search');
									}
								});
							}
							else {
								$.sendMessage('Write more than two character');
								this.gifByKeyWord();
							}
						});
					}
					else {
						this.getGif('search');
					}

					function askForPG() {
						$.sendMessage('Choose rating: y, g, pg, pg-13, r');
						$.waitForRequest(($) => {
							switch ($.message.text) {
								case 'y':
								case 'g':
								case 'pg':
								case 'pg-13':
								case 'r':
									userGifSettings = userGifSettings.setIn([self.userId, 'endPoint', 'search', 'rating'], $.message.text);
									self.getGif('search');
								break;
								default:
									askForPG();
								break;
							}
						});
					}
				}

				randomGif() {
					let tags;

					if (!userGifSettings.getIn([this.userId, 'endPoint', 'random', 'tags'])) {
						$.sendMessage('Write some tags');
						$.waitForRequest(($) => {
							if ($.message.text.length > 3) {
								tags = $.message.text.replace(/ /g, '+');
								userGifSettings = userGifSettings.setIn([this.userId, 'endPoint', 'random', 'tags'], tags);
								this.getGif('random');
							}
							else {
								$.sendMessage('Write more than three character');
								this.randomGif();
							}
						});
					}
					else {
						this.getGif('random');
					}
				}

				getGif(endPointType) {
					let gif,
						index = userGifSettings.getIn([this.userId, 'index']),
						endPoint = userGifSettings.getIn([this.userId, 'endPoint', endPointType]).toJS(),
						urlParam = 'http://api.giphy.com';

					for (let prop in endPoint) {
						if (prop === 'api') {
							urlParam += endPoint[prop] + '?api_key=dc6zaTOxFJmzC';
						}
						else {
							urlParam += '&' + prop + '=' + endPoint[prop];
						}
					}
					$.sendMessage('Preparing GIF');
					req.get(urlParam, (body) => {
						gif = JSON.parse(body);

						if (gif.data instanceof Array) {
							if (gif.data.length) {
								$.sendGifFromUrl(gif.data[index].images.fixed_height.mp4);
							}
							else {
								$.sendMessage('No gifs for your keyword');
							}
						} else {
							$.sendGifFromUrl(gif.data.image_mp4_url);	
						}
						userGifSettings = userGifSettings.setIn([this.userId, 'index'], index+1);
					});
				}

				static initGifBam() {
					return new GifBam();
				}
			}

			GifBam.initGifBam();		
		});
	});
};