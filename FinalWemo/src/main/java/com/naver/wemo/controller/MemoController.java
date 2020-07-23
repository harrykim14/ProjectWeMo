<<<<<<< HEAD
package com.naver.wemo.controller;

import java.io.IOException;
import java.io.PrintWriter;
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
									ModelAndView mv, HttpSession session){
		String id = (String) session.getAttribute("USER_EMAIL");
		
		mv.addObject("USER_EMAIL", id);
		mv.addObject("MEMO_SUB", MEMO_SUB);
		mv.setViewName("WeMo_Main");
		return mv;
		
	}
	
	@ResponseBody
	@RequestMapping(value = "getSectionMemoList", method =RequestMethod.POST)
	public void getSectionMemoList(Memo memoObj, HttpServletResponse resp) {
		PrintWriter out = null;
		try {
			String MEMO_SUB = memoObj.getMEMO_SUB();
			List<Memo> mList = null;
			if(MEMO_SUB.equals("IMPORTANT"))
				mList = mService.getFavMemoList(memoObj);
			else if(MEMO_SUB.equals("TRASH"))
				mList = mService.getTraMemoList(memoObj);
			else
				mList = mService.getMemoList(memoObj);
			
			resp.setCharacterEncoding("UTF-8");
			out = resp.getWriter();
			if (mList.size() >0) {
				String jsonMemolist = new Gson().toJson(mList);
				out.println(jsonMemolist);
			} else {
				out.println("false");
			}
				
		} catch(Exception e) { 
			e.getStackTrace();
		} finally {
			if (out != null)
				out.close();
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
	@RequestMapping(value = "/saveListedMemoProperties", method = RequestMethod.POST)
	public void saveListedMemoProperties(Memo memoObj, HttpServletResponse resp) throws IOException {
		PrintWriter out = null;
		try {
		out = resp.getWriter();
		if(mService.saveListedMemoProperties(memoObj))
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
	@RequestMapping(value = "/setMemoColor", method = RequestMethod.POST)
	public void setMemoColor(Memo memoObj, HttpServletResponse resp) {
		PrintWriter out = null;
		System.out.println("USER_EMAIL:"+memoObj.getUSER_EMAIL()+" MEMO_NUM:"+memoObj.getMEMO_NUM()+" MEMO_COLOR:"+memoObj.getMEMO_COLOR());
		try {
			resp.setCharacterEncoding("UTF-8");
			out = resp.getWriter();
			if(mService.updateMemoColor(memoObj))
				out.print("true");
			else 
				out.println("false");
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (out != null)
				out.close();
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/setMemoLockAndUnlock", method = RequestMethod.POST)
	public void setMemoLockAndUnlock(Memo memoObj, HttpServletResponse resp) {
		PrintWriter out = null;
		try {
			resp.setCharacterEncoding("UTF-8");
			out = resp.getWriter();			
			if(memoObj.getMEMO_LOC().equals("Y")) {
				if (mService.updateMemoLockAndUnlock(memoObj))
					out.print("true");
			} else {
				String id = memoObj.getUSER_EMAIL();
				String pass = memoObj.getMEMO_KEYW();
				if(memberService.isId(id, pass)) {
					memoObj.setMEMO_KEYW("잠금 키워드 초기화");
					if(mService.updateMemoLockAndUnlock(memoObj)) {
						String memoContent = mService.getMemoContent(memoObj).getMEMO_TEX();
						String jsonContent = new Gson().toJson(memoContent);
						System.out.println(jsonContent.length());
						out.write(jsonContent);
					} else
						out.print("일시적인 오류로 메모 내용을 불러오지 못했습니다");
				} else {
					out.print("비밀번호가 틀립니다");
				}
			}
		} catch (Exception e) {
			e.getStackTrace();
		} finally {
			if(out != null)
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
	
	
}
=======
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
									ModelAndView mv, Memo memo, HttpSession session){
		String id = (String) session.getAttribute("USER_EMAIL");
		
		mv.addObject("USER_EMAIL", id);
		mv.addObject("MEMO_SUB", MEMO_SUB);
		mv.setViewName("WeMo_Main");
		return mv;
		
	}
	
	@ResponseBody
	@RequestMapping(value = "getSectionMemoList", method =RequestMethod.POST)
	public void getSectionMemoList(Memo memoObj, HttpServletResponse resp) {
		PrintWriter out = null;
		try {
			String MEMO_SUB = memoObj.getMEMO_SUB();
			List<Memo> mList = null;
			if(MEMO_SUB.equals("IMPORTANT"))
				mList = mService.getFavMemoList(memoObj);
			else if(MEMO_SUB.equals("TRASH"))
				mList = mService.getTraMemoList(memoObj);
			else
				mList = mService.getMemoList(memoObj);
			
			resp.setCharacterEncoding("UTF-8");
			out = resp.getWriter();
			if (mList.size() >0) {
				String jsonMemolist = new Gson().toJson(mList);
				out.println(jsonMemolist);
			} else {
				out.println("false");
			}
				
		} catch(Exception e) { 
			e.getStackTrace();
		} finally {
			if (out != null)
				out.close();
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
	@RequestMapping(value = "/setMemoColor", method = RequestMethod.POST)
	public void setMemoColor(Memo memoObj, HttpServletResponse resp) {
		PrintWriter out = null;
		System.out.println("USER_EMAIL:"+memoObj.getUSER_EMAIL()+" MEMO_NUM:"+memoObj.getMEMO_NUM()+" MEMO_COLOR:"+memoObj.getMEMO_COLOR());
		try {
			resp.setCharacterEncoding("UTF-8");
			out = resp.getWriter();
			if(mService.updateMemoColor(memoObj))
				out.print("true");
			else 
				out.println("false");
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (out != null)
				out.close();
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/setMemoLockAndUnlock", method = RequestMethod.POST)
	public void setMemoLockAndUnlock(Memo memoObj, HttpServletResponse resp) {
		PrintWriter out = null;
		try {
			resp.setCharacterEncoding("UTF-8");
			out = resp.getWriter();			
			if(memoObj.getMEMO_LOC().equals("Y")) {
				if (mService.updateMemoLockAndUnlock(memoObj))
					out.print("true");
			} else {
				String id = memoObj.getUSER_EMAIL();
				String pass = memoObj.getMEMO_KEYW();
				if(memberService.isId(id, pass)) {
					memoObj.setMEMO_KEYW("잠금 키워드 초기화");
					if(mService.updateMemoLockAndUnlock(memoObj)) {
						String memoContent = mService.getMemoContent(memoObj).getMEMO_TEX();
						String jsonContent = new Gson().toJson(memoContent);
						System.out.println(jsonContent.length());
						out.write(jsonContent);
					} else
						out.print("일시적인 오류로 메모 내용을 불러오지 못했습니다");
				} else {
					out.print("비밀번호가 틀립니다");
				}
			}
		} catch (Exception e) {
			e.getStackTrace();
		} finally {
			if(out != null)
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
	
	
}
>>>>>>> refs/remotes/origin/master
