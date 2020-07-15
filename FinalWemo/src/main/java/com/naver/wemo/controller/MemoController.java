package com.naver.wemo.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.google.gson.Gson;
import com.naver.wemo.domain.Member;
import com.naver.wemo.domain.Memo;
import com.naver.wemo.service.MemberService;
import com.naver.wemo.service.MemoService;

@Controller
public class MemoController {
	
	@Autowired
	private MemoService mService;
	
	@Autowired
	private MemberService memberService;
	
	@RequestMapping(value = "/Memolist", method = RequestMethod.GET)
	public ModelAndView getWeMoList(@RequestParam(value = "MEMO_SUB", defaultValue = "STUDY", required = false) String MEMO_SUB, 
									ModelAndView mv, Memo memo, HttpSession session, HttpServletResponse resp) throws IOException{
		String id = (String) session.getAttribute("USER_EMAIL");
		memo = settingValues(id, MEMO_SUB);
		List<Memo> mList = null;
		if(MEMO_SUB.equals("IMPORTANT"))
			mList = mService.getFavMemoList(memo);
		else if(MEMO_SUB.equals("TRASH"))
			mList = mService.getTraMemoList(memo);
		else
			mList = mService.getMemoList(memo);
		
		if (mList != null) { // 계정 내에 memo가 존재하면 mList를 모델뷰에 담아 WeMo_Main으로 보냄
			mv.addObject("Memolist", mList);
			mv.addObject("MEMO_SUB", MEMO_SUB);
			mv.setViewName("WeMo_Main");
			return mv;
		} else { // 새 계정으로 로그인 하면 mList는 반드시 null이므로 새 메모를 추가
			if(mService.memoForNewAccount(id)) {
				//firstInsert를 알아보기 쉽도록 새 계정 메모라고 메소드명만 변경 (return값도 boolean으로 변경)
			memo.setMEMO_NUM(1);
			memo = mService.getLatestMemoInfo(memo);
				// 새 메모를 넣을 때 num값을 1로 고정시켜두고 1번 메모의 상세정보를 가져옴
			mList = new ArrayList<Memo>(); 
				// 지역변수 밖에서 조회한 mList값이 null이기 때문에 지역변수 내에서 new로 틀을 새로 정의
			mList.add(memo);
				// null인 mList에 memo 객체를 담아 모델뷰에 mList를 담기
			mv.addObject("Memolist", mList);
			mv.addObject("MEMO_SUB", MEMO_SUB);
			
			mv.setViewName("WeMo_Main");
			return mv;
			} else { // memoForNewAccount()에서 오류나면 로그인화면으로 history.back()
				PrintWriter out = resp.getWriter();
				System.out.println("새로운 계정이 등록되었으나 디폴트 메모를 등록하는데 실패하였습니다.");
				out.println("<script>alert('오류로 인해 접속할 수 없었습니다. 다시 로그인 해 주세요'); history.back();</script>");
				out.close();
				return null;
			}
				
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/newMemo", method = RequestMethod.POST)
	public String newMemo(Memo memoObj, HttpServletResponse resp) {
		
		PrintWriter out = null;
		try {	
			if(mService.newMemo(memoObj)) {
				// newMemo의 return형은 boolean
				memoObj = mService.getLatestMemoInfo(memoObj);
					String ajaxReturnData = new Gson().toJson(memoObj);
					int latestMEMO_NUM = memoObj.getMEMO_NUM();
					// 맨 마지막에 추가된 메모의 정보를 가져오고 그 정보에서 메모 번호를 구함
					int countMemolist = mService.getCountMemolist(memoObj);
					System.out.println("메모 리스트 개수 : " + countMemolist);
					// 메모 리스트 개수를 구해서 1보다 크다면 z-index값 처리하기
					if(countMemolist > 1) {
						memoObj.setMEMO_NUM(latestMEMO_NUM);
						if(mService.adjustMemoboxzindex(memoObj)) {
							// 해당 메모번호를 제외한 나머지의 z-index값을 -1처리	
							System.out.println("해당 메모번호를 제외한 나머지의 z-index값을 -1처리");
							return ajaxReturnData;
						} else {
							out = resp.getWriter();
							out.println("<script>alert('새 메모를 추가하는 도중 오류가 발생했습니다. 다시 시도해주세요.')</script>");
							return null;
						}
					} else {
						// countMemolist = 1이라면 방금 추가한 메모밖에 없으므로 처리할 필요 없이 out닫고 memo를 리턴
						return ajaxReturnData;
					}
					
			} else {
				out = resp.getWriter();
				out.println("<script>alert('새 메모를 추가하는데 실패하였습니다. 다시 시도해주세요.');</script>");
				return null;
			}
		} catch (Exception e) {
			e.getMessage();
		} finally {
			if (out != null)
				out.close();
		}
		
		return null;

	}
	
	@ResponseBody
	@RequestMapping(value = "/sectionChange", method = RequestMethod.POST)
	public void sectionChange(Memo memoObj, Member member, HttpServletResponse resp) throws IOException{
		System.out.println("USER_EMAIL:" + memoObj.getUSER_EMAIL() +" Section :" + memoObj.getMEMO_SUB());
		PrintWriter out = null;
		try {
			// request로 받아온 값들을 member객체와 memo객체에 각각 저장
			member.setUSER_EMAIL(memoObj.getUSER_EMAIL());
			member.setUSER_SUB(memoObj.getMEMO_SUB());
			String Section = memoObj.getMEMO_SUB();
			// member 테이블의 USER_SUB을 업데이트 하고 업데이트가 성공하면 해당 섹션의 메모 리스트를 받아옴
		if(memberService.updateLastSection(member)) {
			List<Memo> mList = null;
			if(Section.equals("IMPORTANT")) {
				memoObj.setMEMO_SUB("MEMO_FAV");
				mList = mService.getFavMemoList(memoObj);
			} else if (Section.equals("TRASH")) {
				memoObj.setMEMO_SUB("MEMO_TRA");
				mList = mService.getTraMemoList(memoObj);
			} else
				mList = mService.getMemoList(memoObj);
			
			resp.setCharacterEncoding("UTF-8");
			out = resp.getWriter();
			
			if(mList != null){	
				out.write(new Gson().toJson(mList));
				System.out.println("데이터 보냄");
			} else {			
				out.println("<script>alert('페이지 변경에 오류가 발생하였습니다. 잠시 후에 다시 시도해 주세요.')</script>");
			}
			
		} else {
			System.out.println("memberService.updateLastSection()에서 오류가 발생하였습니다");
			out = resp.getWriter();
			out.println("<script>alert('페이지 변경 도중에 오류가 발생하였습니다. 잠시 후에 다시 시도해 주세요.')</script>");
		}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (out != null)
				out.close();
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/sectionAnalysis", method = RequestMethod.POST)
	public void sectionAnalysis(Memo memoObj, HttpServletResponse resp) {
		System.out.println("url = /sectionAnalysis, USER_EMAIL = "+memoObj.getUSER_EMAIL());
		PrintWriter out = null;
		try {
			resp.setCharacterEncoding("UTF-8");
			out = resp.getWriter();
			Map<String, Object> cntMap = null;
			if (memoObj.getMEMO_SUB().equals("ANALYSIS")) {
				cntMap = mService.getCountSectionlist(memoObj.getUSER_EMAIL());
				if (cntMap != null)
					out.println(new Gson().toJson(cntMap));
			} 
		} catch (Exception e) { 
			e.getStackTrace();
		} finally {
			if(out != null)
			   out.close();
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/moveToTrashBackAndForth", method = RequestMethod.POST)
	public void moveToTrash(Memo memoObj, HttpServletResponse resp) {
		PrintWriter out = null;
		try {
			out = resp.getWriter();
			
			if(mService.moveToTrashBackAndForth(memoObj)) {
				resp.setCharacterEncoding("UTF-8");
				out.println("true");
			} else {
				resp.setCharacterEncoding("UTF-8");
				out.println("false");
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if(out!=null)
				out.close();
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/deleteMemo", method = RequestMethod.POST)
	public void deleteMemo(Memo memoObj, HttpServletResponse resp) {
		PrintWriter out = null;
		try {
			resp.setCharacterEncoding("UTF-8");
			out = resp.getWriter();
			
			if(mService.deleteMemo(memoObj)) {				
				out.println("true");
			} else {
				out.println("false");
			}
			
		} catch(Exception e) {
			e.printStackTrace();
		} finally {
			if (out != null)
				out.close();
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/saveMemoProperties", method = RequestMethod.POST)
	public void saveMemoProperties(Memo memoObj, HttpServletResponse resp) throws IOException {
		PrintWriter out = null;
		try {
		out = resp.getWriter();
		if(mService.saveMemoProperties(memoObj))
			out.print("true");
		else
			out.print("false");
		} catch (Exception e) {
			e.getStackTrace();
		} finally {
			if (out != null)
				out.close();
		}
	}	
	
	@ResponseBody
	@RequestMapping(value = "/setMemoFavorite", method = RequestMethod.POST)
	public void setMemoFavorite(Memo memoObj, HttpServletResponse resp) {
		PrintWriter out = null;
		try {
			out = resp.getWriter();
			if (mService.updateMemoFavorite(memoObj))
				out.print("true");
			else
				out.print("false");
		} catch (Exception e) {
			e.getStackTrace();
		} finally {
			if(out != null)
			   out.close();
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/searchMemo", method = RequestMethod.POST)
	public void searchMemo(Memo memoObj, HttpServletResponse resp) {
		PrintWriter out = null;
		try {
			List<Memo> mList = mService.searchMemoList(memoObj);
			if (mList.size() > 0) {
				resp.setCharacterEncoding("UTF-8");
				out = resp.getWriter();
				out.println(new Gson().toJson(mList));
			} else {
				resp.setCharacterEncoding("UTF-8");
				out = resp.getWriter();
				out.println("No Result");
			}
		} catch (Exception e) {
			e.getStackTrace();
		} finally {
			if (out != null)
				out.close();
		}
		
	}
	
	
	public static Memo settingValues(String USER_EMAIL, String MEMO_SUB) {
		Memo memo = new Memo();
		memo.setUSER_EMAIL(USER_EMAIL);
		memo.setMEMO_SUB(MEMO_SUB);
		return memo;
	}
}
