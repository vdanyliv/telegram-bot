module.exports = (tg) => {
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