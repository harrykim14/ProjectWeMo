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

import com.google.gson.Gson;
import com.naver.wemo.DAO.MemberDAO;
import com.naver.wemo.domain.Member;
import com.naver.wemo.service.MemberService;

@Controller
public class MemberController {

	@Autowired
	private MemberDAO memberdao;
	
	@Autowired
	private MemberService mService;
	
	// ����� �ּҿ� �� �ּҸ� ������ �ڵ��α��� �к�
	@RequestMapping(value = "/LoginWeMo")
	public String loginWeMo(@CookieValue(value = "autoLogin", required =false) Cookie autoLogin) throws Exception {
		if (autoLogin != null) {
			// �α���â �� �� autoLogin�� üũ�ߴٸ� ��Ű�� ������ 7�Ϸ� �ʱ�ȭ�ϰ� �ٷ� �α���
			// �α��� �� �� ����� ������ �ʿ��ϹǷ� ����� ������ memberdao���� �޾ƿ� ��ü�� mv�� ��� Memolist�� �ѱ�
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
			// isId�� return���� USER_PASS���̹Ƿ� �Է��� pass���� ��ġ�ϸ�
			// session�� id�� �����Ͽ� �α��� ��Ŵ
			session.setAttribute("USER_EMAIL", id);
			
			
			
			Cookie autoLoginInfo = new Cookie("autoLogin", id);
			if(!autoLogin.equals(""))
				autoLoginInfo.setMaxAge(86400*7);
				// �ڵ� �α����� üũ�ϸ� ��Ű�� ������ 7�Ϸ� �����Ͽ� ���̵� ����
			else
				autoLoginInfo.setMaxAge(0);
			
			resp.addCookie(autoLoginInfo);
			String MEMO_SUB = memberdao.getMemberDetail(id).getUSER_SUB();
			
			
			return "redirect:Memolist?MEMO_SUB="+MEMO_SUB;
		} else {
			PrintWriter out = resp.getWriter();
			out.println("<script>alert('��й�ȣ�� ��ġ���� �ʽ��ϴ�'); location.href = 'LoginWeMo'; </script>");
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
	
	@ResponseBody
	@RequestMapping(value ="getMyAccountDetail", method = RequestMethod.POST)
	public void getMyAccountDetail(Member member, HttpServletResponse resp) {
		String id = member.getUSER_EMAIL();
		resp.setCharacterEncoding("UTF-8");
		PrintWriter out = null;
		try {
			member = mService.getMemberDetail(id);
			out = resp.getWriter();
			String jsonMemberObj = new Gson().toJson(member);
			out.print(jsonMemberObj);
		} catch (Exception e) {
			e.getStackTrace();
		} finally {
			if(out != null)
				out.close();
		}
	}
	
	@ResponseBody
	@RequestMapping(value ="saveUserSetting", method = RequestMethod.POST)
	public void saveUserSetting(Member memberObj, HttpServletResponse resp) {
		resp.setCharacterEncoding("UTF-8");
		PrintWriter out = null;
		try {
			if(mService.saveUserSetting(memberObj)) {
				out = resp.getWriter();
				out.print("true");
			} else {
				out = resp.getWriter();
				out.print("false");
			}
		} catch (Exception e) {
			e.getStackTrace();
		} finally {
			if (out != null)
				out.close();
		}
	}
	
	
	/*
	@RequestMapping(value ="joinWeMoWithKakao")
	public String createNewAccountWithKakao(@RequestParam(value = "e-mail") String Email)
	*/
}
