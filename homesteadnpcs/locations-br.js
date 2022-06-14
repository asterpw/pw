//var PHP_HOST = "https://astrelle.tk/elysiumlocations/";
//var PHP_HOST = "http://ast.sudooo.com/elysiumlocations/"
var PHP_HOST = "https://us-central1-npc-locator-backend.cloudfunctions.net/"
var GET_RECORD_URL = PHP_HOST + "getrecord";
var RECORD_URL = PHP_HOST + "record";
$.ajaxSetup({crossDomain: true});

var locPositions = [[149,960], [645,265], [496,870], [431,461], [124,589], [213,420], [548,375], [336,823], [370,762], [368,460], [580,758], [119,643], [209,319], [424,740], [635,479], [234,229], [290,817], [176,466], [111,310], [120,258], [493,276], [448,570], [421,647], [613,724], [154,892], [282,567], [773,961], [463,423], [370,347], [461,839], [226,554], [772,935], [673,612], [585,564], [149,813], [325,975], [655,208], [460,345], [255,815], [683,258], [638,834], [141,746], [668,175], [176,875], [249,972], [597,858], [236,778], [389,516], [669,674], [497,965], [648,566], [540,419], [439,483], [676,254], [767,890], [234,751], [155,234], [348,465], [126,368]];

var locNames = ["Vila Nevada", "Vila Ametista", "Vila dos Eremitas", "Vila das Espadas", "Cidade do Por do Sol", "Montanha dos Cisnes", "Vila dos Sonhos", "Campo de Su Muer", "Tribo dos Ventos", "Vila Luoying", "Templo das Orquídeas", "Cidade de Fei Wei", "Vila Nanke", "Cidade do Vento Alísio", "Vila Perdida", "Santuário dos Ancestrais", "Muralha Ancestral", "Vila da Areia", "Vila Yelang", "Santuário dos Imortais", "Santuário Esquecido", "Residência do Lago Espelhado", "Cidade do Rio", "Acampamento Aliado", "Cidade de Beiping", "Declive do Dragão", "Templo da Ilusão", "Reino de Yu", "Vila do Bambu", "Estalagem Pengcheng", "Vila da Ponte Quebrada", "Altar da Ilusão", "Vila Langour", "Vila das Orquídeas", "Cidade de Nanping", "Vila da Avalanche", "Vila Presa de Dragão", "Cidade da Presa", "Campo de Expedição", "Altar de Fogo Noturno", "Vila dos Pescadores", "Vila do Fogo", "Acampamento Quebra Onda", "Cidade de Dongpin", "Vila de Gelo", "Vila Quadrada", "Vila Hu", "Garganta dos Ventos Ancestrais", "Ilha Perdida", "Galpão dos Lenhadores", "Cidade de Arcádia", "Vila de Pedra", "Vale do Tablado","Altar do Fogo Noturno","Floresta da Miragem","Campo dos Lírios","A Fenda","Floresta Yujia","Garganta dos Ventos"];

