(function(window, document, $, c) {
"use strict";
	var me = [];

	//	Request all the feed items to display, sorted clientside
	var getFeedItems = function() {
		return c.get("feed");
		// return [{proposer: "joe", acceptor: "jill", arbiter: "lauren", 
		//	p_amount: 100, a_amount: 50, description: "how quickly will venmo shut this down?", id: 1 },
		//	{proposer: "kate", acceptor: "vick", arbiter: "lauren", 
		//	p_amount: 300, a_amount: 800, description: "is the sky falling?", id: 2 }];
	};

	//	Get my information from Venmo or login process.
	var getSelfInfo = function() {
		return c.get("me");
	};

	//	Sort order/type of feed
	var sortFeed = function(feedItems, sorter) {
		feedItems = feedItems || [];
		sorter = sorter || "all";
		var sortedList = [];
		var tempList = [];
		if(sorter === "self") {	//	Bets I'm a part of first
			for (var i = 0; i < feedItems.length; i++) {
				if(feedItems[i]["proposer"] === me["username"] || feedItems[i]["acceptor"] === me["username"]) {
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
				if(feedItems[i]["arbiter"] === me["username"]) {
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
		var itemId = "item-"+itemId;
		var display =	"<li id=" + itemId+ ">"		+
						"<p><a href='#'>" + item.description + "</a></p>"	+ 
						"<ul>"		+
							pLi		+
							aLi		+
						"</ul>"		+
						"<hr />"	+
						"</li>";

		return display;
	};

	//	Start a new bet
	var makeBet = function() {
		c.route("bet");
	};

	//	Prepare and display the sorted feed items
	var init = function(sorter) {
		sorter = sorter || "all";
		getFeedItems().done(function(feedItems) {
			feedItems = feedItems || [];
			getSelfInfo().done(function(data) {
				me = data;
				var sorted = sortFeed(feedItems, sorter);
				$("#feed").empty();
				$("#feed").append("<hr />");
				for (var i = 0; i < sorted.length; i++) {
					var item = formFeedItem(sorted[i]);
					$("#feed").append(item);

					var itemId = "#item-"+sorted[i].id;
					var itemObj = $(itemId);
					itemObj.itemId = sorted[i].id;
					itemObj.on('click', function() {
						c.route("details", "?id="+itemObj.itemId);
					});
				}
			});
		});
	};

	//	Arbiter chooses a winner
	var judgeBet = function(data) {
		var sel = {};
		sel.betId = data.bet.id;
		sel.winnerId = data.winner.id;
		c.post(sel, "bets/resolve");
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