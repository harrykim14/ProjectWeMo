package com.naver.wemo.service;

import com.naver.wemo.domain.Member;

public interface MemberService {
	
	public boolean idcheck(String USER_EMAIL);
	// 회원가입 할 때 아이디 중복 검사
	public boolean isId(String USER_EMAIL, String USER_PASS);
	// 로그인 할 때 ID/PW 검사
	public boolean insertMember(Member member);
	// 회원가입 승인시 insert
	public Member getUserAutoForm(Member member);
	// 유저 설정 자동완성 폼 가져오는 기능
	public boolean updateLastSection(Member member);
	public Member getMemberDetail(String id);
	public boolean saveUserSetting(Member member);
	
	/* SNS 로그인용 메서드 */
	public boolean kakaoJoin(String kemail);
	public boolean naverJoin(String nemail);	

}
