var draggedEventIsAllDay;
var activeInactiveWeekends = true;

var eventModal = $('#eventModal');

var modalTitle = $('.modal-title');
var editAllDay = $('#edit-allDay');
var editTitle = $('#edit-title');
var editStart = $('#edit-start');
var editEnd = $('#edit-end');
var editType = $('#MEMO_SUB');
var editColor = $('#MEMO_COLOR');
var editDesc = $('#MEMO_TEX');

function getDisplayEventDate(event) {

  var displayEventDate;
  
  if (event.allDay == false) {  
    var startTimeEventInfo = moment(event.start).format('HH:mm');
    var endTimeEventInfo = moment(event.end).format('HH:mm');
    displayEventDate = startTimeEventInfo + " - " + endTimeEventInfo;
  } else {
    displayEventDate = "하루종일";
  }
  console.log(displayEventDate)
  return displayEventDate;
}

function filtering(event) {
  var show_username = true;
  var show_type = true;

  var CALENDAR_USERNAME = $('input:checkbox.filter:checked').map(function () {
     
     return $(this).val();
  }).get();
 
  var types = $('#type_filter').val();

  show_username = CALENDAR_USERNAME.indexOf(event.CALENDAR_USERNAME) >= 0;
  
  if (types && types.length > 0) {
    if (types[0] == "all") {
      show_type = true;
    } else {
      show_type = types.indexOf(event.MEMO_SUB) >= 0;
    }
  }
 
  return  show_username && show_type;
}

function calDateWhenResize(event) {

  var newDates = {
    startDate: '',
    endDate: ''
  };

  if (event.allDay) {
    newDates.startDate = moment(event.start._d).format('YYYY-MM-DD');
    newDates.endDate = moment(event.end._d).subtract(1, 'days').format('YYYY-MM-DD');
  } else {
    newDates.startDate = moment(event.start._d).format('YYYY-MM-DD HH:mm');
    newDates.endDate = moment(event.end._d).subtract(1, 'days').format('YYYY-MM-DD HH:mm');
  }

  return newDates;
}

function calDateWhenDragnDrop(event) {
  // 드랍시 수정된 날짜반영
  var newDates = {
    startDate: '',
    endDate: ''
  }

  // 날짜 & 시간이 모두 같은 경우
  if(!event.end) {
    event.end = event.start;
  }

  //하루짜리 all day
  if (event.allDay && event.end === event.start) {
    
    newDates.startDate = moment(event.start._d).format('YYYY-MM-DD');
    newDates.endDate = newDates.startDate;
  }

  //2일이상 all day
  else if (event.allDay && event.end !== null) {
    newDates.startDate = moment(event.start._d).format('YYYY-MM-DD');
    newDates.endDate = moment(event.end._d).subtract(1, 'days').format('YYYY-MM-DD');
  }

  //all day가 아님
  else if (!event.allDay) {
   /* newDates.startDate = moment(new Date(event.start._d)).format('YYYY-MM-DD HH:mm');*/
    newDates.endDate = moment(new Date(event.end._d)).subtract(1, 'days').format('YYYY-MM-DD HH:mm');
  }

  return newDates;
}


