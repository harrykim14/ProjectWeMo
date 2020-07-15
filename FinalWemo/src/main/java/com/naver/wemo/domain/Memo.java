/*2020-07-13 MemoBean에 MEMO_TRA(휴지통에 있는 메모인지 아닌지를 판별하는 컬럼)를 추가
 * 
 * */

package com.naver.wemo.domain;

public class Memo {
	private String USER_EMAIL; 	
	private int MEMO_NUM;		
	private String MEMO_SUB;	
	private String MEMO_POSITION;	
	private String MEMO_TOP;	
	private String MEMO_LEFT;	
	private String MEMO_COLOR;	
	private String MEMO_WIDTH;
	private String MEMO_HEIGHT;
	private int MEMO_ZID;		
	private String MEMO_TEX;	
	private String MEMO_DATE;		
	private String MEMO_PRE;		
	private String PREV_TEX;	
	private String MEMO_FAV;	
	private String MEMO_LOC;
	private String MEMO_TRA;
	private String MEMO_KEYW;
	
	public String getMEMO_TRA() {
		return MEMO_TRA;
	}
	public void setMEMO_TRA(String mEMO_TRA) {
		MEMO_TRA = mEMO_TRA;
	}
	public String getMEMO_KEYW() {
		return MEMO_KEYW;
	}
	public void setMEMO_KEYW(String mEMO_KEYW) {
		MEMO_KEYW = mEMO_KEYW;
	}
	public String getUSER_EMAIL() {
		return USER_EMAIL;
	}
	public void setUSER_EMAIL(String uSER_EMAIL) {
		USER_EMAIL = uSER_EMAIL;
	}
	public int getMEMO_NUM() {
		return MEMO_NUM;
	}
	public void setMEMO_NUM(int mEMO_NUM) {
		MEMO_NUM = mEMO_NUM;
	}
	public String getMEMO_SUB() {
		return MEMO_SUB;
	}
	public void setMEMO_SUB(String mEMO_SUB) {
		MEMO_SUB = mEMO_SUB;
	}
	public String getMEMO_POSITION() {
		return MEMO_POSITION;
	}
	public void setMEMO_POSITION(String mEMO_POSITION) {
		MEMO_POSITION = mEMO_POSITION;
	}
	public String getMEMO_TOP() {
		return MEMO_TOP;
	}
	public void setMEMO_TOP(String mEMO_TOP) {
		MEMO_TOP = mEMO_TOP;
	}
	public String getMEMO_LEFT() {
		return MEMO_LEFT;
	}
	public void setMEMO_LEFT(String mEMO_LEFT) {
		MEMO_LEFT = mEMO_LEFT;
	}
	public String getMEMO_COLOR() {
		return MEMO_COLOR;
	}
	public void setMEMO_COLOR(String mEMO_COLOR) {
		MEMO_COLOR = mEMO_COLOR;
	}
	public String getMEMO_WIDTH() {
		return MEMO_WIDTH;
	}
	public void setMEMO_WIDTH(String mEMO_WIDTH) {
		MEMO_WIDTH = mEMO_WIDTH;
	}
	public String getMEMO_HEIGHT() {
		return MEMO_HEIGHT;
	}
	public void setMEMO_HEIGHT(String mEMO_HEIGHT) {
		MEMO_HEIGHT = mEMO_HEIGHT;
	}
	public int getMEMO_ZID() {
		return MEMO_ZID;
	}
	public void setMEMO_ZID(int mEMO_ZID) {
		MEMO_ZID = mEMO_ZID;
	}
	public String getMEMO_TEX() {
		return MEMO_TEX;
	}
	public void setMEMO_TEX(String mEMO_TEX) {
		MEMO_TEX = mEMO_TEX;
	}
	public String getMEMO_DATE() {
		return MEMO_DATE;
	}
	public void setMEMO_DATE(String mEMO_DATE) {
		MEMO_DATE = mEMO_DATE;
	}
	public String getMEMO_PRE() {
		return MEMO_PRE;
	}
	public void setMEMO_PRE(String mEMO_PRE) {
		MEMO_PRE = mEMO_PRE;
	}
	public String getPREV_TEX() {
		return PREV_TEX;
	}
	public void setPREV_TEX(String pREV_TEX) {
		PREV_TEX = pREV_TEX;
	}
	public String getMEMO_FAV() {
		return MEMO_FAV;
	}
	public void setMEMO_FAV(String mEMO_FAV) {
		MEMO_FAV = mEMO_FAV;
	}
	public String getMEMO_LOC() {
		return MEMO_LOC;
	}
	public void setMEMO_LOC(String mEMO_LOC) {
		MEMO_LOC = mEMO_LOC;
	}
	
}
