(function(window, document, $, c) {
"use strict";

	//	Request all the feed items to display, sorted clientside
	var getFeedItems = function() {
		var feedItems = c.get("feed.json");
		return feedItems || [];
	};

	//	Get my information from Venmo or login process.
	var getSelfInfo = function() {
		return "testPerson";
	};

	//	Sort order/type of feed
	var sortFeed = function(feedItems, sorter) {
		feedItems = feedItems || [];
		var me = getSelfInfo();
		var sortedList = [];
		var tempList = [];
		if(sorter === "self") {	//	Bets I'm a part of first
			for (var i = 0; i < feedItems.length; i++) {
				if(feedItems[i]["proposer"] === me || feedItems[i]["acceptor"] === me) {
					sortedList.append(feedItems[i]);
				}
				else {
					tempList.append(feedItems[i]);
				}
			}
			sortedList.concat(tempList);
		}
		else if(sorter === "judge") {	//	Items I'm judging first
			for (var i = 0; i < feedItems.length; i++) {
				if(feedItems[i]["descriptor"].judge === me) {
					sortedList.append(feedItems[i]);
				}
				else {
					tempList.append(feedItems[i]);
				}
			}
			sortedList.concat(tempList);
		}	
		else {	//	Any order
			sortedList = feedItems;
		}
		return sortedList;
	};

	//	Form a feed item from one listing object
	var formFeedItem = function(item) {
		var pLi =	"<li style='display: inline-block;'>"				+
						"<img src='http://placehold.it/50x50'/>"		+
						"<p>" + item.proposer + "(amount: <b>" + item.p_amount + "</b>)</p>" +
					"</li>";
		var aLi =	"<li style='display: inline-block;'>"				+
						"<img src='http://placehold.it/50x50'/>"		+
						"<p>" + item.acceptor + "(amount: <b>" + item.a_amount + "</b>)</p>" +
					"</li>";
		return pLi + aLi;
	};

	//	Start a new bet
	var makeBet = function() {
		c.route("bet");
	};

	//	Prepare and display the sorted feed items
	var init = function(sortBy) {
		sortBy = sortBy || "all";
		var feedItems = getFeedItems();
		var sorted = sortFeed(feedItems, sortBy);
		for (var i = 0; i < sorted.length; i++) {
			var item = formFeedItem(sorted[i]);
			$("feed").append(item);
		}
	};

	$(function() {
		init();	//	init the page with feed when ready
	});


})(window, document, window.$, window.common);