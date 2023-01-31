---
layout: software
title: ComicPicker
description: ComicPickerは画像をまとめた書庫ファイル、画像、PDF 文書を閲覧、整理するツールです
keywords:
  - ComicPicker
  - mebiusbox
pagination_next: null
pagination_prev: null
image: https://og-image-mebiusbox.vercel.app/api/og?title=ComicPicker&subtitle=ComicPicker%E3%81%AF%E7%94%BB%E5%83%8F%E3%82%92%E3%81%BE%E3%81%A8%E3%82%81%E3%81%9F%E6%9B%B8%E5%BA%AB%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%80%81%E7%94%BB%E5%83%8F%E3%80%81PDF%20%E6%96%87%E6%9B%B8%E3%82%92%E9%96%B2%E8%A6%A7%E3%80%81%E6%95%B4%E7%90%86%E3%81%99%E3%82%8B%E3%83%84%E3%83%BC%E3%83%AB%E3%81%A7%E3%81%99
---

# ComicPicker 0.6.5
ComicPickerは画像をまとめた書庫ファイル、画像、PDF 文書を閲覧、整理するツールです。
画像を確認し、Ｄ＆Ｄ処理でゴミ箱に入れたり、フォルダに移動することを簡単な操作で行うことが出来ます。
書庫ファイルは lzh, zip, rar に対応しています。
（それぞれ UNLHA32.DLL, UNZIP32.DLL, UNRAR32.DLL が必要です）
また、画像は JPG, BMP, PNG のみ対応しています。

書庫ファイル以外に、画像ファイルも整理することができます。
その他に、ファイル名の変更や書庫ファイルから画像ファイルを抽出して、新しい書庫ファイルや、PDF文書を作成することもできます。

<table class="mbx-dl" cellpadding="0" cellspacing="0" border="0">
	<tr>
		<td>
			<a href="https://github.com/mebiusbox/apps/releases/tag/first" target="_blank" onclick="ga('send','pageview',{'page':'/downloads/ComicPickerSetup','Title':'ComicPickerSetup'});">
				<em><img src="/img/download_exe.jpg" /></em>
			</a>
		</td>
		<td>
			<a href="https://github.com/mebiusbox/apps/releases/tag/first" target="_blank" onclick="ga('send','pageview',{'page':'/downloads/ComicPicker','Title':'ComicPicker'});">
				<em><img src="/img/download_zip.jpg" /></em>
			</a>
		</td>
	</tr>
</table>


## 特徴
現在、デフォルトでドロップ先リストにあるごみ箱は削除したり、設定することが出来ません。
環境によっては、ごみ箱からファイルを復元したとき、名前が完全に復元できない場合があります。


## スクリーンショット
<div class="mbx-snap">
	<img src="/img/ComicPicker_snap01.jpg" width="240" height="180" alt="snap01" border="0" />
	<br class="mbx-clear" />
</div>

## 動作環境
Windows10 64bit

## 更新履歴

### 0.6.5

* New: 抽出時のファイル名のパターンを選択できるようにしました。
 * 「書庫ファイル名＋ページ番号」
 * 「日付＋ページ番号」
 * 「オリジナルのファイル名」

### 0.6.4

* Fixed: 画像ファイルが大きいサイズだと応答しなくなる不具合を修正.
* New: 「次のファイルへ」「前のファイルへ」を追加

### 0.6.3
* Fixed: 「すぐにファイルを移動する」の状態で移動すると、移動したファイルがファイルリストから消えてなかった不具合を修正

### 0.6.2
* Fixed: ゴミ箱に削除やドロップ先フォルダへの移動をすると強制終了する場合がある不具合を修正しました。

### 0.6.1
* Improved: WindowsXP でメニューバーの表示がおかしくなる不具合を修正しました。

### 0.6.0
* Improved: ファイルパネルに「ファイルサイズ」「作成日時」「更新日時」のカラムを追加できるようにしました。
* Improved: ファイルパネルでソートできるようになりました。

### 0.5.0
* New: PDF 文書も閲覧、整理できるようになりました。(別途 pdfimages.exe, pdfinfo.exe が必要です。詳しくはヘルプを参照してください。)

### 0.4.0
* New: 抽出機能に、PDF 形式を追加しました。
* New: ファイルの移動先を設定してから、一括で移動する機能を追加しました。
* Improved: ビューア上部のツールバーに、ページ数を表示するようにしました。また、そこにページ数を指定して移動することができるようになりました。
* Fixed: 抽出：書庫内のファイルに日本語名が使われていた場合、書庫を作成できない場合がある不具合を修正しました。

### 0.3.1
* Fixed: 抽出機能で開始ページが１ページずれてしまう不具合を修正しました。

### 0.3.0
* New: 画像ファイルも整理対象になりました。
* New: 名前の変更と抽出機能を追加しました。
* Improved: コンテキストメニューを表示できるようにしました。
* Improved: ドロップ数を 10 から 50 に変更しました。

### 0.2.2
* Misc: Visual Studio 2010 でビルド
* Misc: Gdi+ を使用するようにしました。
* Added: オプションに「ゴミ箱へ移動するときに確認メッセージを表示する」を追加しました。[#0000164]

### 0.2.1
* Improved: オプションを追加しました。
* Improved: ログを出力するようにしました。
* Improved: キーボードで振り分けられるようにしました。
* Improved: ドロップ先に同名のファイルがあった場合、末尾に (数字) を追加してリトライするようにしました。
* Improved: ドロップパネルの表示を改善しました。
* Improved: ドロップ後、自動で次のファイルを開くようにしました。

### 0.2.0
* Added: 拡大縮小機能を加えました。
* Added: アンシャープマスクフィルター機能を加えました。
* Improved: 上部のアドレス部分をエクスプローラライクにしました。
* Improved: ドロップペイン、ファイルリストペインをドッキングウィンドウに変更しました。
* Improved: 「左へ」「右へ」を「進む」「戻る」に変更しました。
* Improved: アイコンを変更しました。
* Improved: メニューの構成を変更しました。
* Improved: ウィンドウのサイズを保存・復帰するようにしました。
* Improved: MFC DLL が必要なくなりました。

### 0.1.1
* Improved: ドロップエリアを上部に表示するようにしました。
* Fixed: lzh形式の書庫をまともに扱えない不具合を修正しました。
* Fixed: 強制終了してしまう不具合を修正しました。

### 0.1.0
* first release.
