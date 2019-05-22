var model = {
	stars : [],
	astral : 3,
	level : 20,
	currentClass: 2,
	nebulaDustCount: 0,
	seekerPowderCount: 0,
	totalAptitude: 0
};

var stats = [
	"Physical Attack",
	"Magical Attack",
	"Physical Penetration",
	"Magic Penetration",
	"Phys. Res.",
	"Mag. Res.", 
	"HP",
	"MP",
	"Spirit",
	"Metal Resistance",
	"Wood Resistance",
	"Water Resistance",
	"Fire Resistance",
	"Earth Resistance",
	"Accuracy",
	"Evasion"
];

var classes = [
	["Blademaster", [1.53, 1.53, 2.38, 2.38, 7.68, 5.83, 3.67, 1.53, 0.48, 5.83, 5.83, 5.83, 5.83, 5.83, 2.29, 1.91], [47375, "Keen Vow"]],
	["Wizard", [1.53, 1.53, 2.38, 2.38, 3.90, 7.96, 3.00, 3.05, 0.48, 7.96, 7.96, 7.96, 7.96, 7.96, 2.29, 1.91], [47461, "Oathscript"]],
	["Archer", [1.53, 1.53, 2.38, 2.38, 5.34, 6.83, 3.34, 1.53, 0.48, 6.83, 6.83, 6.83, 6.83, 6.83, 2.29, 1.91], [47464, "Skysharp"]],
	["Cleric", [1.53, 1.53, 2.38, 2.38, 3.90, 7.96, 3.00, 3.05, 0.48, 7.96, 7.96, 7.96, 7.96, 7.96, 2.29, 1.91], [47465, "Skygrace"]],
	["Barbarian", [1.53, 1.53, 2.38, 2.38, 7.68, 5.83, 3.67, 1.53, 0.48, 5.83, 5.83, 5.83, 5.83, 5.83, 2.29, 1.91], [47462, "Metamight"]],
	["Venomancer", [1.53, 1.53, 2.38, 2.38, 3.90, 7.96, 3.00, 3.05, 0.48, 7.96, 7.96, 7.96, 7.96, 7.96, 2.29, 1.91], [47463, "Metaheart"]],
	["Assassin", [1.15, 1.53, 2.38, 2.38, 5.34, 6.83, 3.34, 1.53, 0.48, 6.83, 6.83, 6.83, 6.83, 6.83, 2.29, 1.91], [47466, "Waveblaze"]],
	["Psychic", [1.53, 1.53, 2.38, 2.38, 3.90, 7.96, 3.00, 3.05, 0.48, 7.96, 7.96, 7.96, 7.96, 7.96, 2.29, 1.91], [47467, "Wavedeep"]],
	["Seeker", [1.53, 1.53, 2.38, 2.38, 7.68, 5.83, 3.67, 1.53, 0.48, 5.83, 5.83, 5.83, 5.83, 5.83, 2.29, 1.91], [47468, "Sagewrath"]],
	["Mystic", [1.53, 1.53, 2.38, 2.38, 3.90, 7.96, 3.00, 3.05, 0.48, 7.96, 7.96, 7.96, 7.96, 7.96, 2.29, 1.91], [47469, "Sagesorrow"]],
	["Duskblade", [1.53, 1.53, 2.38, 2.38, 5.34, 6.83, 3.34, 1.53, 0.48, 6.83, 6.83, 6.83, 6.83, 6.83, 2.29, 1.91], [47470, "Celebreak"]],
	["Stormbringer", [1.53, 1.53, 2.38, 2.38, 3.90, 7.96, 3.00, 3.05, 0.48, 7.96, 7.96, 7.96, 7.96, 7.96, 2.29, 1.91], [47471, "Celesong"]],
	["Technician", [1.53, 1.53, 2.38, 2.38, 5.34, 6.83, 3.34, 1.53, 0.48, 6.83, 6.83, 6.83, 6.83, 6.83, 2.29, 1.91], [60687, "Omensign"]],
	["Edgerunner", [1.53, 1.53, 2.38, 2.38, 7.68, 5.83, 3.67, 1.53, 0.48, 5.83, 5.83, 5.83, 5.83, 5.83, 2.29, 1.91], [60686, "Skymight"]]
	];

