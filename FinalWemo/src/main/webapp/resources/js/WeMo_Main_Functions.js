/* 파일명 : WeMo_Main_Functions
 * 저장위치 : resources/js/WeMo_Main_Functions.js
 * 태그(헤드) : <script src = "resources/js/WeMo_Main_Functions.js"></script>  
 *  */

$(function(){
	
	addAllEventsOnPage();
	
/* navbarAddEvent function */
	function navbarAddEvent(){
         var navbarItems = $('.first-row td');
         navbarItems.css("cursor", "pointer");
         
         $.each(navbarItems,function(index, e){
            
            var firstSpanColValue = index;
            var secondSpanColValue = navbarItems.length-index-1;
            
            var newMemoText = '';
        	var newMemoClass = '';
        	var bgColorClass = $(navbarItems[index]).attr('class');
        	
            if(firstSpanColValue < 4){
            	var newMemoText = '새 메모';
            	var newMemoClass = 'newMemo';
            	// 새 메모가 필요한 것은 공부, 운동, 가계부만 필요하므로 첫 colspan값이 4 이하일 때만 새 메모라는 텍스트를 입력하도록 함
            } 
            
            var secondRow = "<tr class = 'second-row'>"
            			  + "<td colspan='"+firstSpanColValue+"'></td>"
            			  + "<td class ='"+newMemoClass+" "+bgColorClass+"'>"+newMemoText+"</td>"
			 			  + "<td colspan = '"+secondSpanColValue+"'</td></tr>"
			   // 두번째 줄을 생성하기 위한 태그를 여기서 조립
            
	        if (index != 0 && index != 9){
	        // index 0번은 로고, 9번은 검색탭
	            $(navbarItems[index]).click(function(){
	                var bgColorClass = $(navbarItems[index]).attr('class');
	                
	                if($('.second-row'))
	                   $('.second-row').last().remove();
	     
		               $('.first-row').after(secondRow);
		               $('.second-row td').css({
  		            	    "border" : "none",
		                    "border-collapse" : "collapse", 
		                    "border-radius" : "0% 0% 5% 5%",
		                    "cursor" : "pointer"
		                })
	                	$('.second-row .newMemo').on('click', newMemoAppend);
	                	})// navbarItems click event
	            	}// if end
        	})        
    }
	
/* navbarResizingEvent function */
function navbarResizingEvent(){
	
		var isChecked = ""
			if ($('.toggle').eq(0).hasClass('btn-dark'))
				isChecked = "checked";
    	var pageWidth = $(window).width();
        $('.memobox').resizable({
            maxWidth: pageWidth,
            minWidth: 185,
            minHeight: 140
        })
        
        if(pageWidth > 900){
            var normalNav = '<table class="table navTable">'
                          + '<tbody><tr class="first-row">'
                          + '<td class="menu-search normal-menu"><img src = "resources/image/WemoLogo.png" width = "100px"></td>'
                          + '<td class="menu-study normal-menu">공부</td>'
                          + '<td class="menu-health normal-menu">운동</td>'
                          + '<td class="menu-money normal-menu">가계부</td>'
                          + '<td class="menu-calendar normal-menu">캘린더</td>'
                          + '<td class="menu-important normal-menu">보관함</td>'
                          + '<td class="menu-trash normal-menu">휴지통</td>'
                          + '<td class="menu-analysis normal-menu">통계</td>'
                          + '<td class="menu-setting normal-menu">설정</td>'
                          + '<td class="menu-search normal-menu">'
                          + '<input type="checkbox" class="memoAlineBtn" style = "width:120px;" '
                          + 'data-toggle="toggle" data-on="정리 끄기" data-off="메모 정리" data-onstyle="dark" data-offstyle="success"'+isChecked+'>'
                          + '<span><input type = "text" class = "search_input float-right"></span>'
                          + '<span class="material-icons float-right search-icon" style = "line-height: 24pt;">search</span>&nbsp;'
                          + '</td></tr></tbody></table>';
            
            var memoObj = {
            		"USER_EMAIL" : $('#USER_EMAIL').text(), 
            		"MEMO_SUB" : $('#MEMO_SUB').text()
            		};
            
            $.ajax({
            	url : "getSectionMemoList",
            	data : memoObj,
            	dataType : "JSON",
            	method : "POST",
            	success : function(result){            	
            			putMemosAtMemoContainer(result);
            			console.log("putMemosAtMemoContainer 실행");
            	}
            })
            
            $('nav').html(normalNav)
            		.css('z-index', 1000);
            navbarAddEvent(); 
            var firstRow = $('.first-row td');
            $.each(firstRow, function(index){
            	if(index != 9)
            		$(firstRow[index]).on('click', addSectionChangeEvent);
            })
            $('.search-icon').on('click', addSearchMemoEvent);
            $('.memoAlineBtn').bootstrapToggle()
            				  .on('click', autoMemoAlign);
        
        } else if (pageWidth <= 900) {
        	
            var mobileNav = '<nav class="navbar navbar-light bg-light">'
            			  + '<img src="resources/image/WemoLogo.png" width="100px">'
            			  + '<span class="material-icons search-icon" style="line-height:24pt;">search<span>&nbsp;'
            			  + '<input type="text" class="search_input float-right"></nav>'
            			  + '<table class="table table-borderless mobile-nav">'            			  
                          + '<tbody id ="mobile-tbody">'
                          + '<tr class="mobile-row">'
                          + '<td class="menu-study mobile-menu">공부</td></tr>'
                          + '<tr class="mobile-row">'
                          + '<td class="menu-health mobile-menu">운동</td></tr>'
                          + '<tr class="mobile-row">'
                          + '<td class="menu-money mobile-menu">가계부</td></tr>'
                          + '<tr class="mobile-row">'
                          + '<td class="menu-calendar mobile-menu">캘린더</td></tr>'
                          + '<tr class="mobile-row">'
                          + '<td class="menu-important mobile-menu">보관함</td></tr>'
                          + '<tr class="mobile-row">'
                          + '<td class="menu-trash mobile-menu">휴지통</td></tr>'
                          + '<tr class="mobile-row">'
                          + '<td class="menu-analysis mobile-menu">통계</td></tr>'
                          + '<tr class="mobile-row">'
                          + '<td class="menu-setting mobile-menu">설정</td></tr>'
                          + '</tbody></table>';
            
            var memoObj = {
            		"USER_EMAIL" : $('#USER_EMAIL').text(), 
            		"MEMO_SUB" : $('#MEMO_SUB').text()
            		};
            
            $.ajax({
            	url : "getSectionMemoList",
            	data : memoObj,
            	dataType : "JSON",
            	method : "POST",
            	success : function(result){            		
            			listingMemosAtMemoContainer(result);
            			console.log("listingMemosAtMemoContainer 실행");
            	}
            })
                       
            $('nav').html(mobileNav);
            $('.search-icon').on('click', addSearchMemoEvent);
            $('.mobile-menu').on('click', addSectionChangeEvent);            
        }
    }

/* addSectionChangeEvent function */
function addSectionChangeEvent(){
	
	var section_text = $(this).text();
	if(section_text == "캘린더" && section_text == "search")
		return false;
	
    if(section_text == "공부"){
        $('#MEMO_SUB').text('STUDY');
     } else if(section_text == "운동"){
        $('#MEMO_SUB').text('HEALTH');
     } else if(section_text == "가계부"){
        $('#MEMO_SUB').text('MONEY');
     } else if(section_text == "휴지통"){
    	$('#MEMO_SUB').text('TRASH');
     } else if(section_text == "보관함"){
    	$('#MEMO_SUB').text('IMPORTANT');
     } else if(section_text == "통계"){
    	$('#MEMO_SUB').text('ANALYSIS');
    	console.log("drawChart() 실행");
    	drawChart();
    	return false;
     } else if (section_text == "설정"){
    	 $('#MEMO_SUB').text('SETTING');
     } 
		
    var memoObj = {
    		"USER_EMAIL" : $('#USER_EMAIL').text(),
    		"MEMO_SUB" : $('#MEMO_SUB').text()
    	};
		
		$.ajax({
    	url : "sectionChange",
    	method : "POST",
    	dataType : "JSON",
    	data : memoObj,
    	success : function(rdata) {
    		var windowWidth = $(window).width();
    		if(windowWidth > 900)	
    			putMemosAtMemoContainer(rdata);
    		else(windowWidth <= 900)
    			listingMemosAtMemoContainer(rdata);
    	},// success end
    	error : function(){
    		console.log("ajax 에러");
    	}
    	
    })// ajax end
    if($('.toggle').eq(0).hasClass('btn-dark'))
    	$('.toggle').eq(0).trigger('click');
 }

/* putMemosAtMemoContainer (Memobox type) */
function putMemosAtMemoContainer(rdata){
	$('.memoContainer').empty();
		$.each(rdata, function(index){
		var Memolist = rdata[index];
		var thisSection = $('#MEMO_SUB').text();
		var section_text = sectionTranslateENtoKR(thisSection);
		var restoreIcon = "";
			if (thisSection == "TRASH"){
				restoreIcon = "<span class='material-icons float-right restore' "
							+ "data-toggle='tooltip' title ='메모 복구'>restore</span>";
			}
		
    		if(Memolist.MEMO_FAV == 'N'){
    			var favStyle = 'color:rgb(33, 37, 41)';
    			var favTitle = '메모 보관';
    		} else if (Memolist.MEMO_FAV == 'Y') {
    			var favStyle = 'color:rgb(250, 128, 114)';
    			var favTitle = '보관 해제';
    			section_text = sectionTranslateENtoKR(Memolist.MEMO_SUB);
    		}
    		
    		if (Memolist.MEMO_TRA == "Y"){
    			var traTitle = '완전 삭제';
    			section_text = sectionTranslateENtoKR(Memolist.MEMO_SUB);
    		} else if (Memolist.MEMO_TRA == 'N') {
    			var traTitle = '휴지통으로';
    		}
    		
    		if(Memolist.MEMO_LOC == "N"){
    			var locText = 'lock_open';
    			var locTitle = '메모 잠금';
    		} else {
    			var locText = 'lock';
    			var locTitle = '잠금 해제';
    		}
    		
    		if (typeof Memolist.MEMO_TEX == undefined){
    			MEMO_TEX = "";
    		} else { 
    			MEMO_TEX = Memolist.MEMO_TEX;
    			var textareaRows = MEMO_TEX.split("\n").length + 1;
    		}
    		
		var memoboxCreate 
			= "<div class='container memobox memobox-normal shadow-sm' "
	        + "style = 'position:"+Memolist.MEMO_POSITION+"; top:"+Memolist.MEMO_TOP+"; "  
	        + "left:"+Memolist.MEMO_LEFT+"; background-color:"+Memolist.MEMO_COLOR+"; "
	        + "z-index:"+Memolist.MEMO_ZID+"; width:" +Memolist.MEMO_WIDTH+"; height:"+Memolist.MEMO_HEIGHT+"';>"
	        + "<form><div class='container memo-top'>"
	        + "<input type='hidden' class='MEMO_NUM' name='MEMO_NUM' value='"+Memolist.MEMO_NUM+"'>"
	        + "<span class='MEMO_DATE'>"+Memolist.MEMO_DATE+"</span>"
	        + "<span class='section-name'> "+section_text+"</span>"
	        + "<span class='material-icons float-right delete' "
	        + "data-toggle='tooltip' title ='"+traTitle+"'>delete</span>"
	        + restoreIcon
	        + "<span class='material-icons float-right favorites' "
	        + "data-toggle='tooltip' title ='"+favTitle+"' style='"+favStyle+"'>stars</span>"
	        + "<span class='material-icons float-right lock' "
	        + "data-toggle='tooltip' title ='"+locTitle+"'>"+locText+"</span>"
	        + "<span class='material-icons float-right color' "
	        + "data-toggle ='tooltip' title='메모 색 변경'>color_lens</span></div>"
	        + "<div class='container memoContent'><textarea class = 'memotext form-control' "
	        + "style = 'overflow-y:hidden; resize:none; background-color:" + Memolist.MEMO_COLOR
	        + "; border: none' rows ="+textareaRows+">"+MEMO_TEX+"</textarea></div></form></div>";
	    
	    $('.memoContainer').append(memoboxCreate);
	       	    
		})// $.each end      
		$('.lock').on('click', lockEventAdd);
		$('.favorites').on('click', favoEventAdd);
		$('.delete').on('click', deleteEventAdd);
		$('.restore').on('click', deleteEventAdd);
		$('.color').on('click', memoColorChange);
	    $('.colorpad').on('click', colorPicking);
		$("[data-toggle='tooltip']").tooltip();
		$('.memotext').keydown(autoResizeTextArea);
		$('.memobox').draggable()
					 .resizable()
	    			 .one('click', addTextArea)
	    			 .mouseup(function(){
				    	 adjustMemoboxzindex();
				    	 saveMemoProperties();
				     })           
	    			 .mousedown(bringFront)
}

/* listingMemosAtMemoContainer (List Type) */
function listingMemosAtMemoContainer(rdata){
	$('.memoContainer').empty();
	$('.memoContainer').html("<ul class = 'list-group listContainer'></ul>");
	$.each(rdata, function(index){
	var Memolist = rdata[index];
	var thisSection = $('#MEMO_SUB').text();
	var section_text = sectionTranslateENtoKR(thisSection);
	var restoreIcon = "";
		if (thisSection == "TRASH"){
			restoreIcon = "<span class='material-icons float-right restore' "
						+ "data-toggle='tooltip' title ='메모 복구'>restore</span>";
		}
	
		if(Memolist.MEMO_FAV == 'N'){
			var favStyle = 'color:rgb(33, 37, 41)';
			var favTitle = '메모 보관';
		} else if (Memolist.MEMO_FAV == 'Y') {
			var favStyle = 'color:rgb(250, 128, 114)';
			var favTitle = '보관 해제';
			section_text = sectionTranslateENtoKR(Memolist.MEMO_SUB);
		}
		
		if (Memolist.MEMO_TRA == "Y"){
			var traTitle = '완전 삭제';
			section_text = sectionTranslateENtoKR(Memolist.MEMO_SUB);
		} else if (Memolist.MEMO_TRA == 'N') {
			var traTitle = '휴지통으로';
		}
		
		if(Memolist.MEMO_LOC == "N"){
			var locText = 'lock_open';
			var locTitle = '메모 잠금';
		} else {
			var locText = 'lock';
			var locTitle = '잠금 해제';
		}
		
		if (typeof Memolist.MEMO_TEX == undefined){
			MEMO_TEX = "";
		} else { 
			MEMO_TEX = Memolist.MEMO_TEX;
			var textareaRows = MEMO_TEX.split("\n").length + 1;
		}
		
	var memolistCreate
			= "<li class='memobox memobox-list list-group-item list-group-item-action' style='background-color:"+Memolist.MEMO_COLOR+"'>"
            + "<input type='hidden' class='MEMO_NUM' name='MEMO_NUM' value="+Memolist.MEMO_NUM+">"
            + "<span class='MEMO_DATE'>"+Memolist.MEMO_DATE+"&nbsp;&nbsp;</span>"
            + "<span class='section-name'>["+section_text+"]</span>" 
            + "<span class='material-icons delete float-right' data-toggle='tooltip' "
            + "title ='"+traTitle+"'>delete</span>"
            + restoreIcon
            + "<span class='material-icons favorites float-right' data-toggle='tooltip' "
            + "title ='"+favTitle+"' style='background-color:"+favStyle+"'>stars</span>"
            + "<span class='material-icons float-right lock' data-toggle='tooltip' title='"+locTitle+"'>"+locText+"</span>"
            + "<span class='material-icons float-right color' data-toggle ='tooltip' title='메모 색 변경'>color_lens</span></li>"
            + "<li class='memoContent memoContent-list' style='display:none; background-color:"+Memolist.MEMO_COLOR+"';>"
            + "<textarea class='memotext' style='margin:1em; overflow-y:hidden; resize:none; background-color:"+Memolist.MEMO_COLOR+"; "
            + "border:none; width:90%;' rows="+textareaRows+">"
            + Memolist.MEMO_TEX+"</textarea></li>"
    
    $('.listContainer').append(memolistCreate);
       	    
	})// $.each end      
	$('.lock').on('click', lockEventAdd);
	$('.favorites').on('click', favoEventAdd);
	$('.delete').on('click', deleteEventAdd);
	$('.restore').on('click', deleteEventAdd);
	$('.color').on('click', memoColorChange);
    $('.colorpad').on('click', colorPicking);
    $('.memobox').tooltip()
    			 .on('click', function(){
    				 $(this).next('li').slideToggle('fast')
    			 	})
    			 .css("cursor", "pointer");
    $('.memotext').on('keyup', autoResizeTextAreaAtList);
    $('.listContainer').sortable({
    	connectWith : ".memoContent"
    })
}

/* drawChart (Google Chart) */
function drawChart() {
	
	var memoObj = {
    		"USER_EMAIL" : $('#USER_EMAIL').text(),
    		"MEMO_SUB" : $('#MEMO_SUB').text()
    	};
	
	$.ajax({
    	url : "sectionAnalysis",
    	method : "POST",
    	dataType : "JSON",
    	data : memoObj,
    	success : function(rdata) {
    		
    		console.log("데이터 받음");
    		console.log(rdata);
    		
    		$('.memoContainer').html('<div class = "container" id ="analysis"></div>');
    		$('.analysis').css({"height" : "600px", "width" : "600px"});
    		
    		studyCount = rdata.STUDY;
    		healthCount = rdata.HEALTH; 
    		moneyCount = rdata.MONEY;
    		
			google.charts.load('current', {'packages' : ['corechart']});
			google.charts.setOnLoadCallback(function(){
				
				var data  = google.visualization.arrayToDataTable([
					['주제', '메모 수'],
					['공부', studyCount],
					['운동', healthCount],
					['가계부', moneyCount]
				]);
				
				if (studyCount == 0 && healthCount == 0 && moneyCount == 0){
	    			data = google.visualization.arrayToDataTable([
	    				['주제', '메모 수'],
	    				['메모를 작성해주세요', 1]
	    				])
				}
				
				var options = {'title' : '내가 작성한 메모들', 'width' : 600, 'height' : 600};
				
				var chart = new google.visualization.PieChart(document.getElementById('analysis'));
				
				chart.draw(data, options);
				
			})
    	},
    	error : function(){
    		console.log("ajax를 기동하지 못했습니다");
    	}
	})
}

/* newMemoAppend function */
function newMemoAppend(){
   
    var section_translation = sectionTranslateENtoKR($('#MEMO_SUB').text());
    
    var memoObj = {
    		"USER_EMAIL" : $('#USER_EMAIL').text(),
        	"MEMO_SUB" : $('#MEMO_SUB').text()        				
        	};
            	
    $.ajax({
    	url : "newMemo",
        method: "POST",
        dataType : "JSON",
        data : memoObj,
        success : 
        	function(rdata){
        		var style = '"left:'+rdata.MEMO_LEFT+'; top:'+rdata.MEMO_TOP+'; z-index:'+rdata.MEMO_ZID+'; '
        				  + 'width:'+rdata.MEMO_WIDTH+'; height:'+rdata.MEMO_HEIGHT+';"';
        	
                var newMemobox = "<div class = 'container memobox shadow-sm' style = "+style+"><form>"
                        	   + "<div class = 'container memo-top'>"
                        	   + "<input type = 'hidden' class= 'MEMO_NUM' name = 'MEMO_NUM' value = "+ rdata.MEMO_NUM +">"
                               + "<span class = 'MEMO_DATE'>" + rdata.MEMO_DATE + "</span>"
                               + "<span class = 'section-name'> " + section_translation + "</span>"
                               + "<span class = 'material-icons delete float-right' "
                               + "data-toggle='tooltip' title ='휴지통으로'>delete</span>"
                               + "<span class = 'material-icons favorites float-right' "
                               + "data-toggle='tooltip' title ='메모 보관'>stars</span>"
                               + "<span class = 'material-icons float-right lock' "
                               + "data-toggle='tooltip' title ='메모 잠금'>lock_open</span>"
                               + "<span class='material-icons float-right color' "
           	    	           + "data-toggle ='tooltip' title='메모 색 변경'>color_lens</span></div>"
                               + "<div class = 'container memoContent'></div></form></div>";
			     $('.memoContainer').append(newMemobox);

                 var findNewMemoBox = $('.memoContainer').last().find('.memobox');
                 findNewMemoBox.draggable()
                               .resizable()
                             // 한 번만 실행되는 textarea 생성 이벤트를 .memobox 클래스에 추가
                               .one('click', findNewMemoBox, addTextArea)

                            // 나머지 아이콘들에 각각 이벤트 추가
                               .on('click', '.favorites', favoEventAdd)
                               .on('click', '.lock', lockEventAdd)
                               .on('click', '.delete', deleteEventAdd)
                               .on('click', '.color', memoColorChange)                              
                               .mouseup(function(e){
							    	 adjustMemoboxzindex();
							    	 saveMemoProperties();
							     })
                               .mousedown(bringFront) // mousedown end
                               adjustMemoboxzindex();            			
            		}
            	})
}

/* memoboxSelectFunction function */
function memoboxSelectFunction(targetObj){
	/* 클릭했을 때 무조건 memobox를 선택할 수 있도록 하는 함수 */
	/* 클릭한 타겟(Event객체의 e.target)을 선택하고  이 선택한 객체에 부여한 class값이 memo_top이라면 부모객체를, 아니면 그냥 this를 사용 */

	var clickTargetSelector = targetObj;
	
	if (clickTargetSelector.hasClass('memobox')){
		var memoboxSelector = clickTargetSelector;
		console.log(memoboxSelector.attr('class'))
		return memoboxSelector;
	} else {
		var memoboxSelector = clickTargetSelector.closest('.memobox');
		console.log(memoboxSelector.attr('class'))
		return memoboxSelector;
	}
}

/* bringFront function */
function bringFront(){
	mbxSelector = $(this).closest('.memobox');
    mbxSelector.css("z-index", 999);
}

/* addTextArea function */
function addTextArea() {
	var target = $(this);
	var mbxSelector = memoboxSelectFunction(target);
	var isUnlocked = mbxSelector.find('.lock').text().includes('open');
	
	/* 객체 내에 textarea가 하나도 없을 때만 실행되도록 함 */
    if(mbxSelector.find($('textarea')).length == 0 && isUnlocked){
    	var textarea = "<textarea class = 'memotext form-control' style='overflow-y:hidden; resize:none'>";
    		mbxSelector.find('.memoContent').html(textarea);
    	var memotextSelector = mbxSelector.find('.memotext');
	    	memotextSelector.css({ "background-color": "khaki", "border": "none" })
	        				.keydown(autoResizeTextArea)
	        				.focus();
    }
}

/* autoResizeTextArea function */
function autoResizeTextArea() {
	var target = $(this);
	var mbxSelector = memoboxSelectFunction(target);
	var memoText = $(this).val();
		
    var NumberOfEnters = memoText.split("\n").length + 1;
    if (NumberOfEnters == 1) {
        $(this).attr('rows', 2)
    } else {
        $(this).attr('rows', NumberOfEnters)
    }

    var textAreaHeight = $(this).height();
    var memotopHeight = mbxSelector.find('.memo-top').height();
    var memoboxHeight = mbxSelector.height();

    if (textAreaHeight + memotopHeight + 40 > memoboxHeight) {
        mbxSelector.css("height", textAreaHeight + memotopHeight + 40)
    } else if (textAreaHeight < memoboxHeight && memoboxHeight >= 348) {
    	mbxSelector.css("height", textAreaHeight + memotopHeight + 60)
    }
}

function autoResizeTextAreaAtList(){
    var memoText = $(this).val();
    var NumberOfEnters = memoText.split("\n").length + 1;
    if (NumberOfEnters == 1) {
        $(this).attr('rows', 2)
    } else {
        $(this).attr('rows', NumberOfEnters)
    }
    var defaultTextAreaHeight = 52;
    var appendTextAreaHeight = 26*(NumberOfEnters-1);
    $(this).closest('.memoContent').css('height', defaultTextAreaHeight+appendTextAreaHeight)
    }

/* rgb2hex function */
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function targetPrint(e){
	console.log(e.which);
}


$('body').keypress(function(e){
	console.log(e.which);
	// ctrl + q = 17;
});

$('body').mouseup(function(e){
	console.log(e.which);
	console.log(e.target);
})

/* saveMemoProperties function */
function saveMemoProperties(e){
	
	if($(this).hasClass('favorites')|| $(this).hasClass('delete'))
		return false;
	
	var bgColor = mbxSelector.css('background-color');
	var favColor = mbxSelector.find('.favorites').css('color');
	var locText = mbxSelector.find('.lock').text();
	var MEMO_DATE = mbxSelector.find('.MEMO_DATE').text();
	
	if (favColor == "#fa8072")
		var fav = 'Y';
	else 
		var fav = 'N';
	
	if (locText == "lock")
		var loc =  'Y';
	else
		var loc = 'N';

	/* 객체에 저장된 모든 style 정보를 불러오고 이 값들을 memoObj라는 변수로 객체화 */
	var memoObj = {
			"USER_EMAIL" : $('#USER_EMAIL').text(),
			"MEMO_NUM" : mbxSelector.find(".MEMO_NUM").val(),
			"MEMO_SUB" : $('#MEMO_SUB').text(),
			"MEMO_POSITION" : "ABSOLUTE",
			"MEMO_TOP" : mbxSelector.css('top'),
			"MEMO_LEFT" : mbxSelector.css('left'),
			"MEMO_COLOR" : bgColor,
			"MEMO_WIDTH" : mbxSelector.css('width'),
			"MEMO_HEIGHT" : mbxSelector.css('height'),
			"MEMO_ZID" : 1000,
			"MEMO_TEX" : mbxSelector.find('textarea').val(),
			"MEMO_DATE" : MEMO_DATE,
			"MEMO_FAV" : fav,
			"MEMO_LOC" : loc        			
			}
	
	console.log(memoObj);

	$.ajax({
		url : "saveMemoProperties",
		method : "POST",
		data : memoObj,
		success : function(result){
			if (result.includes("true"))
				console.log("success")
			 else 
				console.log("failed")
		}
	})
}

/* adjustMemoboxzindex function */
function adjustMemoboxzindex(){
    var memoboxAll = $('.memobox');

    $.each(memoboxAll, function(index){
        if ($(this).not($(memoboxAll[index]))){
            var zidEach = $(memoboxAll[index]).css("z-index");
            $(memoboxAll[index]).css("z-index", zidEach-1);
            } // if end
        })// each end
}

/* lockEventAdd function */
function lockEventAdd() {
	
	$(this).css('cursor', 'pointer');
	
	var MEMO_NUM = $(this).closest('.memobox').find('.MEMO_NUM').val();
    
    if ($(this).text().search('open') == 5){
        
        var modalHeaderText = "메모를 잠그시려면 이 메모를 간략하게 나타낼 키워드를 입력하세요";
        var modalBodyAssemble = "<div class = 'form-group row'>"
        					  + "<span style='display:none;' class='MEMO_LOC'></span>"
        					  + "<span style='display:none;' class='LOCK_MEMO_NUM'></span>"
        					  + "<label class='col-sm-4 col-form-label modal-title' for='keyword'>잠금 키워드</label>"
        					  + "<input class='col-sm-6 form-control MEMO_KEYW' type='text' maxlength='20'></div>"
							  + "<button type='button' data-dismiss ='modal' class='btn btn-lock float-right'>잠금</button>";
        
        $('.lock-modal-header').text(modalHeaderText);
        $('.lock-modal-body').html(modalBodyAssemble);
        $('.MEMO_LOC').text('Y');
        $('.LOCK_MEMO_NUM').text(MEMO_NUM);
        $('.btn-lock').on('click', setMemoLockAndUnlock);
        $('#ModalForLock').modal();
        
               
    } else {
        
        var modalHeaderText = "이 메모를 잠금해제 하시려면 계정 비밀번호를 입력하세요";
        var modalBodyAssemble = "<div class='form-group row'>"
        					  + "<span style='display:none;' class='MEMO_LOC'></span>"
        					  + "<span style='display:none;' class='LOCK_MEMO_NUM'></span>"
        					  + "<label class='col-sm-4 col-form-label modal-title' for='password'>패스워드</label>"
        					  + "<input class='col-sm-6 form-control MEMO_KEYW' id='password' type='password' maxlength='20'></div>"
							  + "<button type='button' data-dismiss ='modal' class='btn btn-unlock float-right'>잠금해제</button>";
        
        $('.lock-modal-header').text(modalHeaderText);
        $('.lock-modal-body').html(modalBodyAssemble);
        $('.MEMO_LOC').text('N');
        $('.LOCK_MEMO_NUM').text(MEMO_NUM);
        $('.btn-unlock').on('click', setMemoLockAndUnlock);
        $('#ModalForLock').modal();
        
    }
}

function setMemoLockAndUnlock(){
	btnText = $(this).text();
	keyword = $('.MEMO_KEYW').val();
	
	MEMO_NUM = $('.LOCK_MEMO_NUM').text();
	memoColor = $('.MEMO_NUM[value="'+MEMO_NUM+'"').closest('.memobox').css('background-color');
	
	var memoObj = { "MEMO_NUM" : parseInt(MEMO_NUM),
					"USER_EMAIL" : $("#USER_EMAIL").text(),
					"MEMO_LOC" : $('.MEMO_LOC').text(),
					"MEMO_KEYW" : keyword
					}
	console.log(memoObj);

	 $.ajax({
     	url : "setMemoLockAndUnlock",
     	method : "POST",
     	dataType : "JSON",
     	data : memoObj,
     	success : function(result){
     		console.log(result);
     		if(btnText == "잠금"){
     			$('.MEMO_NUM[value='+parseInt(MEMO_NUM)+']').closest('.memobox').find('.lock').text('lock')
	     		    	   		 							.closest('.memobox').find('.lock').attr('title', '잠금 해제')
	     		    	   		 							.closest('.memobox').find('.memoContent').text(keyword);
     		} else {
     			var textarea = "<textarea class = 'memotext form-control' "
     						 + "style='overflow-y:hidden; resize:none; border: none; background-color:"+memoColor+";'>";
     			$('.MEMO_NUM[value='+parseInt(MEMO_NUM)+']').closest('.memobox').find('.lock').text('lock_open')
     													    .closest('.memobox').find('.lock').attr('title', '메모 잠금')
     													    .closest('.memobox').find('.memoContent').html(textarea)
     													    .closest('.memobox').find('.memotext').val(result);

     		}
     	}        	
     })
}

/* favoEventAdd function */
function favoEventAdd() {
	var sectionName = $("#MEMO_SUB").text();
	var favIconSelect = $(this).closest('.memobox').find('favorites');
		favIconSelect.css('cursor', 'pointer');
    if (favIconSelect.css('color') == "rgb(33, 37, 41)") {
    	favIconSelect.css('color', 'rgb(250, 128, 114)')
        	   .attr('title', '보관 해제');
        var fav = 'Y';
    } else if (favIconSelect.css('color') == "rgb(250, 128, 114)") {
    		   favIconSelect.css('color', 'rgb(33, 37, 41)')
    		   				.attr('title', '메모 보관');
        var fav = 'N';
        if(sectionName == "IMPORTANT")
		   mbxSelector.remove();
    }
    
    var memoObj = {
    		"USER_EMAIL" : $("#USER_EMAIL").text(),
    		"MEMO_NUM" : $(this).closest('.memobox').find('.MEMO_NUM').val(),
    		"MEMO_SUB" : "MEMO_FAV",
    		"MEMO_FAV" : fav
     	};
    
    console.log(memoObj);
    
    $.ajax({
    	url : "setMemoFavorite",
    	data : memoObj,
    	type : "POST",
    	success :
    		function(result){
    			console.log("successed");
    	}
    	
    })
}

function deleteEventAdd(e) {
    $(this).css('cursor', 'pointer');
   
    var sectionName = $('#MEMO_SUB').text();
    var MEMO_NUM = $(this).closest('.memobox').find('.MEMO_NUM').val();
    var deleteURL = "moveToTrashBackAndForth";
    
   	if(sectionName == "TRASH" && $(this).hasClass('delete'))
   		var deleteURL = "deleteMemo"; // 완전삭제
   	else if (sectionName == "TRASH" && $(this).hasClass('restore'))
   		var MEMO_TRA = "N";
    else
   		var MEMO_TRA = "Y";
   	
   	var memoObj = {"USER_EMAIL" : $('#USER_EMAIL').text(),
   				   "MEMO_NUM" : MEMO_NUM,
   				   "MEMO_SUB" : "MEMO_TRA",
	               "MEMO_TRA" : MEMO_TRA
   	}
   	
    $.ajax({
        url : deleteURL,
        data : memoObj,
        method : "POST",
        success : function(rdata){
        	var windowWidth = $(window).width();
        	if (windowWidth > 900){
        		$(this).closest('.memobox').remove();
        		return false;
        	} else if (windowWidth <= 900){
        		var memotopObjSelect = $(this).closest('.memobox');
        		var memocontObjSelect = $(memotopObjSelect.next());
        		var mergeMemo = $.merge(memotopObjSelect, memocontObjSelect);
        			mergeMemo.remove();
        		return false;
        	}
        }// success end 
    })// ajax end
}

function addSearchMemoEvent(){
    var search_word = $('.search_input').val();
    console.log(search_word);
    var memoObj = {
	          "USER_EMAIL" : $('#USER_EMAIL').text(),                 
	          "MEMO_TEX" : search_word
	       };
    console.log(memoObj);
    
    if(search_word.length > 0){
 
	    $.ajax({
	       url :"searchMemo",
	       dataType:"JSON",
	       data : memoObj,     
	       type: "POST",
	       success :function(rdata){
	    	   
	    console.log(rdata);
	       
	       var dropdown = $('.search-modal-body');
	       	   dropdown.children().remove();
	       
	       	if(rdata.length == 0){
	             $('input[name=SearchMemo]').val('찾는 메모 없음');
	           return false; 
	           
	       	} else {
	    	   
	       	  var search_result = "<tbody>";
		       $.each(rdata, function(index){
		    	   var Memolist = rdata[index];
		    	   console.log(Memolist);
		    	   
		    	   	  
		    	   if (Memolist.MEMO_TEX.length > 10)
		    		   MEMO_TEX = Memolist.MEMO_TEX.substring(0,10) + "...";
		    	   else
		    		   MEMO_TEX = Memolist.MEMO_TEX;
		    	   
		    	   var MEMO_SUB = sectionTranslateENtoKR(Memolist.MEMO_SUB);
		    	   
		    	   search_result += "<tr class = 'search_result'><td><input type = 'hidden' class = 'SEARCH_MEMO_NUM' value = "+Memolist.MEMO_NUM+">"
		    	   				 +  "<span data-dismiss ='modal'>메모 내용 : " + MEMO_TEX + "&nbsp;&nbsp;"
		    	   				 +  "메모 위치 : " + MEMO_SUB+ "</span></td></tr>";
		    	   console.log(search_result);
		    	   
		       })
		       search_result += "</tbody>";
	       	   dropdown.append(search_result);
		       var searchResultSet = $('.search_result')
		       $.each(searchResultSet, function(index){
		    	   $(searchResultSet[index]).click(memoSearchRemove);
		       })
		       $('#ModalForSearch').modal();
	       	}
	       }//success end
	    });//ajax end
 } else {
    alert('검색어를 입력해 주세요');
    return false;
 }
}

function memoSearchRemove(e){
	var getSearchedMEMO_NUM = $(this).children().find('.SEARCH_MEMO_NUM').val();
	console.log('Searched MEMO_NUM : '+ getSearchedMEMO_NUM);
	var allMemoSelect = $('.MEMO_NUM');
 
	if($('.MEMO_NUM[value='+getSearchedMEMO_NUM+']')){
		 $.each(allMemoSelect, function(index, e){
			 var eachMemo = $(allMemoSelect[index]);
			 if (eachMemo.val() != getSearchedMEMO_NUM){
				 eachMemo.closest('.memobox').css('display', 'none');
			 }
		 })
		$('.search-modal-body').children().remove();
	    $('#ModalForSearch').click();   
	 	};
	}

/* memoColorChange Function*/
function memoColorChange(e){
	var mbxSelector = $(this).closest('.memobox');
	var MEMO_NUM = mbxSelector.find('.MEMO_NUM').val();
	var colorpadTop = (e.clientY + 20) + "px";
	var colorpadleft = (e.clientX - 100) + "px";
	
    if($('.colorpad-menu').css('display') == 'none'){
        $('.colorpad-menu').css({'display':'inline-block',
                                'position' : 'absolute',
                                'top' : colorpadTop,
                                'left' : colorpadleft
                                });
        $('.COLOR_MEMO_NUM').text(MEMO_NUM);
    } else {
        $('.colorpad-menu').css('display', 'none')
    }    
}

function colorPicking(){
	var rgbcode = $(this).css('background-color');
    var hexcode = rgb2hex(rgbcode);
    var MEMO_NUM = parseInt($('.COLOR_MEMO_NUM').text());
    var findMemobox = $('.MEMO_NUM[value ="'+MEMO_NUM+'"]').closest('.memobox');
    	findMemobox.css('background-color', hexcode)
    			   .find('.memotext').css('background-color', hexcode);
    var memoObj = {"USER_EMAIL" : $("#USER_EMAIL").text(),
    			   "MEMO_NUM" : MEMO_NUM,
    			   "MEMO_COLOR" : $(this).css('background-color')};
    
    console.log(memoObj);
    	$.ajax({
    		url : "setMemoColor",
    		method : "POST",
    		data : memoObj,
    		success : function(result){
    			if(result == "true")
    				$('.colorpad-menu').css('display', 'none');
    			else
    				alert('메모 색상을 변경하는 데 오류가 발생했습니다. 잠시 후에 다시 시도해주세요.');
    		}
    	})
   
}
$('.memoAlineBtn').on("change",function(){
	if ($('.toggle').eq(0).hasClass('btn-dark'))
		autoMemoAlign();
	else if ($('.toggle').eq(0).hasClass('btn-success'))
		cancelMemoAlign();
})

/* Auto Memo Align */
function autoMemoAlign(){
	var allMemoboxSelect = $('.memobox');
	var windowSize = window.innerWidth;
	
	var memosInOneRow = 7;
	if (windowSize < 1500 && windowSize >= 1300)
		memosInOneRow = 6;
	else if (window.innerWidth < 1300 && window.innerWidth >= 1100)
		memosInOneRow = 5;
	else if (window.innerWidth < 1100)
		memosInOneRow = 4;
	
	allMemoboxSelect.css({"width":"200px", "height": "150px"})
	$.each(allMemoboxSelect, function(index){
		var eachMemobox = allMemoboxSelect[index];
		var left = 10 + 215*(index%memosInOneRow);
		var top = 100 + (165*(Math.floor(index/memosInOneRow)));
		$(eachMemobox).css({"position" : "absolute", "top" : top, "left" : left});
		$(eachMemobox).find('.memotext').attr('rows', 2);
	})
}

function cancelMemoAlign(){
	var USER_EMAIL = $('#USER_EMAIL').text();
	var MEMO_SUB = $('#MEMO_SUB').text();
	var memoObj = {"USER_EMAIL" : USER_EMAIL, "MEMO_SUB" : MEMO_SUB};
	
	$.ajax({
		url : "getSectionMemoList",
		data : memoObj,
		dataType : "JSON",
		method : "POST",
		success : function(rdata){
			console.log("data acheived");
			putMemosAtMemoContainer(rdata);
		}
	})
}

/* Section Translate */
	function sectionTranslateENtoKR(String) {
		switch (String) {
			case "STUDY":
				section_text = "공부";
				break;
			case "HEALTH":
				section_text = "운동";
				break;
			case "MONEY":
				section_text = "가계부";
				break;
			default:
				section_text = "";
		}
		return section_text;
	}
	
	function sectionTranslateKRtoEN(String) {
		switch (String) {
			case "공부":
				section_text = "STUDY";
				break;
			case "운동":
				section_text = "HEALTH";
				break;
			case "가계부":
				section_text = "MONEY";
				break;
			default:
				section_text = "";
		}
		return section_text;
	}

/* addEventsOnPage function */
function addAllEventsOnPage(e){
	
	navbarAddEvent(); 
	$(window).resize(navbarResizingEvent);
	var pageWidth = window.innerWidth;
	var firstRow = $('.first-row td');
    $.each(firstRow, function(index){
    	if(index != 9)
    		$(firstRow[index]).on('click', addSectionChangeEvent);
    })
    $('.lock')        .on('click', lockEventAdd);
    $('.favorites')   .on('click', favoEventAdd);           
    $('.delete')      .on('click', deleteEventAdd);
    $('.color').on('click', memoColorChange);
    $('.colorpad').on('click', colorPicking);
    $("[data-toggle='tooltip']").tooltip();
    
    $('.memobox').draggable()
			     .resizable({
			             maxWidth: pageWidth,
			             minWidth: 185,
			             minHeight: 140
			     })
			     .one('click', addTextArea)
			     .mouseup(function(){
			    	 adjustMemoboxzindex();
			    	 saveMemoProperties();
			     })
			     .mousedown(bringFront)
	$('.memotext').keydown(autoResizeTextArea);
    $('.search-icon').on('click', addSearchMemoEvent);
}

})