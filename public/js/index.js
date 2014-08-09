// 今日の日付の取得
var m = moment(); 
var formattedDate = m.format("YYYY-MM-DD");

// 表示用のカレンダーデータを格納する変数
// events = {title: string, start: string(YYYY-MM-DD(THH:MI:SS)), end: string, url: string (, id: number)}[]
var calendarSettings = {
    header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,basicWeek,basicDay'
    },
    defaultDate: formattedDate,
    editable: false,
    eventSources: []
};

$(document).ready(function() {
    $('#calendar').fullCalendar(calendarSettings);
    $('#loadEventBtn').bind('click', getApiEvent);
});

function getApiEvent() {
    // 入力されたぴあのイベント検索クエリからスケジュールをクローリング
    var inputPiaURI = document.querySelector('#piaURI');
    if (inputPiaURI.value.length === 0) {
        return;
    }
    $.ajax({
        url: '/api/event/get',
        dataType: 'json',
        data: {piaURI: inputPiaURI.value},
        success: function(data) {
            console.log(data);
            $('#calendar').fullCalendar('addEventSource', {events: data.events});
        },
        error: function(data) {
            console.log('error');
        }
    });
}
