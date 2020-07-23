<<<<<<< HEAD
/* 파일명 : WeMo_Main_Functions
 * 저장위치 : resources/js/WeMo_Main_Functions.js
 * 태그(헤드) : <script src = "resources/js/WeMo_Main_Functions.js"></script>  
 *  */

$(function(){
	
	addAllEventsOnPage();
	if($(window).width() < 900)
		navbarResizingEvent();
	
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
function navbarResizingEvent(e){
		var clickTarget = e.target;
		if ($(clickTarget).hasClass('ui-resizable-handle')||$(clickTarget).hasClass('ui-draggable-handle'))
			return false;
		var sectionCheck = $('#MEMO_SUB').text();
		if (sectionCheck == "ANALYSIS" || sectionCheck == "CALENDAR" || sectionCheck =="SETTING")
			return false;
		
		var isChecked = ""
			if ($('.toggle').eq(0).hasClass('btn-dark'))
				isChecked = "checked";
    	var pageWidth = $(window).width();
        $('.memobox').resizable({ minWidth: 185, minHeight: 140 })
        
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
                          + '<input type="checkbox" class="memoAlignBtn" style = "width:120px;" '
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
            $('.memoAlignBtn').bootstrapToggle();
            $('div[data-toggle="toggle"]:eq(0)').on("change",function(){
            	if ($('.toggle:eq(0)').hasClass('btn-dark'))
            		autoMemoAlign();
            	else if ($('.toggle:eq(0)').hasClass('btn-success'))
            		cancelMemoAlign();
            })
        
        } else if (pageWidth <= 900) {
        	
            var mobileNav = '<nav class="navbar navbar-light bg-light">'
            			  + '<img src="resources/image/WemoLogo.png" width="100px">'
            			  + '<span class="material-icons search-icon" style="line-height:24pt;">search<span>&nbsp;'
            			  + '<input type="text" class="search_input float-right"></nav>'
            			  + '<table class="table table-borderless mobile-nav">'            			  
                          + '<tbody id ="mobile-tbody">'
                          + '<tr class="mobile-row"><td class="menu-study mobile-menu">공부</td></tr>'
                          + '<tr class="mobile-row"><td class="menu-health mobile-menu">운동</td></tr>'
                          + '<tr class="mobile-row"><td class="menu-money mobile-menu">가계부</td></tr>'
                          + '<tr class="mobile-row"><td class="menu-calendar mobile-menu">캘린더</td></tr>'
                          + '<tr class="mobile-row"><td class="menu-important mobile-menu">보관함</td></tr>'
                          + '<tr class="mobile-row"><td class="menu-trash mobile-menu">휴지통</td></tr>'
                          + '<tr class="mobile-row"><td class="menu-analysis mobile-menu">통계</td></tr>'
                          + '<tr class="mobile-row"><td class="menu-setting mobile-menu">설정</td></tr>'
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
            $('.listedMemoAddBtn').on('click', newListedMemoAppend);            
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
    	 console.log("sectionSetting() 실행");
    	 sectionSetting();
    	 return false;
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
	    		else if (windowWidth <= 900)
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
			
			var MEMO_TEX = Memolist.MEMO_TEX;
    		if (typeof MEMO_TEX == undefined){
    			MEMO_TEX = "";
    		} else { 
    			if (MEMO_TEX.includes("\n"))
    				var textareaRows = MEMO_TEX.split("\n").length + 1;
    			else
    				var textareaRows = 2;
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
    			var locContext = "<textarea class = 'memotext form-control' "
    							   + "style = 'overflow-y:hidden; resize:none; "
    							   + "background-color:" + Memolist.MEMO_COLOR
    							   + "; border: none' rows ="+textareaRows+">"
    							   + MEMO_TEX +"</textarea>"
    		} else {
    			var locText = 'lock';
    			var locTitle = '잠금 해제';
    			var locContext = Memolist.MEMO_KEYW;
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
	        + "<div class='container memoContent'>"+locContext+"</div></form></div>";
	    
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
					 .resizable({minWidth: 185, minHeight: 140})
	    			 .one('click', addTextArea)
	    			 .mouseup(function(e){
	    				 var target = e.target;
				    	 adjustMemoboxzindex();
				    	 saveMemoProperties(target);
				     })           
	    			 .mousedown(bringFront)
}

/* listingMemosAtMemoContainer (List Type) */
function listingMemosAtMemoContainer(rdata){
	$('.memoContainer').empty();
	$('.memoContainer').html("<ul class = 'list-group listContainer'></ul>");
	
	var isNormalSection = sectionTranslateENtoKR($('#MEMO_SUB').text());
	if (isNormalSection == "공부" || isNormalSection == "운동" || isNormalSection == "가계부"){
		var row4newListedMemo = "<div class='list-group'><li class='memobox memobox-list list-group-item list-group-item-action listedMemoAddBtn'>"
			  				  + "<span>새 메모 쓰기</span>"
			  				  + "<span class='material-icons float-right' data-toggle ='tooltip' title='새 메모 추가'>add_box</span></li>";
	
		$('.listContainer').append(row4newListedMemo);	
		$('.listedMemoAddBtn').css('vertical-align', 'middle')
							  .on('click', newListedMemoAppend);
	}
	$.each(rdata, function(index){
	var Memolist = rdata[index];
	var thisSection = $('#MEMO_SUB').text();
	var section_text = sectionTranslateENtoKR(thisSection);
	var restoreIcon = "";
		if (thisSection == "TRASH"){
			restoreIcon = "<span class='material-icons float-right restore' "
						+ "data-toggle='tooltip' title ='메모 복구'>restore</span>";
		}
		
		if (typeof Memolist.MEMO_TEX == undefined){
			MEMO_TEX = "";
		} else { 
			MEMO_TEX = Memolist.MEMO_TEX;
			var textareaRows = MEMO_TEX.split("\n").length + 1;
		}
	
		if(Memolist.MEMO_FAV == 'N'){
			var favStyle = 'rgb(73, 80, 87)';
			var favTitle = '메모 보관';
		} else if (Memolist.MEMO_FAV == 'Y') {
			var favStyle = 'rgb(250, 128, 114)';
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
			var locContext = "<textarea class='memotext' style='margin:1em; overflow-y:hidden; "
						   + "resize:none; background-color:"+Memolist.MEMO_COLOR+"; "
						   + "border:none; width:90%;' rows="+textareaRows+">"
						   + Memolist.MEMO_TEX+"</textarea>"
		} else {
			var locText = 'lock';
			var locTitle = '잠금 해제';
			var locContext = "메모 잠금 키워드 :"+Memolist.MEMO_KEYW;
		}	
	
	var memolistCreate
			= "<div class='list-group list-group-div'><li class='memobox memobox-list list-group-item list-group-item-action' style='background-color:"+Memolist.MEMO_COLOR+"'>"
            + "<input type='hidden' class='MEMO_NUM' name='MEMO_NUM' value="+Memolist.MEMO_NUM+">"
            + "<span class='MEMO_DATE'>"+Memolist.MEMO_DATE+"&nbsp;&nbsp;</span>"
            + "<span class='section-name'>["+section_text+"]</span>" 
            + "<span class='material-icons delete float-right' data-toggle='tooltip' "
            + "title ='"+traTitle+"'>delete</span>"
            + restoreIcon
            + "<span class='material-icons favorites float-right' data-toggle='tooltip' "
            + "title ='"+favTitle+"' style='color:"+favStyle+"'>stars</span>"
            + "<span class='material-icons float-right lock' data-toggle='tooltip' title='"+locTitle+"'>"+locText+"</span>"
            + "<span class='material-icons float-right color' data-toggle ='tooltip' title='메모 색 변경'>color_lens</span></li>"
            + "<li class='memoContent memoContent-list' style='display:none; background-color:"+Memolist.MEMO_COLOR+"';>"
            + locContext + "<button type='button' class='btn listedMemoSaveBtn float-right'>저장</button></li></div>"
    
    $('.listContainer').append(memolistCreate);
       	    
	})// $.each end      
	$('.lock').on('click', lockEventAdd);
	$('.favorites').on('click', favoEventAdd);
	$('.delete').on('click', deleteEventAdd);
	$('.restore').on('click', deleteEventAdd);
	$('.color').on('click', memoColorChange);
    $('.colorpad').on('click', colorPicking);
    $("[data-toggle='tooltip']").tooltip();
    $('.memobox').on('click', function(){
    				 $(this).closest('.list-group').find('.memoContent').slideToggle('fast');
    			 	})
    			 .css("cursor", "pointer");
    $('.memotext').on('keyup', autoResizeTextAreaAtList);
    $('.listedMemoSaveBtn').on('click', function(e){
						 	   var target = e.target;
						 	   adjustMemoboxzindex();
						 	   saveMemoProperties(target);
    						});
    $('.listContainer').sortable();
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

function sectionSetting(){
	
	var memberObj = {
    		"USER_EMAIL" : $('#USER_EMAIL').text()
    	};
	
	$.ajax({
		url : "getMyAccountDetail",
		data : memberObj,
		dataType : "JSON",
		method : "POST",
		success : function(rdata){
			
			var USER_PASS = rdata.USER_PASS;
			var passSmallText = "비밀번호는 영문/숫자로 8자 이상 입력해주세요.";
			var isSNSID = ""
			if(rdata.AUTH_TYPE == 'NAVER' || rdata.AUTH_TYPE == 'KAKAO'){
				passSmallText = "SNS로 로그인하시면 비밀번호를 설정하지 않으셔도 됩니다.";
				USER_PASS = "";
				isSNSID = "readonly";
			}
			
			var settingPageBuilder
			= "<div class='container setting-pad'><form class='setting-form'><div class='form-group'>"
		    + "<label class='setting-label' for='USER_EMAIL'>이메일 주소</label>"
		    + "<input type='email' class='form-control form-control-lg setting-input' name='USER_EMAIL' value='"+rdata.USER_EMAIL+"' readonly>"
		    + "<small class='form-text text-muted'>가입하실 때 입력하신 이메일 주소는 변경하실 수 없습니다.</small></div>"
		    + "<div class='form-row'><div class='col'><label class='setting-label' for='USER_PASS'>비밀번호</label>"
		    + "<input type='password' class='form-control form-control-lg setting-input' name='USER_PASS' value='"+USER_PASS+"'"+isSNSID+">"
		    + "<small class='form-text text-muted'>"+passSmallText+"</small></div>"
		    + "<div class='col'><label class='setting-label' for='USER_PASS_CONFIRM'>비밀번호 확인</label>"
		    + "<input type='password' class='form-control form-control-lg setting-input' name='USER_PASS_CHECK'"+isSNSID+">"
		    + "<small class='form-text text-muted'>비밀번호를 변경하고자 하실 때만 입력해주세요.</small></div></div><br>"
		    + "<div class='form-group'><label class='setting-label' for='autocomplete1'>사용자 지정 자동완성폼1</label>"
		    + "<textarea class='form-control form-control-lg setting-input' rows='4' style='overflow-y:hidden; resize:none;'>"+rdata.USER_FORM1+"</textarea>"
		    + "<small class='form-text text-muted'>자주 사용하는 문구 등을 자동완성 폼으로 설정하세요.</small></div>"
		    + "<div class='form-group'><label class='setting-label' for='autocomplete2'>사용자 지정 자동완성폼2</label>"
		    + "<textarea class='form-control form-control-lg setting-input' rows='4' style='overflow-y:hidden; resize:none;'>"+rdata.USER_FORM2+"</textarea>"
		    + "<small class='form-text text-muted'>자동완성 폼은 메모장 안에서 Ctrl+SpaceBar(1번), Ctrl+Q(2번), Ctrl+B(3번)로 불러올 수 있습니다.</small></div>"
		    + "<div class='form-group'><label class='setting-label' for='autocomplete3'>사용자 지정 자동완성폼3</label>"
		    + "<textarea class='form-control form-control-lg setting-input' rows='4' style='overflow-y:hidden; resize:none;'>"+rdata.USER_FORM3+"</textarea>"
		    + "<small class='form-text text-muted'>자동완성 폼은 최대 세 개까지 등록하실 수 있습니다.</small></div>"
		    + "<div class='form-group'><button type='button' class='btn settingConfirmBtn float-right'>설정 저장하기</button></div></form></div>"
		    
		    $('.memoContainer').html(settingPageBuilder);
		    $('.settingConfirmBtn').on('click', saveUserSettingEvent);
			
		}
	})
	
	
	
}

function newListedMemoAppend(){
	console.log("newListedMemoAppend() 실행")
	var section_translation = sectionTranslateENtoKR($('#MEMO_SUB').text());
    
    var memoObj = {
    		"USER_EMAIL" : $('#USER_EMAIL').text(),
        	"MEMO_SUB" : $('#MEMO_SUB').text()        				
        	};
    
    $.ajax({
    	url : "newMemo",
    	method : "POST",
    	dataType : "JSON",
    	data : memoObj,
    	success :
    		function(rdata){
    		var Memo = rdata;
    		
    		var listedNewMemo
			= "<div class='list-group list-group-div'><li class='memobox memobox-list list-group-item list-group-item-action' style='background-color:"+Memo.MEMO_COLOR+"'>"
            + "<input type='hidden' class='MEMO_NUM' name='MEMO_NUM' value="+Memo.MEMO_NUM+">"
            + "<span class='MEMO_DATE'>"+Memo.MEMO_DATE+"&nbsp;&nbsp;</span>"
            + "<span class='section-name'>["+section_translation+"]</span>" 
            + "<span class='material-icons delete float-right' data-toggle='tooltip' "
            + "title ='휴지통으로'>delete</span>"
            + "<span class='material-icons favorites float-right' data-toggle='tooltip' "
            + "title ='메모 보관'>stars</span>"
            + "<span class='material-icons float-right lock' data-toggle='tooltip' title='메모 잠금'>lock_open</span>"
            + "<span class='material-icons float-right color' data-toggle ='tooltip' title='메모 색 변경'>color_lens</span></li>"
            + "<li class='memoContent memoContent-list' style='display:none; background-color:"+Memo.MEMO_COLOR+";'>"
            +"<textarea class='memotext' style='margin:1em; overflow-y:hidden; resize:none; background-color:"+Memo.MEMO_COLOR+"; "
			+ "border:none; width:90%;' rows='2'>새 메모</textarea>"
            + "<button type='button' class='btn listedMemoSaveBtn float-right'>저장</button></li></div>";
    	
    		$('.listContainer').append(listedNewMemo);
    		$('.list-group-div').last().css('display', 'none');
    	}
    })
    
    var triggerPageView = ".menu-" + $('#MEMO_SUB').text().toLowerCase();
	console.log(triggerPageView);
	$(triggerPageView).trigger('click');
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
        	
                var newMemobox = "<div class = 'container memobox memobox-normal shadow-sm' style = "+style+"><form>"
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
                               .resizable({minWidth: 185, minHeight: 140})
                             // 한 번만 실행되는 textarea 생성 이벤트를 .memobox 클래스에 추가
                               .one('click', findNewMemoBox, addTextArea)

                            // 나머지 아이콘들에 각각 이벤트 추가
                               .on('click', '.favorites', favoEventAdd)
                               .on('click', '.lock', lockEventAdd)
                               .on('click', '.delete', deleteEventAdd)
                               .on('click', '.color', memoColorChange)                              
                               .mouseup(function(e){
                            	   var target = e.target;
							    	 adjustMemoboxzindex();
							    	 saveMemoProperties(target);
							     })
                               .mousedown(bringFront) // mousedown end
                               adjustMemoboxzindex();            			
            		}
            	})
}

/* memoboxSelectFunction function */
function memoboxSelectFunction(targetObj){

	var clickTargetSelector = targetObj;
	
	if (clickTargetSelector.hasClass('memobox')){
		var memoboxSelector = clickTargetSelector;
		return memoboxSelector;
	} else {
		var memoboxSelector = clickTargetSelector.closest('.memobox');
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
    var plusSaveButtonAreaHeight = 100;
    $(this).closest('.memoContent').css('height', defaultTextAreaHeight+appendTextAreaHeight+plusSaveButtonAreaHeight)
    }

/* rgb2hex function */
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

$('body').keypress(function(e){
	var INPUT_KEYVALUE = e.which;
	if (e.which == 0 || e.which == 17 || e.which == 2){
		var memberObj = {"USER_EMAIL" : $('#USER_EMAIL').text()}
	$.ajax({
		url : "copyAutoCompleteForm",
		data : memberObj,
		dataType : "JSON",
		method : "POST",
		success : function(UserAutoForm){	
			var copyAutoForm ="";
			switch(INPUT_KEYVALUE){
				case 0 : copyAutoForm = UserAutoForm.USER_FORM1; break;
				case 17 : copyAutoForm = UserAutoForm.USER_FORM2; break;
				default : copyAutoForm = UserAutoForm.USER_FORM3; break; 
			}
			navigator.clipboard.writeText(copyAutoForm).then(() => {
			    console.log('success');
			})
			popupCopyAutoFormSuccess();
		}
		
	})
		
		
	}
});

/* saveMemoProperties function */
function saveMemoProperties(target){
	memoSelector = $(target).closest('.memobox-normal');
	listedMemoSelector = $(target).closest('.list-group');
	var windowWidth = $(window).width();
	if($(this).hasClass('favorites')|| $(this).hasClass('delete')||$(this).hasClass('color'))
		return false;
	
	if (windowWidth > 900){
		
		var favColor = memoSelector.find('.favorites').css('color');
		var locText = memoSelector.find('.lock').text();
		var MEMO_TEXT = memoSelector.find('textarea').val();	
		if (favColor == "rgb(250, 128, 114)") 
			var fav = 'Y';
		else 
			var fav = 'N';
		
		if (locText == "lock")
			var loc = 'Y';
		else
			var loc = 'N';
		
		if (typeof MEMO_TEXT == undefined)
			return false;
		
		var memoObj = {
				"USER_EMAIL" : $('#USER_EMAIL').text(),
				"MEMO_SUB" : $('#MEMO_SUB').text(),
				"MEMO_POSITION" : "ABSOLUTE",
				"MEMO_ZID" : 1000,
				"MEMO_NUM" : memoSelector.find(".MEMO_NUM").val(),
				"MEMO_TOP" : memoSelector.css('top'),
				"MEMO_LEFT" : memoSelector.css('left'),
				"MEMO_COLOR" : memoSelector.css('background-color'),
				"MEMO_WIDTH" : memoSelector.css('width'),
				"MEMO_HEIGHT" : memoSelector.css('height'),
				"MEMO_TEX" : MEMO_TEXT,
				"MEMO_DATE" : memoSelector.find('.MEMO_DATE').text(),
				"MEMO_FAV" : fav,
				"MEMO_LOC" : loc        			
				}
		
		var url = "saveMemoProperties";
		
	} else if (windowWidth <= 900) {
		
		var favColor = listedMemoSelector.find('.favorites').css('color');
		var locText = listedMemoSelector.find('.lock').text();
		var MEMO_DATE = listedMemoSelector.find('.MEMO_DATE').text().substring(0,10);
		var MEMO_TEXT = listedMemoSelector.find('textarea').val();
		
		if (typeof MEMO_TEXT == undefined)
			return false;
		
		if (favColor == "rgb(250, 128, 114)") 
			var fav = 'Y';
		else 
			var fav = 'N';
		
		if (locText == "lock")
			var loc = 'Y';
		else
			var loc = 'N';
		
		var memoObj = {
				"USER_EMAIL" : $('#USER_EMAIL').text(),
				"MEMO_SUB" : $('#MEMO_SUB').text(),
				"MEMO_NUM" : listedMemoSelector.find(".MEMO_NUM").val(),
				"MEMO_COLOR" : listedMemoSelector.find(".memobox-list").css('background-color'),
				"MEMO_ZID" : 1000,
				"MEMO_TEX" : MEMO_TEXT,
				"MEMO_DATE" : MEMO_DATE,
				"MEMO_FAV" : fav,
				"MEMO_LOC" : loc        			
				}
		
		var url = "saveListedMemoProperties";
		
	}

	/* 객체에 저장된 모든 style 정보를 불러오고 이 값들을 memoObj라는 변수로 객체화 */
	
	$.ajax({
		url : url,
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

	 $.ajax({
     	url : "setMemoLockAndUnlock",
     	method : "POST",
     	dataType : "JSON",
     	data : memoObj,
     	success : function(result){
     		console.log(result);
     		MEMO_TEXT = result;
	     	if ($(window).width() > 900){	
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
	     													    .closest('.memobox').find('.memotext').val(MEMO_TEXT);
	     		
	     		}
	     	} else if ($(window).width() <= 900) {
	     		if(btnText == "잠금"){
	     			$('.MEMO_NUM[value='+parseInt(MEMO_NUM)+']').closest('.list-group').find('.lock').text('lock')
		     		    	   		 							.closest('.list-group').find('.lock').attr('title', '잠금 해제')
		     		    	   		 							.closest('.list-group').find('.memoContent-list').html("메모 잠금 키워드 : " + keyword);
	     		
	     		} else {
	     			if (MEMO_TEX.includes("\n"))
	    				var textareaRows = MEMO_TEX.split("\n").length + 1;
	    			else
	    				var textareaRows = 2;
	     			var textarea = "<textarea rows='"+textareaRows+"' class = 'memotext form-control' "
	     						 + "style = 'margin:1em; overflow-y:hidden; resize:none; background-color:"+memoColor+"; border:none; width:90%;'>"
	     						 + MEMO_TEXT + "</textarea><button type='button' class='btn listedMemoSaveBtn float-right'>저장</button>";
	     			$('.MEMO_NUM[value='+parseInt(MEMO_NUM)+']').closest('.list-group').find('.lock').text('lock_open')
	     													    .closest('.list-group').find('.lock').attr('title', '메모 잠금')
	     													    .closest('.list-group').find('.memoContent-list').html(textarea);
	     		
	     		}
	     	}
     	}        	
     })
}

/* favoEventAdd function */
function favoEventAdd() {
	var sectionName = $("#MEMO_SUB").text();
	var favIconSelect = $(this);
		favIconSelect.css('cursor', 'pointer');
		
    if (favIconSelect.css('color') == "rgb(73, 80, 87)" 
    	|| favIconSelect.css('color') == "rgb(33, 37, 41)") {
    	favIconSelect.css('color', 'rgb(250, 128, 114)')
        	   		 .attr('title', '보관 해제');
        var fav = 'Y';
    } else if (favIconSelect.css('color') == "rgb(250, 128, 114)") {
    	var windowWidth = $(window).width();
    		if (windowWidth > 900){
    		   favIconSelect.css('color', "rgb(33, 37, 41)")
    		   				.attr('title', '메모 보관');
    		} else if (windowWidth <= 900){
    			favIconSelect.css('color', "rgb(73, 80, 87)")
    		   				.attr('title', '메모 보관');
    		}
        var fav = 'N';
        if(sectionName == "IMPORTANT")
		   $(this).closest('.memobox').remove();
    }
    
    var memoObj = {
    		"USER_EMAIL" : $("#USER_EMAIL").text(),
    		"MEMO_NUM" : $(this).closest('.memobox').find('.MEMO_NUM').val(),
    		"MEMO_SUB" : "MEMO_FAV",
    		"MEMO_FAV" : fav
     	};
 
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
        		var thisMemoSelector = ".MEMO_NUM[value='"+MEMO_NUM+"']";
        		$(thisMemoSelector).closest('.memobox').remove();
        		return false;
        	} else if (windowWidth <= 900){
        		var thisMemoSelector = ".MEMO_NUM[value='"+MEMO_NUM+"']";
        		var memotopObjSelect = $(thisMemoSelector).closest('.memobox');
        		var memocontObjSelect = $(memotopObjSelect.next());
        		var mergeMemo = $.merge(memotopObjSelect, memocontObjSelect);
        			mergeMemo.remove();
        			
        		return false;
        	}
        }// success end 
    })// ajax end
}

