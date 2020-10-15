# ProjectWeMo

프로젝트 이름 : WeMo ~ 우리들의 메모 ~

프로젝트 요약 : 일상 생활에서 언제든 편하게 사용할 수 있는 싱글 페이지 메모 웹 어플리케이션

1. 로그인 화면 구성
<image src = "https://github.com/harrykim14/ProjectWeMo/blob/master/WeMo%20Screenshot/01.%20%EB%A1%9C%EA%B7%B8%EC%9D%B8%ED%99%94%EB%A9%B4.JPG">
  
SNS 로그인 구현은 다른 팀원이 진행하였으며 반응형을 고려한 UI와 간단한 유효성 검사 등을 본인이 구현함

2. 메인화면
<image src = "https://github.com/harrykim14/ProjectWeMo/blob/master/WeMo%20Screenshot/02.%20%EB%A9%94%EC%9D%B8%ED%99%94%EB%A9%B4.JPG">
  
생성된 메모는 jQuery UI의 draggable()과 resizable()을 사용하여 화면 어디에든 위치할 수 있으며 사이즈 또한 사용자가 조절하여 사용할 수 있음.
메모는 입력된 개행(enter) 수에 비례하여 크기가 자동으로 조절되며 메모를 들었다 놓는것 만으로 ajax를 통해 DB에 바로 메모의 내용을 저장할 수 있음.
