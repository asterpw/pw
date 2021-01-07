var model = {
	lib : [0,0,0,0,0],
	equip : [0,0,0,0,0,0],
	inventory : [0,0,0,0,0,0,0,0],
	upgradelevel : 0,
	upgradetotalxp : 0,
	upgradexp : 0,
	potential: 20,
	freeRefresh: true,
	todayScore: 0,
	growthtime: 0,
	growthscore: 0,
	active: true,
	baby: 0
};

var initModel = function() {
	var lib = [model.lib, model.equip, model.inventory];
	for (var i in lib)
		for (var j in lib[i])
			lib[i][j] = 0;
	model.upgradelevel = 0;
	model.upgradetotalxp = 0;
	model.upgradexp = 0;
	model.potential = 20;
	model.freeRefresh = true;
	model.todayScore = 0;
	model.growthtime = 0;
	model.growthscore = 0;
	model.active = true;
	model.baby = getRandomInt(0, 6);
}

function Bonus(type, count, increase, chance) {
	this.type = type;
	this.count = count;
	this.increase = increase;
	this.chance = chance;
}

function CardSet(id, mask, 
	bonus1count, bonus1type, bonus1increase, bonus1chance,
	bonus2count, bonus2type, bonus2increase, bonus2chance,
	bonus3count, bonus3type, bonus3increase, bonus3chance)
{
	this.id = id;
	this.name = names[id];
	this.mask = mask;
	this.bonuses = [];
	if (bonus1count > 0) this.bonuses.push(new Bonus(bonus1type, bonus1count, bonus1increase, bonus1chance));
	if (bonus2count > 0) this.bonuses.push(new Bonus(bonus2type, bonus2count, bonus2increase, bonus2chance));
	if (bonus3count > 0) this.bonuses.push(new Bonus(bonus3type, bonus3count, bonus3increase, bonus3chance));
};


CardSet.prototype.Count = function() {
	var count = 0;
	var ids = [];
	for (var i in model.equip) {
		if (model.equip[i] != 0 && (model.equip[i].mask & this.mask) && ids.indexOf(model.equip[i].id) == -1) {
			count++;
			ids.push(model.equip[i].id);
		}
	}
	return count;
};
CardSet.prototype.CountLabelValues = function() {
	var count = this.Count();
	var bonus = this.ActiveBonus();
	if (bonus == 0)
		return [false, count, this.bonuses[0].count, this.id];
	return [true, count, bonus.count, this.id];
};

CardSet.prototype.ActiveBonus = function() {
	var count = this.Count();
	for (var i in this.bonuses) {
		if (this.bonuses[this.bonuses.length - 1 - i].count <= count)
			return this.bonuses[this.bonuses.length - 1 - i];
	}
	return 0;
};

var maxEquippedScoreCard = function() {
	var max = 0;
	var maxCard = 0;
	for (var c in model.equip) {
		if (model.equip[c] != 0 && model.equip[c].score > max) {
			max = model.equip[c].score;
			maxCard = model.equip[c];
		}
	}
	return maxCard;
};

var maxEquippedGrade = function() {
	var max = 0;
	for (var c in model.equip) {
		if (model.equip[c] != 0 && model.equip[c].level > max) {
			max = model.equip[c].level;
			maxCard = model.equip[c];
		}
	}
	return max;
}

CardSet.prototype.Contains = function(card) {
	return (this.mask & card.mask) > 0;
};

CardSet.prototype.BonusForCard = function(card) {
	var bonus = this.ActiveBonus();
	if (bonus == 0) 
		return 0;
	
	if ((bonus.type == 0 && (card.mask & this.mask))
		|| bonus.type == 1
		|| (bonus.type == 2  && card == maxEquippedScoreCard())
		|| (bonus.type == 3  && (card.mask & this.mask) && card.level == maxEquippedGrade())
		)
		
		return bonus.increase;
	
	return 0;
};



function Card(id, grade, mask, score1, score2, score3, cost) {
	this.id = id;
	this.name = names[id];
	this.grade = grade;
	this.mask = mask;
	this.level = 1;
	this.score = score1;
	this.scores = [score1, score2, score3];
	this.cost = cost;
	this.refundAmount = cost;
};

Card.prototype.render = function() {
	var result = $('<div class="card"></div>');
	result.append($('<div class="score">'+this.score+'</div>'));
	result.append($('<div class="name">'+this.name+'</div>'));
	result.append($('<div class="cost">'+this.cost+' G</div>'));
	result.append($('<div class="stars level'+this.level+'"></div>'));
	result.css('background-image', 'url("images/cards/'+this.id+'.png")');
	if (model.potential < this.cost)
		result.find('.cost').addClass('notenough');
	return result;
};

