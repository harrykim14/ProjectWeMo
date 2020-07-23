<%@ page language="java" contentType="text/html; charset=UTF-8"
		 pageEncoding="UTF-8"%><!DOCTYPE html>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<html lang="ko">
<head>
<title>WeMo -우리들의 메모-</title>

<!-- Material Icons (for simple icons) -->
<link rel="stylesheet"
	href="https://fonts.googleapis.com/icon?family=Material+Icons">

<!-- Google Charts -->
<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>

<!-- JQuery & Ajax -->
<script	src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

<!-- BootStrap & Popper -->
<link rel="stylesheet"	href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
<script	src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
<script	src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>

<!-- Bootstrap Switch Button -->
<link href="https://cdn.jsdelivr.net/gh/gitbrent/bootstrap4-toggle@3.6.1/css/bootstrap4-toggle.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/gh/gitbrent/bootstrap4-toggle@3.6.1/js/bootstrap4-toggle.min.js"></script>

<!-- jquery-ui (util for drag/snap) -->
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
<link rel="stylesheet"
	href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">

<!-- clipboard.js  -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.4/clipboard.min.js"></script>


<!-- Google Font (Noto Sans KR) -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@500&display=swap" rel="stylesheet">

<meta name="viewport" content="width=device-width, user-scalable=no">

<link href="resources/css/WeMo_Main_CSS.css" rel="stylesheet">
<script src="resources/js/WeMo_Main_Functions.js"></script>
<script>
$(function(){
	var triggerPageView = ".menu-" + $('#MEMO_SUB').text().toLowerCase();
	console.log(triggerPageView);
	$(triggerPageView).trigger('click');
	
})
</script>
</head>

<body>
	<span style="display: none" id="USER_EMAIL">${USER_EMAIL }</span>
	<span style="display: none" id="MEMO_SUB">${MEMO_SUB }</span>
	<nav>
		<table class="table navTable">
			<tbody>
				<tr class="first-row">
					<td class="menu-search normal-menu"><img src="resources/image/WemoLogo.png" width="100px"></td>
					<td class="menu-study normal-menu">공부</td>
					<td class="menu-health normal-menu">운동</td>
					<td class="menu-money normal-menu">가계부</td>
					<td class="menu-calendar normal-menu">캘린더</td>
					<td class="menu-important normal-menu">보관함</td>
					<td class="menu-trash normal-menu">휴지통</td>
					<td class="menu-analysis normal-menu">통계</td>
					<td class="menu-setting normal-menu">설정</td>
					<td class="menu-search normal-menu"> 
							<input type="checkbox" class="memoAlineBtn" style = "width:120px;"data-toggle="toggle" data-on="정리 끄기" data-off="메모 정리" data-onstyle="dark" data-offstyle="success">
							<span><input type="text" name="SearchMemo" class="search_input float-right">&nbsp;&nbsp;</span>
							<span class="material-icons float-right search-icon" style='line-height:"30pt";'>search</span>
					</td>
				</tr>
			</tbody>
		</table>
	</nav>
	<!-- 메모장 컨테이너 시작 -->
	<div class="memoContainer">
	
	</div>
	<!-- Auto User Form Storage-->
	<span id = "AutoUserForm" style = "display:none;"></span>
	
	<!-- Search Modal -->
	<div id="ModalForSearch" class="modal fade" role="dialog">
		<div class="modal-dialog">
			<!-- Modal content-->
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title float-left">메모 검색 결과</h4>
					<h5>누르면 해당 메모로 이동</h5>
				</div>
				<table class="modal-body search-modal-body">

				</table>
			</div>
		</div>
	</div>
	<!-- Lock/Unlock Modal -->
	<div id="ModalForLock" class="modal fade" role="dialog">
		<div class="modal-dialog">
			<!-- Modal content-->
			<div class="modal-content">
				<div class="modal-header lock-modal-header">
					
				</div>
				<div class="modal-body lock-modal-body">
					
				</div>
			</div>
		</div>
	</div>
	<div class="colorpad-menu dropdown-menu" style = "display: none">
        <table class = "table table-borderless" style = "width:250px; ">
            <tbody>
                <tr>
                    <td colspan = "7" style ="text-align: center; font-weight : 700;">메모 색상을 선택</td>
                </tr>
                <tr>
                    <td style = "width:5px"><span class = "COLOR_MEMO_NUM" style = "display : none;"></span></td>
                    <td class = "colorpad" style = "background-color:#B6F2CB; height:40px;"></td>
                    <td class = "colorpad" style = "background-color:#C3F2B6; height:40px;"></td>
                    <td class = "colorpad" style = "background-color:#EBF2B6; height:40px;"></td>
                    <td class = "colorpad" style = "background-color:#F2D7B6; height:40px;"></td>
                    <td class = "colorpad" style = "background-color:#F2B6B6; height:40px;"></td>
                    <td style = "width:5px"></td>
                </tr>
            </tbody>
        </table>
    </div>
</body>

</html>