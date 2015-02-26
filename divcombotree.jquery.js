/**
  * This is a Type-ahead Hierarchical combo tree component
  * @author VK
  */
var DivComboTree = function(elem, suggestions) {
	var code = {up: 38, down: 40},
		suggestionsContainerClass = ".suggestionsContainer";
	function hideChildItems(e){
		var el = $(e.currentTarget);

		if(el.hasClass('collapseArrow')){
			var refId = el.parent().data('id');
			for(var i = 0; i< suggestions.length; i++){
				var p = suggestions[i];
				if(refId === p.id){
					p.excludeChildren = true;
				}
			}
			renderSuggestions(elem, suggestions);
			el.removeClass('collapseArrow')
				.addClass('expandArrow');
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
			el.removeClass('expandArrow')
				.addClass('collapseArrow');
		}
	}
	function insertProjectAndFeatureName(e){
		var el = $(e.currentTarget);
		var result = el.parents('ul').prev('div').children('span').eq(1).html() + ":" + el.html();
		el.parents(suggestionsContainerClass).prev('input').val(result);
		el.parents(suggestionsContainerClass).hide();
	}
	function insertProjectName(e){
		var el = $(e.currentTarget);
		var input = el.parents(suggestionsContainerClass).prev('input');
		input.val(el.html());
		el.parents(suggestionsContainerClass).hide();
	}
	function showSuggestions(e){
		$(e.currentTarget).next(suggestionsContainerClass).toggle();
	}
	function keyOperations(e){
		var keyCode = e.keyCode || e.which;
		// console.log(keyCode);
		var el = $(e.currentTarget);
		if(code.up == keyCode){
			var active = el.next(suggestionsContainerClass).find('.active');
			if(active.length){
				var previous = active.prev();
				if(previous.length){
					previous.addClass('active');
				}
				else{
					var parentPrev = active.parent().prev();
					if(parentPrev.length){
						var children = parentPrev.find('li');
						if(children.length){
							children.last().addClass('active');
						}
						else{
							parentPrev.addClass('active');
						}
					}
					else{
						//Select the last feature or project name 
						el.next(suggestionsContainerClass).children('ul').find('li:last').addClass('active');
					}
				}
				active.removeClass('active');
			}
			else{
				//Select the last feature or project name 
				el.next(suggestionsContainerClass).children('ul').find('li:last').addClass('active');
				active.removeClass('active');
			}
		}
		else if(code.down === keyCode){
			var active = el.next(suggestionsContainerClass).find('.active');
			if(active.length){
				var next = active.next();
				if(next.length){
					var nextChildren = next.children('li');
					if(nextChildren.length){
						nextChildren.first().addClass('active');
					}
					else{
						next.addClass('active');
					}
				}
				else{
					var nextItem = active.parent().parent().next().children().eq(0);
					if(nextItem.length){
						nextItem.addClass('active');
					}
					else{
						//Select the last feature or project name 
						var item = el.next(suggestionsContainerClass).find('ul > li > div').first();
						item.addClass('active');
						active.removeClass('active');
					}
				}
				active.removeClass('active');
			}
			else{
				//Select the last feature or project name 
				var item = el.next(suggestionsContainerClass).find('ul > li > div').first();
				item.addClass('active');
				active.removeClass('active');
			}
		}
		else{
			filterSuggestions(el);
		}
	}

	function makeActive(e){
		var el = $(e.currentTarget);
		el.parents(suggestionsContainerClass).find('.active').removeClass('active');
		el.addClass('active');
	}
	function filterSuggestions(el){
		el.next(suggestionsContainerClass).show();
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
				var f = p.children;
				for(var j=0;j<f.length;j++){
					var feature = f[j];
					feature.excludeChild = false;
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

				var li = document.createElement('li');
				li.appendChild(projectHeadingWrapper);

				//active
				projectHeadingWrapper.onmouseover = makeActive;

				var project = list[i];
				var features = project.children;

				if(project.excludeChildren === false){
					spanArrow.className = "collapseArrow";
				}
				else{
					spanArrow.className = "expandArrow";
				}
				if(!project.excludeParent){
					//event
					spanArrow.onclick = hideChildItems;					
					spanProjectName.innerHTML = project.name;
					projectHeadingWrapper.setAttribute('data-id', project.id);

					spanProjectName.onclick = insertProjectName;

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
								subLi.onclick = insertProjectAndFeatureName;
								subLi.onmouseover = makeActive;
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
	var textBox = document.createElement('input');
	textBox.setAttribute('type', 'text');
	renderSuggestions(elem, suggestions, textBox);
}
