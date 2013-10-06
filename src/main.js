(function(window, document, $, c) {
"use strict";

	//	Request all the feed items to display, sorted clientside
	var getFeedItems = function() {
		// var feedItems = c.get("feed.json");
		// return feedItems || [];
		return [{proposer: "joe", acceptor: "jill", arbiter: "lauren", 
			p_amount: 100, a_amount: 50, description: "how quickly will venmo shut this down?", id: 1 },
			{proposer: "kate", acceptor: "vick", arbiter: "lauren", 
			p_amount: 300, a_amount: 800, description: "is the sky falling?", id: 2 }];
	};

	//	Get my information from Venmo or login process.
	var getSelfInfo = function() {
		return "testPerson";
	};

	//	Sort order/type of feed
	var sortFeed = function(feedItems, sorter) {
		feedItems = feedItems || [];
		sorter = sorter || "all";
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
				if(feedItems[i]["arbiter"] === me) {
					sortedList.append(feedItems[i]);
				}
				else {
					tempList.append(feedItems[i]);
				}
			}
			sortedList.concat(tempList);
		}	
		else {	//	all : Any order
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

		var display =	"<li>"		+
						"<li>"		+
						"<p><a href='#'>" + item.description + "</a></p>"	+ 
						"<ul>"		+
							pLi		+
							aLi		+
						"</ul>"		+
						"<hr />"	+
						"</li>";

		return display;
	};

	//	Form the stakes section
	var formStakesItem = function(stakes) {

	};

	//	Start a new bet
	var makeBet = function() {
		c.route("bet");
	};

	//	Get your total stakes
	var getStakes = function() {
		var stakesObj = c.get("stakes.json") || {hook: 0, win: 0};
		var stakes = {hook: stakes.hook, win: stakes.win};
		return stakes;
	};

	//	Prepare and display the sorted feed items
	var init = function(sorter) {
		sorter = sorter || "all";
		var feedItems = getFeedItems();
		var sorted = sortFeed(feedItems, sorter);
		$("#feed").append("<hr />");
		for (var i = 0; i < sorted.length; i++) {
			var item = formFeedItem(sorted[i]);
			$("#feed").append(item);
		}
	};

	$(function() {
		init();	//	init the page with feed when ready

		$("#sortAll").click(function() {
			init("all");
		});
		$("#sortSelf").click(function() {
			init("self");
		});
		$("#sortJudge").click(function() {
			init("judge");
		});
		$("#makeBet").click(function() {
			makeBet();
		});
	});


})(window, document, window.$, window.common);