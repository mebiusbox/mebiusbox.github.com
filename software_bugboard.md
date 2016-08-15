---
layout: software
title: bugboard
---

# Bugboard 1.2.2

Bugboard はバグトラッキングシステム（ＢＴＳ）です。
コンセプトは簡単に導入できること、フィルター表示やレポートの項目カスタマイズなど、ちょっとリッチな機能を持っていることです。

<table class="dl" cellpadding="0" cellspacing="0" border="0">
	<tr>
		<td>
			<a href="https://dl.dropboxusercontent.com/u/36645874/mebiusbox/bugboard-1.2.2.zip" target="_blank" onclick="ga('send','pageview',{'page':'/downloads/Bugboard','Title':'Bugboard});">
				<img src="/assets/img/download_zip.jpg" />
			</a>
		</td>
	</tr>
</table>

## 特徴
* 管理できるプロジェクトは１つ。（カテゴリをプロジェクトとして使うとか、項目をカスタマイズして擬似的に複数のプロジェクトを管理することは可能です。）
* 管理者モード
* カテゴリ、レポートの項目カスタマイズ機能
* フィルター表示
* レポートにコメント、添付ファイル（複数可）、投票機能

## スクリーンショット
<div class="snap">
	<a class="fancybox" rel="group" href="/assets/img/bugboard_snap01.jpg">
		<img src="/assets/img/bugboard_snap01.jpg" width="240" height="150" alt="snap01" border="0" />
	</a>
	<a class="fancybox" rel="group" href="/assets/img/bugboard_snap02.jpg">
		<img src="/assets/img/bugboard_snap02.jpg" width="240" height="150" alt="snap02" border="0" />
	</a>
	<br class="clear" />
</div>

## 動作環境
PHP4 又は PHP5 (mbstring, mysql or mysqli or pgsql が使えること)
PEAR::Auth, PEAR::DB
データベースは MySQL 又は PostgresSQL が必要です
以下の環境で動作確認致しました

* PHP 4.4.1(SafeMode), MySQL 4.0.22
* PHP 4.4.1(SafeMode), PostgresSQL 8.0.8
* PHP 5.2.0, MySQL 5.0 Community
* PHP 5.2.0, PostgresSQL 8.2

## 更新履歴

### 1.2.2
* Improved: スパム対策：A タグ判定方法を変更しました。
* Fixed: レポート編集において、カスタム項目がおかしくなる不具合を修正しました。

### 1.2.1
* Improved: スパム対策：a タグが入っていたら投稿できないオプションを用意しました。
* Fixed: エスケープ処理をしていなかった不具合を修正しました。

### 1.2.0
* Added: メール通知機能を追加しました。
* Improved: バグ一覧画面においてコメントの数を表示できるようにしました。
* Improved: CAPTCHAを導入できるようにしました。
* Improved: RSS情報を改善しました。
* Improved: RSSがキャッシュによって最新の情報が取得できない場合があるため、キャッシュを無効にするヘッダを送信するようにしました。（この為、RSS のＵＲＬが変わりました）
* Improved: ページングに対応しました。
* Improved: MySQLのバージョンが 4.0.*はサブクエリーに対応していないので使用しないようにしました。
* Fixed: レポートを更新すると報告日も更新される不具合を修正しました。

### 1.1.0
* Fixed: HTMLヘッダを送信する前に一部のファイルが改行を出力してしまう不具合を修正しました。
* Fixed: 添付ファイル処理が正常にできていなかった不具合を修正しました。
* Fixed: MySQLのバージョンによってはコメントを削除することが出来なかった不具合を修正しました。
* Fixed: MySQL 4.0.* 以前のバージョンにおいて日付の表現が違っていた不具合を修正しました。
* Added: RSSを作成する機能をつけました。
* その他、調整しました。

### 1.0.0
* first release.