function saveUserSettingEvent(e){
    var popupBuilder = "<div class = 'container popup'>설정이 저장되었습니다!</div>"
    $('body').append(popupBuilder);
    $('.popup').css({
        "border-radius" : "10pt",
        padding : "15px 0px",
        "text-align" : "center",
        width : "200px",
        height : "60px",
        position:"absolute",
        top : e.pageY-30,
        left : e.pageX-280
    })
    
    var memberObj = {
    	"USER_EMAIL" : $('#USER_EMAIL').text(),
    	"USER_PASS" : $('input[name="USER_PASS"]').val(),
    	"USER_FORM1" : $('textarea:eq(0)').val(),
    	"USER_FORM2" : $('textarea:eq(1)').val(),
    	"USER_FORM3" : $('textarea:eq(2)').val()
    }
 
    $.ajax({
    	url : "saveUserSetting",
    	method : "POST",
    	data : memberObj,
    	dataType : "JSON",
    	success : function(result){
    		if (result == "true"){
    		 setInterval(function(){
    		        $('.popup').animate({opacity : "hide"})
    		    }, 2000)
    		}
    	},
    	error : function(){
    		setInterval(function(){
    			$('.popup').text("오류로 인해 설정을 저장하지 못했습니다.")
    			setInterval(function(){
    		        $('.popup').animate({opacity : "hide"})
    		    }, 2000)
    		})	
    	}
    })
}

