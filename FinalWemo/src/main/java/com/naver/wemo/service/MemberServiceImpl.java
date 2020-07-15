package com.naver.wemo.service;

import java.util.List;
import java.util.Map;

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
	public boolean updateMember(Member member) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean deleteMember(String USER_EMAIL) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public List<Member> getMemberList() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean updateUserSetting(Member member) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public Map<String, String> getUserAutoForm(String USER_EMAIL) {
		// TODO Auto-generated method stub
		return null;
	}

}
