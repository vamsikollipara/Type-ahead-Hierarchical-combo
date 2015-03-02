/**
  * This is a Type-ahead Hierarchical combo tree component
  * @author Venkateshwar
  */
var DivComboTree = function(elem, suggestions, values) {
	var code = {up: 38, down: 40,enter: 13},
		$elem = $(elem);

		values = values || {},
		values.container = values.container || "comboTree",
		values.suggestionsContainer = values.suggestionsContainer || "suggestionsContainer",
		values.hoveredElement = values.hoveredElement || "active",
		values.collapseArrow = values.collapseArrow || "collapseArrow",
		values.expandArrow = values.expandArrow || "expandArrow",
		values.listClass = values.listClass || "selectable",
		values.noChild = "noChild",
		dot = ".",
		suggestionsContainerClass = dot + values.suggestionsContainer;

	$elem.addClass(values.container);

	var textBox = document.createElement('input');
	textBox.setAttribute('type', 'text');
	renderSuggestions(elem, suggestions, textBox);

	// <--  Hide section -->
	//events
	// This section is to make sure that when the user clicks on outside of the suggestions box
	// The suggestion box will hide.
	document.onclick = hideSuggestions;
	$elem.click(function(e){
		e.stopPropagation();
	});
	// <-- End of Hide section -->

	/*
	 * toggleChildItems: It is used to show or hide the child items 
	 * Code Explanation: 'excludeChildren' flag is used to show or hide the child items 
	 * @param: 'e' represents the event
	 */
	function toggleChildItems(e){
		var el = $(e.currentTarget);

		if(el.hasClass(values.collapseArrow)){
			collapseItems(el);
		}
		else if(el.hasClass(values.expandArrow)){
			expandItems(el);
		}
		$elem.find('input').focus();
	}

	/*
	 * collapseItems: It is used to hide the child items
	 * @param: 'el' --> jquery dom object: Holds the clicked parent list item
	 * Code explanation: Makes the flag, 'excludeChildren' true. To hide the child items
	 * and then renders the new list again
	 */
	function collapseItems(el){
		var refId = el.parent().data('id');
		for(var i = 0; i< suggestions.length; i++){
			var p = suggestions[i];
			if(refId === p.id){
				p.excludeChildren = true;
			}
		}
		renderSuggestions(elem, suggestions);
	}

	/*
	 * expandItems: It is used to show the child items
	 * @param: 'el' --> jquery dom object: Holds the clicked parent list item
	 * Code explanation: Makes the flag, 'excludeChildren' false. To show the child items
	 * and then renders the new list again
	 */
	function expandItems(el){
		var refId = el.parent().data('id');
		var blnAccess = false;
		for(var i = 0; i< suggestions.length; i++){
			var p = suggestions[i];
			if(refId === p.id){
				blnAccess = true;
				p.excludeChildren = false;
			}
		}
		if(blnAccess){
			renderSuggestions(elem, suggestions);
		}
	}

	/*
	 * insertData: Inserts the clicked list item's data in to the textbox
	 * @param: Here 'e' could be the event or the jquery dom element object itself.
	 * Code explanation: Here the code checks 
	 * whether the clicked list item is parent item or parent item with no children or child item.
	 */
	function insertData(e){
		var el = $(e.currentTarget || e);
		var text = $elem.find('input');
		if(el[0].tagName.toLowerCase() === "span"){
			text.val(el.html());
		}
		else if(el[0].tagName.toLowerCase() === "div"){
			text.val(el.children.eq(1).html());
		}
		else{
			text.val(el.parents('li').children('div').children('span').eq(1).html() + ":" + el.html());
		}
		hideSuggestions();
	}

	/*
	 * showSuggestions: Shows the suggestions
	 * @noparams
	 */
	function showSuggestions(e){
		if($elem.find(suggestionsContainerClass).css('display') !== 'none'){
			return;
		}
		if(e){
			filterSuggestions($(e.currentTarget));
		}
		$elem.find(suggestionsContainerClass).show();
	}
	/*
	 * hideSuggestions: Hides the suggestions
	 * @noparams
	 */
	function hideSuggestions(){
		$elem.find(suggestionsContainerClass).hide();
		focusInputTextBox();
	}

	/*
	 * focusInputTextBox: Focuses the textBox
	 * @noparams
	 */
	function focusInputTextBox(){
		$elem.find('input').focus();
	}

	/*
	 * keyOperations: Triggers whenever user press a keyboard key.
	 * @param: 'e' represents key pressed event.
	 * Code explanation: Handles keys to navigate the items up or down and 
	 * when pressed 'Enter', the selected item will be added to the textbox.
	 */
	function keyOperations(e){
		var keyCode = e.keyCode || e.which;
		var el = $(e.currentTarget);
		// 'UP' Key pressed
		if(code.up == keyCode){
			var active = $elem.find(dot + values.hoveredElement);

			if(active.length){

				var selectables = $elem.find(dot + values.selectable);

				for(var i = 0; i < selectables.length; i++){
					var s = selectables.eq(i);
					if(s[0] === active[0]){
						var k = i - 1;
						if(k >= 0 && k < selectables.length){
							selectables.eq(k).addClass(values.hoveredElement);
						}
						else{
							selectables.eq(selectables.length-1).addClass(values.hoveredElement);
						}
						active.removeClass(values.hoveredElement);
					}
				}
			}
			else{
				$elem.find(dot + values.selectable).last().addClass(values.hoveredElement);
			}
		}
		// 'DOWN' key pressed
		else if(code.down === keyCode){
			var active = $elem.find(dot + values.hoveredElement);

			if(active.length){

				var selectables = $elem.find(dot + values.selectable);

				for(var i = 0; i < selectables.length; i++){
					var s = selectables.eq(i);
					if(s[0] === active[0]){
						var k = i + 1;
						if(k >= selectables.length){
							selectables.eq(0).addClass(values.hoveredElement);
						}
						else{
							selectables.eq(k).addClass(values.hoveredElement);
						}
						active.removeClass(values.hoveredElement);
					}
				}
			}
			else{
				$elem.find(dot + values.selectable).first().addClass(values.hoveredElement);
			}
		}
		// 'ENTER' Key pressed
		else if(code.enter === keyCode){
			insertData(e);
		}
		// For other key pressed, just filter the suggestions.
		else{
			filterSuggestions(el);
		}
	}

	/*
	 * makeActive: styles the hovered item (parent or child).
	 * @param: 'e' represents the Mouse hovered event
	 */
	function makeActive(e){
		var el = $(e.currentTarget);
		$elem.find(dot + values.hoveredElement).removeClass(values.hoveredElement);
		el.addClass(values.hoveredElement);
	}

	/*
	 * filterSuggestions: Filters the suggestions based on the entered text in textbox.
	 * @param: 'el' represent jquery dom element object.
	 * Code explanation: 'query' represents textbox value (with no colon)
	 * 'queryString' represents parent item textbox value (before colon)
	 * 'subQuery' represents child item's textbox value (after colon)
	 */
	function filterSuggestions(el){
		showSuggestions();
		var query = el.val();
		var queryString = "";

		if(query.indexOf(":") > -1){
			subQuery = query.substring(query.indexOf(":",0)+1, query.length);
			queryString = query.substring(0, query.indexOf(":",0));
		}
		else{
			subQuery = "";
		}

		for(var i = 0; i< suggestions.length; i++){
			var p = suggestions[i];
			if(p.name === queryString){
				p.excludeParent = false;
				p.excludeChildren = false;
				var f = p.children;
				for(var j=0;j<f.length;j++){
					var feature = f[j];
					if(feature.name.indexOf(subQuery) > -1){
						feature.excludeChild = false;
					}
					else{
						feature.excludeChild = true;
					}
				}	
			}
			else if(p.name.indexOf(query) < 0){
				p.excludeParent = true;
			}
			else{
				p.excludeParent = false;
				p.excludeChildren = true;
				var f = p.children;
				if(f){
					for(var j=0;j<f.length;j++){
						var feature = f[j];
						feature.excludeChild = false;
					}	
				}			
			}
		}
		renderSuggestions(elem, suggestions);
	}

	/*
	 * renderSuggestions: Renders the suggestions dynamically when user shows/hides the child items
	 * or when user press any key (by focussing on input textbox)
	 * @params: 'el' represents the element in which the suggestions are to be rendered.
	 * 'list' represents the object data holding all parent items and child items with initialized flags:
	 * 'excludeParent', 'excludeChildren' and 'excludeChild' flags.
	 */
	function renderSuggestions(el, list, textBox){
		if(list.length){
			var ul = document.createElement('ul');

			for(var i=0; i< list.length; i++){
				var projectHeadingWrapper = document.createElement('div');
				var spanArrow = document.createElement('span');
				var spanProjectName = document.createElement('span');

				projectHeadingWrapper.appendChild(spanArrow);
				projectHeadingWrapper.appendChild(spanProjectName);

				projectHeadingWrapper.className = values.selectable;

				var li = document.createElement('li');
				li.appendChild(projectHeadingWrapper);

				//active
				projectHeadingWrapper.onmouseover = makeActive;

				var project = list[i];
				var features = project.children;
				if(project.children){
					if(project.excludeChildren === false){
						spanArrow.className = values.collapseArrow;
					}
					else{
						spanArrow.className = values.expandArrow;
					}
					//event
					spanArrow.onclick = toggleChildItems;					
				}
				else{
					spanArrow.className = values.noChild;
				}
				if(!project.excludeParent){
					spanProjectName.innerHTML = project.name;
					projectHeadingWrapper.setAttribute('data-id', project.id);

					spanProjectName.onclick = insertData;

					li.name = project.id;
					if(features && features.length && project.excludeChildren === false){
						var subUl = document.createElement('ul');
						var features = features;
						for(var j=0;j<features.length; j++){
							var feature = features[j];
							if(!feature.excludeChild){
								var subLi = document.createElement('li');
								subLi.innerHTML = feature.name;
								subUl.appendChild(subLi);

								//event
								subLi.onclick = insertData;
								subLi.onmouseover = makeActive;

								subLi.className = values.selectable;
							}
						}
						li.appendChild(subUl);
					}
					ul.appendChild(li);
				}
			}
			// if textBox variable is present, then it means that the rendering is happening for the first time.
			if(textBox){
				// Making sure nothing is present in the using container.
				el.innerHTML = "";
				el.appendChild(textBox);

				//event
				textBox.onclick = showSuggestions;
				// textBox.onblur = hideSuggestions;
				textBox.onkeyup = keyOperations;

				var suggestionsContainer = document.createElement('div');
				suggestionsContainer.className = values.suggestionsContainer;
			}
			else{
				// keep the textbox
				var suggestionsContainer = $(el).children(suggestionsContainerClass)[0];
				suggestionsContainer.innerHTML = "";
			}
			suggestionsContainer.appendChild(ul);
			el.appendChild(suggestionsContainer);
		}	
	}
}
