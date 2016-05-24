module.exports = (tg) => {
	let fs = require('fs');
	let Twitter = require('twitter');
	let config = require('../../config');
	let client = new Twitter({
		consumer_key: config.twitterApi.consumer_key,
		consumer_secret: config.twitterApi.consumer_secret,
		access_token_key: config.twitterApi.access_token_key,
		access_token_secret: config.twitterApi.access_token_secret
	});

	tg.controller('TrendingTweetsController', ($) => {
		tg.for('/trendingtweets', () => {
			let getTwitterData;

			$.sendMessage('Send me #hashtag!');
			$.waitForRequest(($) => {
				$.sendMessage('Searching...');

				getTwitterData = new Promise((resolve, reject) => {
					client.get('search/tweets', { q: $.message.text, result_type: 'mixed', count: 1 }, (error, tweet, response) => {
						if (error || !tweet.statuses[0]) {
							$.sendMessage('No tweets for your #hashtag :(');	
						}
						else {
							return resolve(tweet);
						}
					});
				});

				getTwitterData.then((data) => {
					$.sendMessage(data.statuses[0]['text']);
				});
         	});
		});

		tg.for('/twittertop', ($) => {
			class GetData {
				constructor(q) {
					this.q = q || '@popular';
					this.firstTime = true;
					this.queryObject = {
						q: this.q,
						result_type: 'popular',
						count: 1
					};

					this.getData();
				}

				getData(params) { //method accept only Object
					if (typeof params === 'object') Object.assign(this.queryObject, params);

					client.get('search/tweets', this.queryObject, (error, tweet, response) => {
							let tweetObject = tweet;

							if (tweet['statuses'].length) tweetObject = tweet['statuses'][0];
							if (!('text' in tweetObject)) {
								$.sendMessage('Sorry no tweets for you ^0^');
							}
							else {
								$.sendMessage(tweetObject.text);
								this.showNav(tweet);
							}
						}
					);
				}

				showNav(tweet) {
					let nextTweet = {};
					let searchData = tweet.search_metadata.next_results.split('&');

					$.runMenu({
					    message: 'Show next tweet?',
					    options: {
					        parse_mode: 'Markdown'
					    },
					    'yes': ($) => {
							for (let i = 0; i < searchData.length; i++) {
								nextTweet[getAttr()] = searchData[i].slice(searchData[i].indexOf('=')+1)

								function getAttr() {
									let attrIndex = 0;

									if (searchData[i].indexOf('?') !== -1) attrIndex = searchData[i].indexOf('?') + 1;
									return searchData[i].slice(attrIndex, searchData[i].indexOf('='));
								}
							}

					    	this.getData({ max_id: nextTweet.max_id });
					    },
					    'no': () => {
					    	$.sendMessage('okay <^^>');
					    }
					});	
				}

				static newInstance() {
					$.sendMessage('Send me #hashtag!');
					$.waitForRequest(($) => {
						return new GetData($.message.text);
					});
				}
			}

			GetData.newInstance();
		});
	});
};