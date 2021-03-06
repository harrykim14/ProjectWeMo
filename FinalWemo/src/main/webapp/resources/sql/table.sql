drop table memo purge;
drop table mmember purge;
CREATE TABLE MEMBER(
	USER_EMAIL VARCHAR2(100) PRIMARY KEY,
	USER_PASS VARCHAR2(30),
	AUTH_TYPE VARCHAR2(100) DEFAULT('WEMO'),
	USER_NICK VARCHAR2(30),
	USER_FORM1 CLOB DEFAULT('설정된 자동완성 폼이 없습니다'),
	USER_FORM2 CLOB DEFAULT('설정된 자동완성 폼이 없습니다'),
	USER_FORM3 CLOB DEFAULT('설정된 자동완성 폼이 없습니다'),
	USER_SUB VARCHAR2(30) DEFAULT('STUDY')
	)	
SELECT (SELECT USER_FORM1 FROM MEMBER WHERE USER_EMAIL = 'g@gmail.com') FROM DUAL 
	SELECT COALESCE(TO_CHAR(MEMO_TEX), '빈 메모') MEMO_TEX FROM MEMO WHERE USER_EMAIL = 'g@gmail.com' AND MEMO_NUM = 11
ALTER TABLE MEMO MODIFY(MEMO_KEYW VARCHAR2(100))
DROP TABLE MEMBER CASCADE Constraints;
INSERT INTO MEMBER VALUES('g@gmail.com', '1234', 'WEMO', 'g@gmail.com', '설정된 자동완성 폼이 없습니다', '설정된 자동완성 폼이 없습니다', '설정된 자동완성 폼이 없습니다', 'STUDY');
INSERT INTO MEMBER VALUES('h@gmail.com', '1234', 'WEMO', 'h@gmail.com', 'No Form Now', 'STUDY');
UPDATE MEMBER SET USER_SUB = 'WORKOUT' WHERE USER_EMAIL = 'g@gmail.com';
DROP TABLE MEMO;
CREATE TABLE MEMO(
	USER_EMAIL VARCHAR2(100) REFERENCES MEMBER(USER_EMAIL),
	MEMO_NUM NUMBER(20) PRIMARY KEY,
	MEMO_SUB VARCHAR2(30) NOT NULL,
	MEMO_POSITION VARCHAR2(20) DEFAULT('ABSOLUTE') NOT NULL,
	MEMO_TOP VARCHAR2(20),
	MEMO_LEFT VARCHAR2(20),
	MEMO_COLOR VARCHAR2(20),
	MEMO_WIDTH VARCHAR2(20),
	MEMO_HEIGHT VARCHAR2(20),
	MEMO_ZID NUMBER(20),
	MEMO_TEX CLOB,
	MEMO_DATE VARCHAR2(10),
	PREV_TEX CLOB,
	MEMO_PRE VARCHAR2(10),
	MEMO_FAV VARCHAR2(3) DEFAULT('N'),
	MEMO_LOC VARCHAR2(3) DEFAULT('N'),
	MEMO_TRA VARCHAR2(3) DEFAULT('N'),
	MEMO_KEYW VARCHAR2(20)
);
DROP TABLE MEMO;
SELECT M.MEMO_TEX FROM (SELECT MEMO_TEX, ROWNUM FROM MEMO ORDER BY ROWNUM DESC) M WHERE ROWNUM = 1;
UPDATE MEMO SET MEMO_COLOR = 'PURPLE' WHERE USER_EMAIL = 'g@gmail.com' AND MEMO_NUM = 7;
SELECT * FROM MEMO;
SELECT * FROM MEMBER;
SELECT * FROM MEMO WHERE USER_EMAIL = 'g@gmail.com' AND MEMO_SUB = 'MONEY';
DELETE MEMBER WHERE USER_EMAIL = 'UNDIFINED'
DELETE MEMO WHERE USER_EMAIL = 'g@gmail.com' AND MEMO_SUB = 'MONEY' AND MEMO_NUM = 2;
SELECT * FROM MEMO WHERE USER_EMAIL = 'g@gmail.com' AND MEMO_SUB = 'STUDY';
SELECT * FROM MEMO WHERE USER_EMAIL = 'g@gmail.com' AND MEMO_SUB = 'STUDY' AND MEMO_NUM = (SELECT MAX(MEMO_NUM) FROM MEMO WHERE USER_EMAIL = 'g@gmail.com' AND MEMO_SUB = 'STUDY')
DELETE FROM MEMO WHERE USER_EMAIL = 'g@gmail.com';
SELECT USER_EMAIL, MEMO_NUM, MEMO_SUB, 
			   MEMO_POSITION, MEMO_TOP, MEMO_LEFT, 
			   MEMO_COLOR, MEMO_WIDTH, MEMO_HEIGHT, MEMO_ZID, 
			   MEMO_TEX, TO_DATE(TRUNC(MEMO_DATE, 'DD'), 'YY-MM-DD') MEMO_DATE, 
			   PREV_TEX, TO_DATE(TRUNC(MEMO_PRE, 'DD'), 'YY-MM-DD') MEMO_PRE, 
			   MEMO_FAV, MEMO_LOC, MEMO_KEYW 
		FROM MEMO 
		WHERE USER_EMAIL = 'g@gmail.com' AND MEMO_SUB = 'STUDY'
		ORDER BY MEMO_ZID DESC