function popupCopyAutoFormSuccess(){
	if ('.popup')
		$('.popup').remove();
    var popupBuilder = "<div class = 'container popup'><br>사용자 지정 자동완성폼이<br>클립보드에 복사 되었습니다.</div>"
    var halfSizeWindow = $(window).width()/3;
    $('body').append(popupBuilder);
    $('.popup').css({
        "text-align" : "center",
        "background-color" : "white",
        border : "2px solid black",
        "border-radius" : "0px 0px 10px 10px",
        width : "250px",
        height : "100px",
        position:"absolute",
        left : halfSizeWindow,
        top : "-1px"
    })
    
    $('.popup').slideDown("slow", function(){ $('.popup').delay(1000).slideUp("slow")})
    		    
}

function addSearchMemoEvent(){
    var search_word = $('.search_input').val();
    console.log(search_word);
    var memoObj = {
	          "USER_EMAIL" : $('#USER_EMAIL').text(),                 
	          "MEMO_TEX" : search_word
	       };
    
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
    	if($(window).width() > 900){
    	findMemobox.css('background-color', hexcode)
    			   .find('.memotext').css('background-color', hexcode);
    	} else if ($(window).width() <= 900){
    		var listedMemobox = $.merge($(findMemobox), $(findMemobox).next());
    		var plusTextarea = $.merge($(listedMemobox), $(findMemobox.next().find('textarea')));
    			plusTextarea.css('background-color', hexcode);
    	}
    		
    var memoObj = {"USER_EMAIL" : $("#USER_EMAIL").text(),
    			   "MEMO_NUM" : MEMO_NUM,
    			   "MEMO_COLOR" : $(this).css('background-color')};
    
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
			case "STUDY": section_text = "공부"; 	break;
			case "HEALTH": section_text = "운동"; break;
			case "MONEY": section_text = "가계부"; break;
			default: section_text = ""; break;
		}
		return section_text;
	}
	
	function sectionTranslateKRtoEN(String) {
		switch (String) {
			case "공부": 	section_text = "STUDY"; break;
			case "운동": section_text = "HEALTH"; break;
			case "가계부": section_text = "MONEY"; break;
			default: section_text = ""; break;
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
			     .resizable({ minWidth: 185, minHeight: 140 })
			     .one('click', addTextArea)
			     .mouseup(function(e){
			    	 var target = e.target;
			    	 adjustMemoboxzindex();
			    	 saveMemoProperties(target);
			     })
			     .mousedown(bringFront)
	$('.memotext').keydown(autoResizeTextArea);
    $('.search-icon').on('click', addSearchMemoEvent);
    $('div[data-toggle="toggle"]:eq(0)').on("change",function(){
    	if ($('.toggle:eq(0)').hasClass('btn-dark'))
    		autoMemoAlign();
    	else if ($('.toggle:eq(0)').hasClass('btn-success'))
    		cancelMemoAlign();
    })
}

=======
/* 파일명 : WeMo_Main_Functions
 * 저장위치 : resources/js/WeMo_Main_Functions.js
 * 태그(헤드) : <script src = "resources/js/WeMo_Main_Functions.js"></script>  
 *  */

$(function(){
	
	addAllEventsOnPage();
	if($(window).width() < 900)
		navbarResizingEvent();
	
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
function navbarResizingEvent(e){
		var clickTarget = e.target;
		if ($(clickTarget).hasClass('ui-resizable-handle')||$(clickTarget).hasClass('ui-draggable-handle'))
			return false;
		var sectionCheck = $('#MEMO_SUB').text();
		if (sectionCheck == "ANALYSIS" || sectionCheck == "CALENDAR" || sectionCheck =="SETTING")
			return false;
		
		var isChecked = ""
			if ($('.toggle').eq(0).hasClass('btn-dark'))
				isChecked = "checked";
    	var pageWidth = $(window).width();
        $('.memobox').resizable({ minWidth: 185, minHeight: 140 })
        
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
                          + '<input type="checkbox" class="memoAlignBtn" style = "width:120px;" '
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
            $('.memoAlignBtn').bootstrapToggle();
            $('div[data-toggle="toggle"]:eq(0)').on("change",function(){
            	if ($('.toggle:eq(0)').hasClass('btn-dark'))
            		autoMemoAlign();
            	else if ($('.toggle:eq(0)').hasClass('btn-success'))
            		cancelMemoAlign();
            })
        
        } else if (pageWidth <= 900) {
        	
            var mobileNav = '<nav class="navbar navbar-light bg-light">'
            			  + '<img src="resources/image/WemoLogo.png" width="100px">'
            			  + '<span class="material-icons search-icon" style="line-height:24pt;">search<span>&nbsp;'
            			  + '<input type="text" class="search_input float-right"></nav>'
            			  + '<table class="table table-borderless mobile-nav">'            			  
                          + '<tbody id ="mobile-tbody">'
                          + '<tr class="mobile-row"><td class="menu-study mobile-menu">공부</td></tr>'
                          + '<tr class="mobile-row"><td class="menu-health mobile-menu">운동</td></tr>'
                          + '<tr class="mobile-row"><td class="menu-money mobile-menu">가계부</td></tr>'
                          + '<tr class="mobile-row"><td class="menu-calendar mobile-menu">캘린더</td></tr>'
                          + '<tr class="mobile-row"><td class="menu-important mobile-menu">보관함</td></tr>'
                          + '<tr class="mobile-row"><td class="menu-trash mobile-menu">휴지통</td></tr>'
                          + '<tr class="mobile-row"><td class="menu-analysis mobile-menu">통계</td></tr>'
                          + '<tr class="mobile-row"><td class="menu-setting mobile-menu">설정</td></tr>'
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
            $('.listedMemoAddBtn').on('click', newListedMemoAppend);            
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
    	 console.log("sectionSetting() 실행");
    	 sectionSetting();
    	 return false;
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
	    		else if (windowWidth <= 900)
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
			
			var MEMO_TEX = Memolist.MEMO_TEX;
    		if (typeof MEMO_TEX == undefined){
    			MEMO_TEX = "";
    		} else { 
    			if (MEMO_TEX.includes("\n"))
    				var textareaRows = MEMO_TEX.split("\n").length + 1;
    			else
    				var textareaRows = 2;
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
    			var locContext = "<textarea class = 'memotext form-control' "
    							   + "style = 'overflow-y:hidden; resize:none; "
    							   + "background-color:" + Memolist.MEMO_COLOR
    							   + "; border: none' rows ="+textareaRows+">"
    							   + MEMO_TEX +"</textarea>"
    		} else {
    			var locText = 'lock';
    			var locTitle = '잠금 해제';
    			var locContext = Memolist.MEMO_KEYW;
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
	        + "<div class='container memoContent'>"+locContext+"</div></form></div>";
	    
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
					 .resizable({minWidth: 185, minHeight: 140})
	    			 .one('click', addTextArea)
	    			 .mouseup(function(e){
	    				 var target = e.target;
				    	 adjustMemoboxzindex();
				    	 saveMemoProperties(target);
				     })           
	    			 .mousedown(bringFront)
}

/* listingMemosAtMemoContainer (List Type) */
function listingMemosAtMemoContainer(rdata){
	$('.memoContainer').empty();
	$('.memoContainer').html("<ul class = 'list-group listContainer'></ul>");
	
	var isNormalSection = sectionTranslateENtoKR($('#MEMO_SUB').text());
	if (isNormalSection == "공부" || isNormalSection == "운동" || isNormalSection == "가계부"){
		var row4newListedMemo = "<div class='list-group'><li class='memobox memobox-list list-group-item list-group-item-action listedMemoAddBtn'>"
			  				  + "<span>새 메모 쓰기</span>"
			  				  + "<span class='material-icons float-right' data-toggle ='tooltip' title='새 메모 추가'>add_box</span></li>";
	
		$('.listContainer').append(row4newListedMemo);	
		$('.listedMemoAddBtn').css('vertical-align', 'middle')
							  .on('click', newListedMemoAppend);
	}
	$.each(rdata, function(index){
	var Memolist = rdata[index];
	var thisSection = $('#MEMO_SUB').text();
	var section_text = sectionTranslateENtoKR(thisSection);
	var restoreIcon = "";
		if (thisSection == "TRASH"){
			restoreIcon = "<span class='material-icons float-right restore' "
						+ "data-toggle='tooltip' title ='메모 복구'>restore</span>";
		}
		
		if (typeof Memolist.MEMO_TEX == undefined){
			MEMO_TEX = "";
		} else { 
			MEMO_TEX = Memolist.MEMO_TEX;
			var textareaRows = MEMO_TEX.split("\n").length + 1;
		}
	
		if(Memolist.MEMO_FAV == 'N'){
			var favStyle = 'rgb(73, 80, 87)';
			var favTitle = '메모 보관';
		} else if (Memolist.MEMO_FAV == 'Y') {
			var favStyle = 'rgb(250, 128, 114)';
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
			var locContext = "<textarea class='memotext' style='margin:1em; overflow-y:hidden; "
						   + "resize:none; background-color:"+Memolist.MEMO_COLOR+"; "
						   + "border:none; width:90%;' rows="+textareaRows+">"
						   + Memolist.MEMO_TEX+"</textarea>"
		} else {
			var locText = 'lock';
			var locTitle = '잠금 해제';
			var locContext = "메모 잠금 키워드 :"+Memolist.MEMO_KEYW;
		}	
	
	var memolistCreate
			= "<div class='list-group list-group-div'><li class='memobox memobox-list list-group-item list-group-item-action' style='background-color:"+Memolist.MEMO_COLOR+"'>"
            + "<input type='hidden' class='MEMO_NUM' name='MEMO_NUM' value="+Memolist.MEMO_NUM+">"
            + "<span class='MEMO_DATE'>"+Memolist.MEMO_DATE+"&nbsp;&nbsp;</span>"
            + "<span class='section-name'>["+section_text+"]</span>" 
            + "<span class='material-icons delete float-right' data-toggle='tooltip' "
            + "title ='"+traTitle+"'>delete</span>"
            + restoreIcon
            + "<span class='material-icons favorites float-right' data-toggle='tooltip' "
            + "title ='"+favTitle+"' style='color:"+favStyle+"'>stars</span>"
            + "<span class='material-icons float-right lock' data-toggle='tooltip' title='"+locTitle+"'>"+locText+"</span>"
            + "<span class='material-icons float-right color' data-toggle ='tooltip' title='메모 색 변경'>color_lens</span></li>"
            + "<li class='memoContent memoContent-list' style='display:none; background-color:"+Memolist.MEMO_COLOR+"';>"
            + locContext + "<button type='button' class='btn listedMemoSaveBtn float-right'>저장</button></li></div>"
    
    $('.listContainer').append(memolistCreate);
       	    
	})// $.each end      
	$('.lock').on('click', lockEventAdd);
	$('.favorites').on('click', favoEventAdd);
	$('.delete').on('click', deleteEventAdd);
	$('.restore').on('click', deleteEventAdd);
	$('.color').on('click', memoColorChange);
    $('.colorpad').on('click', colorPicking);
    $("[data-toggle='tooltip']").tooltip();
    $('.memobox').on('click', function(){
    				 $(this).closest('.list-group').find('.memoContent').slideToggle('fast');
    			 	})
    			 .css("cursor", "pointer");
    $('.memotext').on('keyup', autoResizeTextAreaAtList);
    $('.listedMemoSaveBtn').on('click', function(e){
						 	   var target = e.target;
						 	   adjustMemoboxzindex();
						 	   saveMemoProperties(target);
    						});
    $('.listContainer').sortable();
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

function sectionSetting(){
	
	var memberObj = {
    		"USER_EMAIL" : $('#USER_EMAIL').text()
    	};
	
	$.ajax({
		url : "getMyAccountDetail",
		data : memberObj,
		dataType : "JSON",
		method : "POST",
		success : function(rdata){
			
			var USER_PASS = rdata.USER_PASS;
			var passSmallText = "비밀번호는 영문/숫자로 8자 이상 입력해주세요.";
			var isSNSID = ""
			if(rdata.AUTH_TYPE == 'NAVER' || rdata.AUTH_TYPE == 'KAKAO'){
				passSmallText = "SNS로 로그인하시면 비밀번호를 설정하지 않으셔도 됩니다.";
				USER_PASS = "";
				isSNSID = "readonly";
			}
			
			var settingPageBuilder
			= "<div class='container setting-pad'><form class='setting-form'><div class='form-group'>"
		    + "<label class='setting-label' for='USER_EMAIL'>이메일 주소</label>"
		    + "<input type='email' class='form-control form-control-lg setting-input' name='USER_EMAIL' value='"+rdata.USER_EMAIL+"' readonly>"
		    + "<small class='form-text text-muted'>가입하실 때 입력하신 이메일 주소는 변경하실 수 없습니다.</small></div>"
		    + "<div class='form-row'><div class='col'><label class='setting-label' for='USER_PASS'>비밀번호</label>"
		    + "<input type='password' class='form-control form-control-lg setting-input' name='USER_PASS' value='"+USER_PASS+"'"+isSNSID+">"
		    + "<small class='form-text text-muted'>"+passSmallText+"</small></div>"
		    + "<div class='col'><label class='setting-label' for='USER_PASS_CONFIRM'>비밀번호 확인</label>"
		    + "<input type='password' class='form-control form-control-lg setting-input' name='USER_PASS_CHECK'"+isSNSID+">"
		    + "<small class='form-text text-muted'>비밀번호를 변경하고자 하실 때만 입력해주세요.</small></div></div><br>"
		    + "<div class='form-group'><label class='setting-label' for='autocomplete1'>사용자 지정 자동완성폼1</label>"
		    + "<textarea class='form-control form-control-lg setting-input' rows='4' style='overflow-y:hidden; resize:none;'>"+rdata.USER_FORM1+"</textarea>"
		    + "<small class='form-text text-muted'>자주 사용하는 문구 등을 자동완성 폼으로 설정하세요.</small></div>"
		    + "<div class='form-group'><label class='setting-label' for='autocomplete2'>사용자 지정 자동완성폼2</label>"
		    + "<textarea class='form-control form-control-lg setting-input' rows='4' style='overflow-y:hidden; resize:none;'>"+rdata.USER_FORM2+"</textarea>"
		    + "<small class='form-text text-muted'>자동완성 폼은 메모장 안에서 Ctrl+SpaceBar(1번), Ctrl+Q(2번), Ctrl+B(3번)로 불러올 수 있습니다.</small></div>"
		    + "<div class='form-group'><label class='setting-label' for='autocomplete3'>사용자 지정 자동완성폼3</label>"
		    + "<textarea class='form-control form-control-lg setting-input' rows='4' style='overflow-y:hidden; resize:none;'>"+rdata.USER_FORM3+"</textarea>"
		    + "<small class='form-text text-muted'>자동완성 폼은 최대 세 개까지 등록하실 수 있습니다.</small></div>"
		    + "<div class='form-group'><button type='button' class='btn settingConfirmBtn float-right'>설정 저장하기</button></div></form></div>"
		    
		    $('.memoContainer').html(settingPageBuilder);
		    $('.settingConfirmBtn').on('click', saveUserSettingEvent);
			
		}
	})
	
	
	
}

function newListedMemoAppend(){
	console.log("newListedMemoAppend() 실행")
	var section_translation = sectionTranslateENtoKR($('#MEMO_SUB').text());
    
    var memoObj = {
    		"USER_EMAIL" : $('#USER_EMAIL').text(),
        	"MEMO_SUB" : $('#MEMO_SUB').text()        				
        	};
    
    $.ajax({
    	url : "newMemo",
    	method : "POST",
    	dataType : "JSON",
    	data : memoObj,
    	success :
    		function(rdata){
    		var Memo = rdata;
    		
    		var listedNewMemo
			= "<div class='list-group list-group-div'><li class='memobox memobox-list list-group-item list-group-item-action' style='background-color:"+Memo.MEMO_COLOR+"'>"
            + "<input type='hidden' class='MEMO_NUM' name='MEMO_NUM' value="+Memo.MEMO_NUM+">"
            + "<span class='MEMO_DATE'>"+Memo.MEMO_DATE+"&nbsp;&nbsp;</span>"
            + "<span class='section-name'>["+section_translation+"]</span>" 
            + "<span class='material-icons delete float-right' data-toggle='tooltip' "
            + "title ='휴지통으로'>delete</span>"
            + "<span class='material-icons favorites float-right' data-toggle='tooltip' "
            + "title ='메모 보관'>stars</span>"
            + "<span class='material-icons float-right lock' data-toggle='tooltip' title='메모 잠금'>lock_open</span>"
            + "<span class='material-icons float-right color' data-toggle ='tooltip' title='메모 색 변경'>color_lens</span></li>"
            + "<li class='memoContent memoContent-list' style='display:none; background-color:"+Memo.MEMO_COLOR+";'>"
            +"<textarea class='memotext' style='margin:1em; overflow-y:hidden; resize:none; background-color:"+Memo.MEMO_COLOR+"; "
			+ "border:none; width:90%;' rows='2'>새 메모</textarea>"
            + "<button type='button' class='btn listedMemoSaveBtn float-right'>저장</button></li></div>";
    	
    		$('.listContainer').append(listedNewMemo);
    		$('.list-group-div').last().css('display', 'none');
    	}
    })
    
    var triggerPageView = ".menu-" + $('#MEMO_SUB').text().toLowerCase();
	console.log(triggerPageView);
	$(triggerPageView).trigger('click');
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
        	
                var newMemobox = "<div class = 'container memobox memobox-normal shadow-sm' style = "+style+"><form>"
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
                               .resizable({minWidth: 185, minHeight: 140})
                             // 한 번만 실행되는 textarea 생성 이벤트를 .memobox 클래스에 추가
                               .one('click', findNewMemoBox, addTextArea)

                            // 나머지 아이콘들에 각각 이벤트 추가
                               .on('click', '.favorites', favoEventAdd)
                               .on('click', '.lock', lockEventAdd)
                               .on('click', '.delete', deleteEventAdd)
                               .on('click', '.color', memoColorChange)                              
                               .mouseup(function(e){
                            	   var target = e.target;
							    	 adjustMemoboxzindex();
							    	 saveMemoProperties(target);
							     })
                               .mousedown(bringFront) // mousedown end
                               adjustMemoboxzindex();            			
            		}
            	})
}

/* memoboxSelectFunction function */
function memoboxSelectFunction(targetObj){

	var clickTargetSelector = targetObj;
	
	if (clickTargetSelector.hasClass('memobox')){
		var memoboxSelector = clickTargetSelector;
		return memoboxSelector;
	} else {
		var memoboxSelector = clickTargetSelector.closest('.memobox');
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
    var plusSaveButtonAreaHeight = 100;
    $(this).closest('.memoContent').css('height', defaultTextAreaHeight+appendTextAreaHeight+plusSaveButtonAreaHeight)
    }

/* rgb2hex function */
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

$('body').keypress(function(e){
	var INPUT_KEYVALUE = e.which;
	if (e.which == 0 || e.which == 17 || e.which == 2){
		var memberObj = {"USER_EMAIL" : $('#USER_EMAIL').text()}
	$.ajax({
		url : "copyAutoCompleteForm",
		data : memberObj,
		dataType : "JSON",
		method : "POST",
		success : function(UserAutoForm){	
			var copyAutoForm ="";
			switch(INPUT_KEYVALUE){
				case 0 : copyAutoForm = UserAutoForm.USER_FORM1; break;
				case 17 : copyAutoForm = UserAutoForm.USER_FORM2; break;
				default : copyAutoForm = UserAutoForm.USER_FORM3; break; 
			}
			navigator.clipboard.writeText(copyAutoForm).then(() => {
			    console.log('success');
			})
			popupCopyAutoFormSuccess();
		}
		
	})
		
		
	}
});

/* saveMemoProperties function */
function saveMemoProperties(target){
	memoSelector = $(target).closest('.memobox-normal');
	listedMemoSelector = $(target).closest('.list-group');
	var windowWidth = $(window).width();
	if($(this).hasClass('favorites')|| $(this).hasClass('delete')||$(this).hasClass('color'))
		return false;
	
	if (windowWidth > 900){
		
		var favColor = memoSelector.find('.favorites').css('color');
		var locText = memoSelector.find('.lock').text();
		var MEMO_TEXT = memoSelector.find('textarea').val();	
		if (favColor == "rgb(250, 128, 114)") 
			var fav = 'Y';
		else 
			var fav = 'N';
		
		if (locText == "lock")
			var loc = 'Y';
		else
			var loc = 'N';
		
		if (typeof MEMO_TEXT == undefined)
			return false;
		
		var memoObj = {
				"USER_EMAIL" : $('#USER_EMAIL').text(),
				"MEMO_SUB" : $('#MEMO_SUB').text(),
				"MEMO_POSITION" : "ABSOLUTE",
				"MEMO_ZID" : 1000,
				"MEMO_NUM" : memoSelector.find(".MEMO_NUM").val(),
				"MEMO_TOP" : memoSelector.css('top'),
				"MEMO_LEFT" : memoSelector.css('left'),
				"MEMO_COLOR" : memoSelector.css('background-color'),
				"MEMO_WIDTH" : memoSelector.css('width'),
				"MEMO_HEIGHT" : memoSelector.css('height'),
				"MEMO_TEX" : MEMO_TEXT,
				"MEMO_DATE" : memoSelector.find('.MEMO_DATE').text(),
				"MEMO_FAV" : fav,
				"MEMO_LOC" : loc        			
				}
		
		var url = "saveMemoProperties";
		
	} else if (windowWidth <= 900) {
		
		var favColor = listedMemoSelector.find('.favorites').css('color');
		var locText = listedMemoSelector.find('.lock').text();
		var MEMO_DATE = listedMemoSelector.find('.MEMO_DATE').text().substring(0,10);
		var MEMO_TEXT = listedMemoSelector.find('textarea').val();
		
		if (typeof MEMO_TEXT == undefined)
			return false;
		
		if (favColor == "rgb(250, 128, 114)") 
			var fav = 'Y';
		else 
			var fav = 'N';
		
		if (locText == "lock")
			var loc = 'Y';
		else
			var loc = 'N';
		
		var memoObj = {
				"USER_EMAIL" : $('#USER_EMAIL').text(),
				"MEMO_SUB" : $('#MEMO_SUB').text(),
				"MEMO_NUM" : listedMemoSelector.find(".MEMO_NUM").val(),
				"MEMO_COLOR" : listedMemoSelector.find(".memobox-list").css('background-color'),
				"MEMO_ZID" : 1000,
				"MEMO_TEX" : MEMO_TEXT,
				"MEMO_DATE" : MEMO_DATE,
				"MEMO_FAV" : fav,
				"MEMO_LOC" : loc        			
				}
		
		var url = "saveListedMemoProperties";
		
	}

	/* 객체에 저장된 모든 style 정보를 불러오고 이 값들을 memoObj라는 변수로 객체화 */
	
	$.ajax({
		url : url,
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

	 $.ajax({
     	url : "setMemoLockAndUnlock",
     	method : "POST",
     	dataType : "JSON",
     	data : memoObj,
     	success : function(result){
     		console.log(result);
     		MEMO_TEXT = result;
	     	if ($(window).width() > 900){	
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
	     													    .closest('.memobox').find('.memotext').val(MEMO_TEXT);
	     		
	     		}
	     	} else if ($(window).width() <= 900) {
	     		if(btnText == "잠금"){
	     			$('.MEMO_NUM[value='+parseInt(MEMO_NUM)+']').closest('.list-group').find('.lock').text('lock')
		     		    	   		 							.closest('.list-group').find('.lock').attr('title', '잠금 해제')
		     		    	   		 							.closest('.list-group').find('.memoContent-list').html("메모 잠금 키워드 : " + keyword);
	     		
	     		} else {
	     			if (MEMO_TEX.includes("\n"))
	    				var textareaRows = MEMO_TEX.split("\n").length + 1;
	    			else
	    				var textareaRows = 2;
	     			var textarea = "<textarea rows='"+textareaRows+"' class = 'memotext form-control' "
	     						 + "style = 'margin:1em; overflow-y:hidden; resize:none; background-color:"+memoColor+"; border:none; width:90%;'>"
	     						 + MEMO_TEXT + "</textarea><button type='button' class='btn listedMemoSaveBtn float-right'>저장</button>";
	     			$('.MEMO_NUM[value='+parseInt(MEMO_NUM)+']').closest('.list-group').find('.lock').text('lock_open')
	     													    .closest('.list-group').find('.lock').attr('title', '메모 잠금')
	     													    .closest('.list-group').find('.memoContent-list').html(textarea);
	     		
	     		}
	     	}
     	}        	
     })
}

/* favoEventAdd function */
function favoEventAdd() {
	var sectionName = $("#MEMO_SUB").text();
	var favIconSelect = $(this);
		favIconSelect.css('cursor', 'pointer');
		
    if (favIconSelect.css('color') == "rgb(73, 80, 87)" 
    	|| favIconSelect.css('color') == "rgb(33, 37, 41)") {
    	favIconSelect.css('color', 'rgb(250, 128, 114)')
        	   		 .attr('title', '보관 해제');
        var fav = 'Y';
    } else if (favIconSelect.css('color') == "rgb(250, 128, 114)") {
    	var windowWidth = $(window).width();
    		if (windowWidth > 900){
    		   favIconSelect.css('color', "rgb(33, 37, 41)")
    		   				.attr('title', '메모 보관');
    		} else if (windowWidth <= 900){
    			favIconSelect.css('color', "rgb(73, 80, 87)")
    		   				.attr('title', '메모 보관');
    		}
        var fav = 'N';
        if(sectionName == "IMPORTANT")
		   $(this).closest('.memobox').remove();
    }
    
    var memoObj = {
    		"USER_EMAIL" : $("#USER_EMAIL").text(),
    		"MEMO_NUM" : $(this).closest('.memobox').find('.MEMO_NUM').val(),
    		"MEMO_SUB" : "MEMO_FAV",
    		"MEMO_FAV" : fav
     	};
 
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
        		var thisMemoSelector = ".MEMO_NUM[value='"+MEMO_NUM+"']";
        		$(thisMemoSelector).closest('.memobox').remove();
        		return false;
        	} else if (windowWidth <= 900){
        		var thisMemoSelector = ".MEMO_NUM[value='"+MEMO_NUM+"']";
        		var memotopObjSelect = $(thisMemoSelector).closest('.memobox');
        		var memocontObjSelect = $(memotopObjSelect.next());
        		var mergeMemo = $.merge(memotopObjSelect, memocontObjSelect);
        			mergeMemo.remove();
        			
        		return false;
        	}
        }// success end 
    })// ajax end
}