var npcs = [["Kon Leron", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51],
["Shon Saiven", 23, 12, 9, 28, 11, 15, 29, 21, 10, 17, 25, 8, 30, 5, 0, 33, 43, 35, 6, 24, 4, 13, 36, 32, 20, 27, 16, 26, 22, 46, 44, 14, 34, 3, 2, 7, 18, 40, 1, 41, 47, 19, 50, 31, 42, 49, 38, 51, 39, 48, 37, 45],
["Tsen Wankay", 14, 38, 34, 33, 20, 13, 18, 35, 11, 2, 8, 4, 1, 21, 31, 5, 26, 9, 36, 41, 24, 7, 28, 0, 19, 10, 27, 25, 3, 6, 12, 43, 23, 15, 32, 17, 22, 50, 46, 48, 37, 39, 44, 16, 30, 51, 29, 40, 49, 45, 42, 47],
["Sonn Katson", 43, 29, 23, 5, 19, 7, 22, 9, 20, 32, 4, 24, 46, 35, 16, 21, 25, 34, 28, 48, 41, 17, 33, 31, 39, 11, 10, 8, 15, 36, 38, 26, 14, 13, 0, 2, 3, 44, 6, 45, 42, 49, 12, 27, 1, 40, 18, 50, 51, 47, 30, 37],
["Geon Nenya", 16, 6, 0, 13, 41, 35, 28, 2, 24, 23, 20, 19, 29, 17, 26, 7, 10, 32, 3, 49, 39, 9, 15, 43, 48, 4, 8, 11, 5, 22, 46, 27, 31, 21, 14, 34, 33, 30, 18, 51, 44, 45, 1, 25, 38, 37, 36, 42, 47, 40, 12, 50],
["Criança Raposa", 8, 3, 26, 9, 51, 32, 13, 14, 49, 16, 48, 45, 28, 23, 11, 34, 24, 43, 21, 37, 47, 0, 35, 10, 40, 39, 19, 41, 17, 5, 22, 4, 25, 2, 27, 31, 7, 29, 33, 42, 46, 50, 18, 20, 36, 12, 15, 38, 44, 30, 6, 1],
["Felino de Jade", 31, 46, 32, 15, 24, 21, 36, 17, 4, 34, 11, 20, 38, 7, 43, 13, 27, 2, 22, 39, 19, 35, 3, 14, 41, 8, 25, 10, 33, 18, 1, 16, 0, 5, 23, 9, 28, 42, 29, 49, 50, 48, 30, 26, 12, 47, 6, 37, 45, 51, 44, 40],
["Yon Tonsyn", 25, 22, 43, 35, 49, 2, 15, 23, 39, 31, 41, 48, 36, 34, 10, 9, 4, 14, 5, 47, 45, 32, 21, 27, 51, 19, 20, 24, 7, 33, 18, 8, 26, 17, 16, 0, 13, 38, 28, 37, 1, 40, 29, 11, 6, 44, 3, 12, 50, 42, 46, 30],
["Leu Ninsi", 11, 33, 27, 2, 47, 23, 21, 31, 45, 26, 49, 51, 3, 0, 4, 32, 19, 16, 7, 50, 40, 14, 17, 8, 37, 48, 41, 39, 9, 13, 28, 20, 10, 34, 25, 43, 35, 6, 15, 44, 29, 42, 36, 24, 22, 1, 5, 46, 30, 12, 18, 38],
["Zuw Yonen", 4, 15, 25, 34, 40, 0, 7, 43, 51, 27, 45, 47, 33, 14, 20, 23, 41, 26, 35, 42, 37, 31, 9, 11, 50, 49, 39, 48, 2, 21, 3, 24, 8, 32, 10, 16, 17, 18, 5, 30, 6, 44, 22, 19, 28, 38, 13, 29, 12, 1, 36, 46],
["Vin Horlan", 27, 36, 31, 7, 48, 9, 33, 32, 41, 14, 19, 39, 18, 2, 25, 17, 11, 0, 15, 51, 49, 34, 13, 26, 45, 24, 4, 20, 21, 3, 6, 10, 16, 35, 43, 23, 5, 1, 22, 40, 12, 47, 46, 8, 29, 42, 28, 30, 37, 50, 38, 44],
["Wan Yirzin", 10, 28, 16, 17, 45, 34, 5, 0, 48, 43, 39, 49, 22, 32, 8, 2, 20, 31, 13, 40, 51, 23, 7, 25, 47, 41, 24, 19, 35, 15, 36, 11, 27, 9, 26, 14, 21, 46, 3, 50, 38, 37, 6, 4, 18, 30, 33, 1, 42, 44, 29, 12],
["Vovó Sven", 26, 18, 14, 21, 39, 17, 3, 34, 19, 0, 24, 41, 6, 9, 27, 35, 8, 23, 33, 45, 48, 2, 5, 16, 49, 20, 11, 4, 13, 28, 29, 25, 43, 7, 31, 32, 15, 12, 36, 47, 30, 51, 38, 10, 46, 50, 22, 44, 40, 37, 1, 42]];
npcs.sort(function(a, b){ return a[0] > b[0]});

