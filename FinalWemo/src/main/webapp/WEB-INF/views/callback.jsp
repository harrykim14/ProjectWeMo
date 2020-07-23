<%@ page language="java" contentType="text/html; charset=UTF-8"   pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
 
<head>
    <script type="text/javascript" src="https://static.nid.naver.com/js/naverLogin_implicit-1.0.3.js" charset="utf-8"></script>
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
</head>
 
<body>
    <script type="text/javascript">
          var naver_id_login = new naver_id_login("{ny9R5wW3RUbwHMycFKZK}", "http://localhost:8089/wemo/callback");
          // 접근 토큰 값 출력
          alert(naver_id_login.oauthParams.access_token);
          
          // 네이버 사용자 프로필 조회
          naver_id_login.get_naver_userprofile("naverSignInCallback()");
          
          // 네이버 사용자 프로필 조회 이후 프로필 정보를 처리할 callback function
          function naverSignInCallback() {
            
           
            var email = naver_id_login.getProfileData("email");
            alert(email);
            
            $.ajax({
            	container : '#naver-login-btn',
                 url : 'naverLogin',
                 data : {"email":email},
                  success : function(idChk){
                	  
                	  alert(JSON.stringify(idChk));
                	  
                	  document.body.innertHTML+=JSON.stringify(idChk);
                	  
                	  alert(JSON.stringify(idChk));
                	  
                	  var id = idChk.id;
                	  var token = idChk.access_token;
                	  
                	  console.log(idChk.id);
                	  console.log(naver_id_login.getProfileData["email"]);
                	  console.log(idChk.access_token);
                	  
                	  var str = "id="+id;
                	  str+="&email="+email;
                	  str+="&token="+token;
                	  
                	  location.href="naverLogin?"+str;
                  },
                  fail : function(error){
                	  alert(JSON.stringify(error));
                  }
            });
            
          };
    </script>
    
    <form name="defaultForm">
    </form>
    
</body>
</html>