function saveUserSettingEvent(e){
    var popupBuilder = "<div class = 'container popup'>설정이 저장되었습니다!</div>"
    $('body').append(popupBuilder);
    $('.popup').css({
        "border-radius" : "10pt",
        padding : "15px 0px",
        "text-align" : "center",
        width : "200px",
        height : "60px",
        position:"absolute",
        top : e.pageY-30,
        left : e.pageX-280
    })
    
    var memberObj = {
    	"USER_EMAIL" : $('#USER_EMAIL').text(),
    	"USER_PASS" : $('input[name="USER_PASS"]').val(),
    	"USER_FORM1" : $('textarea:eq(0)').val(),
    	"USER_FORM2" : $('textarea:eq(1)').val(),
    	"USER_FORM3" : $('textarea:eq(2)').val()
    }
 
    $.ajax({
    	url : "saveUserSetting",
    	method : "POST",
    	data : memberObj,
    	dataType : "JSON",
    	success : function(result){
    		if (result == "true"){
    		 setInterval(function(){
    		        $('.popup').animate({opacity : "hide"})
    		    }, 2000)
    		}
    	},
    	error : function(){
    		setInterval(function(){
    			$('.popup').text("오류로 인해 설정을 저장하지 못했습니다.")
    			setInterval(function(){
    		        $('.popup').animate({opacity : "hide"})
    		    }, 2000)
    		})	
    	}
    })
}