var statChances = [
	1,
	0.46059,
	0.41444,
	0.29356,
	0.19783,
	0.18904,
	0.14201,
	0.13687,
	0.0991,
	0.09091
];

var astralLevels = [
	[50, 0],
	[250, 50],
	[800, 300],
	[2000, 1100],
	[5001, 3100],
	[10341, 8101],
	[38326, 18442],
	[103670, 56768],
	[247040, 160438],
	[0, 407478]
];

var xpLevels = [
	[6, 0],
	[6, 6],
	[7, 12],
	[7, 19],
	[8, 26],
	[9, 34],
	[10, 43],
	[11, 53],
	[12, 64],
	[14, 76],
	[15, 90],
	[17, 105],
	[18, 122],
	[20, 140],
	[22, 160],
	[25, 182],
	[27, 207],
	[30, 234],
	[33, 264],
	[36, 297],
	[40, 333],
	[44, 373],
	[48, 417],
	[53, 465],
	[59, 518],
	[65, 577],
	[71, 642],
	[78, 713],
	[86, 791],
	[95, 877],
	[104, 972],
	[115, 1076],
	[126, 1191],
	[139, 1317],
	[153, 1456],
	[168, 1609],
	[185, 1777],
	[204, 1962],
	[224, 2166],
	[246, 2390],
	[271, 2636],
	[298, 2907],
	[328, 3205],
	[361, 3533],
	[397, 3894],
	[437, 4291],
	[481, 4728],
	[529, 5209],
	[582, 5738],
	[0, 6320]
];

var visibilityGroups = [];



function Star(id) {
	this.id = id;
	this.active = true;
	this.aptitude = 1.0;
	this.statId = 0;
}

Star.prototype.getEffectiveAptitude = function() {
	return model.totalAptitude > 19.999 ? this.aptitude : Math.floor(this.aptitude);
};

Star.prototype.getStatValue = function() {
	return Math.floor(classes[model.currentClass][1][this.statId] * (25 + this.getEffectiveAptitude() * model.level));
};

Star.prototype.getStatName = function() {
	return stats[this.statId];
};

Star.prototype.setAptitude = function(value) {
	value = parseFloat(value);
	if (value != NaN && value >= 1.0 && value <= 5.0) {
		this.aptitude = value;
		update();
	} else {
		$('.starControl'+this.id+' .aptitudeValue').val(this.aptitude.toFixed(2));
	};
};

Star.prototype.setStat = function(value) {
	value = parseInt(value);
	if (value == -1) {
		this.active = false;
	} else {
		this.statId = parseInt(value);
		this.active = true;
	}
	update();
};

var makeStatLabel = function(star) {
	var type = star.id < 5 ? "Birthstar" : "Fatestar";
	var str = '<span class="starstat statstar'+star.id+'"><span class="label"><span class="stattype '+type.toLowerCase()+'">'+type+'</span><span class="valuename">&#183; '
		+star.getStatName()+'</span></span><span class="statvalue">+'+star.getStatValue()+'</span></span>';
	return $(str);
}

var handleAptitudes = function() {
	var totalAptitude = 0.0;
	for (var i = 0; i < 5; i++) {
		if (model.stars[i].aptitude > 5.0) model.stars[i].aptitude = 5.0;
		if (model.stars[i].aptitude < 1.0) model.stars[i].aptitude = 1.0;
		if (i==3 && model.stars[i].aptitude + totalAptitude > 19.0) model.stars[i].aptitude = 19.0 - totalAptitude;
		if (i==4 && model.stars[i].aptitude + totalAptitude > 20.0) model.stars[i].aptitude = 20.0 - totalAptitude;
		totalAptitude += model.stars[i].aptitude;
		$(".starControl"+i+" .aptitudeValue").val(model.stars[i].aptitude.toFixed(2));
	}
	$(".totalAptitude").text(totalAptitude.toFixed(2));
	model.totalAptitude = totalAptitude;
	//set fate star aptitude
	for (var i = 5; i < 10; i++) {
		model.stars[i].aptitude = model.stars[i-5].aptitude + model.stars[(i-4)%5].aptitude;
	}
	
	for (var i = 0; i < 10; i++) {
		$("#star"+i).text(Math.floor(model.stars[i].aptitude));
		$(".starTooltip"+i+" .currAptitude").html(model.stars[i].aptitude.toFixed(2));
		$(".starTooltip"+i+" .effectiveAptitude").html(model.stars[i].getEffectiveAptitude().toFixed(2).replace(".00", ""));
	}
};

