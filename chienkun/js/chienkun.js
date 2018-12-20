var htmlDecode = function(input){
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

var update = function(recipe) {
	recipeData = recipe.data('recipe');
	productId = recipe.data('product');
	grade = item_data[productId][1];
	item_type = item_data[productId][3];
	
	refineLevel = recipe.find(".refine select").val();
	chienkunRefineCost = 0;
	if (refineLevel)
		chienkunRefineCost = Math.round((refine_cost[refineLevel] * recipeData[1])/100);
	socketCount = recipe.find(".socket select").val();
	chienkunSocketCost = 0;
	chienkunGemCost = 0;
	if (socketCount) {
		if (chienkun_type_config[item_type][2] == 1) 
			cost_table =  socket_weapon_cost[grade];
		if (chienkun_type_config[item_type][2] == 2) 
			cost_table =  socket_armor_cost[grade];
		else
			cost_table = socket_ornament_cost;
		chienkunSocketCost = Math.round((cost_table[socketCount] * recipeData[1])/100);
		gemGrade = recipe.find(".gems select").val();
		chienkunGemCost = Math.round((gem_cost[gemGrade]* socketCount * recipeData[1])/100);
	}
	
	chienkunEngraveCost = 0
	engraveCount = recipe.find(".engrave select").val();
	if (engraveCount) {
		chienkunEngraveCost = Math.round((engrave_cost[engraveCount] * recipeData[2])/100);
	}
	
	totalChienkunCost = chienkunRefineCost + chienkunSocketCost + chienkunGemCost + chienkunEngraveCost;
	result = recipe.find('.cost').empty();
	if (chienkunRefineCost) //.append(makeItemWidget(12980))
		result.append($('<div class="label">').text("Refine: ")).append($('<div class="value">').text(chienkunRefineCost)).append($("<br>"));
	if (chienkunSocketCost)
		result.append($('<div class="label">').text("Sockets: ")).append($('<div class="value">').text(chienkunSocketCost)).append($("<br>"));
	if (chienkunGemCost)
		result.append($('<div class="label">').text("Gems: ")).append($('<div class="value">').text(chienkunGemCost)).append($("<br>"));
	if (chienkunEngraveCost)
		result.append($('<div class="label">').text("Engrave: ")).append($('<div class="value">').text(chienkunEngraveCost)).append($("<br>"));
	if (totalChienkunCost != chienkunRefineCost && totalChienkunCost != chienkunSocketCost && totalChienkunCost != chienkunGemCost )
		result.append($('<div class="label">').text("Total: ")).append($('<div class="value">').text(totalChienkunCost)).append($("<br>"));	
};


var makeItemWidget = function(id) {
	if (id == 0) return $("<div class='item'>");
	
	return $("<div class='item'>").css('backgroundImage', 'url(http://asterpw.github.io/pwicons/f/'+id+'.png')
		.text(htmlDecode(item_data[id][0]))
		.addClass("item_color" + item_data[id][2]);
};
var makeEngraveControl = function(maxEngraves) {
	selectorControl = $('<div class="engrave selector">');
	label = $('<div class="label">').text("Engrave:");
	select = $('<select>');
	for (var i = 0; i <= maxEngraves; i++) 
		select.append($('<option>').attr('value', i).text(i + " addon" +((i != 1) ? "s" : "")));
	select.change(function(){ update($(this).parents('.recipe'))});
	return selectorControl.append(label).append(select);
};

var makeGemsControl = function(gemType) {
	selectorControl = $('<div class="gems selector">');
	label = $('<div class="label">').text("Gems:");
	select = $('<select>');
	for (var i = 1; i <= 14; i++) 
		select.append($('<option>').attr('value', i).text("Grade "+i));
	select.change(function(){ update($(this).parents('.recipe'))});
	return selectorControl.append(label).append(select);
};

var makeSocketControl = function(maxSocket) {
	selectorControl = $('<div class="socket selector">');
	label = $('<div class="label">').text("Sockets:");
	select = $('<select>');
	for (var i = 0; i <= maxSocket; i++) 
		select.append($('<option>').attr('value', i).text(i + " socket" + (i==1 ? "" : "s")));
	select.change(function(){ update($(this).parents('.recipe'))});
	return selectorControl.append(label).append(select);
};

var makeRefineControl = function(maxRefine) {
	selectorControl = $('<div class="refine selector">');
	label = $('<div class="label">').text("Refine:");
	select = $('<select>');
	for (var i = 0; i <= maxRefine; i++) 
		select.append($('<option>').attr('value', i).text("+" + i));
	select.change(function(){ update($(this).parents('.recipe'))});
	return selectorControl.append(label).append(select);
};

var makeSourceControl = function(id) {
	source = $('<div class="source panel">');
	if (id == 0) return source.text('No Source');
	source.append(makeItemWidget(id));
	item_type = item_data[id][3];
	if (chienkun_type_config[item_type][0])
		source.append(makeRefineControl(12));
	if (chienkun_type_config[item_type][1])
		source.append(makeSocketControl(chienkun_type_config[item_type][1]));
	if (chienkun_type_config[item_type][2])
		source.append(makeGemsControl(chienkun_type_config[item_type][1]));
	if (chienkun_type_config[item_type][3])
		source.append(makeEngraveControl(chienkun_type_config[item_type][3]));
	return source;
};

var makeRecipe = function(id, recipeData) {
	recipe = $("<div class='recipe'>");
	recipe.append($("<div class='title'>").append(makeItemWidget(id)));
		
	recipe.append(makeSourceControl(recipeData[0]));
	mats = $("<div class='mats panel'>");
	for (var i in recipeData[4]) {
		mat = $("<div class='mat'>"); 
		mat.append($("<div class='label'>").text(recipeData[4][i][1]))
		mat.append(makeItemWidget(recipeData[4][i][0]));
		mats.append(mat);
	}
	mats.append($("<div class='label'>").text("Coins: " + recipeData[3]));
	recipe.append($("<div class='cost panel'>"))
	recipe.append(mats);
	recipe.data('recipe', recipeData);
	recipe.data('product', id);
	return recipe;
}

var makeRecipes = function(id) {
	$('#recipes').empty();
	if (id in recipes)
	$.each(recipes[id], function(index, recipeData) {
		$('#recipes').append(makeRecipe(id, recipeData));
	});
	for (var i in recipes) {
		if (i != id) 
			for (var j in recipes[i]) {
				if (recipes[i][j][0] == id) 
					$('#recipes').append(makeRecipe(i, recipes[i][j]));
				else{
					for (var k in recipes[i][j][4]) {
						if (recipes[i][j][4][k][0] == id) {
							$('#recipes').append(makeRecipe(i, recipes[i][j]));
							break;
						}
					}
				}
			}
	}
	
};

var makeItemAutoComplete = function(ul, item) {
	return $('<li>').append(makeItemWidget(item.value))//$('<li>').append($("<div class='icon'>").css('backgroundImage', 'url(http://asterpw.github.io/pwicons/f/'+item.value+'.png'))
		//.append($("<div class='label'>").text(item.label).addClass("item_color" + item_data[item.value][2]))
		.click(function(){
			$("#autocomplete").autocomplete("close");
			makeRecipes(item.value);
		})
		.appendTo(ul);	
};

var selectItem = function( event, ui ) {
	event.preventDefault();
	$('#autocomplete').autocomplete("close");
	$('#autocomplete').val(ui.item.label);
	makeRecipes(ui.item.value);
};

var addSourceItemData= function(items, id) {
	if (!(id in items) && id != 0) items[id] =  htmlDecode(item_data[id][0]);
};

var makeSourceItemData = function() {
	var result = [];
	var completeableItems = {};
	for (var i in recipes) {
		addSourceItemData(completeableItems, i); 

		for (var j in recipes[i]) {
			addSourceItemData(completeableItems, recipes[i][j][0]); 
			for (var k in recipes[i][j][4]) {
				addSourceItemData(completeableItems, recipes[i][j][4][k][0]); 
			}
		}
	}
	
	for (var i in completeableItems) {
		result.push({value: i, label: completeableItems[i]})
	}
	return result;
};

var autoCompleteTerms = makeSourceItemData();

var initAutocomplete = function() {	 
	/*$.ui.autocomplete.prototype._renderMenu = function( ul, items ) {
	   var self = this;
	   $.each( items, function( index, item ) {
		  if (index < 10) // here we define how many results to show
			 {self._renderItem( ul, item );}
		  });
	}*/
	$.ui.autocomplete.prototype._renderItem = makeItemAutoComplete;
	$.ui.autocomplete.prototype._resizeMenu = function() {
		  this.menu.element.outerWidth( 330 );
		};
	$('#autocomplete').autocomplete({
		minLength: 1,
		delay: 0,

		source: function(request, response) {
			var results = $.ui.autocomplete.filter(autoCompleteTerms, request.term);
			response(results.slice(0, 20));
		},		
		select: selectItem,
	
		focus: function( event, ui ) {event.preventDefault();
			$('#autocomplete').val(ui.item.label);
		}
	});
	
	//$.ui.autocomplete.prototype._renderMenu = makeItemAutoComplete;
};


var init = function() {
	initAutocomplete();
	
};


$(document).ready(function(){
	init();
});