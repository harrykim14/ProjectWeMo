<%@ page language="java" contentType="text/html; charset=UTF-8"
		 pageEncoding="UTF-8"%><!DOCTYPE html>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
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

<!-- jquery-ui (util for drag/snap) -->
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
<link rel="stylesheet"
	href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">

<!-- Google Font (Noto Sans KR) -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@500&display=swap" rel="stylesheet">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<link href="resources/css/WeMo_Main_CSS.css" rel="stylesheet">
<script src="resources/js/WeMo_Main_Functions.js"></script>
</head>

<body>
	<span style="display: none" id="USER_EMAIL">${USER_EMAIL }</span>
	<span style="display: none" id="MEMO_SUB">${MEMO_SUB }</span>
	<nav>
		<table class="table navTable">
			<tbody>
				<tr class="first-row">
					<td><img src="resources/image/Wemo.png" width="100px"></td>
					<td class="bg-primary">공부</td>
					<td class="bg-warning">운동</td>
					<td class="bg-success">가계부</td>
					<td class="bg-danger">캘린더</td>
					<td class="bg-secondary">보관함</td>
					<td class="bg-dark trash">휴지통</td>
					<td class="bg-info">통계</td>
					<td class="bg-search"> 
							<span class="material-icons float-right search-icon" style='line-height:"24pt";'>search</span>
							<span><input type="text" name="SearchMemo" class="search_input float-right">&nbsp;&nbsp;</span>
					</td>
				</tr>
			</tbody>
		</table>
	</nav>
	<!-- 메모장 컨테이너 시작 -->
	<div class="memoContainer">
		<c:set var="Memolist" value="${Memolist }" />


		<!-- 컨테이너 내 첫번째 메모박스 -->
		<!-- 메모박스의 위치 지정은 여기서 style로 주면 위치가 지정됨 예시 ↓ -->
		<c:forEach var="Memolist" items="${Memolist }">
			<div class='container memobox shadow-sm'
				style="position: ${Memolist.MEMO_POSITION };
        	 		  top: ${Memolist.MEMO_TOP };  
        	 		  left: ${Memolist.MEMO_LEFT };
        	 		  width : ${Memolist.MEMO_WIDTH };
        	 		  height : ${Memolist.MEMO_HEIGHT }; 
        	 		  background-color: ${Memolist.MEMO_COLOR };
        	 		  z-index: ${Memolist.MEMO_ZID };">
				<form>
					<!-- 메모박스 상단 메뉴(날짜, 카테고리, 아이콘들) -->
					<div class='container memo-top'>
						<input type="hidden" class="MEMO_NUM" name="MEMO_NUM"
							value="${Memolist.MEMO_NUM }"> <span class="MEMO_DATE">${Memolist.MEMO_DATE }</span>
						<c:choose>
							<c:when test="${Memolist.MEMO_SUB eq 'STUDY'}">
								<span class="section-name">공부</span>
							</c:when>
							<c:when test="${Memolist.MEMO_SUB eq 'HEALTH'}">
								<span class="section-name">운동</span>
							</c:when>
							<c:when test="${Memolist.MEMO_SUB eq 'MONEY'}">
								<span class="section-name">가계부</span>
							</c:when>
						</c:choose>
						<span class="material-icons delete float-right" data-toggle = "tooltip" title = "휴지통으로">delete</span>
						<c:if test="${Memolist.MEMO_FAV eq 'Y' }">
							<span class='material-icons float-right favorites'
								style='color: salmon' data-toggle = "tooltip" title = "보관 해제">stars</span>
						</c:if>
						<c:if test="${Memolist.MEMO_FAV eq 'N' }">
							<span class='material-icons float-right favorites' data-toggle = "tooltip" title = "메모 보관">stars</span>
						</c:if>
						<c:if test="${Memolist.MEMO_LOC eq 'Y' }">
							<span class="material-icons float-right lock" data-toggle = "tooltip" title = "잠금 해제">lock</span>
						</c:if>
						<c:if test="${Memolist.MEMO_LOC eq 'N' }">
							<span class="material-icons float-right lock" data-toggle = "tooltip" title = "메모 잠금">lock_open</span>
						</c:if>
					</div>
					<!-- 메모박스 내 메모 컨텐츠 -->
					<div class='container memoContent'>
						<textarea class='memotext form-control'
							style="overflow-y:hidden; 
                		  		   resize:none; 
                		  		   background-color: ${Memolist.MEMO_COLOR }; 
                		  		   border: none">${Memolist.MEMO_TEX }</textarea>
					</div>
				</form>
			</div>
		</c:forEach>
	</div>
	<!-- Modal -->
	<div id="Modal" class="modal fade" role="dialog">
		<div class="modal-dialog">
			<!-- Modal content-->
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title float-left">메모 검색 결과</h4>
					<h5>누르면 해당 메모로 이동</h5>
				</div>
				<table class="modal-body">

				</table>
			</div>
		</div>
	</div>
</body>

</html>