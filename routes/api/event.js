/*
 * GET api event.
 */
// var request = require("request");
var cheerio = require("cheerio");
var exec = require('child_process').exec;
var _ = require('underscore');
var promise = require('promise');

var piaBaseUrl = 'http://ticket-search.pia.jp/pia/search_all.do?';
var piaEventListGetUrl = 'http://ticket-search.pia.jp/pia/rlsInfo.do';

var crawlingSpan = 200; // 200 ms

exports.get = function(req, res) {
 
    var piaURI = req.query.piaURI;
    var data = piaURI.replace(piaBaseUrl, '');

    // クエリパラメータから、検索用のパラメータを抽出する
    var params = data.split('&');
    var activeParams = _.filter(params, function(param) {
        var splitParams = param.split('=');
        if (splitParams.length === 2 
            && splitParams[1].length !== 0
            && splitParams[1] !== 'null'
        ) {
            return true;
        }
        return false;
    });

    var curlDataString = ''
    _.each(activeParams, function(param) {
        curlDataString += ' -d ' + param;
    });

    // イベントリストの取得処理
    var command = 'curl ' + piaEventListGetUrl + ' -X POST' + curlDataString;
    var response = {
        'totalPageNum': 0,
        'events': []
    };

    // これからクローリングする情報のメタデータをスクレイピングする
    execCrawlingBaseInfo(command)
    .then(function(pageInfo) {
        response.totalPageNum = pageInfo.totalPageNum;
        // 該当するページのクローリング処理
        var promiseList = execCrawlingEventList(piaEventListGetUrl, activeParams, 1, pageInfo.totalPageNum);
        // クローリング完了したらresを返す
        promise.all(promiseList).then(function(events) {
            var allEvents = [];
            _.each(events, function(eventsPerPage) {
                allEvents = allEvents.concat(eventsPerPage);
            });
            response.events = allEvents;
            res.send(JSON.stringify(response));
        });
    });
};

function execCrawlingBaseInfo(command)
{
    return new promise(function(onFulfilled, onRejected) {
        exec(command, function(err, stdout, stderr) {
            if(err) {
                onRejected('ng');
                // throw err;
            }

            $ = cheerio.load(stdout);
            // 関連ページ情報を含むDOMをスクレイピング
            var pageInfo = $("#navi_html p").text();
            var totalEventNum = pageInfo.replace(/全|件中.+/g, '');
            var perPage = pageInfo.replace(/^.*～|件を.+/g, '');
            // ページ情報を取得
            var pageInfo = {
                totalEventNum: totalEventNum,
                perPage: perPage,
                totalPageNum: Math.ceil(totalEventNum / perPage)
            };
            onFulfilled(pageInfo);
        });
    });
}

function execCrawlingEventList(url, params, minPage, maxPage)
{
    var paramsWithoutPage = _.filter(params, function(param){
        if (param.indexOf('page') === -1) {
            return true;
        }
    });

    var curlDataString = ''
    _.each(paramsWithoutPage, function(param) {
        curlDataString += ' -d ' + param;
    });

    var promiseList = [];
    var delay = 0;
    for (var page = minPage; page <= maxPage; page++) {
        // イベントリストの取得処理
        var p = new promise(function(onFulfilled, onRejected) {
            var eventList = [];
            var curlDataStringPerPage = curlDataString + ' -d page=' + page;
            var command = 'curl ' + piaEventListGetUrl + ' -X POST' + curlDataStringPerPage;
            // サイトへの負荷を考慮して、1秒に5リクエスト程度に限定
            setTimeout(function() {
                exec(command, function(err, stdout, stderr) {
                    if(err) {
                        onRejected('ng');
                    }

                    $ = cheerio.load(stdout);
                    $('.listWrp_title_list a').each(function(elm) {
                        var openInfo = $(this).parent().next().find('.list_03').text();
                        var oneEvent = {
                            title: $(this).text(),
                            url: $(this).attr('href'),
                            start: openInfo.replace(/\(.*|\s/g, '').replace(/\//g, '-'),
                            end: openInfo.replace(/\s/g, '').replace(/^.*～/g, '').replace(/\(.*/g, '').replace(/\//g, '-')
                        };

                        eventList.push(oneEvent);
                    });
                    onFulfilled(eventList);
                });
            }, delay);
        });
        promiseList.push(p);
        delay += crawlingSpan;
    }
    return promiseList;
}