var updateStats = function() {
	$(".statContainer").empty()
	for (var i = 0; i< 10; i++) {
		var j = i > 4 ? i : (i+1) % 5; // reorder to match game
		if (model.stars[j].active) {
			$(".statContainer").append(makeStatLabel(model.stars[j]));
		}
		$("#star"+j).toggleClass("active", model.stars[j].active);
		$(".starControl"+j+" .stats").val(model.stars[j].active ? model.stars[j].statId : -1);
	}
};

var updateEffectGroups = function() {
	for (var i = 0; i < visibilityGroups.length; i++) {
		$(visibilityGroups[i][0]).show();
		for (var j = 1; j< visibilityGroups[i].length; j++) {
			if (!model.stars[visibilityGroups[i][j]].active) {
				$(visibilityGroups[i][0]).hide();
				break;
			}
		}
	}
};

var getTotalAptitude = function() {
	var totalAptitude = 0;
	for (var i = 0; i < 5; i++) totalAptitude += model.stars[i].aptitude;
	return totalAptitude.toFixed(2);
};

var chartNameColor = function() {
	var count = 0;
	for (var i = 0; i < 10; i++) {
		count += model.stars[i].active ? 1 : 0;
	}
	var color = '';
	if (count < 3) color = 'item_color1';
	else if (count < 5) color = 'item_color7';
	else if (count < 7) color = 'item_color2';
	else if (count < 9) color = 'item_color3';
	else if (count < 10) color = 'item_color4';
	else color = 'item_color5';
	return color;
};

var updateLabels = function() {
	$(".levelValue").html(model.level);
	$(".astralValue").html(model.astral);
	$(".chartEXP").html('0/'+xpLevels[model.level-1][0]);
	$(".chartEXPTotal").html(xpLevels[model.level-1][1]+1);
	$(".tooltipStats").html(getTooltipStats());
	$(".chartName").html('Star Chart: '+classes[model.currentClass][2][1]);
	$('#chartName').attr('class', chartNameColor());
	$(".className").html(classes[model.currentClass][0]);
	$('.totalAptitude').html(getTotalAptitude());
	$('.astralEXP').html('0/'+astralLevels[model.astral-1][0]);
	$('.astralEXPTotal').html(astralLevels[model.astral-1][1]);
};

var updateBars = function() {
	var ratio = model.level / 50.0;
	$("#level").height(Math.round(ratio*$("#levelControl").height()));
	ratio = model.astral / 10.0;
	$("#astralEnergy").height(Math.round(ratio*$("#astralEnergyControl").height()));
};

var update = function() {
	handleAptitudes();
	updateEffectGroups();
	updateBars()
	updateLabels();
	updateStats();
	encode();
};

var makeStarControlWidget = function(star) {
	var container = $(".starControlTooltipBase").clone().attr('class', "starControl"+star.id);

	
	$(".aptitudeValue", container)/*.spinner({
      step: 0.01,
      numberFormat: "n"
    })*/.change(function(){
		star.setAptitude($(this).val())
	});
	if (star.id > 4) {
		$(".aptitudeControl", container).remove();
	}
	
	for (var i = -1; i < stats.length; i++) {
		var label = i < 0 ? 'None' : stats[i];
		var option = $('<option '+((i == star.statId && star.active) ? "selected" : "")+' value="'+i+'">'+label+'</option>');
		$(".stats", container).append(option);
	}
	$(".stats", container).change(function(){
		star.setStat($(this).val());
	});
	return container;
};

var makeStarTooltip = function(star) {
	var label = star.id < 5 ? "birthstarTooltipBase" : "fatestarTooltipBase";
	return $("."+label).clone().attr('class', "starTooltip"+star.id);
}

