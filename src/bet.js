(function(window, document, $, c) {
"use strict";

	

	//	Get all types of betting categories
	var getCategories = function() {
		var categories = c.get("categories.json") || ["General"];
		return categories || [];
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

		$("#categories").clear();
		$("#categories").append(display);
	};

	//	Display data for a specific category
	var showCategoryData = function(cat) {
		if(cat === "General") {
			
		}
	};


	//	Inject the category options, select a default, and setup on click events.
	var init = function(sorter) {
		sorter = sorter || "General";
		var categories = getCategories();
		var chosen = 0;
		for (var i = 0; i < categories.length; i++) {
			if(categories[i] === sorter) {
				chosen = i;
			}
		}
		injectCategories(categories, chosen);

		for (var i = 0; i < categories.length; i++) {
			$("#"+categories[i]).click(function() {
				showCategoryData(categories[i]);
			});
		}
	};

	$(function() {
		init();	//	init the page with default category
	});


})(window, document, window.$, window.common);