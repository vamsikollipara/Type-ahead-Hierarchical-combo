/**
  * This is a Type-ahead Hierarchical combo tree component
  * @author VK
  */
var DivComboTree = function(options) {

	var combohtml = "<div class='divComboTree'>";
	combohtml += "<input type='text' class='keyString'>";
	combohtml += "<div class = 'dropArrowHolder'><div class='arrow-down'></div>"
	combohtml += "</div></div>";
	combohtml += "<div class= 'suggestionContainer'></div>";
	
	//merge the defaults and the user defined options
	argCount = options.length;
	if(argCount == 0) {
		console.log("no cinfiguration given");
	} else {
		defaults = {
			combo : {
				width: 250,
				height: 25
			},
			events : {
				select : null,
				change : null,
				mouseover : null,
				mouseenter : null,
				mouseout: null,
				click : null,
				mouseDown : null,
				mouseUp : null
			},
			data: [],
			options : {
				dropdownArrow : {
					width: 11,
					height: 11
				},
				typeAhead : true
			},
			suggestions : {
				width: 250,
				height: 250
			}
		}
		this.config = extend(defaults, options);

		if(this.config.events.select) {
			this.config.events.select();
		}
		if(this.config.events.mouseover) {
			this.config.events.select();
		}
	}

	this.renderTo = document.getElementById(this.config.combo.renderTo);

	//give the basic HTML
	this.renderTo.innerHTML = combohtml;
	//create the tree
	var treeHTML = buildTreeHTML(this.config.data);
	console.log("tree is done");
	
	//create dom vriable to reuse
	this.suggestionContainer = this.renderTo.getElementsByClassName("suggestionContainer")[0];
	this.keyString = this.renderTo.getElementsByClassName('keyString')[0];
	this.dropArrowHolder = this.renderTo.getElementsByClassName('dropArrowHolder')[0];
	
	//give tree as HTML for suggestions
	this.suggestionContainer.innerHTML = treeHTML;

	this.comboParents = this.renderTo.getElementsByClassName("comboParent");
	
	//give height and width properties to the divs
	//for tex box
	this.keyString.style.width = this.config.combo.width - this.config.combo.height + 'px';
	this.keyString.style.height = this.config.combo.height + 'px';

	this.dropArrowHolder.style.padding = (this.config.combo.height - 11)/2 + 'px';

	//for suggestions
	this.suggestionContainer.style.width = this.config.suggestions.width -20 + 'px';
	this.suggestionContainer.style.maxHeight = this.config.suggestions.height -20 + 'px';
	this.suggestionContainer.style.display = 'none';
	
	
	for (var i = 0, comboParentCount = this.comboParents.length ; i < comboParentCount; i++) {
		this.comboParents[i].style.width = this.config.suggestions.width - 30 + 'px';	
	}
	
	//binding events to the combotree
	var isSuggestionOpen = false;
	var __this = this;
	this.keyString.addEventListener('click',function(e){
		__this.dropArrowHolder.click();
	}, true);
	
	this.dropArrowHolder.addEventListener('click',function(e){
		if(isSuggestionOpen) {
			__this.suggestionContainer.style.display = 'none';
			__this.keyString.blur();
			isSuggestionOpen = false;
		} else {
			__this.suggestionContainer.style.display = 'inline-block';
			__this.keyString.focus();
			isSuggestionOpen = true;
		}
		if(e.stopPropagation()) {
			e.stopPropagation();
		} else {
			e = window.event;
			e.cancelBubble = true;
		}
	}, true);

	//typeahead related code
	this.keyString.addEventListener('keyup',function(e){
		var key = this.value;
		if(e.keyCode == 38) {
			//pressed up arrow up
			// var currItem = __this.suggestionContainer.querySelectorAll('.hover');
			// var nodes = __this.suggestionContainer.querySelectorAll('.suggestionItem');
			// if(currItem.length > 0 ) {
			// 	//move the hover to next elem
			// 	currItem[0].className = currItem[0].className.replace( /(?:^|\s)hover(?!\S)/g , '' );
				
			// 	//add hover for previous one
			// 	var previousElem = currItem[0].previousElementSibling;
			// 	if(previousElem != null) {
			// 		if(previousElem.tagName == 'UL') {
			// 			// give hover class to its immidiate child
			// 			previousElem.firstChild.className = previousElem.firstChild.className + ' hover';
			// 		} else if(previousElem.className == 'arrow-right') {
			// 			if(previousElem.parentElement.previousElementSibling != null) {
			// 				var prevParent  = previousElem.parentElement.previousElementSibling;
			// 				if(prevParent.className != 'suggestionContainer') {
			// 					prevParent.lastChild.className = prevParent.lastChild.className + ' hover';
			// 				} else {
			// 					currItem[0].className = currItem[0].className + ' hover';
			// 				}	
			// 			} else {
			// 				currItem[0].className = currItem[0].className + ' hover';
			// 			}
						
			// 		} else {
			// 			previousElem.className = previousElem.className + ' hover';
			// 		}
			// 	} else {
			// 		var prevParent  = currItem[0].parentElement.previousElementSibling;
			// 		if(prevParent.className == 'suggestionContainer') {
			// 			currItem[0].className = currItem[0].className + ' hover';
			// 		} else {
			// 			if(prevParent.tagName == 'UL') {
			// 				// give hover class to its immidiate child
			// 				prevParent.lastChild.className = prevParent.lastChild.className + ' hover';
			// 			} else if(prevParent.firstChild.className == 'arrow-right') {
			// 				if(prevParent.className != 'suggestionContainer') {
			// 					prevParent.lastChild.className = prevParent.lastChild.className + ' hover';
			// 				} else {
			// 					currItem[0].className = currItem[0].className + ' hover';
			// 				}
								
			// 			} else {
			// 				//give it hover class 
			// 				prevParent.className = prevParent.className + ' hover';
			// 			}
			// 		}
			// 	}
			// } else {
			// 	//give hover to the first one
			// 	console.log('down');
				
			// }
			
		} else if(e.keyCode == 40) {
			//pressed down arrow
			// var currItem = __this.suggestionContainer.querySelectorAll('.hover');
			// if(currItem.length > 0 ) {
			// 	//move the hover previous elem
			// 	//remove hover for the current elem
			// 	currItem[0].className = currItem[0].className.replace( /(?:^|\s)hover(?!\S)/g , '' );
			// 	var nextElem = currItem[0].nextElementSibling;
			// 	if(nextElem != null) {
			// 		if(nextElem.tagName == 'UL') {
			// 			// give hover class to its immidiate child
			// 			nextElem.firstChild.className = nextElem.firstChild.className + ' hover';
			// 		} else if(nextElem.className == 'arrow-right') {
			// 			var nextParent  = currItem[0].parentElement.previousElementSibling;
			// 			nextElem.lastChild.className = nextElem.lastChild.className + ' hover';
			// 		} else {
			// 			//give it hover class 
			// 			var nextParent  = currItem[0].parentElement.nextElementSibling;
			// 			nextElem.className = nextElem.className + ' hover';
			// 		}

			// 	} else {
			// 		var nextParent  = currItem[0].parentElement.nextElementSibling;
			// 		if(nextParent == null) {
			// 			currItem[0].className = currItem[0].className + ' hover';
			// 		} else {
			// 			if(nextParent.tagName == 'UL') {
			// 				// give hover class to its immidiate child
			// 				nextParent.firstChild.className = nextParent.firstChild.className + ' hover';
			// 			} else if(nextParent.firstChild.className == 'arrow-right') {
			// 				nextParent.lastChild.className = nextParent.lastChild.className + ' hover';
			// 			}  else {
			// 				//give it hover class 
			// 				nextParent.className = nextParent.className + ' hover';
			// 			}
			// 		}
			// 	}
			// } else {
			// 	//give hover to the first one
			// }
			

		} else {
			if(key.indexOf(':') > -1) {
				//indicates user has entered the name of the project now typing the name of the feature
				var res =  this.value.split(":");
				__this.searchProjectFeature(res[0], res[1]);

			} else {
				//indicates user is still typing the name of the project
				__this.searchProjects(key);
			}	
		}
	},true);

	//focus for suggestions
	var suggestionItems = this.suggestionContainer.querySelectorAll('.suggestionItem');
	for(var i = 0, suggestionCount = suggestionItems.length ; i < suggestionCount; i++) {
		var item = suggestionItems[i];
		item.addEventListener('mouseover',function(e) {
			hoverItem = __this.suggestionContainer.querySelectorAll('.hover');
			if(hoverItem && hoverItem.length > 0)
			hoverItem[0].className = hoverItem[0].className.replace( /(?:^|\s)hover(?!\S)/g , '' )
			e.currentTarget.className = e.currentTarget.className + ' hover';

		});
	}

	var rightArrows = this.suggestionContainer.querySelectorAll('.arrow-right');
	for(var i = 0 , rightArrowCount = rightArrows.length; i < rightArrowCount; i++) {
		var arrow = rightArrows[i];
		arrow.addEventListener('click', function(e) {
			this.className = this.className.replace( /(?:^|\s)arrow-right(?!\S)/g , '' )
			this.className = this.className + 'arrow-down'; 
			projId = this.parentElement.getAttribute('relId');
			featureList = __this.suggestionContainer.querySelectorAll('ul.children[relId="'+projId+'"]');
			featureList[0].style.display = 'none'
		}, true)
	}

	var downArrows = this.suggestionContainer.querySelectorAll('.arrow-down');
	for(var i = 0 , downArrowCount = downArrows.length; i < downArrowCount; i++) {
		var arrow = downArrows[i];
		arrow.addEventListener('click', function(e) {
			this.className = this.className.replace( /(?:^|\s)arrow-down(?!\S)/g , '' )
			this.className = this.className + 'arrow-right';
			projId = this.parentElement.getAttribute('relId');
			featureList = __this.suggestionContainer.querySelector('ul.children [relId="' + projId +  '"]');
			featureList.style.display = 'none'
		}, true)
	}

	//selecting Suggestion

	this.searchProjects = function(key) {
		var elems = this.suggestionContainer.querySelectorAll('[relParent]');
		for(var i = 0 , elemCount =elems.length; i < elemCount ; i++) {
			if(elems[i].getAttribute('relParent').indexOf(key) > -1) {
				//user is searching for this so show
				elems[i].style.display = '';
			} else {
				//user is not searching for this hide it
				elems[i].style.display = 'none';
			}
		}
	}

	this.searchProjectFeature = function(parent,child) {
		var project = this.suggestionContainer.querySelectorAll('div[relParent='+ parent +']');
		project[0].style.display = 'inline-block';
		var featureBlock = this.suggestionContainer.querySelectorAll('ul[relParent='+ parent +']');
		var features = featureBlock[0].getElementsByTagName('li');
		for(var i = 0, featureCount = features.length; i < featureCount ; i++) {
			if(features[i].getAttribute('item').indexOf(child) > -1) {
				features[i].style.display = 'inline-block';
			} else {
				features[i].style.display = 'none';
			}
			
		}
	}
}

