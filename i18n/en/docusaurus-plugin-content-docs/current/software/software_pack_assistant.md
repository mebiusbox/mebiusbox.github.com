---
layout: software
title: PackAssistant
description: ackAssistant は複数のファイルを指定の容量をもつパックに、効率良く収まるように振り分けます
keywords:
  - PackAssistant
  - mebiusbox
pagination_next: null
pagination_prev: null
image: https://og-image-mebiusbox.vercel.app/api/og?title=PackAssistant&subtitle=ackAssistant%20%E3%81%AF%E8%A4%87%E6%95%B0%E3%81%AE%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%82%92%E6%8C%87%E5%AE%9A%E3%81%AE%E5%AE%B9%E9%87%8F%E3%82%92%E3%82%82%E3%81%A4%E3%83%91%E3%83%83%E3%82%AF%E3%81%AB%E3%80%81%E5%8A%B9%E7%8E%87%E8%89%AF%E3%81%8F%E5%8F%8E%E3%81%BE%E3%82%8B%E3%82%88%E3%81%86%E3%81%AB%E6%8C%AF%E3%82%8A%E5%88%86%E3%81%91%E3%81%BE%E3%81%99
---

# PackAssistant 1.6.0
PackAssistant は複数のファイルを指定の容量をもつパックに、効率良く収まるように振り分けます。

<table class="mbx-dl" cellPadding="0" cellSpacing="0" border="0">
	<tr>
		<td>
			<a href="https://github.com/mebiusbox/apps/releases/tag/first" target="_blank" onclick="ga('send','pageview',{'page':'/downloads/PackAssitantSetupX64','Title':'PackAssistantSetupX64'});">
				<em><img src="/img/download_exe.jpg" /></em>
			</a>
		</td>
		<td>
			<a href="https://github.com/mebiusbox/apps/releases/tag/first" target="_blank" onclick="ga('send','pageview',{'page':'/downloads/PackAssistantX64','Title':'PackAssistantX64'});">
				<em><img src="/img/download_zip.jpg" /></em>
			</a>
		</td>
	</tr>
</table>

## グループ機能
ファイルをグループ化することで、いくつかのファイルを同じパック内に入れることができます。

## ドラッグ＆ドロップ
ライティングソフトのファイル登録時にＤ＆Ｄを利用することによって、簡単に登録することができます。

## スクリーンショット
<div class="mbx-snap">
	<img src="/img/PackAssistant_snap01.jpg" width="240" height="180" alt="snap01" border="0" />
	<img src="/img/PackAssistant_snap02.jpg" width="240" height="180" alt="snap02" border="0" />
	<br class="mbx-clear" />
</div>

## 動作環境
Windows 10 (64bit)

## 更新履歴

### 1.6.0
* Windows10 (64bit) に対応しました
* PackClassify を削除しました（連携機能がなくなっています）
* BD -> Blu-ray と表記を変え，Blu-ray XL (100GB) を追加しました．

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
