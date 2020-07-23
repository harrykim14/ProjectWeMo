<<<<<<< HEAD
Kakao.init('ee479d4486868e3e37f98046e49f978d');
Kakao.Auth.createLoginButton({
	container : '#kakao-login-btn',
	success : function(authObj) {

		Kakao.API.request({

			url : '/v2/user/me',

			success : function(res) {

				var email = res.kakao_account['email'];
				
				console.log(email);
				//console.log(res.kakao_account['email']);
				//console.log(authObj.access_token);

				var str = "email=" + email;

				location.href = "joinWeMoWithKakao?" + str;
			}
		})
	},

	fail : function(error) {
		alert(JSON.stringify(error));
	}

});
console.log("Kakao init()");

var naverLogin = new naver.LoginWithNaverId({
	clientId : "FYI_O_KmyI5JoBnG_Wm7",
	callbackUrl : "http://localhost:8089/wemo/callback",
	isPopup : false, /* 팝업을 통한 연동처리 여부 */
	loginButton : {
		color : "green",
		type : 1,
		height : 30
	}
/* 로그인 버튼의 타입을 지정 */
});

/* 설정정보를 초기화하고 연동을 준비 */
naverLogin.init();
=======
Kakao.init('ee479d4486868e3e37f98046e49f978d');
Kakao.Auth.createLoginButton({
	container : '#kakao-login-btn',
	success : function(authObj) {

		Kakao.API.request({

			url : '/v2/user/me',

			success : function(res) {

				var email = res.kakao_account['email'];
				
				console.log(email);
				//console.log(res.kakao_account['email']);
				//console.log(authObj.access_token);

				var str = "email=" + email;

				location.href = "joinWeMoWithKakao?" + str;
			}
		})
	},

	fail : function(error) {
		alert(JSON.stringify(error));
	}

});
console.log("Kakao init()");

var naverLogin = new naver.LoginWithNaverId({
	clientId : "FYI_O_KmyI5JoBnG_Wm7",
	callbackUrl : "http://localhost:8089/wemo/callback",
	isPopup : false, /* 팝업을 통한 연동처리 여부 */
	loginButton : {
		color : "green",
		type : 1,
		height : 30
	}
/* 로그인 버튼의 타입을 지정 */
});

/* 설정정보를 초기화하고 연동을 준비 */
naverLogin.init();
>>>>>>> refs/remotes/origin/master
$('[data-toggle="tooltip"]').tooltip();