Card.prototype.clone = function() {
	var card = new Card(this.id, this.grade, this.mask, this.scores[0], this.scores[1], this.scores[2], this.cost)
	card.level = this.level;
	return card;
};

Card.prototype.calcBonus = function() {
	var bonus = 0;
	for (s in setPool) {
		bonus += setPool[s].BonusForCard(this);
	}
	return bonus;
};

var cardPool = [];
var setPool = [];

var upgradeZenithLevel = function() {
	if (!model.active)
		return;
	if (model.potential < 4 || model.upgradelevel == 9)
		return;
	model.upgradetotalxp += 4;
	model.potential -= 4;
	update();
};

var submitTutorship = function() {
	if (model.growthtime == 15)
		return;
	model.growthscore += model.todayScore;
	model.growthtime++;
	model.upgradetotalxp++;

	if (model.growthtime == 15)
	{
		model.active = false;
	} else {
		model.potential = 20;
		model.freeRefresh = true;
	}
	update();
};

var initCards = function() {
	for (c in carddata) {
		cardPool.push(new Card(carddata[c][0], carddata[c][1], carddata[c][2], carddata[c][3], carddata[c][4], carddata[c][5], carddata[c][6]));
	}
		
};

var initSets = function() {
	for (s in sets) {
		setPool.push(new CardSet(sets[s][0], sets[s][1], sets[s][2], sets[s][3], sets[s][4], sets[s][5], sets[s][6], 
		 sets[s][7], sets[s][8],  sets[s][9], sets[s][10], sets[s][11],  sets[s][12], sets[s][13]));
	}
		
};
var initButtons = function() {
	$('#refresh').click(handleRefresh);
	$('#btnpoollevel').click(upgradeZenithLevel);
	$('#submit').click(submitTutorship);
	$('#reset').click(reset);
	
	$('#viewpool').html('<span class="label">View&nbsp;Pool</span>');
	//$('#viewpool').click(function(){if (!model.active) return; model.potential = 9999; update();});
	$('#viewpool').click(function(){
		$("#poolwindow").show();
	});
	
	$('#photo').click(function(){model.baby = (model.baby + 1) % 6; update();});
};

var purchaseCard = function(libIdx, dest, destIdx) {
	if (model.potential <  model.lib[libIdx].cost || dest[destIdx] != 0 || !model.active)
		return;
	model.potential -= model.lib[libIdx].cost;
	swapcards(model.lib, libIdx, dest, destIdx);
};

var swapcards = function(typeA, idxA, typeB, idxB) {
	if (!model.active) return;
	var temp = typeA[idxA];
	typeA[idxA] = typeB[idxB];
	typeB[idxB] = temp;
	update();
};

var refundcard = function(slottype, idx) {
	if (!model.active) return;
	model.potential += slottype[idx].refundAmount;
	slottype[idx] = 0;
	update();
};


var poolClickHandler = function() {
	if (!model.active) return;
	for (var i in model.inventory)
		if (model.inventory[i] == 0)
		{
			model.inventory[i] = $(this).data('card').clone();
			break;
		}
	update();
}


var libClickHandler = function() {
	if (!model.active) return;
	for (var i in model.inventory)
		if (model.inventory[i] == 0)
		{
			purchaseCard($(this).data('slot'), model.inventory, i);
			break;
		}
	update();
}

var invClickHandler = function() {
	if (!model.active) return;
	for (var i in model.equip)
		if (model.equip[i] == 0)
		{
			model.equip[i] = $(this).data('card');
			model.inventory[$(this).data('slot')] = 0;
			$(this).data('slot', i);
			break;
		}
	update();
}

var equipClickHandler = function() {
	if (!model.active) return;
	for (var i in model.inventory)
		if (model.inventory[i] == 0)
		{
			model.inventory[i] = $(this).data('card');
			model.equip[$(this).data('slot')] = 0;
			$(this).data('slot', i);
			break;
		}
	update();
}

var slotinfo = [['libslot', model.lib, libClickHandler],['equipslot', model.equip, equipClickHandler],['invslot', model.inventory, invClickHandler]];


