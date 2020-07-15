<%@ page language="java" contentType="text/html; charset=EUC-KR"
    pageEncoding="EUC-KR"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Log In</title>
    
    <!-- Material Icons (for simple icons) -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>

    <!-- jquery-ui (util for drag/snap) -->
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">

    <!-- Google Font (Noto Sans KR) -->
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@500&display=swap" rel="stylesheet">

    <script>
       $(function(){

        var date = new Date();
            if (date.getMonth() + 1 < 10)
                var month = "0" + (date.getMonth() + 1);
            else
                var month = data.getMonth() + 1;
            if (date.getDate()<10)
                var day = "0"+date.getDate();
            else
                var day = date.getDate();

            var today = date.getFullYear() + "." + month + "." + day;

            $('.date').text(today)
                      .css({"font-size" : "16pt",
                            "font-weight" : 700});
            $(window).resize(viewSetup)
            viewSetup();

        $('.btn-join').on('click', transToJoinView);       
        $('.btn-login').on('click', requireIDandPASS);
        
        var userinfo = $('form').serialize();
        
        function requireIDandPASS(){
        	console.log(userinfo);
        	if($('#USER_EMAIL').val() ==""){
        	   $('#USER_EMAIL').focus();
        	   return false;
        
        		if ($('#USER_PASS').val() ==""){
        		   $('#USER_PASS').focus();
    			   return false;
        		}
        	} 
        }

        var loginView = '<form action = "IntoWeMo" method ="POST">'
                      + '<label for ="USER_EMAIL">이메일주소</label>&nbsp;'
                      + '<input type = "text" id = "USER_EMAIL" name = "USER_EMAIL"'
                      + ' class = "loginInput"><br><br>'
                      + '<label for ="USER_PASS">&nbsp;&nbsp;비밀번호&nbsp;&nbsp;&nbsp;</label>'
                      + '<input type = "password" id ="USER_PASS" name = "USER_PASS" class ="loginInput"><br><br>'
                      + '<span><input type = "checkbox" id = "autoLogin" name ="autoLogin">'
                      + '<label for = "autoLogin">&nbsp;자동 로그인</label></span>&nbsp;&nbsp;'
                      + '<img src = "resources/image/kakaobtn.png" width ="30px"><br>'
                      + '<button type ="submit" class = "btn btn-login">메모장 열기</button>'
                      + '<button type ="button" class = "btn btn-join">회원가입</button>'
                      + '<button type ="button" class = "btn">비밀번호 찾기</button></form>'

        var joinView = '<form action = "joinWeMo" method ="POST">'
                     + '<label for ="USER_EMAIL">이메일주소</label>&nbsp;'
                     + '<input type = "text" id = "USER_EMAIL" name = "USER_EMAIL"'
                     + ' class = "loginInput useremail"><br>'
                     + '<span class = "emailCheck"></span><br>'
                     + '<label for ="USER_PASS">&nbsp;&nbsp;비밀번호&nbsp;&nbsp;&nbsp;</label>'
                     + '<input type = "password" id ="USER_PASS" name = "USER_PASS" '
                     + 'class ="loginInput userpass" maxlength = "20"><br>'
                     + '<span class = "passCheck"></span><br><br>'
                     + '<button type ="submit" class = "btn">회원가입</button>'
                     + '<button type ="button" class = "btn btn-login-view">로그인으로 돌아가기</button>'
                     + '</form>'

        function checkEmail(){
            var idcheck = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
            var user_email = $('.useremail').val();
            if (idcheck.test(user_email)){
            $.ajax({
            	url : "idcheck",
            	data : {"USER_EMAIL" : user_email},
            	type : "POST",
            	success : function(result){
            		console.log(result);
            		if(result.includes("true")){
            			$('.emailCheck').text("사용할 수 없는 이메일 주소입니다.")
                        .css("color", "red")
                        .focus();
            		} else {
            			$('.emailCheck').text("사용할 수 있는 이메일 주소입니다.")
                        .css("color", "green")
            		}
            	} // success End
            	})// ajax End
            }// idcheck.test End
        }// checkEmail End  

        function checkPass(){
            var passcheck = /[A-Za-z0-9]{8,}/;
            var user_pass = $('.userpass').val();
                if (passcheck.test(user_pass)){
                    $('.passCheck').text("사용가능한 비밀번호입니다.")
                                   .css("color", "green")
                } else {
                    $('.passCheck').text("영문/숫자로 8자 이상 입력해주세요.")
                                   .css("color", "red")
                                   .focus();
                }
        }

        function transToJoinView(){
            $('.loginViewInput').html(joinView);
            $('.loginViewInput').attr('class', 'joinViewInput');
            $('.btn-login-view').click(transToLoginView);
            $('.useremail').on('keyup', checkEmail);
            $('.userpass').on('keyup', checkPass);                
        } 
        
        function transToLoginView(){
        	$('.joinViewInput').html(loginView);
            $('.joinViewInput').attr('class', 'loginViewInput');
            $('.btn-join').on('click', transToJoinView);
            $('.btn-login').on('click', requireIDandPASS);
        }

        function viewSetup(){
            var loginTopWidth = $('.loginViewTop').css('width');
            $('.loginViewMain').css('width', loginTopWidth);

            var viewWidth = $(window).width();

            if(viewWidth >= 450) { 
                 $('.loginViewMain').css({"padding": "60px"})
                 $('.loginInput').css({"width" : "200px"})
                 // 기본값
            } else if (viewWidth >360 && viewWidth < 450){
                $('.loginViewMain').css({
                 "padding-top" : "40px",
                 "padding-left": "40px", 
                 "padding-right": "40px",
                 "padding-bottom": "40px"})
                $('.loginInput').css({"width" : "120px"})
            } else if (viewWidth <= 360){
                $('.loginViewMain').css({
                 "padding-top" : "60px",
                 "padding-left": "20px", 
                 "padding-right": "20px",
                 "padding-bottom": "60px"})
                $('.loginInput').css({"width" : "120px"})
            }
            }
       })
    </script>
    <style>

        * {
            font-family: 'Noto Sans KR', sans-serif;
        }
      
        .loginViewTop{
            border : 5px solid black;
            border-radius : 20px 20px 0px 0px;
            padding : 10px;
            margin:0px auto;
            box-sizing:border-box;
            background-color : pink;
            box-shadow:12px 12px 2px 1px hotpink;
        }
        .loginViewMain{
            width : 80%;
            box-sizing:border-box;
            border-top : 0px solid black;
            border-left : 5px solid black;
            border-right : 5px solid black;
            border-bottom : 5px solid black;
            border-radius : 0px 0px 20px 20px;
            background-color: white;
            
            height : 480px;
            box-shadow:12px 12px 2px 1px hotpink;
        }
        .title {
            text-align: center;
            font-size : 54pt;
        }
        h3 {
            text-align: center;
            font-weight: 700;
        }
        .loginInput{
            border-top : none;
            border-left : none;
            border-right : none;
            border-bottom : 1px solid black;
            color : darkslategray
        }
        .loginInput:focus{
            outline :none;
        }
        .loginViewInput, .joinViewInput{
            margin : 0px auto;
            box-sizing:border-box;
            width : 350px;
        }
        .mainImage{
            display : block;
            margin : 0 auto;
        }
    </style>
