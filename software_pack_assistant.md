---
layout: software
title: PackAssistant
---

# PackAssistant 1.5.2
PackAssistant は複数のファイルを指定の容量をもつパックに、効率良く収まるように振り分けます。

<table class="dl" cellpadding="0" cellspacing="0" border="0">
	<tr>
		<td>
			<a href="http://bit.ly/1YyzD2N" target="_blank" onclick="ga('send','pageview',{'page':'/downloads/PackAssitantSetup','Title':'PackAssistantSetup'});">
				<img src="/assets/img/download_exe.jpg" />
			</a>
		</td>
		<td>
			<a href="http://bit.ly/1SaF5l5" target="_blank" onclick="ga('send','pageview',{'page':'/downloads/PackAssistant','Title':'PackAssistant'});">
				<img src="/assets/img/download_zip.jpg" />
			</a>
		</td>
	</tr>
</table>

## グループ機能
ファイルをグループ化することで、いくつかのファイルを同じパック内に入れることができます。

## ドラッグ＆ドロップ
ライティングソフトのファイル登録時にＤ＆Ｄを利用することによって、簡単に登録することができます。

## PackClassify
ツール PackClassify との連携機能により、PackAssistant の結果を元にファイルやフォルダを実際に振り分けます。
PackClassify は PackAssistant と一緒にインストールされます。

## スクリーンショット
<div class="snap">
	<a class="fancybox" rel="group" href="/assets/img/PackAssistant_snap01.jpg">
		<img src="/assets/img/PackAssistant_snap01.jpg" width="240" height="180" alt="snap01" border="0" />
	</a>
	<a class="fancybox" rel="group" href="/assets/img/PackAssistant_snap02.jpg">
		<img src="/assets/img/PackAssistant_snap02.jpg" width="240" height="180" alt="snap02" border="0" />
	</a>
	<a class="fancybox" rel="group" href="/assets/img/PackAssistant_snap03.jpg">
		<img src="/assets/img/PackAssistant_snap03.jpg" width="240" height="180" alt="snap03" border="0" />
	</a>
	<br class="clear" />
</div>

## 動作環境
Windows XP(32), Vista(32)

## 更新履歴

### 1.5.1
* Visual Studio 2010 でビルド。
* 必要な DLL を同梱するようにしました。ランタイムライブラリのインストールは不要になりました。

### 1.5.1
* Fixed: PackClassify で一部の文字が含まれていると、正常に処理できない不具合を修正しました。
* Misc: エクスポートする csv ファイルの文字コードを sjis から utf-8 に変更しました。

### 1.5.0
* Added: パックの許容率を設定できるようにしました。
* Improved: [#0000098] ５桁以上のパックサイズを指定できるようにしました。
* Improved: 初期状態に「BD １層」と「BD ２層」を追加しました。

### 1.4.2
* Added: [#0000096][PackClassify] PackAssistantで登録したフォルダを振り分け先に登録できる「登録フォルダ」ボタンを追加しました。
* Added: [#0000096][PackClassify] 振り分けのオプションに「階層構造を維持する」を追加しました。
* Added: オプションに「簡易アイコンで表示する」を追加しました。
* Misc: インストーラを InnoSetup で作るようにしました。

### 1.4.1
* Fixed: 一部のマニフェストファイルを修正しました。

### 1.4.0
* Added: 公式ページへのリンクをメニューに追加しました。
* Improved: アイコンを追加したり、入れ替えたりしました。
* Fixed: パック後のリスト表示画面において、オプション画面を開いて OK をすると異常終了してしまう不具合を修正しました。

### 1.3.0
* Added: フィルター機能を追加しました。
* Added: 自動グルーピング機能を追加しました。
* Improved: ツリーコントロールみたいな表示にしました。
* Improved: ヘルプを更新しました。
* Fixed: ファイルサイズの表示単位を KB, MB にしているとパック後の Rate の表示が正しくない不具合を修正しました。
* Fixed: ファイルサイズの表示単位を KB, MB にしているとグループ番号の表示が正しくない不具合を修正しました。

### 1.2.2
* Fixed: リストの最初にあるアイテムをグループに割り当てようとすると、すべてのアイテムが１つのグループになってしまう不具合を修正しました。（それが原因で異常終了する場合がありました）

### 1.2.1
* Improved: ファイルサイズの表示単位が「MB」の時、1KB(1000) -> 1KB(1024) で計算するようにしました。

### 1.2.0
* Improved: Windows2000, WindowsVistaに対応しました。
* Improved: ファイルサイズの表示単位を変更できるようにしました。
* Fixed: 計算誤差を修正しました。

### 1.1.1
* Improved: PackClassifyの不具合修正のため、エクスポートファイル形式をタブ区切りテキストファイルに変更しました。
* Fixed: [PackClassify] ファイル名にカンマ「,」があると正常に動作しない不具合を修正しました。
* Fixed: [PackClassify] エクスポートファイルを２度以上読み込むと正常に動作しない不具合を修正しました。

### 1.1.0
* Added: 「個別にグループ化」と「サブフォルダをグループ化」機能を追加しました。
* Added: 外部ツール「PackClassify」との連携機能をつけました。
* Improved: 「個別にグループ化」と「サブフォルダをグループ化」機能を追加しました。
* Improved: パッキング処理の進行状態を表示するようにしました。
* Improved: リスト表示上でファイルにもアイコンを表示するようにしました。
* Improved: ツールバーの画像を１６色から２５６色に変更しました。
* Improved: リスト表示の項目名「Percent」を「Rate」に変更しました。
* Improved: リスト表示の Rate(旧Percent) を小数第一位まで表示するようにしました。
* Improved: リスト表示の Rate(旧Percent) で、パックサイズよりもファイルまたはグループのサイズが大きいとき、０％だったのを「over」と表示するようにしました。
* Improved: 一部の処理を改善しました。
* Fixed: パッキング中のキャンセル判定が間違っていたので修正しました。

### 1.0.0
* 公開
