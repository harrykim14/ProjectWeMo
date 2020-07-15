drop table mmember;
create table mmember(
	id varchar2(13) primary key,
	pass varchar2(30)  not null,
	LASTSECTION varchar2(30) default 'study'
);

