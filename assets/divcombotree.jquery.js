/**
  * This is a Type-ahead Hierarchical combo tree component
  * @author Venkateshwar
  */
var DivComboTree = function(elem, suggestions) {
	var code = {up: 38, down: 40,enter: 13},
		suggestionsContainerClass = ".suggestionsContainer",
		$elem = $(elem),
		$suggestionsContainer = $elem.find(suggestionsContainerClass);
	$elem.addClass('comboTree');

	var textBox = document.createElement('input');
	textBox.setAttribute('type', 'text');
	renderSuggestions(elem, suggestions, textBox);

	function toggleChildItems(e){
		var el = $(e.currentTarget);

		if(el.hasClass('collapseArrow')){
			collapseItems(el);
		}
		else if(el.hasClass('expandArrow')){
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
	}
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
		$elem.find(suggestionsContainerClass).hide();
	}
	function showSuggestions(e){
		filterSuggestions($(e.currentTarget));
		$elem.find(suggestionsContainerClass).show();
	}
	function hideSuggestions(e){
		$elem.find(suggestionsContainerClass).hide();
	}
	function keyOperations(e){
		var keyCode = e.keyCode || e.which;
		// console.log(keyCode);
		var el = $(e.currentTarget);
		if(code.up == keyCode){
			var active = $elem.find('.active');

			if(active.length){

				var selectables = $elem.find('.selectable');

				for(var i = 0; i < selectables.length; i++){
					var s = selectables.eq(i);
					if(s[0] === active[0]){
						var k = i - 1;
						if(k >= 0 && k < selectables.length){
							selectables.eq(k).addClass('active');
						}
						else{
							selectables.eq(selectables.length-1).addClass('active');
						}
						active.removeClass('active');
					}
				}
			}
			else{
				$elem.find('.selectable').last().addClass('active');
			}
		}
		else if(code.down === keyCode){
			var active = $elem.find('.active');

			if(active.length){

				var selectables = $elem.find('.selectable');

				for(var i = 0; i < selectables.length; i++){
					var s = selectables.eq(i);
					if(s[0] === active[0]){
						var k = i + 1;
						if(k >= selectables.length){
							selectables.eq(0).addClass('active');
						}
						else{
							selectables.eq(k).addClass('active');
						}
						active.removeClass('active');
					}
				}
			}
			else{
				$elem.find('.selectable').first().addClass('active');
			}
		}
		else if(code.enter === keyCode){
			insertData(e);
		}
		else{
			filterSuggestions(el);
		}
	}

	function makeActive(e){
		var el = $(e.currentTarget);
		$elem.find('.active').removeClass('active');
		el.addClass('active');
	}
	function filterSuggestions(el){
		$elem.find(suggestionsContainerClass).show();
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
	function renderSuggestions(el, list, textBox){
		if(list.length){
			var ul = document.createElement('ul');

			for(var i=0; i< list.length; i++){
				var projectHeadingWrapper = document.createElement('div');
				var spanArrow = document.createElement('span');
				var spanProjectName = document.createElement('span');

				projectHeadingWrapper.appendChild(spanArrow);
				projectHeadingWrapper.appendChild(spanProjectName);

				projectHeadingWrapper.className = "selectable";

				var li = document.createElement('li');
				li.appendChild(projectHeadingWrapper);

				//active
				projectHeadingWrapper.onmouseover = makeActive;

				var project = list[i];
				var features = project.children;
				if(project.children){
					if(project.excludeChildren === false){
						spanArrow.className = "collapseArrow";
					}
					else{
						spanArrow.className = "expandArrow";
					}
					//event
					spanArrow.onclick = toggleChildItems;					
				}
				else{
					spanArrow.className = "noChild";
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

								subLi.className = "selectable";
							}
						}
						li.appendChild(subUl);
					}
					ul.appendChild(li);
				}
			}
			if(textBox){
				el.innerHTML = "";
				el.appendChild(textBox);

				//event
				textBox.onclick = showSuggestions;
				// textBox.onblur = hideSuggestions;
				textBox.onkeyup = keyOperations;

				var suggestionsContainer = document.createElement('div');
				suggestionsContainer.className = "suggestionsContainer";
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