var initStars = function() {
	model.stars = [];
	for (var i = 0; i < 10; i++) {
		model.stars[i] = new Star(i);
	}
};

var initStarTooltips = function() {
	for (var i = 0; i < 10; i++) {
		$("#hiddenStuff").append(makeStarControlWidget(model.stars[i]));
		$("#hiddenStuff").append(makeStarTooltip(model.stars[i]));
	}

	for (var i = 0; i < 10; i++) { 
		$("#star"+i).qtip({
				id: ("starDialog"+i),
				content: {
					text: $(".starControl"+i),
					title: {
						text: i < 5 ? "Birthstar" : "Fatestar",
						button: 'Close'
					}
				},
				position: {
					my: 'top center',
					at: 'bottom center',
					container : $("#starChart"),
					viewport: $(window),
					adjust: {
						method: 'shift none'
					}
				},
				show: {
					event: 'click',
					solo: true,
					modal: {
						on: false,
						blur: true,
						escape: true // On by default
					}
				},
				prerender: false,
				hide: false,
				style: {
					classes: "pwi-qtip qtip-rounded modal starDialog"+i,
					tip: true
				}
		}).removeData('qtip').qtip({  // unnattach so it wont be overwritten by the other tooltip
			content: $(".starTooltip"+i),
			show : {
				delay: 500
			},
			position	 : {
				container : $('#starChart'),
				viewport: $(window),
				adjust: {
					method: 'shift none'
				}
			},
			style: {
				classes: "pwi-qtip qtip-rounded",
				tip: false
			}
		});
		$("#star"+i).mouseenter(function(){
			$(".stat"+$(this).attr('id')).addClass('selected');
		}).mouseleave(function(){
			$(".starstat.selected").removeClass("selected");
		});
	}
};

var getTooltipStats = function() {
	var text = ''
	for (var i = 0; i< 10; i++) {
		var j = i > 4 ? i : (i+1) % 5; // reorder to match game
		if (model.stars[j].active)
			text += model.stars[j].getStatName() + " +" +model.stars[j].getStatValue() + "<br>";
	}
	return text;
}

var initTooltips = function() {
	initStarTooltips();
	$("#chartIcon").qtip({
		//content: getChartIconTooltipContent(),
		content: $("#chartIconTooltip"),
		show : {
			delay: 300
		},
		position	 : {
			type  : 'absolute',
			my: 'bottom left',
			at: 'top right',
			//container : $(document),
			viewport: $(window),
			adjust: {
				method: 'shift shift'
			}
		},
		prerender: true,
		style: {
			classes: "pwi-qtip items-qtip qtip-rounded",
			tip: false
		}
	});
	$(".dustIcon").qtip({
		//content: getChartIconTooltipContent(),
		content: $("#nebulaDustTooltip"),
		show : {
			delay: 300
		},
		position	 : {
			type  : 'absolute',
			my: 'bottom left',
			at: 'top right',
			//container : $(document),
			viewport: $(window),
			adjust: {
				method: 'shift shift'
			}
		},
		prerender: true,
		style: {
			classes: "pwi-qtip items-qtip qtip-rounded",
			tip: false
		}
	});
	$(".powderIcon").qtip({
		//content: getChartIconTooltipContent(),
		content: $("#starseekerPowderTooltip"),
		show : {
			delay: 300
		},
		position	 : {
			type  : 'absolute',
			my: 'bottom left',
			at: 'top right',
			//container : $(document),
			viewport: $(window),
			adjust: {
				method: 'shift shift'
			}
		},
		prerender: true,
		style: {
			classes: "pwi-qtip items-qtip qtip-rounded",
			tip: false
		}
	});
	$("#levelControl").qtip({
		content: $("#levelTooltip"),
		show : {
			event: 'mousemove',
			delay: 500
		},
		position	 : {
			type  : 'absolute',
			my: 'bottom left',
			target: 'mouse',
			//container : $(document),
			viewport: $(window),
			adjust: {
				method: 'shift shift',
				mouse: false,
				x: 10,
				y: -10
			}
		},
		prerender: true,
		style: {
			classes: "pwi-qtip items-qtip qtip-rounded",
			tip: false
		},
		hide: {
			event: 'mousemove mouseleave click'
		}
	});	
	$("#astralEnergyControl").qtip({
		content: $("#astralEnergyTooltip"),
		show : {
			event: 'mousemove',
			delay: 500
		},
		position	 : {
			type  : 'absolute',
			my: 'bottom left',
			target: 'mouse',
			//container : $(document),
			viewport: $(window),
			adjust: {
				method: 'shift shift',
				mouse: false,
				x: 10,
				y: -10
			}
		},
		prerender: true,
		style: {
			classes: "pwi-qtip items-qtip qtip-rounded",
			tip: false
		},
		hide: {
			event: 'mousemove mouseleave click'
		}
	});
};

