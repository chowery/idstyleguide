/* global SyntaxHighlighter */
$(document).ready(function() {
	
	/******************** GLOBAL-VARIABLES ********************/
	var pages;
	var pIndex = -1;
	var hIndex = -1;
	
	/******************** FUNCTIONS ********************/
	
	function determinePage() {
		var pageId = $("html").attr("id");
		
		if (pageId === "css") {
			pages = ["pageheaders","typo","layouts","emphasis","tables","footers","helpers"];
		} else if (pageId === "callouts") {
			pages = ["callouts-inline","callouts-block-level"];
		} else if (pageId === "advEx") {
			
		} else {
			pages = ["404"];
		}
	}
	
	function checkIfExist(page) {
		var exist = false;
		
		$.each(pages, function(i,val) {
			if (page === val) {
				exist = true;
				hIndex = i;
				return false;
			}
		});

		return exist;
	}
	
	function getContent(page) {
		$("#page-content").hide();
		$("#page-content").load("parts/"+page+".html", function(){
			SyntaxHighlighter.highlight();
			$(this).fadeIn("slow");
		});
	}
	
	function makeCurrent(i) {
		$(".toc ul li a").each(function() {
			$(this).removeClass("active");
		});
		if (i >= 0) {
			$(".toc ul li a:eq("+i+")").addClass("active");
		}
		pIndex = i;
	}
	
	function checkForHash() {
		var hash = window.location.hash;
		
		hash = hash.replace("#","").trim(hash).toLowerCase();

		if (hash !== "") {
			if (checkIfExist(hash)) {
				if (hIndex !== pIndex) {
					makeCurrent(hIndex);
					getContent(hash);
					return (1);
				}
			} else {
				makeCurrent(-1);
				getContent("404");
				return (0);
			}
		} else {
			return (-1);
		}
		
	}
	
	/******************** MAIN CODE ********************/
	
	$.ajaxSetup ({ cache: false });
	
	determinePage();
	
	if (checkForHash() === -1) {
		makeCurrent(0);
		getContent(pages[0]);
	}
	
	$(window).on('hashchange', function() {
		checkForHash();
	});
	
	$(".toc ul li a").on("click", function() {
		var exist = false;
		var parent = this.parentNode;
		var index = $(parent).index();
		var current = $(this).data("name");
		exist = checkIfExist(current);
		
		if (exist) {
			if (index !== pIndex) {
				makeCurrent(index);
				getContent(current);
			}
		} else {
			makeCurrent(-1);
			getContent("404");
		}
		
	});
	
});