/* ****************
 *  일정 편집
 * ************** */
var gevent=""
var editEvent = function (event, element, view) {
   gevent=event
    $('#deleteEvent').data('id', event.USER_EMAIL); //클릭한 이벤트 ID

    $('.popover.fade.top').remove();
    $(element).popover("hide");

    if (event.allDay === true) {
        editAllDay.prop('checked', true);
    } else {
        editAllDay.prop('checked', false);
    }

    if (event.end === null) {
        event.end = event.start;
    }

    if (event.allDay === true && event.end !== event.start) {
        editEnd.val(moment(event.end).format('YYYY-MM-DD HH:mm'))
    } else {
       editEnd.val(moment(event.end).format('YYYY-MM-DD HH:mm'))
    }

    modalTitle.html('일정 수정');
    editTitle.val(event.title);
    editStart.val(event.start.format('YYYY-MM-DD HH:mm'));
    editType.val(event.MEMO_SUB);
    editDesc.val(event.MEMO_TEX);
    editColor.val(event.MEMO_COLOR).css('color', event.MEMO_COLOR);

    addBtnContainer.hide();
    modifyBtnContainer.show();
    eventModal.modal('show');

    //업데이트 버튼 클릭시
    $('#updateEvent').unbind();
    $('#updateEvent').on('click', function () {

        if (editStart.val() > editEnd.val()) {
            alert('끝나는 날짜가 앞설 수 없습니다.');
            return false;
        }

        if (editTitle.val() === '') {
            alert('일정명은 필수입니다.')
            return false;
        }

        var statusAllDay;
        var startDate;
        var endDate;
        var displayDate;
        var USER_EMAIL = $('#USER_EMAIL').text();

        if (editAllDay.is(':checked')) {
            statusAllDay = true;
            startDate = moment(editStart.val()).format('YYYY-MM-DD');
            endDate = moment(editEnd.val()).subtract(1, 'days').format('YYYY-MM-DD');
            displayDate = moment(editEnd.val()).format('YYYY-MM-DD');
        } else {
            statusAllDay = false;
            startDate = editStart.val();
            endDate = editEnd.val()
               //moment(editEnd.val()).subtract(1, 'days').format('YYYY-MM-DD');
            displayDate = moment(editEnd.val()).format('YYYY-MM-DD');
            /*endDate = moment(editEnd.val()).add(1, 'days').format('YYYY-MM-DD');
            displayDate = endDate;*/
        }

        eventModal.modal('hide');

        event.allDay = statusAllDay;
        event.title = editTitle.val();
        event.start = startDate;
        event.end = endDate;
        event.MEMO_SUB = editType.val();
        event.MEMO_COLOR = editColor.val();
        event.MEMO_TEX = editDesc.val();
       
       var eventfix = {
             USER_EMAIL : USER_EMAIL,
             MEMO_SUB : editType.val(),
             MEMO_TEX : editDesc.val(),
             title : editTitle.val(),
             start : Date.parse(editStart.val()),
             end : Date.parse(editEnd.val()),
             MEMO_COLOR : editColor.val(),
             allDay: editAllDay.is(":checked"),
             MEMO_NUM : event.MEMO_NUM
       }
       console.log("eventfix.start : " + eventfix.start + ", eventfix.end : " + eventfix.end)
       $("#calendar").fullCalendar('updateEvent', event);

       //일정 업데이트
        $.ajax({
            type: "get",
            url: "calendarupdate.net",   //update
            data: eventfix,
            /*dataType : "JSON",*/
            success: function (response) {
               //DB연동시 중복이벤트 방지를 위한
               $('#calendar').fullCalendar('removeEvents');
               $('#calendar').fullCalendar('refetchEvents');
            }
        });

    });
    

};

//삭제버튼
$('body').on('click','#deleteEvent', function () {
    
    $('#deleteEvent').unbind();
    $("#calendar").fullCalendar('removeEvents', $(this).data('id'));
    console.log($(this).data('id'))
    eventModal.modal('hide');
    
    var CalObj = {
            USER_EMAIL : $('#USER_EMAIL').text(),
            MEMO_NUM : gevent.MEMO_NUM
         };
    
    //삭제시
    $.ajax({
        type: "get",
        url: "calendarDeleteAction.net",   //delete
        data: CalObj,
        success: function (response) {
           console.log("calendarDeleteAction.net")
           $('#calendar').fullCalendar('removeEvents');
           $('#calendar').fullCalendar('refetchEvents');
        }
    });

});