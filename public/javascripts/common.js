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
		var ret = new $.Deferred();
		$.post(endpoint, function(data) {
			ret.resolve(data);
		});
		return ret.promise();
	};

	common.get = function(endpoint) {
		endpoint = endpoint || "bets";
		endpoint = url + endpoint + ".json";
		var ret = new $.Deferred();
		$.getJSON(endpoint, function(data) {
			window.console.dir(data);
			ret.resolve(data);
		});
		return ret.promise();
	};

	//	Redirect to new page
	common.route = function(page, uri) {
		uri = uri || "";
		page = page || "index";
		page = "/" + page;
		if(this.isset(uri)) {
			page += formUri(uri);
		}
		window.location = page;
	};

    return common;

}(window.$, document, window));
