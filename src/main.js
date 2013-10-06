(function(window, document, $, c) {
"use strict";

	//	Request all the feed items to display, sorted clientside
	var getFeedItems = function() {
		var feedItems = c.get("feed.json");
		return feedItems || [];
	};

	//	Sort order/type of feed
	var sortBy = function(sorter) {
		if(sorter === "self") {

		}
		else if(sorter === "judge") {

		}
		else {	// All

		}
	};

	//	Form a feed item from one listing object
	var formFeedItem = function(item) {

	};

	//	Start a new bet
	var makeBet = function() {
		c.route("bet");
	};

})(window, document, window.$, window.common);