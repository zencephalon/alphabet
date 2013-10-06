(function(window, document, $, c) {
"use strict";

	var DEFAULT_CATEGORY = "general";

	//	Get all types of betting categories
	var getCategories = function() {
		return c.get("categories");

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
			data =	"Bet: <input type='text' name='bet' id='bet'>";
		}
		$('#form').empty();
		$("#form").append(data);
	};


	//	Inject the category options, select a default, and setup on click events.
	var init = function(sorter) {
		sorter = sorter || DEFAULT_CATEGORY;
		getCategories().done(function(categories) {
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

		$("#bet").on('click', function() {
			window.console.log("placing a bet");
			var formData = $('#form').serializeArray();
			c.post(formData, "bets");
			c.route("main");
		});
	};

	$(function() {
		init();	//	init the page with default category
	});


})(window, document, window.$, window.common);