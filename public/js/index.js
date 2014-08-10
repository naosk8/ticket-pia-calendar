// 今日の日付の取得
var m = moment(); 
var formattedDate = m.format("YYYY-MM-DD");

// 表示用のカレンダーデータを格納する変数
// events = {title: string, start: string(YYYY-MM-DD(THH:MI:SS)), end: string, url: string (, id: number)}[]
var calendarSettings = {
    header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month, agendaWeek, agendaDay'
    },
    defaultDate: formattedDate,
    editable: false,
    eventSources: [
        // Google Calendarから日本の祝祭日情報を読み込む
        {
            url: "http://www.google.com/calendar/feeds/ja.japanese%23holiday%40group.v.calendar.google.com/public/full/",
            currentTimezone: 'Asia/Tokyo',
            backgroundColor: '#F19824',
            borderColor: '#F15A24',
            textColor: '#EEEEEE'
        }
    ],
    // ボタン文字列
    buttonText: {
        today:    '今日',
        month:    '月',
        week:     '週',
        day:      '日'
    },
    // タイトルの書式
    titleFormat: {
        month: 'YYYY年M月',
        week: "YYYY年M月D日",
        day: "YYYY年M月D日"
    },
    allDaySlot: true,
    allDayText: '終日',
    timeFormat: 'H(:mm)',
    slotMinutes: 15,
    snapMinutes: 15,
    axisFormat: 'H:mm',
    timeFormat: {
        agenda: 'H:mm'
    },
    monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
    dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
    firstDay: 1
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
