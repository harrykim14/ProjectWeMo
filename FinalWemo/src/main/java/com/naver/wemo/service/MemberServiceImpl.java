package com.naver.wemo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.naver.wemo.DAO.MemberDAO;
import com.naver.wemo.domain.Member;

@Service
public class MemberServiceImpl implements MemberService {

	@Autowired
	MemberDAO mdao;
	
	@Override
	public boolean idcheck(String USER_EMAIL) {
		 String check = mdao.idcheck(USER_EMAIL);
		 System.out.println(check);
		 if(check == null) {
			 return false;
		 } else {
			 return true;
		 }
	}

	@Override
	public boolean isId(String USER_EMAIL, String USER_PASS) {
		String pass = mdao.isId(USER_EMAIL);
		if (USER_PASS.equals(pass))
			return true;
		else
			return false;
	}
	
	@Override
	public boolean updateLastSection(Member member) {
		if (mdao.updateLastSection(member) > 0)
			return true;
		else
			return false;
	}

	@Override
	public boolean insertMember(Member member) {
		 if (mdao.insertMember(member) > 0)
		 	return true;
		 else 
			 return false;
	}

	@Override
	public Member getMemberDetail(String id) {
		return mdao.getMemberDetail(id);
	}

	@Override
	public boolean saveUserSetting(Member member) {
		if (mdao.saveUserSetting(member) > 0)
			return true;
		else 
			return false;
	}

	@Override
	public Member getUserAutoForm(Member member) {
		return mdao.getUserAutoForm(member);
	}
	
	@Override
	public boolean kakaoJoin(String kemail) {
		if (mdao.kakaoJoin(kemail) > 0)
		 	return true;
		 else 
			 return false;
		
	}
	@Override
	public boolean naverJoin(String nemail) {
		if (mdao.naverJoin(nemail) > 0)
		 	return true;
		 else 
			 return false;
		
	}

}