/**
 * JS code for doing deep merge of two JSONs similar to JQuery extend
 * @params [object]
 */
function extend(){
	if(typeof arguments[1] == "object") {
		for(var i = 1 ; i < arguments.length ; i++) {
			for(var key in arguments[i])
		    {
				if(arguments[i].hasOwnProperty(key)) {
					if(arguments[i] != undefined  && arguments[0] != undefined ){
						arguments[0][key] = extend(arguments[0][key] , arguments[i][key]);
					} else {
						arguments[0] = arguments[0] = arguments[i];
					}	
				}
			}
		}
	} else {
		arguments[0] = arguments[1];
	}
	return arguments[0];
}

/**
 * builds a tree like HTML View with tree like data
 * @param [object] treedata - contains the dat to be used to build the tree
 */
function buildTreeHTML(treeData) {
	var htmlStr = "";

	for (var i = 0, treeLength = treeData.length; i < treeLength; i++ ) {
		
		if(treeData[i].hasChildren) {
			htmlStr += "<div relId=" + treeData[i].id + " relParent = " + treeData[i].name + "><div class = 'arrow-right' relId=" + treeData[i].id + "></div>";
			htmlStr += "<div class='comboParent suggestionItem' >" + treeData[i].name + "</div>"; 
			htmlStr += "</div><ul style='display: inline-block' class='children' relId=" + treeData[i].id + " relParent = " + treeData[i].name + ">";
			htmlStr += buildTreeHTML(treeData[i].children);
			htmlStr += "</ul>"
		} else {
			htmlStr += "<div class = 'suggestionItem' ><li item = " + treeData[i].name + ">" + treeData[i].name + "</li></div>";
		}
	}

	return htmlStr;
}