var calendar = $('#calendar').fullCalendar({
   
  eventRender: function (event, element, view) {
     
     switch(event.MEMO_SUB) {
       case "STUDY" : event.MEMO_SUB = "공부"; break;
       case "HEALTH" : event.MEMO_SUB = "운동"; break;
       case "MONEY" : event.MEMO_SUB = "가계부"; break;
       }
     console.log(event)
    element.popover({
      title: $('<div />', {
        class: 'popoverTitleCalendar',
        text: event.title
      }).css({
        'background': event.MEMO_COLOR,
        'color': event.CALENDAR_TEXTCOLOR
      }),
      content: $('<div />', {
          class: 'popoverInfoCalendar'
        }).append('<p><strong>등록자:</strong> ' + event.USER_EMAIL + '</p>')
        .append('<p><strong>구분:</strong> ' + event.MEMO_SUB + '</p>')
        .append('<p><strong>시간:</strong> ' + getDisplayEventDate(event) + '</p>')
        .append('<div class="popoverDescCalendar"><strong>설명:</strong> ' + event.MEMO_TEX + '</div>'),
      delay: {
        show: "800",
        hide: "50"
      },
      trigger: 'hover',
      placement: 'top',
      html: true,
      container: 'body'
    });

    return filtering(event);

  },

  //주말 숨기기 & 보이기 버튼
  customButtons: {
    viewWeekends: {
      text: '주말',
      click: function () {
        activeInactiveWeekends ? activeInactiveWeekends = false : activeInactiveWeekends = true;
        $('#calendar').fullCalendar('option', {
          weekends: activeInactiveWeekends
        });
      }
    }
  },

  header: {
    left: 'prevYear, nextYear',
    center: 'prev, title, next',
    right: 'today'
  },
  views: {
    month: {
      columnFormat: 'dddd'
    },
    agendaWeek: {
      columnFormat: 'M/D ddd',
      titleFormat: 'YYYY년 M월 D일',
      eventLimit: false
    },
    agendaDay: {
      columnFormat: 'dddd',
      eventLimit: false
    },
    listWeek: {
      columnFormat: ''
    }
  },

  /* ****************
   *  일정 받아옴 
   * ************** */
  events: function (start, end, timezone, callback) {
     
     function convert(str) {
        var date = new Date(str),
          mnth = ("0" + (date.getMonth() + 1)).slice(-2),
          day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
      }     
     
     var CalObj = {"USER_EMAIL" : $('#USER_EMAIL').text()};
     
    $.ajax({      
      type: "POST",
      url: "calendarListAjax.net",      // select
      data: CalObj,
      dataType : "json",
      success: function (response) {
         
         var events = [];
         $.each(response, function(index){
            response[index].start = moment(parseInt(response[index].start)).format("YYYY-MM-DD HH:mm")
            response[index].end = moment(parseInt(response[index].end)).format("YYYY-MM-DD HH:mm")
            console.log(" response[index].start : " + response[index].start + ",  response[index].end : " +  response[index].end)
            
         })
         events.push(response);
         console.log(events);
         $('#calendar').fullCalendar("renderEvent", events);
   
        var fixedDate = response.map(function(array){
           
           if(array.CALENDAR_ALLDAY == 1){
              array.allDay = true;
              //console.log('CALENDAR_ALLDAY T = '+ array.CALENDAR_ALLDAY)
           }else{
              array.allDay = false;
              //console.log('CALENDAR_ALLDAY F = '+ array.CALENDAR_ALLDAY)
           }
          if (array.allDay && array.start !== array.end) {
             array.end = moment(array.end);
          } else {
             array.end = moment(array.end);
          }
           console.log(array)
          return array;
        });
        
       callback(fixedDate);
       
        $.each(response, function(index){                
          $('.CAL_MEMO_NUM').eq(index).text(response[index].MEMO_NUM);
          console.log("response["+index+"].MEMO_NUM : " + response[index].MEMO_NUM)
       });
        
        
      }
    });
  },

  eventAfterAllRender: function (view) {
    if (view.name == "month") {
      $(".fc-content").css('height', 'auto');
    }
  },

  //일정 리사이즈
  eventResize: function (event, delta, revertFunc, jsEvent, ui, view) {
    $('.popover.fade.top').remove();

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
       editEnd.val(event.end.format('YYYY-MM-DD HH:mm'));
       // editEnd.val(event.end.format('YYYY-MM-DD HH:mm'));
    }
    
    editTitle.val(event.title);
    editStart.val(event.start.format('YYYY-MM-DD HH:mm'));
    editType.val(event.MEMO_SUB);
    editDesc.val(event.MEMO_TEX);
    editColor.val(event.MEMO_COLOR).css('color', event.MEMO_COLOR);

    addBtnContainer.hide();
    modifyBtnContainer.show();
    
    /** 리사이즈시 수정된 날짜반영
     * 하루를 빼야 정상적으로 반영됨. */
    var newDates = calDateWhenResize(event);

    // 드랍시 수정된 날짜반영
    var statusAllDay;
    var startDate;
    var endDate;
    var displayDate;
    var USER_EMAIL = $('#USER_EMAIL').text();

    if (editAllDay.is(':checked')) {
        statusAllDay = true;
        startDate = moment(editStart.val()).format('YYYY-MM-DD HH:mm');
        endDate = moment(editEnd.val()).add(1, 'days').format('YYYY-MM-DD HH:mm');
        displayDate = moment(editEnd.val()).add(1, 'days').format('YYYY-MM-DD');
    } else {
        statusAllDay = false;
        startDate = moment(editStart.val()).format('YYYY-MM-DD HH:mm');
        endDate = moment(editEnd.val()).add(1, 'days').format('YYYY-MM-DD HH:mm');
        displayDate = moment(endDate).format('YYYY-MM-DD');
    }

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
           start : Date.parse(startDate),
           end : Date.parse(editEnd.val()),
           MEMO_COLOR : editColor.val(),
           allDay: editAllDay.is(":checked"),
           MEMO_NUM : event.MEMO_NUM
   }

    //리사이즈한 일정 업데이트
    $.ajax({
      type: "get",
      url: "calendarREupdate.net",      //update
      data: eventfix,
      success: function (response) {
         $('#calendar').fullCalendar('removeEvents');
          $('#calendar').fullCalendar('refetchEvents');
      }
    });

  },

  eventDragStart: function (event, jsEvent, ui, view) {
    draggedEventIsAllDay = event.allDay;
  },

  //일정 드래그앤드롭
  eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
    $('.popover.fade.top').remove();
    
    console.trace()
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
        editEnd.val(moment(event.end).format('YYYY-MM-DD HH:mm'));
        //editEnd.val(event.end.format('YYYY-MM-DD HH:mm'));
    }
    
    console.log("editEnd:"+editEnd.val()+", event.end:"+event.end)
    editTitle.val(event.title);
    editStart.val(event.start.format('YYYY-MM-DD HH:mm'));
    editType.val(event.MEMO_SUB);
    editDesc.val(event.MEMO_TEX);
    editColor.val(event.MEMO_COLOR).css('color', event.MEMO_COLOR);

    addBtnContainer.hide();
    modifyBtnContainer.show();
    
    //주,일 view일때 종일 <-> 시간 변경불가
    if (view.type === 'agendaWeek' || view.type === 'agendaDay') {
      if (draggedEventIsAllDay !== event.allDay) {
        alert('드래그앤드롭으로 종일<->시간 변경은 불가합니다.');
        location.reload();
        return false;
      }
    }

    // 드랍시 수정된 날짜반영
    var statusAllDay;
    var startDate;
    var endDate;
    var displayDate;
    var USER_EMAIL = $('#USER_EMAIL').text();

    if (editAllDay.is(':checked')) {
        statusAllDay = true;
        startDate = moment(editStart.val()).format('YYYY-MM-DD HH:mm');
        endDate = moment(editEnd.val()).add(1, 'days').format('YYYY-MM-DD HH:mm');
        displayDate = moment(editEnd.val()).add(1, 'days').format('YYYY-MM-DD');
    } else {
        statusAllDay = false;
        startDate = moment(editStart.val()).format('YYYY-MM-DD HH:mm');
        endDate = moment(editEnd.val()).add(1, 'days').format('YYYY-MM-DD HH:mm');
        displayDate = moment(endDate).format('YYYY-MM-DD');
    }

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
           start : Date.parse(startDate),
           end : Date.parse(editEnd.val()),
           MEMO_COLOR : editColor.val(),
           allDay: editAllDay.is(":checked"),
           MEMO_NUM : event.MEMO_NUM
   }
    
    //드롭한 일정 업데이트
    $.ajax({
      type: "get",
      url: "calendarDGupdate.net",      // update
      data: eventfix,
      success: function (response) {
             
             $('#calendar').fullCalendar('removeEvents');
            $('#calendar').fullCalendar('refetchEvents');
      }
    });

  },

  select: function (startDate, endDate, jsEvent, view) {

    $(".fc-body").unbind('click');
    $(".fc-body").on('click', 'td', function (e) {

      $("#contextMenu")
        .addClass("contextOpened")
        .css({
          display: "block",
          left: e.pageX,
          top: e.pageY
        });
      return false;
    });

    var today = moment();

    if (view.name == "month") {
      startDate.set({
        hours: today.hours(),
        minute: today.minutes()
      });
      startDate = moment(startDate).format('YYYY-MM-DD HH:mm');
      endDate = moment(endDate).subtract(1, 'days');

      endDate.set({
        hours: today.hours() + 1,
        minute: today.minutes()
      });
      endDate = moment(endDate).format('YYYY-MM-DD HH:mm');
    } else {
      startDate = moment(startDate).format('YYYY-MM-DD HH:mm');
      endDate = moment(endDate).format('YYYY-MM-DD HH:mm');
    }

    //날짜 클릭시 카테고리 선택메뉴
    var $contextMenu = $("#contextMenu");
    $contextMenu.on("click", "a", function (e) {
      e.preventDefault();

      //닫기 버튼이 아닐때
      if ($(this).data().role !== 'close') {
        newEvent(startDate, endDate, $(this).html());
      }

      $contextMenu.removeClass("contextOpened");
      $contextMenu.hide();
    });

    $('body').on('click', function () {
      $contextMenu.removeClass("contextOpened");
      $contextMenu.hide();
    });

  },

  //이벤트 클릭시 수정이벤트
  eventClick: function (event, jsEvent, view) {
    editEvent(event);
  },

  locale: 'ko',
  timezone: "local",
  nextDayThreshold: "00:00:00",
  allDaySlot: true,
  displayEventTime: true,
  displayEventEnd: true,
  firstDay: 0, //월요일이 먼저 오게 하려면 1
  weekNumbers: false,
  selectable: true,
  weekNumberCalculation: "ISO",
  eventLimit: true,
  views: {
    month: {
      eventLimit: 12
    }
  },
  eventLimitClick: 'week', //popover
  navLinks: true,
  timeFormat: 'HH:mm',
  defaultTimedEventDuration: '01:00:00',
  editable: true,
  minTime: '00:00:00',
  maxTime: '24:00:00',
  slotLabelFormat: 'HH:mm',
  weekends: true,
  nowIndicator: true,
  dayPopoverFormat: 'MM/DD dddd',
  longPressDelay: 0,
  eventLongPressDelay: 0,
  selectLongPressDelay: 0,
});