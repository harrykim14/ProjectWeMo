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
		
		if (mList != null) { // ���� ���� memo�� �����ϸ� mList�� �𵨺信 ��� WeMo_Main���� ����
			mv.addObject("Memolist", mList);
			mv.addObject("MEMO_SUB", MEMO_SUB);
			mv.setViewName("WeMo_Main");
			return mv;
		} else { // �� �������� �α��� �ϸ� mList�� �ݵ�� null�̹Ƿ� �� �޸� �߰�
			if(mService.memoForNewAccount(id)) {
				//firstInsert�� �˾ƺ��� ������ �� ���� �޸��� �޼ҵ���� ���� (return���� boolean���� ����)
			memo.setMEMO_NUM(1);
			memo = mService.getLatestMemoInfo(memo);
				// �� �޸� ���� �� num���� 1�� �������ѵΰ� 1�� �޸��� �������� ������
			mList = new ArrayList<Memo>(); 
				// �������� �ۿ��� ��ȸ�� mList���� null�̱� ������ �������� ������ new�� Ʋ�� ���� ����
			mList.add(memo);
				// null�� mList�� memo ��ü�� ��� �𵨺信 mList�� ���
			mv.addObject("Memolist", mList);
			mv.addObject("MEMO_SUB", MEMO_SUB);
			
			mv.setViewName("WeMo_Main");
			return mv;
			} else { // memoForNewAccount()���� �������� �α���ȭ������ history.back()
				PrintWriter out = resp.getWriter();
				System.out.println("���ο� ������ ��ϵǾ����� ����Ʈ �޸� ����ϴµ� �����Ͽ����ϴ�.");
				out.println("<script>alert('������ ���� ������ �� �������ϴ�. �ٽ� �α��� �� �ּ���'); history.back();</script>");
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
				// newMemo�� return���� boolean
				memoObj = mService.getLatestMemoInfo(memoObj);
					String ajaxReturnData = new Gson().toJson(memoObj);
					int latestMEMO_NUM = memoObj.getMEMO_NUM();
					// �� �������� �߰��� �޸��� ������ �������� �� �������� �޸� ��ȣ�� ����
					int countMemolist = mService.getCountMemolist(memoObj);
					System.out.println("�޸� ����Ʈ ���� : " + countMemolist);
					// �޸� ����Ʈ ������ ���ؼ� 1���� ũ�ٸ� z-index�� ó���ϱ�
					if(countMemolist > 1) {
						memoObj.setMEMO_NUM(latestMEMO_NUM);
						if(mService.adjustMemoboxzindex(memoObj)) {
							// �ش� �޸��ȣ�� ������ �������� z-index���� -1ó��	
							System.out.println("�ش� �޸��ȣ�� ������ �������� z-index���� -1ó��");
							return ajaxReturnData;
						} else {
							out = resp.getWriter();
							out.println("<script>alert('�� �޸� �߰��ϴ� ���� ������ �߻��߽��ϴ�. �ٽ� �õ����ּ���.')</script>");
							return null;
						}
					} else {
						// countMemolist = 1�̶�� ��� �߰��� �޸�ۿ� �����Ƿ� ó���� �ʿ� ���� out�ݰ� memo�� ����
						return ajaxReturnData;
					}
					
			} else {
				out = resp.getWriter();
				out.println("<script>alert('�� �޸� �߰��ϴµ� �����Ͽ����ϴ�. �ٽ� �õ����ּ���.');</script>");
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
			// request�� �޾ƿ� ������ member��ü�� memo��ü�� ���� ����
			member.setUSER_EMAIL(memoObj.getUSER_EMAIL());
			member.setUSER_SUB(memoObj.getMEMO_SUB());
			String Section = memoObj.getMEMO_SUB();
			// member ���̺��� USER_SUB�� ������Ʈ �ϰ� ������Ʈ�� �����ϸ� �ش� ������ �޸� ����Ʈ�� �޾ƿ�
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
				System.out.println("������ ����");
			} else {			
				out.println("<script>alert('������ ���濡 ������ �߻��Ͽ����ϴ�. ��� �Ŀ� �ٽ� �õ��� �ּ���.')</script>");
			}
			
		} else {
			System.out.println("memberService.updateLastSection()���� ������ �߻��Ͽ����ϴ�");
			out = resp.getWriter();
			out.println("<script>alert('������ ���� ���߿� ������ �߻��Ͽ����ϴ�. ��� �Ŀ� �ٽ� �õ��� �ּ���.')</script>");
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