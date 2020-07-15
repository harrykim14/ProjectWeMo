drop table memo;
create table memo(
	id varchar2(13) references mmember id,
	number number primary key,
	subject varchar2(300),
	content varchar2(3000),
	study number(1) default 0,
	monty number(1) default 0,
	health number(1) default 0,
	date date
);