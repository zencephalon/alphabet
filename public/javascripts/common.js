window.common = (function ($, document, window) {
    "use strict";

    var common = {};

    var url = "http://alphabet.io/";



	/***
	*	Private methods
	***/
	var formUri = function(uri) {
		return uri;
	};


	/***
	 *	Public methods
	 ***/
    common.isset = function (check) {
        var test = (typeof check !== 'undefined' && check !== null && check !== "");
        if (check instanceof Array) {
            test = test && (check.length > 0);
        }
        return test;
    };

	common.post = function(data, endpoint) {
		endpoint = endpoint || "bets";
		endpoint = url + endpoint;
		$.post(endpoint, function(data) {
			// $( ".result" ).html( data );
			window.console.dir(data);
		});
	};

	common.get = function(endpoint) {
		endpoint = endpoint || "bets";
		endpoint = url + endpoint + ".json";
		$.getJSON(endpoint, function(data) {
			window.console.dir(data);
		});
	};

	//	Redirect to new page
	common.route = function(page, uri) {
		uri = uri || "";
		page = page || "index";
		page = "/" + page + ".html";
		if(this.isset(uri)) {
			page += formUri(uri);
		}
		window.open(page);
	};

    return common;

}(window.$, document, window));