var doHoroscope = function() {
	var statCount = model.astral;
	// decide number of stats
	for (var i = statCount+1; i <= 10; i++) {
		if (Math.random() <= statChances[i-1]) {
			statCount = i;
		} else {
			break;
		}
	}
	//randomly assign stats  to first N stars
	for (var i = 0; i < 10; i++) {
		if (i < statCount) {
			model.stars[i].active = true;
			while(true) {
				model.stars[i].statId = Math.floor(Math.random()*stats.length);
				var prevCount = 0;
				for (var j = 0; j < i; j++)
					if (model.stars[j].statId == model.stars[i].statId)
						prevCount++;
				if (prevCount < 2) // max 2 count per stat
					break;
			}
		} else {
			model.stars[i].active = false;
		}
	}
	

	model.nebulaDustCount += 1;
	if (model.nebulaDustCount > 0){
		$('.dustUsed, #reset').show();
		$('.dustUsedValue').html(model.nebulaDustCount);
	}
	
	// pick a valid configuration
	model.seekerPowderCount -= 1; // dont overcount
	doStargaze();
};

var doStargaze = function() {
	var currStats = [];
	// Store all stats in an array
	for (var i = 0; i < 10; i++) {
		if (model.stars[i].active) 
			currStats.push(model.stars[i].statId);
		model.stars[i].active = false;
	}
	// Reassign the stats to a valid configuration
	var allowedSpots = [0, 1, 2, 3, 4];
	for (var i = 0; i < currStats.length; i++) {
		var ri = Math.floor(Math.random()*allowedSpots.length);
		// take out a random allowed spot
		var rs = allowedSpots.splice(ri, 1)[0]; 
		// add a fate star to the allowed list if now allowed
		if (rs < 5) {
			if (!allowedSpots.includes((rs + 1)%5)) allowedSpots.push(rs+5);
			if (!allowedSpots.includes((rs + 4)%5)) allowedSpots.push((rs + 4)%5 + 5);
		}
		model.stars[rs].active = true;
		model.stars[rs].statId = currStats[i];
	}
	model.seekerPowderCount += 1;
	if (model.seekerPowderCount > 0){
		$('.powderUsed, #reset').show();
		$('.powderUsedValue').html(model.seekerPowderCount);
	}
	update();
	if (model.seekerPowderCount + model.nebulaDustCount > 0) { // not for initial page load
		//$(".clickPulse.ready").removeClass('ready').remove().appendTo($("#chartPanel")).one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function() {$(this).addClass('ready');});
		$(".clickPulse.ready").remove().appendTo($("#chartPanel"));
	}
};
var initButtons = function() {
	$("#horoscope").click(doHoroscope);
	$("#stargaze").click(doStargaze);
	$("#reset").click(function(){
		model.nebulaDustCount = 0;
		model.seekerPowderCount = 0;
		$(".powderUsed").hide();
		$(".dustUsed").hide();
		$("#reset").hide();
	});
};

