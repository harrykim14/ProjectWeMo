package com.naver.wemo.DAO;

import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.naver.wemo.domain.Memo;

@Repository
public class MemoDAO {
	@Autowired
	private SqlSessionTemplate sqlSession;
	
	public List<Memo> getMemoList(Memo memo) {
		return sqlSession.selectList("Memoes.getMemoList", memo);		
	}

	public int memoForNewAccount(String USER_EMAIL) {
		return sqlSession.insert("Memoes.memoForNewAccount",USER_EMAIL);
	}

	public int newMemo(Memo memo) {
		return sqlSession.insert("Memoes.newMemo", memo);
	}

	public Memo getLatestMemoInfo(Memo memo) {
		return sqlSession.selectOne("Memoes.getLatestMemoInfo", memo);
	}

	public int adjustMemoboxzindex(Memo memo) {
		return sqlSession.update("Memoes.adjustMemoboxzindex", memo);
	}

	public int getCountMemolist(Memo memo) {
		return sqlSession.selectOne("Memoes.getCountMemolist", memo);
	}

	public int deleteMemo(Memo memo) {
		return sqlSession.delete("Memoes.deleteMemo", memo);
	}

	public int saveMemoProperties(Memo memoObj) {
		return sqlSession.update("Memoes.saveMemoProperties", memoObj);
	}

	public List<Memo> getFavMemoList(Memo memo) {
		return sqlSession.selectList("Memoes.getFavMemoList", memo);
	}
	
	public List<Memo> getTraMemoList(Memo memo) {
		return sqlSession.selectList("Memoes.getTraMemoList", memo);
	}
	
	public int updateMemoLockAndUnlock(Memo memo) {
		return sqlSession.update("Memoes.updateMemoLockAndUnlock", memo);
	}

	public int updateMemoFavorite(Memo memo) {
		return sqlSession.update("Memoes.updateMemoFavorite",memo);
	}
	
	public int updateMemoColor(Memo memo) {
		return sqlSession.update("Memoes.updateMemoColor", memo);
	}

	public List<Memo> searchMemoList(Memo memo) {
		return sqlSession.selectList("Memoes.searchMemoList", memo);
	}

	public int moveToTrashBackAndForth(Memo memo) {
		return sqlSession.update("Memoes.moveToTrashBackAndForth", memo);
	}

	public Map<String, Object> getCountSectionlist(String USER_EMAIL) {
		return sqlSession.selectOne("Memoes.getCountSectionlist", USER_EMAIL);
	}

	public Memo getMemoContent(Memo memo) {
		return sqlSession.selectOne("Memoes.getMemoContent", memo);
	}

	

	
	
}