</head>
<body>
    <br><br>
        <div class = "container loginViewTop">
            <span class = "date"></span>
            <span class ="material-icons float-right">close</span>
            <span class ="material-icons float-right">crop_square</span>
            <span class ="material-icons float-right">minimize</span>
        </div>
        <div class = "container loginViewMain">
            <img class = "mainImage" src = "resources/image/Wemo.png" width = "300px"><br>
            
            <div class = "loginViewInput">
            <form action = "IntoWeMo" method ="POST">
            <label for ="USER_EMAIL">이메일주소</label>&nbsp; 
            <input type = "text" id = "USER_EMAIL" name = "USER_EMAIL" class = "loginInput"><br><br>
                
            <label for ="USER_PASS">&nbsp;&nbsp;비밀번호&nbsp;&nbsp;&nbsp;</label> 
            <input type = "password" id ="USER_PASS" name = "USER_PASS" class ="loginInput"><br><br>
            <span><input type = "checkbox" id = "autoLogin" name ="autoLogin">
            <label for = "autoLogin">&nbsp;자동 로그인</label></span>&nbsp;&nbsp;
            <img src = "resources/image/kakaobtn.png" width =30px>
            <br>            
                <button type ="submit" class = "btn btn-login">메모장 열기</button>
                <button type ="button" class = "btn btn-join">회원가입</button>
                <button type ="button" class = "btn">비밀번호 찾기</button>
            </form>
            </div>
        </div>
</body>
</html>