function popupCopyAutoFormSuccess(){
	if ('.popup')
		$('.popup').remove();
    var popupBuilder = "<div class = 'container popup'><br>사용자 지정 자동완성폼이<br>클립보드에 복사 되었습니다.</div>"
    var halfSizeWindow = $(window).width()/3;
    $('body').append(popupBuilder);
    $('.popup').css({
        "text-align" : "center",
        "background-color" : "white",
        border : "2px solid black",
        "border-radius" : "0px 0px 10px 10px",
        width : "250px",
        height : "100px",
        position:"absolute",
        left : halfSizeWindow,
        top : "-1px"
    })
    
    $('.popup').slideDown("slow", function(){ $('.popup').delay(1000).slideUp("slow")})
    		    
}

function addSearchMemoEvent(){
    var search_word = $('.search_input').val();
    console.log(search_word);
    var memoObj = {
	          "USER_EMAIL" : $('#USER_EMAIL').text(),                 
	          "MEMO_TEX" : search_word
	       };
    
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
    	if($(window).width() > 900){
    	findMemobox.css('background-color', hexcode)
    			   .find('.memotext').css('background-color', hexcode);
    	} else if ($(window).width() <= 900){
    		var listedMemobox = $.merge($(findMemobox), $(findMemobox).next());
    		var plusTextarea = $.merge($(listedMemobox), $(findMemobox.next().find('textarea')));
    			plusTextarea.css('background-color', hexcode);
    	}
    		
    var memoObj = {"USER_EMAIL" : $("#USER_EMAIL").text(),
    			   "MEMO_NUM" : MEMO_NUM,
    			   "MEMO_COLOR" : $(this).css('background-color')};
    
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
			case "STUDY": section_text = "공부"; 	break;
			case "HEALTH": section_text = "운동"; break;
			case "MONEY": section_text = "가계부"; break;
			default: section_text = ""; break;
		}
		return section_text;
	}
	
	function sectionTranslateKRtoEN(String) {
		switch (String) {
			case "공부": 	section_text = "STUDY"; break;
			case "운동": section_text = "HEALTH"; break;
			case "가계부": section_text = "MONEY"; break;
			default: section_text = ""; break;
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
			     .resizable({ minWidth: 185, minHeight: 140 })
			     .one('click', addTextArea)
			     .mouseup(function(e){
			    	 var target = e.target;
			    	 adjustMemoboxzindex();
			    	 saveMemoProperties(target);
			     })
			     .mousedown(bringFront)
	$('.memotext').keydown(autoResizeTextArea);
    $('.search-icon').on('click', addSearchMemoEvent);
    $('div[data-toggle="toggle"]:eq(0)').on("change",function(){
    	if ($('.toggle:eq(0)').hasClass('btn-dark'))
    		autoMemoAlign();
    	else if ($('.toggle:eq(0)').hasClass('btn-success'))
    		cancelMemoAlign();
    })
}

>>>>>>> refs/remotes/origin/master
})