package com.naver.wemo.controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.naver.wemo.DAO.MemberDAO;
import com.naver.wemo.domain.Member;
import com.naver.wemo.service.MemberService;

@Controller
public class MemberController {

	@Autowired
	private MemberDAO memberdao;
	
	@Autowired
	private MemberService mService;
	
	// 모바일 주소와 웹 주소를 별도로 자동로그인 분별
	@RequestMapping(value = "/LoginWeMo")
	public String loginWeMo(@CookieValue(value = "autoLogin", required =false) Cookie autoLogin) throws Exception {
		if (autoLogin != null) {
			// 로그인창 갈 때 autoLogin을 체크했다면 쿠키의 수명을 7일로 초기화하고 바로 로그인
			// 로그인 할 때 사용자 정보가 필요하므로 사용자 정보를 memberdao에서 받아와 객체를 mv에 담아 Memolist로 넘김
			autoLogin.setMaxAge(86400*7);
			String id = autoLogin.getValue();
			Member info = memberdao.getMemberDetail(id);
			String pass = info.getUSER_PASS();
					
			return "redirect:IntoWeMo?USER_EMAIL="+id+"&USER_PASS="+pass+"&autoLogin=";
		} else {
			return "WeMo_Login";
		}
	}
	
	@RequestMapping(value = "/IntoWeMo")
	public String intoWeMo(@RequestParam(value = "USER_EMAIL") String id,
						   @RequestParam(value = "USER_PASS") String pass,
						   @RequestParam(value = "autoLogin", defaultValue = "") String autoLogin,
						   HttpServletResponse resp, HttpSession session,
						   ModelAndView mv) throws IOException {
		
		System.out.println(id + ":" +pass);
		resp.setContentType("text/html;charset=UTF-8");
		
		if(memberdao.isId(id).equals(pass)) {
			// isId의 return값은 USER_PASS값이므로 입력한 pass값과 일치하면
			// session에 id를 저장하여 로그인 시킴
			session.setAttribute("USER_EMAIL", id);
			
			
			
			Cookie autoLoginInfo = new Cookie("autoLogin", id);
			if(!autoLogin.equals(""))
				autoLoginInfo.setMaxAge(86400*7);
				// 자동 로그인을 체크하면 쿠키의 수명을 7일로 설정하여 아이디를 저장
			else
				autoLoginInfo.setMaxAge(0);
			
			resp.addCookie(autoLoginInfo);
			String MEMO_SUB = memberdao.getMemberDetail(id).getUSER_SUB();
			
			
			return "redirect:Memolist?MEMO_SUB="+MEMO_SUB;
		} else {
			PrintWriter out = resp.getWriter();
			out.println("<script>alert('비밀번호가 일치하지 않습니다'); location.href = 'LoginWeMo'; </script>");
			out.close();
			return null;
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "idcheck", method = RequestMethod.POST)
	public void idcheck(@RequestParam(value = "USER_EMAIL") String email,
						HttpServletResponse resp) throws IOException {
		PrintWriter out = resp.getWriter();
		if(mService.idcheck(email)) {
			out.println("true");
			out.close();
		} else {
			out.println("false");
			out.close();
		}
	}
	
	@PostMapping(value = "joinWeMo")
	public String createNewAccount(Member member) {
		mService.insertMember(member);
		return "WeMo_Login";
	}
	
	/*
	@RequestMapping(value ="joinWeMoWithKakao")
	public String createNewAccountWithKakao(@RequestParam(value = "e-mail") String Email)
	*/
}