INSERT INTO MEMO VALUES('g@gmail.com', 4, 'MONEY', 'ABSOLUTE', '100px', '100px', 'khaki', '350px', '200px', 999, 'WeMo에 오신것을 환영합니다', TO_CHAR(2020-07-15, 'YYYY-MM-DD'), 'WeMo에 오신것을 환영합니다', TO_CHAR(2020-07-15, 'YYYY-MM-DD'), 'N', 'N', 'N', '잠금 키워드');
INSERT INTO MEMO VALUES('g@gmail.com', 5, 'HEALTH', 'ABSOLUTE', '100px', '100px', 'khaki', '350px', '200px', 999, 'WeMo에 오신것을 환영합니다', TO_CHAR(2020-07-16, 'YYYY-MM-DD'), 'WeMo에 오신것을 환영합니다', TO_CHAR(2020-07-16, 'YYYY-MM-DD'), 'N', 'N', 'N', '잠금 키워드');
INSERT INTO MEMO VALUES('g@gmail.com', 6, 'STUDY', 'ABSOLUTE', '100px', '100px', 'khaki', '350px', '200px', 999, 'WeMo에 오신것을 환영합니다', TO_CHAR(2020-07-17, 'YYYY-MM-DD'), 'WeMo에 오신것을 환영합니다', TO_CHAR(2020-07-17, 'YYYY-MM-DD'), 'N', 'N', 'N', '잠금 키워드');

SELECT MEMO_SUB, COUNT(MEMO_SUB) COUNT FROM MEMO WHERE USER_EMAIL = 'g@gmail.com' AND MEMO_TRA = 'N' GROUP BY MEMO_SUB;
SELECT MEMO_SUB, COUNT(MEMO_SUB) CNT FROM MEMO WHERE USER_EMAIL = 'g@gmail.com' GROUP BY MEMO_SUB;
UPDATE MEMO SET MEMO_ZID = MEMO_ZID-1 
		WHERE USER_EMAIL = 'g@gmail.com'
		  AND MEMO_SUB = 'STUDY' 
		  AND MEMO_NUM != 1;
		  
SELECT TO_CHAR(SYSDATE, 'D') FROM DUAL;

SELECT (SELECT COUNT(MEMO_SUB) FROM MEMO WHERE USER_EMAIL = 'g@gmail.com' AND MEMO_SUB = 'STUDY' AND MEMO_TRA = 'N') STUDY,
	   (SELECT COUNT(MEMO_SUB) FROM MEMO WHERE USER_EMAIL = 'g@gmail.com' AND MEMO_SUB = 'HEALTH' AND MEMO_TRA = 'N') HEALTH,
	   (SELECT COUNT(MEMO_SUB) FROM MEMO WHERE USER_EMAIL = 'g@gmail.com' AND MEMO_SUB = 'MONEY' AND MEMO_TRA = 'N') MONEY
FROM DUAL;
		  
		  
SELECT MEMO_DATE, TO_CHAR(TO_DATE(MEMO_DATE, 'yy-mm-dd'), 'DAY') DAY, COUNT(TO_CHAR(TO_DATE(MEMO_DATE, 'yy-mm-dd'), 'DAY')) COUNT 
FROM MEMO 
WHERE USER_EMAIL = 'g@gmail.com' 
AND MEMO_DATE BETWEEN (SELECT MAX(TO_DATE(MEMO_DATE))-7 FROM MEMO WHERE USER_EMAIL = 'g@gmail.com') 
				  AND (SELECT MAX(TO_DATE(MEMO_DATE)) FROM MEMO WHERE USER_EMAIL = 'g@gmail.com') 
GROUP BY MEMO_DATE 
ORDER BY MEMO_DATE;
