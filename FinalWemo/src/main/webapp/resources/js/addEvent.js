var eventModal = $('#eventModal');
var addBtnContainer = $('.modalBtnContainer-addEvent');
var modifyBtnContainer = $('.modalBtnContainer-modifyEvent');


/* ****************
 *  새로운 일정 생성
 * ************** */
var newEvent = function (start, end, eventType) {
   
    $("#contextMenu").hide(); //메뉴 숨김
    
    modalTitle.html('새로운 일정');
    console.log("start:"+start +", end:"+end + ", eventType" + eventType)
    switch(eventType) {
    case "공부" : eventType = "STUDY"; break;
    case "운동" : eventType = "HEALTH"; break;
    case "가계부" : eventType = "MONEY"; break;
    }
    editType.val(eventType).prop('selected', true);
    editTitle.val('');
    editStart.val(start);
    editEnd.val(end);
    editDesc.val('');
    
    addBtnContainer.show();
    modifyBtnContainer.hide();
    
    eventModal.modal('show');

    //새로운 일정 저장버튼 클릭
    $('#save-event').unbind();
    $('#save-event').on('click', function () {

       var USER_EMAIL = $('#USER_EMAIL').text();
       
        var eventData = {
           USER_EMAIL: USER_EMAIL,
           title: editTitle.val(),
           start: Date.parse(editStart.val()),
           end: Date.parse(editEnd.val()),
           MEMO_TEX: editDesc.val(),
           MEMO_SUB: editType.val(),
           CALENDAR_USERNAME: USER_EMAIL,
           MEMO_COLOR: editColor.val(),            
           CALENDAR_TEXTCOLOR: '#000000',
           allDay: editAllDay.is(":checked")
           
        };
              
        if (eventData.start > eventData.end) {
            alert('끝나는 날짜가 앞설 수 없습니다.');
            return false;
        }

        if (eventData.title === '') {
            alert('일정명은 필수입니다.');
            return false;
        }

        var realEndDay;

        if (editAllDay.is(':checked')) {
            eventData.allDay = true;
        } else {
           eventData.allDay = false;
        }
        
        $("#calendar").fullCalendar('renderEvent', eventData, true);
        eventModal.find('input, textarea').val('');
        editAllDay.prop('checked', false);
        eventModal.modal('hide');
        
        $.ajax({
            type: "get",
            url: "CalendarWrite.net",   //insert
            data: eventData,
            success: function (response) {
               
                $('#calendar').fullCalendar('removeEvents');
                $('#calendar').fullCalendar('refetchEvents');
            }
        });
    });
};