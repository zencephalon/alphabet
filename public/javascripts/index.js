(function(window, document, $, c) {
"use strict";


	$(function() {
		$("#login").on('click', function() {
			c.route("login");
		});
	});


})(window, document, window.$, window.common);