var otherNpcs = [["Dil Honse", 52, 45, 53],
["Jan Holfen", 54, 55, 56],
["Jee Enir", 45, 53, 57],
["Lee Sefan", 20, 28, 52],
["Loo Kohan", 56, 20, 28],
["Lor Wenil", 55, 56, 20],
["Ol Ninze", 57, 58, 54],
["Wan Lanch", 58, 54, 55],
["Wong Zehow", 53, 57, 58],
["Xi Chenko", 28, 52, 45]];

var token = '';

var sortSelect = function(sel) {
	var opts_list = sel.find('option');
	opts_list.sort(function(a, b) { return $(a).text() > $(b).text() ? 1 : -1; });
	sel.empty().append(opts_list);
};

var makeMap = function(i) {
	var label = $("<div class='label'>"+locNames[i]+"</div>");
	var map = $("<div class='map'></div>");
	//for (var i in locPositions) {
		var pos = locPositions[i];
		var x = Math.round(-15+0.42*pos[0]);
		var y = Math.round(434- .42*pos[1]);
		map.append($("<div class='marker' style ='top: "+y+"px; left: "+x+"px'></div>"));
	//}
	//return map;
	return label.append(map);
};

var init = function(side, npclist) {
	var npcSelect = $("#"+side+" .npcName");
	var locationSelect = $("#"+side+" .location");
	var result = $("#"+side+" .result");
	for (var i = 0; i < npclist.length; i++)
		npcSelect.append($("<option value=\""+(i)+"\">"+npclist[i][0]+"</option>"));
	sortSelect(npcSelect);
	npcSelect.prepend('<option value="-1" selected>Escolha um NPC</option>');
	npcSelect.change(function(){
		var val = $(this).val();
		if (val < 0 || val >= npclist.length) return;
		$("option[value=-1]", $(this)).remove();
		locationSelect.empty()
		for(var i = 1; i < npclist[val].length; i++) 
			locationSelect.append($("<option value=\""+(i)+"\">"+locNames[npclist[val][i]]+"</option>"));
		sortSelect(locationSelect);
		locationSelect.prepend('<option value="-1" selected>Escolha uma posição</option>');
	});
	locationSelect.change(function(){
		var val = $(this).val();
		if (val == -1) return;
		$("option[value=-1]", $(this)).remove();
		result.empty();
		for(var i = 0; i < npclist.length; i++) {
			result.append($("<div class='namelabel'>"+npclist[i][0]+"</div><span> está em </span>")).append(makeMap(npclist[i][val])).append($("<br>"));
		}
		var button = $(".submit", $(this).closest(".container"));
		button.show();
		if ($(".message", $(this).closest(".container")).text() == "")
			button.prop('disabled', false);
	});
}; 

var makeSightingWidget = function(record) {
	var npclist = [npcs, otherNpcs][record.type];
	if (record.npc < 0 || record.npc >= npclist.length || record.loc < 1 || record.loc >= npclist[0].length) 
		return;
	var date = new Date(record.time*1000);
	var identicon = '<div style="display: inline-block; width:20px; height:20px; background-image: url(\'http://vanillicon.com/'+record.id+'_50.png\'); background-size: cover"></div> viu ';
	var typeName = record.type ? " <span style='color: #BFB'>andando</span> em " : " <span style='color: #FBB'>parado</span> em ";
	var sighting = $("<div class='sighting'><span class='time'>"+date.toLocaleString()+"</span>: </div>").append(identicon);
	var link = $("<span class='link'>"+npclist[record.npc][0]+typeName+locNames[npclist[record.npc][record.loc]]+" (#"+record.loc+")</span>");
	link.click(function(){
		var type = record.type == "1" ? "#walking" : "#normal";
		$(".npcName", type).val(record.npc).change();
		$(".location", type).val(record.loc).change();
		$(".submit", type).prop('disabled', true);
	});
	sighting.append(link);
	return sighting;
};

