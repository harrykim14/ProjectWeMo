package com.naver.wemo.service;

import java.util.List;
import java.util.Map;

import com.naver.wemo.domain.Memo;

public interface MemoService {

	public boolean memoForNewAccount(String USER_EMAIL);
	public List<Memo> getMemoList(Memo memo);
	// 섹션값에 따라 메모 리스트 가져오기
	public List<Memo> getFavMemoList(Memo memo);
	public List<Memo> getTraMemoList(Memo memo);
	// 보관함/휴지통 메모 리스트 가져오기
	public boolean newMemo(Memo memo);
	// 새 메모 등록
	public Memo getLatestMemoInfo(Memo memo);
	// 마지막에 등록한 메모 값 가져오기
	public boolean adjustMemoboxzindex(Memo memo);
	// 새로 메모를 등록하거나 메모를 드래그 했다 뗐을 때 해당 메모를 제외한 나머지 메모의 z-index값을 변경
	public int getCountMemolist(Memo memo);
	// 메모의 개수 구하기
	public Map<String, Object> getCountSectionlist(String USER_EMAIL);
	public boolean setMemoLock(Memo memo);
	public boolean updateMemoFavorite(Memo memo);
	public boolean moveToTrashBackAndForth(Memo memo);
	public boolean deleteMemo(Memo memo);
	// 메모를 휴지통으로 이동 혹은 휴지통 내 메모 영구삭제
	public List<Memo> searchMemoList(Memo memo);
	// 메모 검색
	public boolean saveMemoProperties(Memo memoObj);
	
	
	
	
}