var initSlots = function() {
	for (var slot in slotinfo)
		for (var i in slotinfo[slot][1])
			$("#"+slotinfo[slot][0]+i).data('index', i)
	
	
	$('.equipslot').droppable({
		drop: function( event, ui ){
			switch (ui.draggable.data('slottype')) {
				case 'equipslot':
					swapcards(model.equip, $(this).data('index'), model.equip, ui.draggable.data('slot'));
					break;
				case 'invslot':
					swapcards(model.equip, $(this).data('index'), model.inventory, ui.draggable.data('slot'));
					break;
				case 'libslot':
					purchaseCard(ui.draggable.data('slot'), model.equip, $(this).data('index'));
					break;
			}
		}
	});
	$('.invslot').droppable({
		drop: function( event, ui ){
			switch (ui.draggable.data('slottype')) {
				case 'equipslot':
					swapcards(model.inventory, $(this).data('index'), model.equip, ui.draggable.data('slot'));
					break;
				case 'invslot':
					swapcards(model.inventory, $(this).data('index'), model.inventory, ui.draggable.data('slot'));
					break;
				case 'libslot':
					purchaseCard(ui.draggable.data('slot'), model.inventory, $(this).data('index'));
					break;
			}
		}
	});	
	
	$('#refund').droppable({
		drop: function( event, ui ){
			switch (ui.draggable.data('slottype')) {
				case 'equipslot':
					refundcard(model.equip, ui.draggable.data('slot'));
					break;
				case 'invslot':
					refundcard(model.inventory, ui.draggable.data('slot'));
					break;
			}
		}
	});	
};


var formatRawText = function(text, ...args) {
	text = "<span>"+text+"</span>";

	for (var i in args)
	{
		text = text.replace(/%[ds]/, args[i])
	}	
	text = text.replace(/\^(......)/g, "</span><span style='color: #$1'>")
		.replace(/<span><\/span>/g, "")
		.replace(/\r/g, "<br>")
		.replace(/%%/g, "%");
	return text;
};

var makeZenithPoolTooltipContent = function() {
	var text = formatRawText(uiText[18428], 4, 4);
	for (var i = 0; i < 10; i++)
	{
		var isActive = i == model.upgradelevel;
		var chances = "";
		for (var j = 1; j <= 5; j++)
			if (i == model.upgradelevel)
				chances += uiText[18400+j]+upgradeTable[i][j] + "%" + ((j < 5) ? "^ffffff/" : "");
			else 
				chances += upgradeTable[i][j] + "%" + ((j < 5) ? "/" : "");
			
		text += formatRawText((isActive ? "^ffffff" : "^b0b0b0") + uiText[18434], "<br>&nbsp;", i+1, chances);
	}
	return text;
};

var initTooltips = function() {

};

var initMessages = function() {
	$('.message').each(function(){
		var id = $(this).attr('id');
		if (id in names)
			$(this).html(names[id]);
	});
};


var combineInv = function() {
	for (var i = 0; i < model.inventory.length - 2; i++)
	{
		if (model.inventory[i] == 0 || model.inventory[i].level >= 3)
			continue;
		var count = 1;
		for (var j = i + 1; j < model.inventory.length; j++)
			if (model.inventory[i].id == model.inventory[j].id 
				&& model.inventory[i].level == model.inventory[j].level)
				count++;
		if (count == 3)
		{
			for (var j = i + 1; j < model.inventory.length; j++)
				if (model.inventory[i].id == model.inventory[j].id 
					&& model.inventory[i].level == model.inventory[j].level)
					model.inventory[j] = 0;
			model.inventory[i].level++;
			model.inventory[i].score = model.inventory[i].scores[model.inventory[i].level - 1];
			model.inventory[i].refundAmount = model.inventory[i].cost + model.inventory[i].level - 1;
			combineInv();
		}
	}
}

var makeCardTooltipContent = function(card) {
	var bonus = Math.floor((card.calcBonus() * card.score) / 100);
	
	var scoreText = card.score + (bonus > 0 ? " +"+bonus : "") + " (";
	
	for (var i in card.scores) 
	{
		scoreText += (card.score == card.scores[i] ? "^00ff00" : "^ffffff");
		scoreText += card.scores[i] + "^ffffff";
		scoreText += ((i < 2) ? "/" : ")");
	}
	var text = uiText[18401+card.grade] + card.name + "^ffffff\r"
		+ formatRawText(uiText[18423], scoreText) + "\r"
		+ uiText[card.id];

	for (var s in setPool) {
		if (setPool[s].Contains(card)) {
			text += "^ffffff"+setPool[s].name + uiText[setPool[s].id]+ "\r";
			
			for (var b in setPool[s].bonuses) {
				var bonus = setPool[s].bonuses[b];
				text += bonus == setPool[s].ActiveBonus() ? "^00ff00" : "^b0b0b0";
				text += formatRawText(uiText[18410], bonus.count, setPool[s].name);
				text += (bonus.chance != 100) ? formatRawText(uiText[18435], bonus.chance) : "";
				text += uiText[18411 + bonus.type];
				text += formatRawText(uiText[18420], bonus.increase)+ "\r";
			}
			
		}
	}
		
	return formatRawText(text);
};