var initBarControls = function() {
	var levelHandler = function(e){
		if (e.buttons & 1) {
			var ratio = ($("#levelControl").height() - e.offsetY) / $("#levelControl").height(); 
			var newValue = Math.max(Math.round(ratio * 50), 1);
			if (newValue != model.level) {
				model.level = newValue;
				update();
			}
		}
	};
	$("#levelControl").mousemove(levelHandler).mousedown(levelHandler);
	var astralEnergyHandler = function(e){
		if (e.buttons & 1) {
			var ratio = ($("#astralEnergyControl").height() - e.offsetY) / $("#astralEnergyControl").height(); 
			var newValue = Math.max(Math.round(ratio * 10), 1);
			if (newValue != model.astral) {
				model.astral = newValue;
				update();
			}
		}
	};
	$("#astralEnergyControl").mousemove(astralEnergyHandler).mousedown(astralEnergyHandler);
};

var initVisibilityGroups = function() {
	for (var i = 0; i < 5; i++) {
		visibilityGroups.push(["#piece"+i+" .back", i, (i+1)%5, i+5]);
		visibilityGroups.push(["#piece"+i+" .edge1", i, i+5]);
		visibilityGroups.push(["#piece"+i+" .edge2", (i+1)%5, i+5]);
		visibilityGroups.push(["#piece5 .edge"+(i+1), i, (i+1)%5]);
	}
	visibilityGroups.push(["#piece5 .back", 0, 1, 2, 3, 4]);
};

var selectClass = function(classID) {
	model.currentClass = Number(classID);
	for (var i = 0; i < 14; i++)
		$("#class"+i).removeClass("selected");
	$("#class"+model.currentClass).addClass("selected");
	$("#chartIcon").css('background-image', 'url("http://asterpw.github.io/pwicons/f/'+classes[model.currentClass][2][0]+'.png")');
	update();
}


var initClassSelector = function() {
	var top = 405;
	var left = 25;
	classLabel = $("<div id='classLabel' class='label'>Class: <span class='className'>Archer</span></div>")
	classLabel.css({"top": (top-18)+"px", "left": (left+5)+"px", "width": "180px"});
	$("#chartPanel").append(classLabel);
	
	for (var i = 0; i < 14; i++) {
		selector = $("<div id='class"+i+"' class='classSelector'></div>");
		selector.css({
			"left": left+"px",
			"top": top+"px"
		}).click(function() {
			classId = $(this).attr("id").substring(5);
			selectClass(classId);
		});
		$("#chartPanel").append(selector);
		left += 26;
		if (i == 6) {left -= 26*7; top += 26;}
	}
	$("#class2").addClass('selected');
}

var encodeState = function() {
	var state = parseInt(model.currentClass).toString(16);
	state += ("00"+model.level).substr(-2);
	state += model.astral.toString(16);
	for(var i = 0; i < 5; i++) 
		state += Math.round(100 * model.stars[i].aptitude).toString().substr(0,3);
	for(var i = 0; i < 10; i++) {
		state += model.stars[i].active ? model.stars[i].statId.toString(16) : "X";
	}
	return state;
};

var decodeState = function(state) {
	model.level = parseInt(state.substr(1,2));
	model.astral = parseInt(state[3], 16);
	for(var i = 0; i < 5; i++) 
		model.stars[i].aptitude = parseInt(state.substr(4+3*i, 3))/100.0;
	for(var i = 0; i < 10; i++) {
		model.stars[i].active = state[19+i] != 'X';
		model.stars[i].statId = parseInt(state[19+i],16);
	}
	selectClass(parseInt(state[0], 16)); // also updates
};

var encode = function() {
	var state = encodeState();
	window.location.replace(window.location.href.split('#')[0] + '#' +state);
};

function loadFromUrl() {
	var state = unescape(self.document.location.hash.substring(1));
	if (state.length == 29)
		decodeState(state);
	else {
		model.nebulaDustCount = -1;
		doHoroscope();
	};
};
function preload(arrayOfImages) {
	$(arrayOfImages).each(function(){
		$('<img/>')[0].src = this;
	});
}

function preLoadImages() {
	preload([
		'images/smallbutton.png',
		'images/smallbuttton-hover.png',
		'images/smallbuttton-press.png'
	]);
}

var init = function() {
	preLoadImages();
	initStars();
	initButtons();
	initVisibilityGroups();
	initClassSelector();
	initBarControls();
	loadFromUrl();
	initTooltips();
};


$(document).ready(function(){
	init();
	update();
});