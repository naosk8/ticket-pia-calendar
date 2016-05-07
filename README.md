(勝手に)チケットぴあのイベントカレンダー
==============

娯楽に溢れ、自分のスケジュールを基準に<br>
余暇の使い方を決めたい今日この頃。

よりよく休日を過ごすために、<br>
気になる情報を、もっと視覚的に認識できるよう<br>
大手興行案内「チケットぴあ」のイベントリストをカレンダーに表示できるようにしてみました。<br>
※ スクレイピングしてますが、ある程度節度はあるのでお許しを。<br>
※ というか、本家で実装してください。<br>


# 使い方
※ 事前に、node, npmをインストールしておいてください。

## サーバー起動
$ git clone このリポジトリ<br>
$ cd リポジトリのホームディレクトリ<br>
$ npm install<br>
$ node app.js<br>

## 操作方法
まず、任意のブラウザで以下のURLにアクセスする。<br>
http://localhost:3001<br>
<br>
次に、チケットぴあ(http://ticket-search.pia.jp/pia/search_all.do)で<br>
興味のあるイベントを抽出するための検索条件を決める。<br>
![](https://raw.githubusercontent.com/naosk8/ticket-pia-calendar/master/images/description1.png?token=ACwFKxHGtXmTCnLF3wP3VwNgKpWNBIq3ks5XNqswwA%3D%3D)
<br>
<br>
検索した際のチケットぴあのURLをコピーし、このアプリに入力の上、「カレンダーに表示」を押下<br>
![](https://raw.githubusercontent.com/naosk8/ticket-pia-calendar/master/images/description2.png?token=ACwFK-32RY3JCeSDSkhwkNkFn3ZveRRGks5XNqwZwA%3D%3D)
<br>
以上。
興味のあるイベントをクリックしたら、「チケットぴあ」の詳細ページへと移動します。

それでは皆さん、良い休日を〜

# 注意事項
各イベントの開催時間を取得したかったものの、<br>
スクレイピング負荷が一気に高まる模様だったので、日付までしか取得していません。<br>
