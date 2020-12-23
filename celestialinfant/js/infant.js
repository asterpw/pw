var model = {
	lib : [0,0,0,0,0],
	equip : [0,0,0,0,0,0],
	inventory : [0,0,0,0,0,0,0,0],
	upgradelevel : 6,
	upgradexp : 1

};

function Bonus(type, count, increase) {
	this.type = type;
	this.count = count;
	this.increase = increase;
}

function CardSet(id, mask, 
	bonus1count, bonus1type, bonus1increase, 
	bonus2count, bonus2type, bonus2increase,
	bonus3count, bonus3type, bonus3increase)
{
	this.id = id;
	this.name = names[id];
	this.mask = mask;
	this.bonuses = [];
	if (bonus1count > 0) this.bonuses.push(new Bonus(bonus1type, bonus1count, bonus1increase));
	if (bonus2count > 0) this.bonuses.push(new Bonus(bonus2type, bonus2count, bonus2increase));
	if (bonus3count > 0) this.bonuses.push(new Bonus(bonus3type, bonus3count, bonus3increase));
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
};

Card.prototype.render = function() {
	var result = $('<div class="card"></div>');
	result.append($('<div class="score">'+this.score+'</div>'));
	result.append($('<div class="name">'+this.name+'</div>'));
	result.append($('<div class="stars level'+this.level+'"></div>'));
	result.css('background-image', 'url("images/cards/'+this.id+'.png")');
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

var initCards = function() {
	for (c in carddata) {
		cardPool.push(new Card(carddata[c][0], carddata[c][1], carddata[c][2], carddata[c][3], carddata[c][4], carddata[c][5], carddata[c][6]));
	}
		
};

var initSets = function() {
	for (s in sets) {
		setPool.push(new CardSet(sets[s][0], sets[s][1], sets[s][2], sets[s][3], sets[s][4], sets[s][5], sets[s][6], 
		 sets[s][7], sets[s][8],  sets[s][9], sets[s][10]));
	}
		
};
var initButtons = function() {
	$('#refresh').click(performRefresh);
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

var libClickHandler = function() {
	for (var i in model.inventory)
		if (model.inventory[i] == 0)
		{
			model.inventory[i] = $(this).data('card');
			model.lib[$(this).data('slot')] = 0;
			$(this).data('slot', i);
			break;
		}
	update();
}

var invClickHandler = function() {
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
			combineInv();
		}
	}
}

var updateCards = function() {
	var slots = [['libslot', model.lib, libClickHandler],['equipslot', model.equip, equipClickHandler],['invslot', model.inventory, invClickHandler]]
	for (var s in slots)
		for (var i in slots[s][1])
			if (slots[s][1][i] != 0)
			{
				var id = slots[s][0]+i;
				var cardDiv = slots[s][1][i].render();
				cardDiv.data('card', slots[s][1][i]);
				cardDiv.data('slot', i);
				cardDiv.click(slots[s][2]);
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
	for (var c in model.equip) {
		if (model.equip[c] != 0)
		{
			cardscore = Math.floor(model.equip[c].score * (100 + model.equip[c].calcBonus()) / 100)
			console.log(model.equip[c].name + " - " + model.equip[c].score + " +" + (cardscore - model.equip[c].score));
			
			score += cardscore;
		}
			
	}
	$("#lbltodayscore").html("+"+score);
};

var update = function() {
	$('#infantwindow .card').remove();
	combineInv();
	updateSets();
	updateCards();
	calcScore();
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
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

var init = function() {
	initCards();
	initSets();
	initButtons();
	initTooltips();
	initMessages();
	
};


$(document).ready(function(){
	init();
	performRefresh();
});