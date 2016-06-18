---
layout: software
title: SmartQuickBar
---

# SmartQuickBar

画面上部固定のランチャーです。Mac のメニューバーみたいなものです。
マウスカーソルを画面上部に移動し、一定時間が経つとアニメーションしながら表示されます。
本体にはグループ名が表示され、各グループにカーソルを載せると、そのグループに所属するアイテムがポップアップされます。
アプリケーションを起動したり、ファイルをアプリケーション（またはフォルダ）にドラッグ＆ドロップすることもできます。

<table class="dl" cellpadding="0" cellspacing="0" border="0">
	<tr>
		<td>
			<a href="http://bit.ly/1runa37" target="_blank" onclick="ga('send','pageview',{'page':'/downloads/SmartQuickBarSetup','Title':'SmartQuickBarSetup'});">
				<img src="/assets/img/download_exe.jpg" />
			</a>
		</td>
		<td>
			<a href="http://bit.ly/1rumI4J" target="_blank" onclick="ga('send','pageview',{'page':'/downloads/SmartQuickBar','Title':'SmartQuickBar'});">
				<img src="/assets/img/download_zip.jpg" />
			</a>
		</td>
	</tr>
</table>

## スクリーンショット
<div class="snap">
	<a class="fancybox" rel="group" href="{{ site.url }}/assets/img/smart_quickbar_title.jpg">
		<img src="{{ site.url }}/assets/img/smart_quickbar_title.jpg" />
	</a>
	<br class="clear" />
</div>

## 動作環境
* WindowsXP, Vista, 7
* .Net Framework 3.5以上

## マニュアル

### 使い方
SmartQuickBar を起動します。SmartQuickBar は起動すると隠れます。タスクバーにも表示されません。
SmartQuickBar を表示するには、画面上部にマウスカーソルを持っていって、一定時間経過させます。
表示されたら、グループにカーソルを合わせて、グループに所属する項目を表示し、項目を選択（クリック）してください。

### オプション

 項目 | 説明
--- | ---
スリープ時間 | マウスカーソルの位置を監視する時のスリープ時間。ミリ秒。
出現時間 | マウスカーソルを画面上部に移動して、SmartQuickBar を表示させるまでの時間。ミリ秒。
本体：幅 | SmartQuickBar 本体の縦幅。ピクセル。
本体：パディング | SmartQuickBar 本体のグループ間のパディング。ピクセル。
本体：アニメーション時間 | SmartQuickBar 本体のアニメーション時間。ミリ秒。
本体：アニメーションタイプ | SmartQuickBar 本体のアニメーションタイプ。
ポップアップ : アニメーション時間 | ポップアップメニューのアニメーション時間。ミリ秒。
ポップアップ：アニメーションタイプ | ポップアップメニューのアニメーションタイプ。
大きいアイコン | ポップアップメニューのアイコンの大きさ。

### マウスカーソルの画面上部の範囲ってどれくらい？
２ピクセルです。

### グループ名の頭に「$」が付いているものは？
特殊なグループ名です。現在は「$Drives」だけ有効です。$Drives はドライブを表示します。

### フォルダへのドラッグ＆ドロップ
フォルダを登録した場合、フォルダに対してファイルやフォルダをドロップして、コピー・移動することができます。

### プログラムへのドラッグ＆ドロップ
プログラムを登録した場合、プログラムに対してファイルやフォルダを渡すことができます。
その場合、ドロップ専用の引数が使用されます。

### レスポンスファイルとは？
プログラムにファイルをドロップした際に、ドロップしたファイルの名前をテキストファイルに出力したファイルのことです。
プログラムのドロップ専用の引数に指定できます。

## 更新履歴

### 0.1.0.0
* First version.
