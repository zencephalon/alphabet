window.common = (function ($, document, window) {
    "use strict";

    var common = {};

    var url = "http://alphabet.io";

    common.isset = function (check) {
        var test = (typeof check !== 'undefined' && check !== null && check !== "");
        if (check instanceof Array) {
            test = test && (check.length > 0);
        }
        return test;
    };

	common.post = function(data, endpoint) {
		endpoint = endpoint || "/bets";
		$.post( endpoint, function( data ) {
			// $( ".result" ).html( data );
			window.console.dir(data);
		});
	};

	common.get = function(endpoint) {
		endpoint = endpoint || "/bets.json";
		$.getJSON(endpoint, function( data ) {
			var items = [];
			$.each(data, function( key, val ) {
				items.push( "<li id ='" + key + "'>" + val + "</li>" );
			});
		});
	};

    return common;

}(window.$, document, window));
