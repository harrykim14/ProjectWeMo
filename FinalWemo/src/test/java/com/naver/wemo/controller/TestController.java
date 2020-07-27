package com.naver.wemo.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.naver.wemo.domain.Member;
import com.naver.wemo.domain.Memo;
import com.naver.wemo.service.MemberService;
import com.naver.wemo.service.MemoService;

	@Controller
	public class TestController {

		@Autowired
		private MemberService mService;
		
		@Autowired
		private MemoService memServ;
		
		@RequestMapping(value ="/IntoWeMo", method = RequestMethod.POST)
		public ModelAndView intoWeMo(Member member, HttpServletRequest req, ModelAndView mv) throws Exception {
		
			String USER_EMAIL = req.getParameter("USER_EMAIL");
			String USER_PASS = req.getParameter("USER_PASS");
			if(!mService.idcheck(USER_EMAIL)) {
				member.setUSER_EMAIL(USER_EMAIL);
				member.setUSER_PASS(USER_PASS);
				if(mService.insertMember(member)) {
					mv.addObject("USER_EMAIL", USER_EMAIL);
					mv.setViewName("WeMo_Main");
					return mv;
				} else { 
					mv.addObject("error", "error");
					mv.setViewName("error");
					return mv;
				}
			} else {
				if(mService.isId(USER_EMAIL,USER_PASS)) {
					mv.addObject("USER_EMAIL", USER_EMAIL);
					System.out.println(mv.getModel().get("USER_EMAIL"));
					mv.setViewName("WeMo_Main");
					return mv;
				}else { 
					mv.addObject("error", "error");
					mv.setViewName("error");
					return mv;
				}
			}
				
		}
		
		@RequestMapping(value = "/WeMolist", method = RequestMethod.POST)
		public ModelAndView getWeMoList(Memo memo, HttpServletRequest req, ModelAndView mv) {
			
			String USER_EMAIL = req.getParameter("USER_EMAIL");
			String MEMO_SUB = req.getParameter("MEMO_SUB");
			memo.setUSER_EMAIL(USER_EMAIL);
			memo.setMEMO_SUB(MEMO_SUB);
			
			List<Memo> wemolist = memServ.getMemoList(memo);
			if (wemolist.size() >0) {
				mv.addObject("WeMolist", wemolist);
				mv.setViewName("WeMo_Main");
				return mv;
			} else {
				mv.addObject("NoList", "불러올 메모가 없습니다.");
				mv.setViewName("WeMo_Main");
				return mv;
			}
			
		}
	}
