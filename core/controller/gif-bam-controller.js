module.exports = (tg) => {
	let req = require('tiny_request');
	let Immutable = require('immutable');
	let config = require('../../config');
	let defaultGifSettings = Immutable.fromJS({
		repeatable: false,
		frequencyShow: null,
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
				keyword: 'gif'
			}
		}
	});
	var userGifSettings = defaultGifSettings;
	
	tg.controller('GifBamController', ($) => {
		tg.for('/gifbam', () => {
			class GifBam {
				constructor() {
					this.showMenu();
				}

				showMenu() {
					$.runMenu({
					    message: 'Choose:',
					    options: {
					        parse_mode: 'Markdown'
					    },
					    'Random GifBaam': () => {
					    	this.randomGif();
					    },
					    'Reset all GifBaam settings': () => {
					    	userGifSettings = defaultGifSettings;
					    }
					}); 
				}

				randomGif() {
					let tags;

					if (!userGifSettings.getIn(['endPoint', 'random', 'tags'])) {
						$.sendMessage('Write some tags');
						$.waitForRequest(($) => {
							if ($.message.text.length > 3) {
								$.sendMessage('Preparing GIF');
								tags = $.message.text.replace(/ /g, '+');
								userGifSettings = userGifSettings.setIn(['endPoint', 'random', 'tags'], tags);
								this.getGif('random');
							}
							else {
								$.sendMessage('Write more than three character');
								this.randomGif();
							}
						});
					}
					else {
						$.sendMessage('Preparing GIF');
						this.getGif('random');
					}
				}

				getGif(endPointType) {
					let gif,
						endPoint = userGifSettings.getIn(['endPoint', endPointType]).toJS(),
						urlParam = 'http://api.giphy.com';

					for (let prop in endPoint) {
						if (prop === 'api') {
							urlParam += endPoint[prop] + '?api_key=dc6zaTOxFJmzC';
						}
						else {
							urlParam += '&' + prop + '=' + endPoint[prop];
						}
					}

					req.get(urlParam, (body) => {
						gif = JSON.parse(body);

						if (gif.data instanceof Array) {
							$.sendGifFromUrl(gif.data[0].images.fixed_height.mp4);	
						} else {
							$.sendGifFromUrl(gif.data.image_mp4_url);	
						}
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