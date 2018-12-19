var htmlDecode = function(input){
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

var update = function(recipe) {
	recipeData = recipe.data('recipe');
	productId = recipe.data('product');
	grade = item_data[productId][1];
	refineLevel = recipe.find(".refine select").val();
	chienkunRefineCost = 0;
	if (refineLevel)
		chienkunRefineCost = Math.round((refine_cost[refineLevel] * recipeData[1])/100);
	socketCount = recipe.find(".socket select").val();
	chienkunSocketCost = 0;
	chienkunGemCost = 0;
	if (socketCount) {
		cost_table = recipe.find(".socket select option").length > 3 ? socket_armor_cost : socket_weapon_cost;
		chienkunSocketCost = Math.round((cost_table[grade][socketCount] * recipeData[1])/100);
		gemGrade = recipe.find(".gems select").val();
		chienkunGemCost = Math.round((gem_cost[gemGrade]* socketCount * recipeData[1])/100);
	}
	totalChienkunCost = chienkunRefineCost + chienkunSocketCost + chienkunGemCost;
	result = $('<div class="cost">');
	if (chienkunRefineCost)
		result.append($('<div class="label">').text("Refine: ")).append($('<div class="value">').text(chienkunRefineCost)).append(makeItemWidget(12980)).append($("<br>"));
	if (chienkunSocketCost)
		result.append($('<div class="label">').text("Sockets: ")).append($('<div class="value">').text(chienkunSocketCost)).append(makeItemWidget(12980)).append($("<br>"));
	if (chienkunGemCost)
		result.append($('<div class="label">').text("Gems: ")).append($('<div class="value">').text(chienkunGemCost)).append(makeItemWidget(12980)).append($("<br>"));
	if (totalChienkunCost != chienkunRefineCost && totalChienkunCost != chienkunSocketCost && totalChienkunCost != chienkunGemCost )
		result.append($('<div class="label">').text("Total: ")).append($('<div class="value">').text(totalChienkunCost)).append(makeItemWidget(12980)).append($("<br>"));
	recipe.find('.cost').remove();
	recipe.append(result);
	
};


var makeItemWidget = function(id) {
	if (id == 0) return $("<div class='item'>");
	
	return $("<div class='item'>")
		.append($("<div class='icon'>").css('backgroundImage', 'url(http://asterpw.github.io/pwicons/f/'+id+'.png'))
		.append($("<div class='label'>").text(htmlDecode(item_data[id][0])).addClass("item_color" + item_data[id][2]));
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
		select.append($('<option>').attr('value', i).text(i + " socket" + (i==0 ? "" : "s")));
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
	source = $('<div class="source">');
	if (id == 0) return source.text('No Source');
	source.append(makeItemWidget(id));
	item_type = item_data[id][3];
	if (chienkun_type_config[item_type][0])
		source.append(makeRefineControl(12));
	if (chienkun_type_config[item_type][1])
		source.append(makeSocketControl(chienkun_type_config[item_type][1]));
	if (chienkun_type_config[item_type][2])
		source.append(makeGemsControl(chienkun_type_config[item_type][1]));
	
	return source;
};

var makeRecipes = function(id) {
	$('#recipes').empty();
	$('#recipes').append(makeItemWidget(id));
	$.each(recipes[id], function(index, item) {
		recipe = $("<div class='recipe'>");
		recipe.append(makeSourceControl(item[0]));
		mats = $("<div class='mats'>");
		for (var i in item[4]) {
			mat = $("<div class='mat'>"); 
			mat.append($("<div class='label'>").text(item[4][i][1]))
			mat.append(makeItemWidget(item[4][i][0]));
			mats.append(mat);
		}
		mats.append($("<div class='label'>").text("Coins: " + item[3]));
		recipe.append(mats);
		recipe.data('recipe', item);
		recipe.data('product', id);
		$('#recipes').append(recipe);
	});
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
	$('#autocomplete').autocomplete("close");
};

var makeSourceItemData = function() {
	var result = [];
	for (var i in item_data) {
		if (i in recipes) {
			result.push({label: htmlDecode(item_data[i][0]), value: i})
		}
	}
	return result;
};

var autoCompleteTerms = makeSourceItemData();

var initAutocomplete = function() {	 /*
	$.ui.autocomplete.prototype._renderMenu = function( ul, items ) {
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
			response(results.slice(0, 10));
		},		
		select: selectItem,
	
		focus: function( event, ui ) {}
	});
	
	//$.ui.autocomplete.prototype._renderMenu = makeItemAutoComplete;
};


var init = function() {
	initAutocomplete();
	
};


$(document).ready(function(){
	init();
});