package com.naver.wemo.service;

import java.util.List;
import java.util.Map;

import com.naver.wemo.domain.Member;

public interface MemberService {
	
	public boolean idcheck(String USER_EMAIL);
	// 회원가입 할 때 아이디 중복 검사
	public boolean isId(String USER_EMAIL, String USER_PASS);
	// 로그인 할 때 ID/PW 검사
	public boolean insertMember(Member member);
	// 회원가입 승인시 insert
	public boolean updateMember(Member member);
	// 회원 정보 수정 시 update
	public boolean deleteMember(String USER_EMAIL);
	// ADMIN의 회원 삭제 기능
	public List<Member> getMemberList();
	// ADMIN의 회원 리스트
	public boolean updateUserSetting(Member member);
	// 유저 설정 세팅값 업데이트
	public Map<String, String> getUserAutoForm(String USER_EMAIL);
	// 유저 설정 자동완성 폼 가져오는 기능
	public boolean updateLastSection(Member member);
	

}
