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

	//	Get one user's info
	var getUserInfo = function(userId) {
		return c.get("user", "?id="+userId);
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
				if(feedItems[i]["proposer"] === me.id || feedItems[i]["acceptor"] === me.id) {
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
				if(feedItems[i]["arbiter"] === me.id) {
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
		console.dir(item);

		var itemId = "item-"+item.id;
		var winnings = 0;
		var losses = 0;
		var nemesis = "";
		var nemesisImage = "http://placehold.it/24x24";

		if(item.proposer == me.id) {	//	I am the proposer
			winnings = item.a_amount;
			losses = item.p_amount;
			nemesis = item.acceptor_name;
			nemesisImage = item.acceptor_pic;
		}
		else if(item.acceptor == me.id) {	//	I am the acceptor
			winnings = item.p_amount;
			losses = item.a_amount;
			nemesis = item.proposer_name;
			nemesisImage = item.proposer_pic;
		}
		else {	//	I am the arbiter
			nemesis = "Neutral";
		}

		var display =	"<li id=" + itemId + ">" 	+
							"<div class='amount'>"	+
							"<div class='win'><span class='condensed'> + </span>$" + winnings + "</div>"	+
							"<div class='lose'><span class='condensed'> - </span>$" + losses + "</div>"		+
							"</div>"			+
							"<p>" + item.description + "</p>"	+
							"<div class='person'>"		+
								"<img src=" + nemesisImage + " /> <p>" + nemesis + "</p>" +
							"</div>" +
						"</li>";

		return display;
	};

	//	Start a new bet
	var makeBet = function() {
		//c.route("bets");

		$('.modal').fadeToggle(function() {
			getSelfInfo().done(function(data) {
				me = data;
				getFriends().done(function(friendList) {
					friends = (friendList.data).sort();
					window.console.dir(friends);
					betInit();	//	init the page with default category
				});
			});
		});
	};

	//	Prepare and display the sorted feed items
	var init = function(sorter) {
		sorter = sorter || "all";
		getFeedItems().done(function(feedItems) {
			feedItems = feedItems || [];
			if (feedItems) {
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
			} else {
				$("#feed").empty();
				$("#feed").append("<li class='no-items'><h3>Looks like you haven't placed a bet yet, get too it.</h3></li>");
			}

		});
	};

	//	Arbiter chooses a winner
	var judgeBet = function(data) {
		var sel = {};
		sel.betId = data.bet.id;
		sel.userId = data.user.id;
		c.post(sel, "bet/resolve");
	};

	//	Cancel a bet
	var cancelBet = function(data) {
		var sel = {};
		sel.betId = data.bet.id;
		sel.userId = data.user.id;
		c.post(sel, "bet");
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


//							BET FUNCTIONS

	var DEFAULT_CATEGORY = "general";
	var friends = [];

	//	Get all types of betting categories
	var getCategories = function() {
		return c.get("categories");

	};

	//	Get logged in user's friends
	var getFriends = function() {
		return c.get("friends");
	};

	//	Inject categories into the page
	var injectCategories = function(cats, selected) {
		var display = "";
		var sel = "";
		for (var i = 0; i < cats.length; i++) {
			display +=	"<li id='" + cats[i] +  "' style='display: inline-block;'>";
			display += (i === selected) ? "<b>" + cats[i] + "</b>" : cats[i];
			display += "</li>";
		}

		$("#categories").empty();
		$("#categories").append(display);
	};

	//	Display data for a specific category
	var showCategoryData = function(cat) {
		var data = "";
		if(cat === "general") {
			data =	"<textarea name='textarea' name='description' id='bet'>what's yer wager?</textarea>";
		}
		$('#bet-canvas').empty();
		$("#bet-canvas").append(data);
	};

	var injectFriends = function() {
		$("#aUser-dropdown").empty();
		for (var i = 0; i < friends.length; i++) {
			$("#aUser-dropdown").append("<option id=" + friends[i].id + " value='" + 
				friends[i].profile_picture_url + "'>" + friends[i].display_name + "</option>");
		}
	};



	//	Inject the category options, select a default, and setup on click events.
	var betInit = function(sorter) {
		sorter = sorter || DEFAULT_CATEGORY;
		injectFriends();
		$("#pImage").attr("src", me.picture); 
		$("#aImage").attr("src", $("#aUser-dropdown option:selected").val()); 
		getCategories().done(function(categories) {
			categories = ["general"];
			var chosen = 0;
			for (var i = 0; i < categories.length; i++) {
				if(categories[i] === sorter) {
					chosen = i;
				}
			}
			injectCategories(categories, chosen);
			showCategoryData(categories[chosen]);

			for (var i = 0; i < categories.length; i++) {
				var catObj = $("#"+categories[i]);
				catObj.category = categories[i];
				catObj.on('click', function() {
					showCategoryData(catObj.category);
				});
			}
		});

		// var nemesis = {name: "test"};
		//$("#pUser").append(me.name);
		// $("#aUser").append(nemesis.name);

		$("#bet").on('click', function() {
			window.console.log("placing a bet");
			var data = {};
			data.proposer = me.id;
			data.proposer_name = "";
			data.p_amount = $("#p_amount").val();
			data.proposer_pic = me.picture;
			data.acceptor = $("#aUser-dropdown option:selected").attr("id");
			data.acceptor_name = "";
			data.a_amount = $("#a_amount").val();
			data.acceptor_pic = $("#aUser-dropdown option:selected").val();
			data.arbiter = 1;
			data.description = $("#bet").val();

			for (var i = 0; i < friends.length; i++) {
				if(friends[i].id == data.proposer) {
					data.proposer_name = friends[i].display_name;
				}
				else if(friends[i].id == data.acceptor) {
					data.acceptor_name = friends[i].display_name;
				}
			}

			data = JSON.stringify(data);

			window.console.dir(data);
			c.post(data, "bet").done(function() {
				c.route("main");
			});
		});

		$("#aUser-dropdown").change(function() {
			var pic = $(this).val();
			$("#aImage").attr("src", pic); 
		});
	};



})(window, document, window.$, window.common);

	$(function() {
	    $('textarea').each(function() {
	        $.data(this, 'default', this.value);
	    }).css("color","gray")
	    .focus(function() {
	        if (!$.data(this, 'edited')) {
	            this.value = "";
	            $(this).css("color","black");
	        }
	    }).change(function() {
	        $.data(this, 'edited', this.value != "");
	    }).blur(function() {
	        if (!$.data(this, 'edited')) {
	            this.value = $.data(this, 'default');
	            $(this).css("color","gray");
	        }
	    });
	});