var autoPickSighting = function(records) {
	var server = localStorage.getItem('server');
	if (!server) return;
	var counts = [{}, {}]
	for (var i = 0; i < records.length; i++) {
		if (isCurrentDay(records[i].time, server)) {
			counts[records[i].type][records[i].loc] = (counts[records[i].type][records[i].loc] || 0) + 1;
		}
	}
	var keys = [Object.keys(counts[0]), Object.keys(counts[1])];
	for (var i = 0; i < keys.length; i++) {
		var maxValue = 0;
		var maxLoc = 0;
		for (var j = 0; j < keys[i].length; j++) {
			if (counts[i][keys[i][j]] > maxValue) {
				maxValue = counts[i][keys[i][j]];
				maxLoc = keys[i][j];
			}
		}
		if (maxLoc > 0 && maxValue >= 1) {
			var type = ["#normal", "#walking"][i];
			$(".npcName", type).val(0).change();
			$(".location", type).val(maxLoc).change();
			$(".submit", type).prop('disabled', true);
		}
	}
};

var setSightings = function(data) {
	console.log(data);
	$(".sightings .result").empty();
	for (var i = 0; i < data.records.length; i++) {
		$(".sightings .result").prepend(makeSightingWidget(data.records[i]));
	}
	autoPickSighting(data.records);
};

var isCurrentDay = function(utc, server) {
	var locations = {
		"etherblade":	"US/Pacific",
		"twilight":	"US/Pacific",
		"tideswell":	"US/Eastern",
		"dawnglory": "Europe/Paris",
		"cygnus": "America/Araguaina",
		"arcadia": "America/Araguaina",
		"pegasus": "America/Araguaina",
		"hydra": "America/Araguaina",
		"draco": "America/Araguaina",
		"lynx": "America/Araguaina",
	};

	var location = locations[server];
	var daystart = moment.utc().tz(location).startOf('day');
	return daystart.diff(moment.utc(utc*1000)) < 0;
};

var initSightings = function() {
	$(".sightings .server").change(function(){
		var server = $(this).val();
		if (server == "-1") return;
		$(".sightings .server option[value=-1]").remove();
		localStorage.setItem('server', server);
		$.ajax({url: GET_RECORD_URL+"?q="+server, dataType: "json"}).done(setSightings);
	});
	
	$(".submit").click(function(){
		var message = $('.message', $(this).closest('.container'));
		var server = $(".server").val();
		var type = $(this).closest("#walking").length;
		var button = $(this);
		
		var captchaSuccess = function(response){
			token = response;
			button.click();
		};
		
		if (token == ''){
			if ($("#captcha"+type).length == 0) {
				var capctchaDiv = $("<div id='captcha"+type+"' class='recaptcha'></div>")
				$(this).closest('.container').append(capctchaDiv);
				grecaptcha.render(capctchaDiv[0], {
					'sitekey' : '6LfULR4TAAAAAKbR_S0t-H025tlQFnX6GFZC9t9L',
					'callback' : captchaSuccess,
					'theme' : 'dark'
				});
			}
			return;
		}
		//if (grecaptcha.getResponse('captcha'+type) == '')
		//	return;
		//token = grecaptcha.getResponse('captcha'+type);

		var npc = $(".npcName", $(this).closest(".container")).val();
		var loc = $(".location", $(this).closest(".container")).val();
		if (server == -1 || npc == -1 || loc == -1) {
			return;
		}
		$(this).prop('disabled', true);

		$.post(RECORD_URL, {
			q: server,
			type: type,
			name: npc,
			loc: loc,
			token: token
		}).done(function(result){
			message.text("Obrigado!").toggle;
			$(".sightings .server").change();
			token = '';
			$(".recaptcha").remove();
		});
	}).hide();
};

function load() {
	var server = localStorage.getItem('server');
	if (server) {
		$(".sightings .server").val(server).change();
	}
};

var onloadCallback = function() {};

  
$(document).ready(function(){
	init('normal', npcs);
	init('walking', otherNpcs);
	initSightings();
	load();
});