var makeCardTooltip = function(cardDiv, tooltipContainer) {
	cardDiv.qtip({
		content: {
			text: makeCardTooltipContent(cardDiv.data('card')),
		},
		show : {
			delay: 300
		},
		position	 : {
			target: 'event',
			type  : 'absolute',
			my: 'top left',
			at: 'bottom center',
			container : tooltipContainer,
			viewport: $(window),
			adjust: {
				method: 'flip',
				mouse: false
			}
		},
		style: {
			classes: "pwi-qtip qtip-rounded",
			tip: false
		}
		
	});
};

var updateCards = function() {
	
	for (var s in slotinfo)
		for (var i in slotinfo[s][1])
			if (slotinfo[s][1][i] != 0)
			{
				var id = slotinfo[s][0]+i;
				var cardDiv = slotinfo[s][1][i].render();
				cardDiv.data('card', slotinfo[s][1][i]);
				cardDiv.data('slot', i);
				cardDiv.data('slottype', slotinfo[s][0]);
				cardDiv.click(slotinfo[s][2]);
				cardDiv.draggable({
					revert: true,
					revertDuration: 0,
					start: function(event,ui) {
						$('body').addClass('indrag');
						$('#lblrefundamount').html(names['lblrefundamount'] + $(this).data('card').refundAmount + ' G');
					},
					stop: function(event,ui) {
						$('body').removeClass('indrag');
					},
				});
				makeCardTooltip(cardDiv, $("#infantwindow"));
				$('#'+id).append(cardDiv);
			}
};

var updateSets = function() {
	labelValues = []
	$("#lblsets .set").remove();
	for (var s in setPool) {
		label = setPool[s].CountLabelValues();
		if (label[1] > 0) 
			labelValues.push(label);
	}
	//[true, count, bonus.count, this.id]
	labelValues = labelValues.sort(function(a,b){return (b[0]* 100 + b[1]) - (a[0]* 100 + a[1]);});
	for (var l in labelValues) {
		var labelValue = $('<div class="set"></div>');
		labelValue.html(names[labelValues[l][3]] + " (" + labelValues[l][1] + "/" + labelValues[l][2] + ")");
		if (labelValues[l][0])
			labelValue.addClass("active");
		$("#lblsets").append(labelValue);
	}
	
};

var calcScore = function() {
	var score = 0;
	var cultivationBonus = 0;
	var bondBonus = 0;
	for (var c in model.equip) {
		if (model.equip[c] != 0)
		{
			cardscore = Math.floor(model.equip[c].score * (100 + model.equip[c].calcBonus()) / 100)
			console.log(model.equip[c].name + " - " + model.equip[c].score + " +" + (cardscore - model.equip[c].score));
			
			score += cardscore;
			cultivationBonus += model.equip[c].score;
			bondBonus += (cardscore - model.equip[c].score);
		}
			
	}
	model.todayScore = score;
	$("#lbltodayscore").html("+"+score);
	
	$("#lbltodayscore").qtip({
		content: {
			text: formatRawText(uiText[18398], cultivationBonus, bondBonus),
		},
		show : {
			delay: 700
		},
		position	 : {
			target: 'mouse',
			type  : 'absolute',
			my: 'top left',
			at: 'bottom right',
			//container : $(document),
			//viewport: $(window),
			adjust: {
				method: 'flip',
				mouse: false
			}
		},
		style: {
			classes: "pwi-qtip qtip-rounded",
			tip: false
		}
	});
	$("#mark1").qtip({
		content: {
			text: formatRawText(uiText[18460], 50000, 100000, 150000),
		},
		show : {
			delay: 700
		},
		position	 : {
			target: 'mouse',
			type  : 'absolute',
			my: 'top left',
			at: 'bottom right',
			//container : $(document),
			//viewport: $(window),
			adjust: {
				method: 'flip',
				mouse: false
			}
		},
		style: {
			classes: "pwi-qtip qtip-rounded",
			tip: false
		}
	});
	$("#mark2").qtip({
		content: {
			text: formatRawText(uiText[18483], 20, 20),
		},
		show : {
			delay: 700
		},
		position	 : {
			target: 'mouse',
			type  : 'absolute',
			my: 'top left',
			at: 'bottom right',
			//container : $(document),
			//viewport: $(window),
			adjust: {
				method: 'flip',
				mouse: false
			}
		},
		style: {
			classes: "pwi-qtip qtip-rounded",
			tip: false
		}
	});
};

