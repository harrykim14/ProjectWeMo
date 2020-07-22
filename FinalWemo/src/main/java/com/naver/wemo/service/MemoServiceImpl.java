package com.naver.wemo.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.naver.wemo.DAO.MemoDAO;
import com.naver.wemo.domain.Memo;

@Service
public class MemoServiceImpl implements MemoService {
	
	@Autowired
	MemoDAO memodao;

	@Override
	public List<Memo> getMemoList(Memo memo) {
		return memodao.getMemoList(memo);
	}
	
	@Override
	public boolean memoForNewAccount(String USER_EMAIL) {
		if(memodao.memoForNewAccount(USER_EMAIL) > 0) {
			return true;
		} else 
			return false;
	}
	
	@Override
	public boolean newMemo(Memo memo) {
		if(memodao.newMemo(memo) > 0) {
			return true;
		} else
			return false;
	}
	
	@Override
	public Memo getLatestMemoInfo(Memo memo) {
		return memodao.getLatestMemoInfo(memo);
	}
	
	@Override
	public boolean adjustMemoboxzindex(Memo memo) {
		if(memodao.adjustMemoboxzindex(memo)> 0) {
			return true;
		} else {
			return false;
		}
	}
	
	@Override
	public int getCountMemolist(Memo memo) {
		return memodao.getCountMemolist(memo);
	}

	@Override
	public boolean updateMemoLockAndUnlock(Memo memo) {
		if(memodao.updateMemoLockAndUnlock(memo) > 0)
			return true;
		else
			return false;
	}

	@Override
	public boolean updateMemoFavorite(Memo memo) {
		if(memodao.updateMemoFavorite(memo) > 0)
			return true;
		else
			return false;
	}
	
	@Override
	public boolean updateMemoColor(Memo memo) {
		if(memodao.updateMemoColor(memo) > 0)
			return true;
		else
			return false;
	}

	@Override
	public boolean deleteMemo(Memo memo) {
		if (memodao.deleteMemo(memo) > 0)
			return true;
		else
			return false;
	}

	@Override
	public List<Memo> searchMemoList(Memo memo) {
		memo.setMEMO_TEX("%"+memo.getMEMO_TEX()+"%");
		return memodao.searchMemoList(memo);
	}

	@Override
	public boolean saveMemoProperties(Memo memoObj) {
		if (memodao.saveMemoProperties(memoObj) > 0)
			return true;
		else
			return false;
	}
	
	@Override
	public boolean saveListedMemoProperties(Memo memoObj) {
		if (memodao.saveListedMemoProperties(memoObj) > 0)
			return true;
		else
			return false;
	}

	@Override
	public List<Memo> getFavMemoList(Memo memo) {
		return memodao.getFavMemoList(memo);
	}
	
	@Override
	public List<Memo> getTraMemoList(Memo memo) {
		return memodao.getTraMemoList(memo);
	}

	@Override
	public boolean moveToTrashBackAndForth(Memo memo) {
		if (memodao.moveToTrashBackAndForth(memo) > 0)
			return true;
		else
			return false;
	}

	@Override
	public Map<String, Object> getCountSectionlist(String USER_EMAIL) {
		System.out.println("MemoServiceImpl에서 getCountSectionlist()실행");
		return memodao.getCountSectionlist(USER_EMAIL);
	}

	@Override
	public Memo getMemoContent(Memo memo) {
		return memodao.getMemoContent(memo);
	}


}
