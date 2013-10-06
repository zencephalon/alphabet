(function(window, document, $, c) {
"use strict";

	var DEFAULT_CATEGORY = "general";
	var me = [];
	var friends = [];

	//	Get all types of betting categories
	var getCategories = function() {
		return c.get("categories");

	};

	//	Get logged in user's friends
	var getFriends = function() {
		return c.get("friends");
	};

	//	Get my information from Venmo or login process.
	var getSelfInfo = function() {
		return c.get("me");
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
			data =	"Bet: <input type='text' name='description' id='bet'>";
		}
		$('#form').empty();
		$("#form").append(data);
	};

	var injectFriends = function() {
		$("#aUser-dropdown").empty();
		for (var i = 0; i < friends.length; i++) {
			$("#aUser-dropdown").append("<option id=" + friends[i].id + " value='" + 
				friends[i].id + "'>" + friends[i].display_name + "</option>");
			$("#"+friends[i].id).pic = friends[i].picture;
		}
	};

	//	Inject the category options, select a default, and setup on click events.
	var init = function(sorter) {
		sorter = sorter || DEFAULT_CATEGORY;
		injectFriends();
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
		$("#pUser").append(me.name);
		// $("#aUser").append(nemesis.name);

		$("#bet").on('click', function() {
			window.console.log("placing a bet");
			var data = {};
			data.pUser = me.id;
			data.pAmount = $("#p_amount").val();
			data.pPic = me.picture;
			data.aUser = $("#aUser-dropdown option:selected").val();
			data.aAmount = $("#a_amount").val();
			data.aPic = ("#aUser-dropdown option:selected").picture;
			data.description = $("#bet").val();

			c.post(data, "bet").done(function() {
				c.route("main");
			});
		});
	};

	$(function() {
		getSelfInfo().done(function(data) {
			me = data;
			getFriends().done(function(friendList) {
				friends = (friendList.data).sort();
				window.console.dir(friends.data);
				init();	//	init the page with default category
			});
		});
	});


})(window, document, window.$, window.common);