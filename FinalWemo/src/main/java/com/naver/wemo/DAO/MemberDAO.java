package com.naver.wemo.DAO;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.naver.wemo.domain.Member;

@Repository
public class MemberDAO {
	
	@Autowired
	private SqlSessionTemplate sqlSession;
	
	public int insertMember(Member member) {
			return sqlSession.insert("Members.insert", member);
		}
	
	public String idcheck(String USER_EMAIL) {
		return sqlSession.selectOne("Members.idcheck", USER_EMAIL);
	}
	
	public String isId(String USER_EMAIL) {
		return sqlSession.selectOne("Members.isId", USER_EMAIL);
	}

	public Member getMemberDetail(String USER_EMAIL) {
		return sqlSession.selectOne("Members.getMemberDetail", USER_EMAIL);
	}

	public int updateLastSection(Member member) {
		return sqlSession.update("Members.updateLastSection", member);
	}

	public int saveUserSetting(Member member) {
		return sqlSession.update("Members.saveUserSetting", member);
	}

	public Member getUserAutoForm(Member member) {
		return sqlSession.selectOne("Members.getUserAutoForm", member);
	}
	
	public int kakaoJoin(String kemail) {
		return sqlSession.insert("Members.kakaoInsert",kemail);
	}
	
	public int naverJoin(String nemail) {
		return sqlSession.insert("Members.naverInsert",nemail);
	}
}
