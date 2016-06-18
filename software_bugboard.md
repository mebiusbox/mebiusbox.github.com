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
			<a href="http://bit.ly/1QcQUNz" target="_blank" onclick="ga('send','pageview',{'page':'/downloads/Bugboard','Title':'Bugboard});">
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
