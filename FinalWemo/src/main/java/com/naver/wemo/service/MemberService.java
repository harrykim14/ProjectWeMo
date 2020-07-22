package com.naver.wemo.service;

import java.util.List;
import java.util.Map;

import com.naver.wemo.domain.Member;

public interface MemberService {
	
	public boolean idcheck(String USER_EMAIL);
	// ȸ������ �� �� ���̵� �ߺ� �˻�
	public boolean isId(String USER_EMAIL, String USER_PASS);
	// �α��� �� �� ID/PW �˻�
	public boolean insertMember(Member member);
	// ȸ������ ���ν� insert
	public boolean updateMember(Member member);
	// ȸ�� ���� ���� �� update
	public boolean deleteMember(String USER_EMAIL);
	// ADMIN�� ȸ�� ���� ���
	public List<Member> getMemberList();
	// ADMIN�� ȸ�� ����Ʈ
	public boolean updateUserSetting(Member member);
	// ���� ���� ���ð� ������Ʈ
	public Map<String, String> getUserAutoForm(String USER_EMAIL);
	// ���� ���� �ڵ��ϼ� �� �������� ���
	public boolean updateLastSection(Member member);
	public Member getMemberDetail(String id);
	public boolean saveUserSetting(Member member);
	

}
