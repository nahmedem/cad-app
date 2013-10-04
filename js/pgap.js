var pgap = new function() {

	/*
	Determine if phonegap library is available
	*/
	this.has = function() {

		return (window.cordova);

	}

	/*
	Detect wether or not there is an internet connection
	*/
	this.is_online = function(override) {
	
		if(navigator != undefined
			&& navigator != null
			&& navigator.onLine != undefined
			&& navigator.onLine != null) {

			return navigator.onLine;

		}

		return true;

	};

	this.online_wait_to = '';
	this.online_wait_callback = '';
	this.online_wait_tries = '';

	this.online_wait = function(options) {

		options = Core.ensure_defaults({
			callback: function() { },
			tries: -1
		}, options);


		clearTimeout(pgap.online_wait_to);

		if(options['tries'] == -1) {

			pgap.online_wait_callback = options['callback'];
			pgap.online_wait_tries = 0;

		}

		if(pgap.is_online()) {

			Core.alert({
				type: 'remove'
			});

			pgap.online_wait_callback();

		} else {

			++pgap.online_wait_tries;

			Core.alert({
				msg: "Your device has lost internet connection. Attempting to connect... "
			});

			online_wait_to = setTimeout(function() {

				pgap.online_wait({
					tries: pgap.online_wait_tries
				});

			}, 500);

		}

	};

	this.go_url = '';

	this.go = function(url) {

		pgap.go_url = url;

		pgap.online_wait({
			callback: function() {

				Core.alert({
					msg: "Loading...",
					type: "success"
				});

				window.location = pgap.go_url;

			}
		});

	}

};

$(document).ready(function() {

	$("a").click(function(e) {

		e.preventDefault();

		var el = $(this);

		if(el.attr('href') != '#') {

			pgap.go(el.attr('href'));

		}

	});

});