var updateZenithPool = function() {
	for (var i = 0; i < upgradeTable.length; i++)
	{
		if (model.upgradetotalxp >= upgradeTable[i][0])
		{
			model.upgradelevel = i+0;
			model.upgradexp = model.upgradetotalxp - upgradeTable[i][0];
		}
	}
	$("#poollevel").removeClass().addClass("level"+(model.upgradelevel+1));
	
	$("#lblpoolxp").html(model.upgradelevel < 9 ? names['lblpoolxp'] + model.upgradexp + "/" + (upgradeTable[model.upgradelevel+1][0] - upgradeTable[model.upgradelevel][0]) : '');
	$("#btnpoollevel, #poollevel").qtip({
		content: {
			text: makeZenithPoolTooltipContent(),
		},
		show : {
			delay: 700
		},
		position	 : {
			target: 'mouse',
			type  : 'absolute',
			my: 'bottom left',
			at: 'top right',
			//container : $(document),
			viewport: $(window),
			adjust: {
				method: 'flip',
				mouse: false
			}
		},
		style: {
			classes: "pwi-qtip qtip-rounded",
			tip: false
		}
		
	});
};

var updateButtons = function() {
	$('.disabled').removeClass('disabled');
	$('#lblrefresh2').html(model.freeRefresh ? '(Free)' : '(2G)');
	if (model.potential < 2 && model.freeRefresh == false)
		$('#refresh').addClass('disabled');
	if (model.potential < 4 || model.upgradelevel == 9)
		$('#btnpoollevel').addClass('disabled');
	if (!model.active)
	{
		$('#refresh').addClass('disabled');
		$('#btnpoollevel').addClass('disabled');
		$('#submit').addClass('disabled');
	}
	if (model.active)
		$('#reset').addClass('disabled');
	
	
};

var update = function() {
	//$('.card, #btnpoollevel').qtip('hide');
	$('#infantwindow .qtip').each(function(){
		$(this).data('qtip').destroy();
		$(this).remove();
	});
	$('#infantwindow .card').remove();
	combineInv();
	updateSets();
	updateCards();
	updateButtons();
	calcScore();
	updateZenithPool();
	
	$("#lbldaynum").html(names['lbldaynum']+ Math.min(model.growthtime+1,15) + "/15 Days");
	$("#lbldaynum").html(names['lbldaynum']+ Math.min(model.growthtime+1,15) + "/15 Days");
	$("#lblgrowthscore").html(names['lblgrowthscore']+"<br>"+ model.growthscore);
	$("#lblpotential").html(names['lblpotential']+ model.potential +"G");
	$("#photo").removeClass().addClass(model.baby < 3 ? "female" + model.baby : "male" + (model.baby % 3)).addClass("age" + Math.min(Math.floor((model.growthtime+1) / 5), 2));
	$("#refund").removeClass().addClass(model.baby < 3 ? "female" : "male");
	
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

var handleRefresh = function() {
	if (!model.active)
		return;
	if (model.freeRefresh) 
		model.freeRefresh = false;
	else if (model.potential >= 2)
		model.potential -= 2;
	else
		return;
	performRefresh();
}

var performRefresh = function() {

	for (var i in model.lib)
		refreshLib(i);
	update();

	
}

var refreshLib = function(slot) {
	var roll = getRandomInt(0, 100);
	var cardGrade = 0;
	var percentages = upgradeTable[model.upgradelevel];
	for (var lev = 0; lev <= 5; lev++)
	{
		if (percentages[1 + lev] > roll)
		{
			var cardGrade = lev;
			break;
		}
		roll -= percentages[1 + lev];
	}
	var count = 0;
	var card;
	for (var i in cardPool) {
		if (cardPool[i].grade == cardGrade) {
			count++;
			if (getRandomInt(0, count) == 0) {
				card = cardPool[i].clone();
			}
		}
	}
	model.lib[slot] = card;
};


var initPoolWindow = function() {
	for (var i = 0; i < cardPool.length; i++) {
		var card = cardPool[i].clone();
		var cardDiv = card.render();
		cardDiv.data('card', card);
		$("#pool"+(i+1)).append(cardDiv);
		makeCardTooltip(cardDiv, $("#poolwindow"));
		cardDiv.click(poolClickHandler);
	}
	$("#poolwindow #close").click(function(){
		$("#poolwindow").hide();
	});
};

var init = function() {
	initSlots();
	initCards();
	initSets();
	initButtons();
	initTooltips();
	initMessages();
	initPoolWindow();
};

var reset = function() {
	initModel();
	performRefresh();
}

$(document).ready(function(){
	init();
	reset();
});