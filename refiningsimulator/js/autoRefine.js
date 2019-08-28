var autoRefine = false;
function startAutoRefine() {
        autoRefine = true;
        $("#startAutoRefine").attr("disabled", true);
        $("#stopAutoRefine").attr("disabled", false);
        doAutoRefine();
}
function stopAutoRefine() {
        autoRefine = false;
        $("#startAutoRefine").attr("disabled", false);
        $("#stopAutoRefine").attr("disabled", true);
}

function doAutoRefine() {
        if (canAutoRefine()){
                if (settings.currentGear){
                        addRefineAid();
                        refine();
                }
                
                var timer = $('#RefineTime').val();
                if (!$.isNumeric(timer) || timer < 0){
                        timer = 1;
                        $('#RefineTime').val(timer);
                }
                setTimeout(doAutoRefine, timer * 1000);
        }
        else
                stopAutoRefine();
}


function addRefineAid(){
        var amounts = [];
        var itemIds = [];
        var aids    = [];
        aids[0] = null;
        $('#autoRefineAids input').each(function (){ 
                amounts[amounts.length] = $(this).val() == "" ? -1 : parseInt($(this).val());
        });
        $('#autoRefineAids select').each(function (){ 
                itemIds[itemIds.length] = $(this).val();
        });
        
        for (var i in amounts){
                if ($.isNumeric(amounts[i]) && amounts[i] >= 0 && amounts[i] <= 12)
                        aids[amounts[i]] = itemIds[i];
        }
        for (var i = 1; i <= 12; i++){
                if (!aids[i]) aids[i] = aids[i-1];
        }
        
        var aid = aids[settings.currentGear.refineLevel];
        if (amounts.length > 0)
          setCurrentRefineAid(aid);
}

function canAutoRefine() {
        var amount = parseInt($('#RefineUntilAmount').val());
        var type   = $('#RefineUntilType').val();
        var cost   = parseInt($('#totalcost span:first-child').text().replace(/,/g, ''));
        
        if (settings.currentGear == null) 
                return false;
        if (amount && $.isNumeric(amount)){
                if (type == 0 && settings.currentGear.refineLevel >= amount)
                        return false;
                if (type == 1 && settings.currentGear.refineCount >= amount)
                        return false;
                if (type == 2 && cost >= amount)
                        return false;
                if (type == 3 && settings.items['11208'].count >= amount)
                        return false;
        }
        return autoRefine;
}


function addAutoRefine() {
        $('#autoRefineAidsRule div.line').clone().appendTo('#autoRefineAids');
        $('#autoRefineAids div.line:last-child input').val('0');
        $('#autoRefineAids div.line:last-child select').val('0');
        
        $("#removeAutoRefine").attr("disabled", false);
        if ($("#autoRefineAids div").size() >= 13)
        	$("#addAutoRefine").attr("disabled", true);
}
function removeAutoRefine() {
        $('#autoRefineAids div.line:last-child').remove();
    	$("#addAutoRefine").attr("disabled", false);
        if ($("#autoRefineAids div").size() == 0)
                $("#removeAutoRefine").attr("disabled", true);
}


function getAutoRefineHtml(){
        var content = '\
        <div id="autoRefine">\
               <div class="windowtitle" style="width: 242px; margin-top: 6px; text-align: center">Auto Refine</div>\
                        <div class="line" style="margin-top: 40px;">\
                                <input id="startAutoRefine" type="button" onclick="startAutoRefine()" class="button" value="Start" />&nbsp;\
                                <input id="stopAutoRefine" type="button" onclick="stopAutoRefine()" class="button" value="Stop" disabled />&nbsp;\
                                <span>Every</span> <input type="text" id="RefineTime" class="textarea" value="0" style="width: 45px;" /> <span>sec</span>\
                        </div>\
                        <div class="line">\
                                <span>Until</span> <input type="text" id="RefineUntilAmount" class="textarea" value="" size="4" />\
                                <select id="RefineUntilType">\
                                        <option value="0">Refine Level</option>\
                                        <option value="1">Refine Count</option>\
                                        <option value="2">Total Cost</option>\
                                        <option value="3">Mirages Used</option>\
                                </select>\
                        </div>\
                        <div class="line" style="margin-left: 5px; margin-right: 20px; text-align: right">\
                                <div class="windowtitle">Rules</div>\
                                <input id="addAutoRefine" type="button" onclick="addAutoRefine()" class="button" value="Add" />&nbsp;\
                                <input id="removeAutoRefine" type="button" onclick="removeAutoRefine()" class="button" value="Delete" disabled />\
                        </div>\
                        <div id="autoRefineAids"/>\
                        <div id="autoRefineAidsRule" style="display: none">\
                                <div class="line">\
                                        <span>Use</span>\
                                        <select>';

                                        for (var i in refineTypes)
                                                content += '<option value="'+ refineTypes[i].itemId +'">'+ refineTypes[i].name +'</option>';

                                        content += '\
                                        </select>\
                                        <span>from</span> +<input type="number" class="textarea" value="0" style="width: 43px;" min="0" max="12" />\
                               </div>\
                        </div>\
                </div>';
        
        return content;
}

function getAutoRefineCss() {
        return "\
        #autoRefine {\
                position: absolute;\
                width: 257px;\
                left: 620px;\
                top: 750px;\
                padding-left: 15px;\
                background-image: url('images/resultswindow.png');\
        }\
        #autoRefine:after {\
                content: '';\
                position: absolute;\
                bottom: -15px;\
                left: 0px;\
                width: 272px;\
                height: 15px;\
                background: url('images/resultswindow.png') 0px 14px;\
        }\
        #autoRefine .line {\
                margin-top: 5px;\
                margin-right: 15px;\
                text-align: center;\
        }\
        #autoRefine span {\
                font-size: 85%;\
        }";
}


$(document).ready(function(){
        $('style').append("<style type='text/css'>"+ getAutoRefineCss() +"</style>");
        $('body > div.content').append(getAutoRefineHtml());
});