# ProjectWeMo

프로젝트 이름 : WeMo ~ 우리들의 메모 ~

프로젝트 요약 : 일상 생활에서 언제든 편하게 사용할 수 있는 싱글 페이지 메모 웹 어플리케이션

<b>1. 로그인 화면 구성</b>
<image src = "https://github.com/harrykim14/ProjectWeMo/blob/master/WeMo%20Screenshot/01.%20%EB%A1%9C%EA%B7%B8%EC%9D%B8%ED%99%94%EB%A9%B4.JPG">
  
SNS 로그인 구현은 다른 팀원이 진행하였으며 반응형을 고려한 UI와 간단한 유효성 검사 등을 본인이 구현함

<b>2. 메인화면</b>
<image src = "https://github.com/harrykim14/ProjectWeMo/blob/master/WeMo%20Screenshot/02.%20%EB%A9%94%EC%9D%B8%ED%99%94%EB%A9%B4.JPG">
  
생성된 메모는 jQuery UI의 draggable()과 resizable()을 사용하여 화면 어디에든 위치할 수 있으며 사이즈 또한 사용자가 조절하여 사용할 수 있음.
메모는 입력된 개행(enter) 수에 비례하여 크기가 자동으로 조절되며 메모를 들었다 놓는것 만으로 ajax를 통해 DB에 바로 메모의 내용을 저장할 수 있음.

<b>3. 메모 정리기능</b>
<image src="https://github.com/harrykim14/ProjectWeMo/blob/master/WeMo%20Screenshot/03.%20%EB%A9%94%EB%AA%A8%EC%A0%95%EB%A6%AC%EA%B8%B0%EB%8A%A5.JPG">

메모가 겹쳐 안보이게 될 경우를 고려하여 상단탭 우측에 "메모 정리" 버튼을 구현하였음. 메모들은 화면 너비에 비례하여 정리되며 버튼을 다시 누르면 원래 상태로 복귀됨.

<b>4. 메모 보관기능</b><br>
<image src="https://github.com/harrykim14/ProjectWeMo/blob/master/WeMo%20Screenshot/04.%20%EB%B3%B4%EA%B4%80%ED%95%A8.JPG" width ="300px">
  
메모 우측상단에 위치한 별 모양의 마크를 눌러 분홍색으로 활성화하면 보관함 탭에서 카테고리에 상관 없이 중요한 메모들을 볼 수 있다.

<b>5. 휴지통 내 메모 복구 기능</b><br>
<image src= "https://github.com/harrykim14/ProjectWeMo/blob/master/WeMo%20Screenshot/05.%20%ED%9C%B4%EC%A7%80%ED%86%B5%EC%97%90%EC%84%9C%20%EB%A9%94%EB%AA%A8%20%EB%B3%B5%EA%B5%AC%ED%95%98%EA%B8%B0.jpg">
  
메모 우측상단의 휴지통 마크를 클릭하면 메모는 휴지통에서만 볼 수 있으며 휴지통으로 이동된 메모의 우측 상단에는 메모 복구 아이콘이 추가됨. 추가된 메모 복구 아이콘을 클릭하면 원래 있었던 페이지로 이동되며 휴지통에서는 안보이게 된다.

<b>6. 통계 페이지</b><br>
<img src ="https://github.com/harrykim14/ProjectWeMo/blob/master/WeMo%20Screenshot/06.%20%ED%86%B5%EA%B3%84%ED%99%94%EB%A9%B4.JPG">

통계 탭에서는 유저가 작성한 카테고리 별 메모 수를 집계하여 파이차트로 볼 수 있으며 이 파이차트는 구글 API를 사용하였음.

<b>7. 자동완성 기능</b><br>
<img src = "https://github.com/harrykim14/ProjectWeMo/blob/master/WeMo%20Screenshot/07.%20%EC%84%A4%EC%A0%95%EC%97%90%EC%84%9C%20%EC%9E%90%EB%8F%99%EC%99%84%EC%84%B1%20%ED%8F%BC%20%EC%A0%80%EC%9E%A5%ED%95%98%EA%B8%B0.JPG">

설정 탭에서는 유저가 자주 사용하는 문구를 최대 세 개까지 저장할 수 있으며 저장된 문구는 단축키를 눌렀을 때 클립보드로 저장되며 유저는 클립보드로 저장된 내용을 복사함으로써 원하는 내용을 쉽게 사용할 수 있다. <br>

<img src =https://github.com/harrykim14/ProjectWeMo/blob/master/WeMo%20Screenshot/07-1.%20%EC%9E%90%EB%8F%99%EC%99%84%EC%84%B1%20%ED%8F%BC%20%ED%81%B4%EB%A6%BD%EB%B3%B4%EB%93%9C%EB%A1%9C%20%EB%B3%B5%EC%82%AC%ED%95%98%EA%B3%A0%20%EB%B6%99%EC%97%AC%EB%84%A3%EA%B8%B0.jpg"><br>
(단축키를 누르면 화면 상단에 클립보드에 복사되었다는 메시지가 표시되었다가 사라진다)

